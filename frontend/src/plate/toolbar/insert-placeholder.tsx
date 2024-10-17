import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { MOD_KEY } from '@app/keys';
import { createPlaceHolder } from '@app/plate/templates/helpers';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useMyPlateEditorRef } from '@app/plate/types';
import { isPlaceholderActive } from '@app/plate/utils/queries';
import { insertPlaceholderFromSelection, removePlaceholder } from '@app/plate/utils/transforms';
import { PencilWritingIcon, PlusIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, TextField } from '@navikt/ds-react';
import { insertElements, isCollapsed, isExpanded } from '@udecode/plate-common';
import { useEditorState } from '@udecode/plate-core/react';
import { useRef, useState } from 'react';
import { styled } from 'styled-components';

export const InsertPlaceholder = () => {
  const editor = useEditorState();
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const ref = useRef<HTMLSpanElement>(null);
  const [placeholder, setPlaceholder] = useState('');

  const resetAndClose = () => {
    setPlaceholder('');
    setIsOpen(false);
  };

  useOnClickOutside(ref, resetAndClose, true);

  const onClick = () => {
    if (isCollapsed(editor.selection)) {
      if (isPlaceholderActive(editor)) {
        removePlaceholder(editor);
      } else {
        toggleOpen();
      }
    } else {
      insertPlaceholderFromSelection(editor);
    }
  };

  const disabled = editor.selection === null || (isExpanded(editor.selection) && isPlaceholderActive(editor));

  return (
    <span ref={ref}>
      <ToolbarIconButton
        label="Sett inn innfyllingsfelt"
        keys={[MOD_KEY, 'J']}
        onClick={onClick}
        icon={<PencilWritingIcon aria-hidden />}
        active={isPlaceholderActive(editor)}
        disabled={disabled}
      />
      <PlaceholderText show={isOpen} close={resetAndClose} placeholder={placeholder} setPlaceholder={setPlaceholder} />
    </span>
  );
};

interface PlaceholderProps {
  show: boolean;
  close: () => void;
  placeholder: string;
  setPlaceholder: (value: string) => void;
}

const PlaceholderText = ({ show, close, placeholder, setPlaceholder }: PlaceholderProps) => {
  const editor = useMyPlateEditorRef();

  if (!show) {
    return null;
  }

  const addPlaceholder = () => {
    insertElements(editor, createPlaceHolder(placeholder), { select: true });
    close();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addPlaceholder();
    } else if (event.key === 'Escape') {
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
      <Button
        size="small"
        onClick={addPlaceholder}
        icon={<PlusIcon aria-hidden />}
        variant="primary"
        title="Sett inn"
      />
      <Button size="small" onClick={close} icon={<XMarkIcon aria-hidden />} variant="danger" title="Avbryt" />
    </StyledPlaceholderText>
  );
};

const StyledPlaceholderText = styled.div`
  position: absolute;
  display: flex;
  gap: var(--a-spacing-1);
  background-color: var(--a-surface-subtle);
  padding: var(--a-spacing-2);
  border: 1px solid var(--a-border-strong);
  border-radius: var(--a-border-radius-medium);
  min-width: 220px;
  top: 100%;
  right: 0;
`;
