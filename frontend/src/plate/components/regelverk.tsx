import { GavelSoundBlockIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Loader, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { PlateElement, type PlateElementProps, useEditorReadOnly } from 'platejs/react';
import { useCallback, useEffect, useState } from 'react';
import { useRegelverkQuery } from '@/components/smart-editor/hooks/use-query';
import { sortWithOrdinals } from '@/functions/sort-with-ordinals/sort-with-ordinals';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorLanguage } from '@/hooks/use-smart-editor-language';
import { DeleteSection } from '@/plate/components/common/delete-section';
import { useIsChanged } from '@/plate/components/maltekstseksjon/use-is-changed';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@/plate/components/styled-components';
import { onPlateContainerDragStart } from '@/plate/drag-start-handler/on-plate-container-drag-start';
import { ELEMENT_REGELVERK } from '@/plate/plugins/element-types';
import { type RegelverkContainerElement, type RegelverkElement, useMyPlateEditorRef } from '@/plate/types';
import { isNodeEmpty } from '@/plate/utils/queries';
import { useLazyGetConsumerTextsQuery } from '@/redux-api/texts/consumer';
import { REGELVERK_TYPE } from '@/types/common-text-types';
import type { IConsumerRegelverkText, IConsumerText } from '@/types/texts/consumer';

const isRegelverk = (text: IConsumerText): text is IConsumerRegelverkText => text.textType === REGELVERK_TYPE;

export const Regelverk = (props: PlateElementProps<RegelverkElement>) => (
  <PlateElement<RegelverkElement>
    {...props}
    as="div"
    attributes={{ ...props.attributes, onDragStart: onPlateContainerDragStart }}
  >
    {props.children}
  </PlateElement>
);

export const RegelverkContainer = (props: PlateElementProps<RegelverkContainerElement>) => {
  const [loading, setLoading] = useState(false);
  const { data: oppgave } = useOppgave();
  const query = useRegelverkQuery();
  const readOnly = useEditorReadOnly();

  const [getTexts] = useLazyGetConsumerTextsQuery();

  const { children, element, editor } = props;

  const insertRegelverk = useCallback(async () => {
    if (oppgave === undefined || query === skipToken) {
      return;
    }

    setLoading(true);

    const at = editor.api.findPath(element);

    if (at === undefined) {
      return;
    }

    const regelverk = (await getTexts(query).unwrap()).filter(isRegelverk);
    const nodes = regelverk.sort((a, b) => sortWithOrdinals(a.title, b.title)).flatMap(({ richText }) => richText);

    const { ytelseHjemmelIdList, utfallIdList } = query;

    editor.tf.setNodes<RegelverkElement>(
      { query: { ytelseHjemmelIdList, utfallIdList } },
      { match: (n) => n === element, at },
    );

    editor.tf.replaceNodes(nodes, { at, children: true });

    setLoading(false);
  }, [editor, element, getTexts, oppgave, query]);

  return (
    <PlateElement<RegelverkContainerElement>
      {...props}
      attributes={{ ...props.attributes, onDragStart: onPlateContainerDragStart }}
    >
      <SectionContainer sectionType={SectionTypeEnum.REGELVERK} data-element={element.type} aria-disabled={loading}>
        {children}
        {loading ? (
          <Box
            asChild
            position="absolute"
            top="space-0"
            left="space-0"
            right="space-0"
            bottom="space-0"
            background="neutral-strong"
          >
            <HStack align="center" justify="center">
              <Loader title="Laster..." size="2xlarge" />
            </HStack>
          </Box>
        ) : null}
        {readOnly ? null : (
          <SectionToolbar contentEditable={false}>
            <DeleteRegelverkButton element={element} />
            <Tooltip content={loading ? 'Oppdaterer regelverk...' : 'Oppdater regelverk'} delay={0}>
              <Button
                data-color="neutral"
                icon={<GavelSoundBlockIcon aria-hidden />}
                onClick={insertRegelverk}
                variant="tertiary"
                size="xsmall"
                contentEditable={false}
                disabled={loading}
              />
            </Tooltip>
          </SectionToolbar>
        )}
      </SectionContainer>
    </PlateElement>
  );
};

interface DeleteRegelverkButtonProps {
  element: RegelverkContainerElement;
}

const DeleteRegelverkButton = ({ element }: DeleteRegelverkButtonProps) => {
  const editor = useMyPlateEditorRef();
  const at = editor.api.findPath(element);
  const entry = editor.api.node<RegelverkElement>({ at: at, match: { type: ELEMENT_REGELVERK } });

  return entry === undefined ? null : <DeleteRegelverk element={entry[0]} />;
};

interface DeleteRegelverkProps {
  element: RegelverkElement;
}

const DeleteRegelverk = ({ element }: DeleteRegelverkProps) => {
  const editor = useMyPlateEditorRef();
  const language = useSmartEditorLanguage();
  const [, maltekstseksjonElement, regelverkContainerElement] = element.children;
  const [maltekstseksjonChangedIsLoading, maltekstseksjonChanged] = useIsChanged(maltekstseksjonElement, language);
  const [contentChangedIsLoading, setContentChangedIsLoading] = useState(false);
  const [contentChanged, setContentChanged] = useState(false);

  const isLoading = maltekstseksjonChangedIsLoading || contentChangedIsLoading;
  const isChanged = maltekstseksjonChanged || contentChanged;

  useEffect(() => {
    setContentChangedIsLoading(true);

    const timeout = setTimeout(() => {
      requestIdleCallback(() => {
        setContentChangedIsLoading(false);
        setContentChanged(!isNodeEmpty(regelverkContainerElement));
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [regelverkContainerElement]);

  const path = editor.api.findPath(element);

  return (
    <DeleteSection
      isLoading={isLoading}
      isChanged={isChanged}
      path={path}
      errorTooltip="Teknisk feil. Kan ikke slette regelverk."
      defaultTooltip="Slett hele regelverket"
      isChangedWarning="Regelverket inneholder endringer. Er du sikker på at du vil slette det?"
      side="right"
    />
  );
};
