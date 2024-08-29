import { skipToken } from '@reduxjs/toolkit/query';
import { PlateElement, PlateRenderElementProps, isEditorReadOnly } from '@udecode/plate-common';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useQuery } from '@app/components/smart-editor/hooks/use-query';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { Instructions } from '@app/plate/components/maltekstseksjon/instructions';
import { Loading } from '@app/plate/components/maltekstseksjon/loading';
import { replaceNodes } from '@app/plate/components/maltekstseksjon/replace-nodes';
import { Toolbar } from '@app/plate/components/maltekstseksjon/toolbar';
import { MaltekstseksjonUpdate } from '@app/plate/components/maltekstseksjon/types';
import { UpdateMaltekstseksjon } from '@app/plate/components/maltekstseksjon/update-maltekstseksjon';
import { usePath } from '@app/plate/components/maltekstseksjon/use-path';
import { NO_TIED_LIST, useUpdateMaltekstseksjon } from '@app/plate/components/maltekstseksjon/use-update';
import { MaltekstseksjonContainer } from '@app/plate/components/styled-components';
import { onPlateContainerDragStart } from '@app/plate/drag-start-handler/on-plate-container-drag-start';
import { ScoredText } from '@app/plate/functions/lex-specialis/lex-specialis';
import { TemplateSections } from '@app/plate/template-sections';
import { EditorValue, MaltekstseksjonElement } from '@app/plate/types';
import { getIsInRegelverk } from '@app/plate/utils/queries';
import { MALTEKSTSEKSJON_TYPE } from '@app/types/common-text-types';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

export const Maltekstseksjon = ({
  editor,
  attributes,
  children,
  element,
}: PlateRenderElementProps<EditorValue, MaltekstseksjonElement>) => {
  const { data: oppgave } = useOppgave();
  const { templateId } = useContext(SmartEditorContext);
  const query = useQuery({ textType: MALTEKSTSEKSJON_TYPE, section: element.section, templateId });
  const path = usePath(editor, element);
  const [isUpdating, setIsUpdating] = useState(true);
  const [manualUpdate, setManualUpdate] = useState<MaltekstseksjonUpdate | null | undefined>(undefined);
  const [tiedList, setTiedList] = useState(NO_TIED_LIST);
  const [maltekstseksjon, setMaltekstseksjon] = useState<IMaltekstseksjon | null>(null);
  const elementRef = useRef(element);

  const { updateMaltekstseksjon, isFetching } = useUpdateMaltekstseksjon(
    editor,
    path,
    templateId,
    setIsUpdating,
    setManualUpdate,
    setTiedList,
    setMaltekstseksjon,
  );

  // Keep element in a ref in order to avoid unneccessary triggers of useEffect below, which would ultimatlely lead to fetch maltekstseksjon spam
  useEffect(() => {
    elementRef.current = element;
  }, [element]);

  useEffect(() => {
    if (oppgave?.ytelseId === undefined || oppgave?.resultat === undefined || query === skipToken) {
      return;
    }

    setIsUpdating(true);
    const timeout = setTimeout(
      () => updateMaltekstseksjon(elementRef.current, oppgave.resultat, oppgave.ytelseId, query),
      1_000,
    );

    return () => clearTimeout(timeout);
  }, [oppgave?.ytelseId, oppgave?.resultat, query, updateMaltekstseksjon]);

  const isInRegelverk = useMemo(() => getIsInRegelverk(editor, element), [editor, element]);

  return (
    <PlateElement
      asChild
      attributes={attributes}
      element={element}
      editor={editor}
      contentEditable={!isEditorReadOnly(editor)}
      suppressContentEditableWarning
      onDragStart={onPlateContainerDragStart}
    >
      <MaltekstseksjonContainer
        data-element={element.type}
        data-section={element.section}
        data-language={element.language}
        data-maltekstseksjon-id={element.id}
      >
        {manualUpdate !== undefined ? (
          <UpdateMaltekstseksjon next={manualUpdate} replaceNodes={(...a) => replaceNodes(editor, path, ...a)} />
        ) : null}
        {children}
        {maltekstseksjon === null && oppgave !== undefined ? (
          <Information
            isUpdating={isUpdating}
            oppgave={oppgave}
            section={element.section}
            templateId={templateId}
            tiedList={tiedList}
          />
        ) : null}
        <Toolbar
          editor={editor}
          element={element}
          path={path}
          isInRegelverk={isInRegelverk}
          isFetching={isFetching}
          update={() => {
            if (oppgave !== undefined && query !== skipToken) {
              setIsUpdating(true);
              updateMaltekstseksjon(element, oppgave.resultat, oppgave.ytelseId, query);
            }
          }}
        />
      </MaltekstseksjonContainer>
    </PlateElement>
  );
};

interface InformationProps {
  isUpdating: boolean;
  oppgave: IOppgavebehandling;
  tiedList: ScoredText<IMaltekstseksjon>[];
  templateId: string;
  section: TemplateSections;
}

const Information = ({ isUpdating, oppgave, section, templateId, tiedList }: InformationProps) => {
  if (isUpdating) {
    return <Loading section={section} />;
  }

  return <Instructions oppgave={oppgave} tiedList={tiedList} templateId={templateId} section={section} />;
};
