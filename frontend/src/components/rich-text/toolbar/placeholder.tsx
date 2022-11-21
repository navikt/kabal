import { Add, Close, Parking } from '@navikt/ds-icons';
import { Button, TextField } from '@navikt/ds-react';
import React, { useRef, useState } from 'react';
import { Range } from 'slate';
import { useSlate } from 'slate-react';
import styled from 'styled-components';
import { useOnClickOutside } from '../../../hooks/use-on-click-outside';
import {
  insertPlaceholder,
  insertPlaceholderFromSelection,
  isPlaceholderActive,
  removePlaceholder,
} from '../functions/insert-placeholder';
import { isInPlaceholderInMaltekst } from '../functions/maltekst';
import { Key } from '../rich-text-editor/use-keyboard/types';
import { ToolbarIconButton } from './toolbarbutton';

interface Props {
  show: boolean;
}

export const Placeholder = ({ show }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const ref = useRef<HTMLSpanElement>(null);
  const [placeholder, setPlaceholder] = useState('');
  const editor = useSlate();
  const notEditable = isInPlaceholderInMaltekst(editor);

  const resetAndClose = () => {
    setPlaceholder('');
    setIsOpen(false);
  };

  useOnClickOutside(resetAndClose, ref, true);

  if (!show) {
    return null;
  }

  const onClick = () => {
    if (editor.selection === null) {
      return;
    }

    if (Range.isCollapsed(editor.selection)) {
      if (isPlaceholderActive(editor)) {
        removePlaceholder(editor);
      } else {
        toggleOpen();
      }
    } else if (!isPlaceholderActive(editor)) {
      insertPlaceholderFromSelection(editor);
    }
  };

  const disabled =
    editor.selection === null || notEditable || (Range.isExpanded(editor.selection) && isPlaceholderActive(editor));

  return (
    <StyledPlaceholder ref={ref}>
      <ToolbarIconButton
        label="Sett inn innfyllingsfelt (Ctrl/⌘ + P)"
        onClick={onClick}
        icon={<Parking width={24} />}
        active={isPlaceholderActive(editor)}
        disabled={disabled}
      />
      <PlaceholderText show={isOpen} close={resetAndClose} placeholder={placeholder} setPlaceholder={setPlaceholder} />
    </StyledPlaceholder>
  );
};

interface PlaceholderProps {
  show: boolean;
  close: () => void;
  placeholder: string;
  setPlaceholder: (value: string) => void;
}

const PlaceholderText = ({ show, close, placeholder, setPlaceholder }: PlaceholderProps) => {
  const editor = useSlate();

  if (!show) {
    return null;
  }

  const addPlaceholder = () => {
    insertPlaceholder(editor, placeholder);
    close();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === Key.ENTER) {
      event.preventDefault();
      addPlaceholder();
    } else if (event.key === Key.ESCAPE) {
      event.preventDefault();
      close();
    }
  };

  return (
    <StyledPlaceholderText>
      <TextField
        autoFocus
        size="small"
        label="Innfyllingsfelt"
        placeholder="Innfyllingsfelt"
        hideLabel
        value={placeholder}
        onChange={({ target }) => setPlaceholder(target.value)}
        onKeyDown={onKeyDown}
      />
      <Button size="small" onClick={addPlaceholder} icon={<Add aria-hidden />} variant="primary" title="Sett inn" />
      <Button size="small" onClick={close} icon={<Close aria-hidden />} variant="danger" title="Avbryt" />
    </StyledPlaceholderText>
  );
};

const StyledPlaceholder = styled.span``;

const StyledPlaceholderText = styled.div`
  position: absolute;
  display: flex;
  gap: 4px;
  background: var(--a-surface-subtle);
  padding: 8px;
  border: 1px solid var(--a-border-strong);
  border-radius: 4px;
`;
