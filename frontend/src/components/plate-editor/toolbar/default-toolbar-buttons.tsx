import { ArrowUndoIcon } from '@navikt/aksel-icons';
import {
  ClearFormatting,
  DocumentPageBreak,
  TableAdd,
  TextAlignLeft,
  TextAlignRight,
  TextBold,
  TextItalic,
  TextUnderline,
} from '@styled-icons/fluentui-system-regular';
import { TextBulletListLtr } from '@styled-icons/fluentui-system-regular/TextBulletListLtr';
import { TextDescription } from '@styled-icons/fluentui-system-regular/TextDescription';
import { TextHeader1 } from '@styled-icons/fluentui-system-regular/TextHeader1';
import { TextHeader2 } from '@styled-icons/fluentui-system-regular/TextHeader2';
import { TextHeader3 } from '@styled-icons/fluentui-system-regular/TextHeader3';
import { TextIndentDecreaseLtr } from '@styled-icons/fluentui-system-regular/TextIndentDecreaseLtr';
import { TextIndentIncreaseLtr } from '@styled-icons/fluentui-system-regular/TextIndentIncreaseLtr';
import { TextNumberListLtr } from '@styled-icons/fluentui-system-regular/TextNumberListLtr';
import {
  AlignToolbarButton,
  BlockToolbarButton,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_UL,
  ListToolbarButton,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  MarkToolbarButton,
  TableToolbarButton,
  ToolbarButton,
  focusEditor,
  getPluginType,
  indent,
  insertTable,
  outdent,
} from '@udecode/plate';
import React from 'react';
import styled from 'styled-components';
import { ELEMENT_PAGE_BREAK } from '@app/components/plate-editor/plugins/page-break';
import { ToolbarSeparator } from '@app/components/plate-editor/toolbar/separator';
import { useMyPlateEditorRef } from '@app/components/plate-editor/types';
import { ToolbarIconButton } from '@app/components/rich-text/toolbar/toolbarbutton';

const tooltip = (content: string) => ({
  content,
});

const activeStyle = {
  backgroundColor: 'var(--a-blue-100)',
  opacity: 0.5,
};

export const DefaultToolbarButtons = () => {
  const editor = useMyPlateEditorRef();

  return (
    <>
      <ToolbarIconButton
        label="Angre (Ctrl/⌘ + Z)"
        icon={<ArrowUndoIcon width={ICON_SIZE} />}
        active={false}
        onClick={editor.undo}
      />

      <ToolbarIconButton
        label="Gjenopprett (Ctrl/⌘ + Shift + Z)"
        icon={<Redo width={ICON_SIZE} />}
        active={false}
        onClick={editor.redo}
      />

      <ToolbarSeparator />

      <MarkToolbarButton
        tooltip={tooltip('Fet skrift (Ctrl/⌘+B)')}
        type={getPluginType(editor, MARK_BOLD)}
        icon={<TextBold />}
        styles={{ active: activeStyle }}
      />

      <MarkToolbarButton
        tooltip={tooltip('Kursiv (Ctrl/⌘+I)')}
        type={getPluginType(editor, MARK_ITALIC)}
        icon={<TextItalic />}
        styles={{ active: activeStyle }}
      />
      <MarkToolbarButton
        tooltip={tooltip('Understreking (Ctrl/⌘+U)')}
        type={getPluginType(editor, MARK_UNDERLINE)}
        icon={<TextUnderline />}
        styles={{ active: activeStyle }}
      />
      <ToolbarButton
        tooltip={tooltip('Innrykk')}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          indent(editor);
          focusEditor(editor);
        }}
        icon={<TextIndentIncreaseLtr />}
        styles={{ active: activeStyle }}
      />

      <ToolbarButton
        tooltip={tooltip('Fjern innrykk')}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          outdent(editor);

          focusEditor(editor);
        }}
        icon={<TextIndentDecreaseLtr />}
      />

      <ToolbarIconButton
        label="Fjern formatering"
        icon={<ClearFormatting width={ICON_SIZE} />}
        active={false}
        onClick={() => {
          editor.removeMark(MARK_BOLD);
          editor.removeMark(MARK_ITALIC);
          editor.removeMark(MARK_UNDERLINE);
        }}
      />
      <ToolbarIconButton
        label="Sett inn sideskift (Ctrl/⌘ + Enter)"
        onClick={() => editor.insertNode({ type: ELEMENT_PAGE_BREAK, children: [{ text: '' }] })}
        icon={<DocumentPageBreak height={ICON_SIZE} />}
        active={false}
      />

      <ToolbarSeparator />

      <BlockToolbarButton
        tooltip={tooltip('Normal tekst')}
        type={getPluginType(editor, ELEMENT_PARAGRAPH)}
        icon={<TextDescription />}
      />

      <BlockToolbarButton
        tooltip={tooltip('Dokumenttittel / Overskrift 1')}
        type={getPluginType(editor, ELEMENT_H1)}
        icon={<TextHeader1 />}
        styles={{ active: activeStyle }}
      />
      <BlockToolbarButton
        tooltip={tooltip('Overskrift 2')}
        type={getPluginType(editor, ELEMENT_H2)}
        icon={<TextHeader2 />}
        styles={{ active: activeStyle }}
      />
      <BlockToolbarButton
        tooltip={tooltip('Overskrift 3')}
        type={getPluginType(editor, ELEMENT_H3)}
        icon={<TextHeader3 />}
        styles={{ active: activeStyle }}
      />

      <ToolbarSeparator />

      <ListToolbarButton
        tooltip={tooltip('Punktliste')}
        type={getPluginType(editor, ELEMENT_UL)}
        icon={<TextBulletListLtr />}
        styles={{ active: activeStyle }}
      />
      <ListToolbarButton
        tooltip={tooltip('Nummerert liste')}
        type={getPluginType(editor, ELEMENT_OL)}
        icon={<TextNumberListLtr />}
        styles={{ active: activeStyle }}
      />

      <TableToolbarButton
        tooltip={tooltip('Sett inn tabell')}
        icon={<TableAdd />}
        transform={insertTable}
        styles={{ active: activeStyle }}
      />

      <AlignToolbarButton
        tooltip={tooltip('Venstrejuster')}
        value="left"
        icon={<TextAlignLeft />}
        styles={{ active: activeStyle }}
      />

      <AlignToolbarButton
        tooltip={tooltip('Høyrejuster')}
        value="right"
        icon={<TextAlignRight />}
        styles={{ active: activeStyle }}
      />

      <ToolbarSeparator />
    </>
  );
};
const ICON_SIZE = 24;

const Redo = styled(ArrowUndoIcon)`
  transform: scaleX(-1);
`;
