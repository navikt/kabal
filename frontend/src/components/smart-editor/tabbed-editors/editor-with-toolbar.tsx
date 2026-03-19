import { useContext, useEffect, useState } from 'react';
import { SmartEditorContext } from '@/components/smart-editor/context';
import { useSmartEditorSpellCheckLanguage } from '@/hooks/use-smart-editor-language';
import { KabalPlateEditor } from '@/plate/plate-editor';
import { Sheet } from '@/plate/sheet';
import { SaksbehandlerTableToolbar } from '@/plate/toolbar/toolbars/table-toolbar';

interface EditorWithNewCommentAndFloatingToolbarProps {
  id: string;
}

export const EditorWithNewCommentAndFloatingToolbar = ({ id }: EditorWithNewCommentAndFloatingToolbarProps) => {
  const { sheetRef } = useContext(SmartEditorContext);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const lang = useSmartEditorSpellCheckLanguage();

  useEffect(() => {
    sheetRef.current = containerElement;
  }, [containerElement, sheetRef]);

  return (
    <Sheet ref={setContainerElement} minHeight data-component="sheet" className="mr-4">
      <SaksbehandlerTableToolbar container={containerElement} editorId={id} />

      <KabalPlateEditor id={id} lang={lang} contentEditable="dynamic" />
    </Sheet>
  );
};
