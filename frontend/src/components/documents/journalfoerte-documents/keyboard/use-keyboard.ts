import {
  addOrRemoveOne,
  selectDown,
  selectHome,
  selectUp,
} from '@app/components/documents/journalfoerte-documents/keyboard/actions/select';
import { useKeyboardContext } from '@app/components/documents/journalfoerte-documents/keyboard/keyboard-context';
import { openKeyboardHelpModal } from '@app/components/documents/journalfoerte-documents/keyboard/state/help-modal';
import { unselectAll } from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
import { Keys, isMetaKey } from '@app/keys';
import { pushEvent } from '@app/observability';
import { useCallback, useMemo } from 'react';

export const EVENT_DOMAIN = 'journalforte-documents-keyboard-shortcuts';

export const useKeyboard = () => {
  const actions = useKeyboardShortcuts();

  return useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      for (const { key, modifiers, action, metric } of actions) {
        if (isKey(event, key, modifiers)) {
          event.preventDefault();
          action();
          pushEvent(metric, EVENT_DOMAIN);
          return;
        }
      }
    },
    [actions],
  );
};

interface Modifiers {
  meta?: boolean;
  alt?: boolean;
  shift?: boolean;
}

interface Action {
  key: Keys;
  modifiers?: Modifiers;
  action: () => void;
  metric: string;
}

const DEFAULT_MODIFIERS: Required<Modifiers> = { meta: false, alt: false, shift: false };

const isKey = (
  event: React.KeyboardEvent<HTMLInputElement>,
  key: Keys,
  modifiers: Modifiers = DEFAULT_MODIFIERS,
): boolean => {
  const { meta = false, alt = false, shift = false } = modifiers;

  return isMetaKey(event) === meta && event.altKey === alt && event.shiftKey === shift && event.key === key;
};

const useKeyboardShortcuts = () => {
  const {
    down,
    up,
    home,
    end,
    selectTo,
    selectEnd,
    collapseVedlegg,
    expandVedlegg,
    collapseAllVedlegg,
    expandAllVedlegg,
    toggleInfo,
    toggleSelectAll,
    toggleInclude,
    toggleShowIncludeOnly,
    setAsAttachmentTo,
    rename,
    copyName,
    openInline,
    openInNewTab,
    focusSearch,
  } = useKeyboardContext();

  return useMemo<Action[]>(
    () => [
      // Navigate
      { key: Keys.ArrowDown, action: down, metric: 'keyboard-shortcut-down' },
      { key: Keys.ArrowUp, action: up, metric: 'keyboard-shortcut-up' },
      { key: Keys.Home, action: home, metric: 'keyboard-shortcut-home' },
      { key: Keys.ArrowUp, modifiers: { meta: true }, action: home, metric: 'keyboard-shortcut-home' },
      { key: Keys.End, action: end, metric: 'keyboard-shortcut-end' },
      { key: Keys.ArrowDown, modifiers: { meta: true }, action: end, metric: 'keyboard-shortcut-end' },

      // Select up/down
      {
        key: Keys.ArrowDown,
        modifiers: { shift: true },
        action: selectDown,
        metric: 'keyboard-shortcut-select-down',
      },
      {
        key: Keys.ArrowUp,
        modifiers: { shift: true },
        action: selectUp,
        metric: 'keyboard-shortcut-select-up',
      },

      // Select one
      { key: Keys.Space, action: addOrRemoveOne, metric: 'keyboard-shortcut-add-select' },

      // Select to
      {
        key: Keys.Space,
        modifiers: { shift: true },
        action: selectTo,
        metric: 'keyboard-shortcut-select-to',
      },

      // Select home
      {
        key: Keys.Home,
        modifiers: { shift: true },
        action: selectHome,
        metric: 'keyboard-shortcut-select-home',
      },
      {
        key: Keys.ArrowUp,
        modifiers: { meta: true, shift: true },
        action: selectHome,
        metric: 'keyboard-shortcut-select-home',
      },

      // Select end
      {
        key: Keys.End,
        modifiers: { shift: true },
        action: selectEnd,
        metric: 'keyboard-shortcut-select-end',
      },
      {
        key: Keys.ArrowDown,
        modifiers: { meta: true, shift: true },
        action: selectEnd,
        metric: 'keyboard-shortcut-select-end',
      },

      // Select all
      {
        key: Keys.A,
        modifiers: { meta: true },
        action: toggleSelectAll,
        metric: 'keyboard-shortcut-toggle-select-all',
      },

      // Focus search
      { key: Keys.F, modifiers: { meta: true }, action: focusSearch, metric: 'keyboard-shortcut-focus-search' },

      // Actions
      { key: Keys.M, action: toggleInclude, metric: 'keyboard-shortcut-toggle-include' },
      {
        key: Keys.B,
        action: toggleShowIncludeOnly,
        metric: 'keyboard-shortcut-toggle-show-include-only',
      },
      { key: Keys.I, action: toggleInfo, metric: 'keyboard-shortcut-toggle-metadata' },
      {
        key: Keys.V,

        action: setAsAttachmentTo,
        metric: 'keyboard-shortcut-set-as-attachment-to',
      },
      { key: Keys.N, action: rename, metric: 'keyboard-shortcut-rename' },
      { key: Keys.F2, action: rename, metric: 'keyboard-shortcut-rename' },
      { key: Keys.C, modifiers: { meta: true }, action: copyName, metric: 'keyboard-shortcut-rename' },

      { key: Keys.Escape, action: unselectAll, metric: 'keyboard-shortcut-unselect-all' },

      // Help
      { key: Keys.H, action: openKeyboardHelpModal, metric: 'keyboard-shortcut-help-open' },

      // Vedlegg expand/collapse
      { key: Keys.ArrowRight, action: expandVedlegg, metric: 'keyboard-shortcut-expand-vedlegg' },
      {
        key: Keys.ArrowRight,
        modifiers: { meta: true },
        action: expandAllVedlegg,
        metric: 'keyboard-shortcut-expand-all-vedlegg',
      },
      { key: Keys.ArrowLeft, action: collapseVedlegg, metric: 'keyboard-shortcut-collapse-vedlegg' },
      {
        key: Keys.ArrowLeft,
        modifiers: { meta: true },
        action: collapseAllVedlegg,
        metric: 'keyboard-shortcut-collapse-all-vedlegg',
      },

      // Open
      { key: Keys.Enter, modifiers: { meta: true }, action: openInNewTab, metric: 'keyboard-shortcut-open-in-new-tab' },
      { key: Keys.Enter, action: openInline, metric: 'keyboard-shortcut-open-inline' },
    ],
    [
      down,
      up,
      home,
      end,
      selectTo,
      selectEnd,
      collapseVedlegg,
      expandVedlegg,
      collapseAllVedlegg,
      expandAllVedlegg,
      toggleInfo,
      toggleSelectAll,
      toggleInclude,
      setAsAttachmentTo,
      rename,
      copyName,
      openInline,
      openInNewTab,
      focusSearch,
      toggleShowIncludeOnly,
    ],
  );
};
