import { TRange } from '@udecode/plate-common';
import React, { createContext, useState } from 'react';
import { useSmartEditorGodeFormuleringerOpen } from '@app/hooks/settings/use-setting';
import { DistribusjonsType } from '@app/types/documents/documents';
import { ISmartEditor } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

const noop = () => {};

interface ISmartEditorContext extends Pick<ISmartEditor, 'templateId' | 'dokumentTypeId'> {
  showGodeFormuleringer: boolean;
  setShowGodeFormuleringer: (show: boolean) => void;
  newCommentSelection: TRange | null;
  setNewCommentSelection: (selection: TRange | null) => void;
  documentId: string | null;
  focusedThreadId: string | null;
  setFocusedThreadId: (threadId: string | null) => void;
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
});

interface Props {
  children: React.ReactNode;
  editor: ISmartEditor;
}

export const SmartEditorContextComponent = ({ children, editor }: Props) => {
  const { dokumentTypeId, templateId, id } = editor;
  const { value: showGodeFormuleringer = false, setValue: setShowGodeFormuleringer } =
    useSmartEditorGodeFormuleringerOpen();
  const [newCommentSelection, setNewCommentSelection] = useState<TRange | null>(null);
  const [focusedThreadId, setFocusedThreadId] = useState<string | null>(null);

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
      }}
    >
      {children}
    </SmartEditorContext.Provider>
  );
};
