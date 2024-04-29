import { GavelSoundBlockIcon } from '@navikt/aksel-icons';
import { Button, Loader, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { PlateElement, PlateRenderElementProps, findNodePath, replaceNodeChildren } from '@udecode/plate-common';
import React, { useCallback, useState } from 'react';
import { styled } from 'styled-components';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { sortWithOrdinals } from '@app/functions/sort-with-ordinals/sort-with-ordinals';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { EditorValue, RegelverkContainerElement, RegelverkElement } from '@app/plate/types';
import { useLazyGetConsumerTextsQuery } from '@app/redux-api/texts/consumer';
import { REGELVERK_TYPE } from '@app/types/common-text-types';
import { IConsumerRegelverkText, IConsumerText } from '@app/types/texts/consumer';
import { UNTRANSLATED } from '@app/types/texts/language';

const isRegelverk = (text: IConsumerText): text is IConsumerRegelverkText => text.textType === REGELVERK_TYPE;

export const Regelverk = ({
  attributes,
  children,
  element,
  editor,
}: PlateRenderElementProps<EditorValue, RegelverkElement>) => (
  <PlateElement
    attributes={attributes}
    element={element}
    editor={editor}
    onDragStart={(event) => event.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
  >
    {children}
  </PlateElement>
);

const LoadingWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
`;

const StyledLoader = styled(Loader)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
`;

export const RegelverkContainer = ({
  attributes,
  children,
  element,
  editor,
}: PlateRenderElementProps<EditorValue, RegelverkContainerElement>) => {
  const [loading, setLoading] = useState(false);
  const { data: oppgave } = useOppgave();
  const query = useQuery({ textType: REGELVERK_TYPE, language: UNTRANSLATED });

  const [getTexts] = useLazyGetConsumerTextsQuery();

  const insertRegelverk = useCallback(async () => {
    if (oppgave === undefined || query === skipToken) {
      return;
    }

    setLoading(true);

    const at = findNodePath(editor, element);

    if (at === undefined) {
      return;
    }

    const regelverk = (await getTexts(query).unwrap()).filter(isRegelverk);
    const nodes = regelverk.sort((a, b) => sortWithOrdinals(a.title, b.title)).flatMap(({ richText }) => richText);

    replaceNodeChildren(editor, { at, nodes });

    setLoading(false);
  }, [editor, element, getTexts, oppgave, query]);

  return (
    <PlateElement
      asChild
      attributes={attributes}
      element={element}
      editor={editor}
      onDragStart={(event) => event.stopPropagation()}
      onDrop={(e) => e.stopPropagation()}
    >
      <SectionContainer $sectionType={SectionTypeEnum.REGELVERK} data-element={element.type} aria-disabled={loading}>
        {children}
        {loading ? (
          <LoadingWrapper>
            <StyledLoader title="Laster..." size="2xlarge" />
          </LoadingWrapper>
        ) : null}
        <SectionToolbar contentEditable={false}>
          <Tooltip content={loading ? 'Oppdaterer regelverk...' : 'Oppdater regelverk'} delay={0}>
            <Button
              icon={<GavelSoundBlockIcon aria-hidden />}
              onClick={insertRegelverk}
              variant="tertiary"
              size="xsmall"
              contentEditable={false}
              disabled={loading}
            />
          </Tooltip>
        </SectionToolbar>
      </SectionContainer>
    </PlateElement>
  );
};
