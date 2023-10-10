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
import { useGetTextsQuery } from '@app/redux-api/texts';
import { IRichText, IText, RichTextTypes } from '@app/types/texts/texts';

export const Maltekst = ({
  editor,
  attributes,
  children,
  element,
}: PlateRenderElementProps<EditorValue, MaltekstElement>) => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const { templateId } = useContext(SmartEditorContext);
  const query = useQuery({ textType: RichTextTypes.MALTEKST, section: element.section, templateId });
  const { data, isLoading, isFetching, refetch } = useGetTextsQuery(query);

  useEffect(() => {
    if (isLoading || isFetching || data === undefined || oppgaveIsLoading || oppgave === undefined) {
      return;
    }

    const path = findNodePath(editor, element);

    if (path === undefined) {
      return;
    }

    const maltekster = lexSpecialis(
      templateId,
      element.section,
      oppgave.ytelseId,
      oppgave.resultat.hjemmelIdSet,
      oppgave.resultat.utfallId === null
        ? oppgave.resultat.extraUtfallIdSet
        : [oppgave.resultat.utfallId, ...oppgave.resultat.extraUtfallIdSet],
      data.filter(isMaltekst),
    )?.content ?? [createEmptyVoid()];

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
          <Tooltip content="Oppdater til siste versjon" delay={0}>
            <Button
              title="Oppdater til siste versjon"
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

const isMaltekst = (text: IText): text is IRichText => text.textType === RichTextTypes.MALTEKST;
