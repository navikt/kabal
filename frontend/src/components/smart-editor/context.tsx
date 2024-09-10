import { TRange } from '@udecode/plate-common';
import { createContext, useState } from 'react';
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
  documentId: string | null;
  focusedThreadId: string | null;
  setFocusedThreadId: (threadId: string | null) => void;
  showAnnotationsAtOrigin: boolean;
  setShowAnnotationsAtOrigin: (show: boolean) => void;
  sheetRef: HTMLDivElement | null;
  setSheetRef: (ref: HTMLDivElement | null) => void;
}

export const SmartEditorContext = createContext<ISmartEditorContext>({
  templateId: TemplateIdEnum.GENERELT_BREV,
  dokumentTypeId: DistribusjonsType.BREV,
  showGodeFormuleringer: false,
  setShowGodeFormuleringer: noop,
  newCommentSelection: null,
  setNewCommentSelection: noop,
  documentId: null,
  focusedThreadId: null,
  setFocusedThreadId: noop,
  showAnnotationsAtOrigin: false,
  setShowAnnotationsAtOrigin: noop,
  sheetRef: null,
  setSheetRef: noop,
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

  return (
    <SmartEditorContext.Provider
      value={{
        templateId,
        dokumentTypeId,
        setShowGodeFormuleringer,
        showGodeFormuleringer,
        newCommentSelection,
        setNewCommentSelection,
        documentId: id,
        focusedThreadId,
        setFocusedThreadId,
        showAnnotationsAtOrigin,
        setShowAnnotationsAtOrigin,
        sheetRef,
        setSheetRef,
      }}
    >
      {children}
    </SmartEditorContext.Provider>
  );
};
