import { SkipToken, skipToken } from '@reduxjs/toolkit/query';
import { PlateElement, PlateRenderElementProps, isEditorReadOnly, setNodes } from '@udecode/plate-common';
import { useCallback, useContext, useMemo } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useMaltekstseksjonQuery } from '@app/components/smart-editor/hooks/use-query';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { Instructions } from '@app/plate/components/maltekstseksjon/instructions';
import { Loading } from '@app/plate/components/maltekstseksjon/loading';
import { replaceNodes } from '@app/plate/components/maltekstseksjon/replace-nodes';
import { Toolbar } from '@app/plate/components/maltekstseksjon/toolbar';
import { UpdateMaltekstseksjon } from '@app/plate/components/maltekstseksjon/update-maltekstseksjon';
import { usePath } from '@app/plate/components/maltekstseksjon/use-path';
import { useUpdateMaltekstseksjon } from '@app/plate/components/maltekstseksjon/use-update';
import { MaltekstseksjonContainer } from '@app/plate/components/styled-components';
import { onPlateContainerDragStart } from '@app/plate/drag-start-handler/on-plate-container-drag-start';
import { ScoredText } from '@app/plate/functions/lex-specialis/lex-specialis';
import { ELEMENT_EMPTY_VOID } from '@app/plate/plugins/element-types';
import { TemplateSections } from '@app/plate/template-sections';
import { EditorValue, MaltekstseksjonElement } from '@app/plate/types';
import { getIsInRegelverk } from '@app/plate/utils/queries';
import { IGetConsumerMaltekstseksjonerParams } from '@app/types/common-text-types';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

export const Maltekstseksjon = ({
  editor,
  attributes,
  children,
  element,
}: PlateRenderElementProps<EditorValue, MaltekstseksjonElement>) => {
  const oppgave = useRequiredOppgave();
  const language = useSmartEditorLanguage();
  const { canManage, templateId } = useContext(SmartEditorContext);
  const query = useMaltekstseksjonQuery(templateId, element.section);
  const path = usePath(editor, element);
  const isUpdated = useMemo(
    () => language === element.language && areQueriesEqual(query, element.query),
    [language, element.language, element.query, query],
  );

  const setUpdated = useCallback(() => {
    if (query === skipToken || isUpdated) {
      return;
    }

    setNodes<MaltekstseksjonElement>(editor, { query, language }, { match: (n) => n === element, at: path });
  }, [editor, element, isUpdated, language, path, query]);

  const { isFetching, maltekstseksjon, manualUpdate, tiedList, update } = useUpdateMaltekstseksjon(
    editor.id,
    element,
    query,
    templateId,
    oppgave.ytelseId,
    oppgave.resultat,
    setUpdated,
    isUpdated,
    canManage,
  );

  const isInRegelverk = useMemo(() => getIsInRegelverk(editor, element), [editor, element]);

  const elementIsEmpty = useMemo(() => {
    const [first, ...rest] = element.children;

    if (rest.length !== 0) {
      return false;
    }

    return first.type === ELEMENT_EMPTY_VOID;
  }, [element]);

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
        {!canManage || isFetching || manualUpdate === undefined || isUpdated ? null : (
          <UpdateMaltekstseksjon
            next={manualUpdate}
            ignore={setUpdated}
            replaceNodes={(...a) => {
              replaceNodes(editor, path, ...a);
              setUpdated();
            }}
          />
        )}
        {children}
        {canManage && elementIsEmpty && maltekstseksjon === null && oppgave !== undefined ? (
          <Information
            isUpdating={false}
            oppgave={oppgave}
            section={element.section}
            templateId={templateId}
            tiedList={tiedList}
          />
        ) : null}
        {canManage ? (
          <Toolbar
            editor={editor}
            element={element}
            path={path}
            isInRegelverk={isInRegelverk}
            isFetching={isFetching}
            update={() => update(false)}
          />
        ) : null}
      </MaltekstseksjonContainer>
    </PlateElement>
  );
};

const useRequiredOppgave = () => {
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    throw new Error('Oppgave is required');
  }

  return oppgave;
};

const areQueriesEqual = (
  a: IGetConsumerMaltekstseksjonerParams | SkipToken,
  b: IGetConsumerMaltekstseksjonerParams | undefined,
): boolean =>
  a !== skipToken &&
  b !== undefined &&
  a.utfallIdList === b.utfallIdList &&
  stringListsAreEqual(a.templateSectionIdList, b.templateSectionIdList) &&
  stringListsAreEqual(a.ytelseHjemmelIdList, b.ytelseHjemmelIdList);

const stringListsAreEqual = (a: string[] | undefined, b: string[] | undefined): boolean => {
  if (a === undefined || b === undefined) {
    return a === b;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (const aElement of a) {
    if (!b.includes(aElement)) {
      return false;
    }
  }

  return true;
};

interface InformationProps {
  isUpdating: boolean;
  oppgave: IOppgavebehandling;
  tiedList: ScoredText<IMaltekstseksjon>[];
  templateId: string;
  section: TemplateSections;
}

const Information = ({ isUpdating, oppgave, section, templateId, tiedList }: InformationProps) =>
  isUpdating ? (
    <Loading section={section} />
  ) : (
    <Instructions oppgave={oppgave} tiedList={tiedList} templateId={templateId} section={section} />
  );
