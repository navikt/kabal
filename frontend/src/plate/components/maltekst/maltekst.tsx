import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { ToolbarButtonWithConfirm } from '@app/plate/components/common/toolbar-button-with-confirm';
import { LegacyMaltekst } from '@app/plate/components/maltekst/legacy-maltekst';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { ELEMENT_EMPTY_VOID } from '@app/plate/plugins/element-types';
import type { MaltekstElement } from '@app/plate/types';
import { getIsInRegelverk } from '@app/plate/utils/queries';
import { useLazyGetConsumerTextByIdQuery } from '@app/redux-api/texts/consumer';
import { RichTextTypes } from '@app/types/common-text-types';
import type { IConsumerRichText, IConsumerText } from '@app/types/texts/consumer';
import { ArrowCirclepathIcon, PadlockUnlockedIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { ElementApi } from 'platejs';
import { PlateElement, type PlateElementProps } from 'platejs/react';
import { useContext, useMemo } from 'react';

export const Maltekst = (props: PlateElementProps<MaltekstElement>) => {
  const { children, element, editor } = props;
  const [getText, { isFetching }] = useLazyGetConsumerTextByIdQuery();
  const language = useSmartEditorLanguage();
  const isInRegelverk = useMemo(() => getIsInRegelverk(editor, element), [editor, element]);
  const { hasWriteAccess } = useContext(SmartEditorContext);

  // TODO: Remove this when all smart documents in prod use maltekstseksjon
  if (element.id === undefined) {
    return <LegacyMaltekst {...props}>{children}</LegacyMaltekst>;
  }

  const reload = async () => {
    if (element.id === undefined) {
      return;
    }

    const path = editor.api.findPath(element);

    if (path === undefined) {
      return;
    }

    const text = await getText({ textId: element.id, language }).unwrap();

    if (!isMaltekst(text)) {
      return;
    }

    editor.tf.replaceNodes(text.richText, { at: path, children: true });
  };

  const [first] = element.children;

  if (ElementApi.isElement(first) && first.type === ELEMENT_EMPTY_VOID) {
    return (
      <PlateElement<MaltekstElement> {...props} as="div">
        {null}
      </PlateElement>
    );
  }

  const unlock = () => editor.tf.unwrapNodes({ match: (n) => n === element, at: [] });

  const readOnly = editor.api.isReadOnly();

  return (
    <PlateElement<MaltekstElement>
      {...props}
      as="div"
      attributes={{
        ...props.attributes,
        contentEditable: !readOnly,
        suppressContentEditableWarning: true,
        onDragStart: (event) => event.preventDefault(),
        onDrop: (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
      }}
    >
      <SectionContainer
        data-element={element.type}
        data-section={element.section}
        $sectionType={SectionTypeEnum.MALTEKST}
      >
        {children}
        {readOnly || !hasWriteAccess ? null : (
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
