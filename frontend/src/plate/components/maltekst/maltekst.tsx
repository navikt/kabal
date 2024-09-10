import { ArrowCirclepathIcon, PadlockUnlockedIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import {
  PlateElement,
  PlateRenderElementProps,
  findNodePath,
  isEditorReadOnly,
  isElement,
  replaceNodeChildren,
  unwrapNodes,
} from '@udecode/plate-common';
import { useContext, useMemo } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useCanManageDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import { useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { ToolbarButtonWithConfirm } from '@app/plate/components/common/toolbar-button-with-confirm';
import { LegacyMaltekst } from '@app/plate/components/maltekst/legacy-maltekst';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { ELEMENT_EMPTY_VOID } from '@app/plate/plugins/element-types';
import { EditorValue, MaltekstElement } from '@app/plate/types';
import { getIsInRegelverk } from '@app/plate/utils/queries';
import { useLazyGetConsumerTextByIdQuery } from '@app/redux-api/texts/consumer';
import { RichTextTypes } from '@app/types/common-text-types';
import { IConsumerRichText, IConsumerText } from '@app/types/texts/consumer';

export const Maltekst = ({
  editor,
  attributes,
  children,
  element,
}: PlateRenderElementProps<EditorValue, MaltekstElement>) => {
  const [getText, { isFetching }] = useLazyGetConsumerTextByIdQuery();
  const language = useSmartEditorLanguage();
  const isInRegelverk = useMemo(() => getIsInRegelverk(editor, element), [editor, element]);
  const { templateId } = useContext(SmartEditorContext);
  const canManage = useCanManageDocument(templateId);

  // TODO: Remove this when all smart documents in prod use maltekstseksjon
  if (element.id === undefined) {
    return (
      <LegacyMaltekst editor={editor} attributes={attributes} element={element}>
        {children}
      </LegacyMaltekst>
    );
  }

  const reload = async () => {
    if (element.id === undefined) {
      return;
    }

    const path = findNodePath(editor, element);

    if (path === undefined) {
      return;
    }

    const text = await getText({ textId: element.id, language }).unwrap();

    if (!isMaltekst(text)) {
      return;
    }

    replaceNodeChildren(editor, { at: path, nodes: text.richText });
  };

  const [first] = element.children;

  if (isElement(first) && first.type === ELEMENT_EMPTY_VOID) {
    return (
      <PlateElement as="div" attributes={attributes} element={element} editor={editor}>
        {null}
      </PlateElement>
    );
  }

  const unlock = () => unwrapNodes(editor, { match: (n) => n === element, at: [] });

  const readOnly = isEditorReadOnly(editor);

  return (
    <PlateElement
      asChild
      attributes={attributes}
      element={element}
      editor={editor}
      contentEditable={!readOnly}
      suppressContentEditableWarning
      onDragStart={(event) => event.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <SectionContainer
        data-element={element.type}
        data-section={element.section}
        $sectionType={SectionTypeEnum.MALTEKST}
      >
        {children}
        {readOnly || !canManage ? null : (
          <SectionToolbar contentEditable={false}>
            <Tooltip content="Oppdater til siste versjon" delay={0}>
              <Button
                icon={<ArrowCirclepathIcon aria-hidden />}
                onClick={reload}
                variant="tertiary"
                size="xsmall"
                contentEditable={false}
                loading={isFetching}
              />
            </Tooltip>
            {isInRegelverk ? null : (
              <ToolbarButtonWithConfirm
                onClick={unlock}
                icon={<PadlockUnlockedIcon aria-hidden />}
                tooltip="Lås opp tekst (Obs! Kan ikke låses igjen. Teksten du låser opp vil ikke lenger automatisk påvirkes om du endrer utfall/resultat eller hjemmel.)"
                loading={isFetching}
              />
            )}
          </SectionToolbar>
        )}
      </SectionContainer>
    </PlateElement>
  );
};

const isMaltekst = (element: IConsumerText): element is IConsumerRichText =>
  element.textType === RichTextTypes.MALTEKST;
