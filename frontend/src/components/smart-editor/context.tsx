import { TRange } from '@udecode/plate-common';
import React, { createContext, useState } from 'react';
import { useSmartEditorGodeFormuleringerOpen } from '@app/hooks/settings/use-setting';
import { RichText } from '@app/plate/types';
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
  bookmarksMap: Record<string, RichText[]>;
  addBookmark: (bookmarkId: string, richTexts: RichText[]) => void;
  removeBookmark: (bookmarkId: string) => void;
  setInitialBookmarks: (bookmarks: Record<string, RichText[]>) => void;
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
  bookmarksMap: {},
  addBookmark: noop,
  removeBookmark: noop,
  setInitialBookmarks: noop,
});

interface Props {
  children: React.ReactNode;
  editor: ISmartDocument;
}

export const SmartEditorContextComponent = ({ children, editor }: Props) => {
  const { dokumentTypeId, templateId, id } = editor;
  const { value: showGodeFormuleringer = false, setValue: setShowGodeFormuleringer } =
    useSmartEditorGodeFormuleringerOpen();
  const [newCommentSelection, setNewCommentSelection] = useState<TRange | null>(null);
  const [focusedThreadId, setFocusedThreadId] = useState<string | null>(null);
  const [bookmarksMap, setBookmarksMap] = useState<Record<string, RichText[]>>({});

  const addBookmark = (bookmarkId: string, richTexts: RichText[]) =>
    setBookmarksMap((prev) => ({ ...prev, [bookmarkId]: richTexts }));

  const removeBookmark = (bookmarkId: string) =>
    setBookmarksMap((prev) => {
      delete prev[bookmarkId];

      return { ...prev };
    });

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
        bookmarksMap,
        addBookmark,
        removeBookmark,
        setInitialBookmarks: setBookmarksMap,
      }}
    >
      {children}
    </SmartEditorContext.Provider>
  );
};
