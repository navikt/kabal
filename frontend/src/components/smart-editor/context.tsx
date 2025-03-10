import { useCanEditDocument, useCanManageDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import {
  GodeFormuleringerExpandState,
  useSmartEditorAnnotationsAtOrigin,
  useSmartEditorGodeFormuleringerExpandstate,
  useSmartEditorGodeFormuleringerOpen,
  useSmartEditorHistoryOpen,
} from '@app/hooks/settings/use-setting';
import { DistribusjonsType, type ISmartDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { TRange } from '@udecode/plate';
import { type MutableRefObject, createContext, useRef, useState } from 'react';

const noop = () => {};

interface ISmartEditorContext extends Pick<ISmartDocument, 'templateId' | 'dokumentTypeId'> {
  showGodeFormuleringer: boolean;
  setShowGodeFormuleringer: (show: boolean) => void;
  godeFormuleringerExpandState: GodeFormuleringerExpandState;
  setGodeFormuleringerExpandState: (state: GodeFormuleringerExpandState) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  newCommentSelection: TRange | null;
  setNewCommentSelection: (selection: TRange | null) => void;
  dokumentId: string;
  focusedThreadId: string | null;
  setFocusedThreadId: (threadId: string | null) => void;
  showAnnotationsAtOrigin: boolean;
  setShowAnnotationsAtOrigin: (show: boolean) => void;
  sheetRef: MutableRefObject<HTMLDivElement | null>;
  canManage: boolean;
  canEdit: boolean;
  creator: string;
}

export const SmartEditorContext = createContext<ISmartEditorContext>({
  templateId: TemplateIdEnum.GENERELT_BREV,
  dokumentTypeId: DistribusjonsType.BREV,
  showGodeFormuleringer: false,
  setShowGodeFormuleringer: noop,
  godeFormuleringerExpandState: GodeFormuleringerExpandState.PREVIEW,
  setGodeFormuleringerExpandState: noop,
  showHistory: false,
  setShowHistory: noop,
  newCommentSelection: null,
  setNewCommentSelection: noop,
  dokumentId: '',
  focusedThreadId: null,
  setFocusedThreadId: noop,
  showAnnotationsAtOrigin: false,
  setShowAnnotationsAtOrigin: noop,
  sheetRef: { current: null },
  canManage: false,
  canEdit: false,
  creator: '',
});

interface Props {
  children: React.ReactNode;
  smartDocument: ISmartDocument;
}

export const SmartEditorContextComponent = ({ children, smartDocument }: Props) => {
  const { dokumentTypeId, templateId, id, creator } = smartDocument;
  const { value: showGodeFormuleringer = false, setValue: setShowGodeFormuleringer } =
    useSmartEditorGodeFormuleringerOpen();
  const {
    value: godeFormuleringerExpandState = GodeFormuleringerExpandState.PREVIEW,
    setValue: setGodeFormuleringerExpandState,
  } = useSmartEditorGodeFormuleringerExpandstate();
  const { value: showHistory = false, setValue: setShowHistory } = useSmartEditorHistoryOpen();
  const [newCommentSelection, setNewCommentSelection] = useState<TRange | null>(null);
  const [focusedThreadId, setFocusedThreadId] = useState<string | null>(null);
  const { value: showAnnotationsAtOrigin = false, setValue: setShowAnnotationsAtOrigin } =
    useSmartEditorAnnotationsAtOrigin();
  // const [sheetRef, setSheetRef] = useState<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const canManage = useCanManageDocument(templateId);
  const canEdit = useCanEditDocument(templateId);

  return (
    <SmartEditorContext.Provider
      value={{
        templateId,
        dokumentTypeId,
        setShowGodeFormuleringer,
        showGodeFormuleringer,
        godeFormuleringerExpandState,
        setGodeFormuleringerExpandState,
        showHistory,
        setShowHistory,
        newCommentSelection,
        setNewCommentSelection,
        dokumentId: id,
        focusedThreadId,
        setFocusedThreadId,
        showAnnotationsAtOrigin,
        setShowAnnotationsAtOrigin,
        sheetRef,
        canManage,
        canEdit,
        creator: creator.employee.navIdent,
      }}
    >
      {children}
    </SmartEditorContext.Provider>
  );
};
