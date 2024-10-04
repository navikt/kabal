import { TRange } from '@udecode/plate-common';
import { createContext, useState } from 'react';
import { useCanManageDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import {
  useSmartEditorAnnotationsAtOrigin,
  useSmartEditorGodeFormuleringerOpen,
} from '@app/hooks/settings/use-setting';
import { DistribusjonsType, ISmartDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

const noop = () => {};

interface ISmartEditorContext extends Pick<ISmartDocument, 'templateId' | 'dokumentTypeId'> {
  showGodeFormuleringer: boolean;
  setShowGodeFormuleringer: (show: boolean) => void;
  newCommentSelection: TRange | null;
  setNewCommentSelection: (selection: TRange | null) => void;
  dokumentId: string;
  focusedThreadId: string | null;
  setFocusedThreadId: (threadId: string | null) => void;
  showAnnotationsAtOrigin: boolean;
  setShowAnnotationsAtOrigin: (show: boolean) => void;
  sheetRef: HTMLDivElement | null;
  setSheetRef: (ref: HTMLDivElement | null) => void;
  canManage: boolean;
}

export const SmartEditorContext = createContext<ISmartEditorContext>({
  templateId: TemplateIdEnum.GENERELT_BREV,
  dokumentTypeId: DistribusjonsType.BREV,
  showGodeFormuleringer: false,
  setShowGodeFormuleringer: noop,
  newCommentSelection: null,
  setNewCommentSelection: noop,
  dokumentId: '',
  focusedThreadId: null,
  setFocusedThreadId: noop,
  showAnnotationsAtOrigin: false,
  setShowAnnotationsAtOrigin: noop,
  sheetRef: null,
  setSheetRef: noop,
  canManage: false,
});

interface Props {
  children: React.ReactNode;
  smartDocument: ISmartDocument;
}

export const SmartEditorContextComponent = ({ children, smartDocument }: Props) => {
  const { dokumentTypeId, templateId, id } = smartDocument;
  const { value: showGodeFormuleringer = false, setValue: setShowGodeFormuleringer } =
    useSmartEditorGodeFormuleringerOpen();
  const [newCommentSelection, setNewCommentSelection] = useState<TRange | null>(null);
  const [focusedThreadId, setFocusedThreadId] = useState<string | null>(null);
  const { value: showAnnotationsAtOrigin = false, setValue: setShowAnnotationsAtOrigin } =
    useSmartEditorAnnotationsAtOrigin();
  const [sheetRef, setSheetRef] = useState<HTMLDivElement | null>(null);
  const canManage = useCanManageDocument(templateId);

  return (
    <SmartEditorContext.Provider
      value={{
        templateId,
        dokumentTypeId,
        setShowGodeFormuleringer,
        showGodeFormuleringer,
        newCommentSelection,
        setNewCommentSelection,
        dokumentId: id,
        focusedThreadId,
        setFocusedThreadId,
        showAnnotationsAtOrigin,
        setShowAnnotationsAtOrigin,
        sheetRef,
        setSheetRef,
        canManage,
      }}
    >
      {children}
    </SmartEditorContext.Provider>
  );
};
