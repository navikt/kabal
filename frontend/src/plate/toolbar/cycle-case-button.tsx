import { Keys } from '@app/keys';
import { Case, cycleCase, getNewCase } from '@app/plate/plugins/cycle-case/cycle-case';
import { getWordRange } from '@app/plate/plugins/cycle-case/get-word-range';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useMyPlateEditorState } from '@app/plate/types';
import { TextCaseLowercase, TextCaseUppercase, TextChangeCase } from '@styled-icons/fluentui-system-regular';
import { RangeApi } from 'platejs';
import type { ReactElement } from 'react';

export const CycleCaseButton = (): ReactElement => {
  const editor = useMyPlateEditorState();
  const { selection } = editor;
  const casing =
    selection == null
      ? Case.CAPITALISE
      : getNewCase(
          editor.api.string(RangeApi.isCollapsed(selection) ? getWordRange(editor, selection.focus) : selection),
        );

  const commonProps = {
    keys: [Keys.Shift, Keys.F3],
    disabled: selection == null,
  };

  switch (casing) {
    case Case.LOWER:
      return (
        <ToolbarIconButton
          {...commonProps}
          label="Endre til små bokstaver"
          icon={<TextCaseLowercase aria-hidden width={24} />}
          onClick={() => cycleCase(editor, Case.LOWER)}
        />
      );
    case Case.UPPER:
      return (
        <ToolbarIconButton
          {...commonProps}
          label="Endre til STORE BOKSTAVER"
          icon={<TextCaseUppercase aria-hidden width={24} />}
          onClick={() => cycleCase(editor, Case.UPPER)}
        />
      );
    case Case.CAPITALISE:
      return (
        <ToolbarIconButton
          {...commonProps}
          label="Endre til Stor Forbokstav I Alle Ord"
          icon={<TextChangeCase aria-hidden width={24} />}
          onClick={() => cycleCase(editor, Case.CAPITALISE)}
        />
      );
  }
};
