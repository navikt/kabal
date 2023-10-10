import { GavelSoundBlockIcon } from '@navikt/aksel-icons';
import { Button, Loader, Tooltip } from '@navikt/ds-react';
import { PlateElement, PlateRenderElementProps, findDescendant, replaceNodeChildren } from '@udecode/plate-common';
import React, { useCallback, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { getYtelseHjemmelList } from '@app/components/smart-editor/hooks/use-query';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { ELEMENT_REGELVERK_CONTAINER } from '@app/plate/plugins/element-types';
import { EditorValue, RegelverkContainerElement, RegelverkElement } from '@app/plate/types';
import { useLazyGetTextsQuery } from '@app/redux-api/texts';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import { IRichText, IText, RichTextTypes } from '@app/types/texts/texts';

const isRegelverk = (text: IText): text is IRichText => text.textType === RichTextTypes.REGELVERK;

const useSortedHjemler = (): string[] => {
  const { data: oppgave } = useOppgave();
  const { data: ytelser } = useLatestYtelser();

  return useMemo<string[]>(() => {
    if (oppgave === undefined || ytelser === undefined || oppgave.resultat.hjemmelIdSet.length === 0) {
      return [];
    }

    const ytelse = ytelser.find(({ id }) => id === oppgave.ytelseId);
    const { hjemmelIdSet } = oppgave.resultat;

    if (ytelse === undefined) {
      return hjemmelIdSet;
    }

    const sortedIds: string[] = [];

    for (const lovkilde of ytelse.lovKildeToRegistreringshjemler) {
      if (hjemmelIdSet.length === sortedIds.length) {
        return sortedIds;
      }

      for (const registreringshjemmel of lovkilde.registreringshjemler) {
        if (hjemmelIdSet.length === sortedIds.length) {
          return sortedIds;
        }

        if (hjemmelIdSet.includes(registreringshjemmel.id)) {
          sortedIds.push(registreringshjemmel.id);
        }
      }
    }

    if (hjemmelIdSet.length !== sortedIds.length) {
      return Array.from(new Set([...sortedIds, ...hjemmelIdSet]));
    }

    return sortedIds;
  }, [oppgave, ytelser]);
};

export const Regelverk = ({
  attributes,
  children,
  element,
  editor,
}: PlateRenderElementProps<EditorValue, RegelverkElement>) => {
  const [loading, setLoading] = useState(false);
  const sortedHjemler = useSortedHjemler();
  const { data: oppgave } = useOppgave();

  const [getTexts] = useLazyGetTextsQuery();

  const insertRegelverk = useCallback(async () => {
    if (oppgave === undefined) {
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

    const queries = sortedHjemler.map((hjemmelId) => ({
      textType: RichTextTypes.REGELVERK,
      ytelseHjemmelList: getYtelseHjemmelList(oppgave.ytelseId, [hjemmelId]),
    }));

    const promises = queries.map(async (q) =>
      (await getTexts(q).unwrap()).filter(isRegelverk).flatMap(({ content }) => content),
    );

    const regelverk = (await Promise.all(promises)).flat();

    replaceNodeChildren(editor, { at: [...regelverkContainer[1]], nodes: regelverk });

    setLoading(false);
  }, [editor, element, getTexts, oppgave, sortedHjemler]);

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
