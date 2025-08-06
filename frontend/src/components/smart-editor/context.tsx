import { useHasWriteAccess } from '@app/components/smart-editor/hooks/use-has-write-access';
import {
  GodeFormuleringerExpandState,
  useSmartEditorAnnotationsAtOrigin,
  useSmartEditorGodeFormuleringerExpandstate,
  useSmartEditorGodeFormuleringerOpen,
  useSmartEditorHistoryOpen,
} from '@app/hooks/settings/use-setting';
import { DistribusjonsType, type ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import type { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { TRange } from 'platejs';
import { createContext, type RefObject, useRef, useState } from 'react';

const noop = () => undefined;

interface ISmartEditorContext extends Pick<ISmartDocumentOrAttachment, 'templateId' | 'dokumentTypeId'> {
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
  sheetRef: RefObject<HTMLDivElement | null>;
  hasWriteAccess: boolean;
  creator: string;
  editingComment: ISmartEditorComment | null;
  setEditingComment: (comment: ISmartEditorComment | null) => void;
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
  hasWriteAccess: false,
  creator: '',
  editingComment: null,
  setEditingComment: noop,
});

interface Props {
  children: React.ReactNode;
  smartDocument: ISmartDocumentOrAttachment;
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
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const hasWriteAccess = useHasWriteAccess(smartDocument);
  const [editingComment, setEditingComment] = useState<ISmartEditorComment | null>(null);

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
        hasWriteAccess,
        creator: creator.employee.navIdent,
        editingComment,
        setEditingComment,
      }}
    >
      {children}
    </SmartEditorContext.Provider>
  );
};
