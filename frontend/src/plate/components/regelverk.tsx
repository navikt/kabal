import { GavelSoundBlockIcon } from '@navikt/aksel-icons';
import { Button, Loader, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { PlateElement, PlateRenderElementProps, findDescendant, replaceNodeChildren } from '@udecode/plate-common';
import React, { useCallback, useState } from 'react';
import { styled } from 'styled-components';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { sortWithOrdinals } from '@app/functions/sort-with-ordinals/sort-with-ordinals';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { ELEMENT_REGELVERK_CONTAINER } from '@app/plate/plugins/element-types';
import { EditorValue, RegelverkContainerElement, RegelverkElement } from '@app/plate/types';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { IRichText, IText, RichTextTypes } from '@app/types/texts/texts';

const isRegelverk = (text: IText): text is IRichText => text.textType === RichTextTypes.REGELVERK;

export const Regelverk = ({
  attributes,
  children,
  element,
  editor,
}: PlateRenderElementProps<EditorValue, RegelverkElement>) => {
  const [loading, setLoading] = useState(false);
  const { data: oppgave } = useOppgave();
  const query = useQuery({ textType: RichTextTypes.REGELVERK });

  const [getTexts] = useLazyGetTextsQuery();

  const insertRegelverk = useCallback(async () => {
    if (oppgave === undefined || query === skipToken) {
      return;
    }

    setLoading(true);

    const regelverkEntry = findDescendant<RegelverkElement>(editor, { at: [], match: (n) => n === element });

    if (regelverkEntry === undefined) {
      return;
    }

    const [, at] = regelverkEntry;

    const regelverkContainer = findDescendant<RegelverkContainerElement>(editor, {
      at,
      match: (n) => n.type === ELEMENT_REGELVERK_CONTAINER,
    });

    if (regelverkContainer === undefined) {
      return;
    }

    const regelverk = (await getTexts(query).unwrap()).filter(isRegelverk);

    const sortedRegelverk = regelverk.sort((a, b) => sortWithOrdinals(a.title, b.title));

    replaceNodeChildren(editor, {
      at: [...regelverkContainer[1]],
      nodes: sortedRegelverk.flatMap(({ content }) => content),
    });

    setLoading(false);
  }, [editor, element, getTexts, oppgave, query]);

  return (
    <PlateElement
      asChild
      attributes={attributes}
      element={element}
      editor={editor}
      onDragStart={(event) => event.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
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
}: PlateRenderElementProps<EditorValue, RegelverkContainerElement>) => (
  <PlateElement
    asChild
    attributes={attributes}
    element={element}
    editor={editor}
    onDragStart={(event) => event.stopPropagation()}
    onDrop={(e) => e.stopPropagation()}
  >
    <div>{children}</div>
  </PlateElement>
);
