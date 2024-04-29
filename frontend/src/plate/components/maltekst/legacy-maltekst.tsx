import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Loader, Tooltip } from '@navikt/ds-react';
import {
  PlateElement,
  PlateRenderElementProps,
  findNodePath,
  isEditorReadOnly,
  isElement,
  replaceNodeChildren,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import React, { useContext, useEffect } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { nodesEquals } from '@app/plate/components/maltekst/nodes-equals';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { lexSpecialis } from '@app/plate/functions/lex-specialis';
import { ELEMENT_EMPTY_VOID } from '@app/plate/plugins/element-types';
import { createEmptyVoid } from '@app/plate/templates/helpers';
import { EditorValue, MaltekstElement, RichTextEditorElement } from '@app/plate/types';
import { useGetConsumerTextsQuery } from '@app/redux-api/texts/consumer';
import { RichTextTypes } from '@app/types/common-text-types';
import { IConsumerRichText, IConsumerText } from '@app/types/texts/consumer';

export const LegacyMaltekst = ({
  editor,
  attributes,
  children,
  element,
}: PlateRenderElementProps<EditorValue, MaltekstElement>) => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const { templateId } = useContext(SmartEditorContext);
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

    const maltekster = lexSpecialis(
      templateId,
      element.section,
      ytelseId,
      hjemmelIdSet,
      utfallId === null ? extraUtfallIdSet : [utfallId, ...extraUtfallIdSet],
      data.filter(isMaltekst),
    )?.richText ?? [createEmptyVoid()];

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
      </SectionContainer>
    </PlateElement>
  );
};

const isMaltekst = (text: IConsumerText): text is IConsumerRichText => text.textType === RichTextTypes.MALTEKST;
