import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useSmartEditorSpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { KabalPlateEditor } from '@app/plate/plate-editor';
import { Sheet } from '@app/plate/sheet';
import { SaksbehandlerTableToolbar } from '@app/plate/toolbar/toolbars/table-toolbar';
import { useContext, useEffect, useState } from 'react';

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
