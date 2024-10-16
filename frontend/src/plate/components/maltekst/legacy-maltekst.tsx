import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { nodesEquals } from '@app/plate/components/maltekst/nodes-equals';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { LexSpecialisStatus, lexSpecialis } from '@app/plate/functions/lex-specialis/lex-specialis';
import { ELEMENT_EMPTY_VOID } from '@app/plate/plugins/element-types';
import { createEmptyVoid } from '@app/plate/templates/helpers';
import type { EditorValue, MaltekstElement, RichTextEditorElement } from '@app/plate/types';
import { useGetConsumerTextsQuery } from '@app/redux-api/texts/consumer';
import { RichTextTypes } from '@app/types/common-text-types';
import type { IConsumerRichText, IConsumerText } from '@app/types/texts/consumer';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Loader, Tooltip } from '@navikt/ds-react';
import {
  PlateElement,
  type PlateRenderElementProps,
  findNodePath,
  isEditorReadOnly,
  isElement,
  replaceNodeChildren,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import { useContext, useEffect } from 'react';

/**
 * @deprecated Remove this when all smart documents in prod use maltekstseksjon.
 */
export const LegacyMaltekst = ({
  editor,
  attributes,
  children,
  element,
}: PlateRenderElementProps<EditorValue, MaltekstElement>) => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const { canManage, templateId } = useContext(SmartEditorContext);
  const query = useQuery({ textType: RichTextTypes.MALTEKST, section: element.section, templateId });
  const { data, isLoading, isFetching, refetch } = useGetConsumerTextsQuery(query);

  useEffect(() => {
    if (isLoading || isFetching || data === undefined || oppgaveIsLoading || oppgave === undefined) {
      return;
    }

    const path = findNodePath(editor, element);

    if (path === undefined) {
      return;
    }

    const { ytelseId, resultat } = oppgave;
    const { hjemmelIdSet, utfallId, extraUtfallIdSet } = resultat;

    const [lexSpecialisStatus, richText] = lexSpecialis(
      templateId,
      element.section,
      ytelseId,
      hjemmelIdSet,
      utfallId === null ? extraUtfallIdSet : [utfallId, ...extraUtfallIdSet],
      data.filter(isMaltekst),
    );

    const maltekster = lexSpecialisStatus === LexSpecialisStatus.FOUND ? richText.richText : [createEmptyVoid()];

    if (nodesEquals(element.children, maltekster)) {
      return;
    }

    withoutSavingHistory(editor, () => {
      withoutNormalizing(editor, () =>
        replaceNodeChildren<RichTextEditorElement>(editor, { at: path, nodes: maltekster }),
      );
    });
  }, [data, editor, element, isFetching, isLoading, oppgave, oppgaveIsLoading, templateId]);

  if (isLoading) {
    return (
      <PlateElement asChild attributes={attributes} element={element} editor={editor} suppressContentEditableWarning>
        <SectionContainer
          data-element={element.type}
          data-section={element.section}
          $sectionType={SectionTypeEnum.MALTEKST}
        >
          <Loader title="Laster..." />
        </SectionContainer>
      </PlateElement>
    );
  }

  const [first] = element.children;

  if (isElement(first) && first.type === ELEMENT_EMPTY_VOID) {
    return (
      <PlateElement as="div" attributes={attributes} element={element} editor={editor}>
        {null}
      </PlateElement>
    );
  }

  return (
    <PlateElement
      asChild
      attributes={attributes}
      element={element}
      editor={editor}
      contentEditable={!isEditorReadOnly(editor)}
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
        {canManage ? (
          <SectionToolbar contentEditable={false}>
            <AddNewParagraphs editor={editor} element={element} />
            <Tooltip content="Oppdater til siste versjon" delay={0} placement="bottom">
              <Button
                icon={<ArrowCirclepathIcon aria-hidden />}
                onClick={refetch}
                variant="tertiary"
                size="xsmall"
                contentEditable={false}
                loading={isLoading || isFetching}
              />
            </Tooltip>
          </SectionToolbar>
        ) : null}
      </SectionContainer>
    </PlateElement>
  );
};

const isMaltekst = (text: IConsumerText): text is IConsumerRichText => text.textType === RichTextTypes.MALTEKST;
