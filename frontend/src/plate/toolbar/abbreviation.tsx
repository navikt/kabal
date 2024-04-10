import { PlusIcon, TagIcon } from '@navikt/aksel-icons';
import { Button, TextField, Tooltip } from '@navikt/ds-react';
import { focusEditor, getEditorString, isCollapsed } from '@udecode/plate-common';
import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { toast } from '@app/components/toast/store';
import { ABBREVIATIONS } from '@app/custom-data/abbreviations';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useMyPlateEditorRef, useMyPlateEditorState } from '@app/plate/types';
import { useAddAbbreviationMutation } from '@app/redux-api/bruker';

export const Abbreviation = () => {
  const [addAbbreviation] = useAddAbbreviationMutation();
  const editor = useMyPlateEditorState();
  const editorRef = useMyPlateEditorRef();
  const disabled = isCollapsed(editor.selection);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [localShort, setLocalShort] = useState('');

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        focusEditor(editorRef);
      }

      if (e.key.toLowerCase() === 'f' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        setIsOpen((o) => !o);
      }
    };

    window.addEventListener('keydown', listener);

    return () => window.removeEventListener('keydown', listener);
  }, [editorRef]);

  const onAdd = async () => {
    const short = localShort.trim();

    if (short.length === 0) {
      toast.warning('Du må skrive inn en forkortelse.');

      return;
    }

    if (short.includes(' ')) {
      toast.warning('Forkortelsen kan ikke inneholde mellomrom.');

      return;
    }

    if (ABBREVIATIONS.hasAbbreviation(short)) {
      toast.warning(`Forkortelsen «${short}» finnes allerede.`);

      return;
    }

    const long = getEditorString(editor, editor.selection).trim();

    if (long.length === 0) {
      toast.warning('Du må markere teksten du vil forkorte.');

      return;
    }

    if (short === long) {
      toast.warning(`Forkortelsen «${short}» kan ikke være lik den lange teksten.`);

      return;
    }

    await addAbbreviation({ short, long }).unwrap();
    focusEditor(editorRef);
    setIsOpen(false);
  };

  useOnClickOutside(containerRef, () => {
    if (isOpen) {
      setIsOpen(false);
      focusEditor(editorRef);
    }
  });

  return (
    <Container ref={containerRef}>
      <ToolbarIconButton
        label="Legg til forkortelse"
        icon={<TagIcon aria-hidden />}
        onClick={() => setIsOpen(!isOpen)}
        active={isOpen}
        disabled={disabled}
        variant={isOpen ? 'primary' : 'tertiary-neutral'}
        keys={['Ctrl', 'Shift', 'F']}
      />
      {isOpen ? (
        <Popup>
          <Tooltip content="Den korte teksten du vil skal ekspandere til markert tekst">
            <TextField
              autoFocus
              label="Forkortelse"
              hideLabel
              value={localShort}
              onChange={(e) => setLocalShort(e.target.value)}
              onKeyDown={({ key }) => {
                if (key === 'Enter') {
                  onAdd();
                }

                if (key === 'Escape') {
                  setIsOpen(false);
                  focusEditor(editorRef);
                }
              }}
              autoCorrect="off"
              spellCheck={false}
              autoComplete="off"
              size="small"
              htmlSize={10}
            />
          </Tooltip>
          <Tooltip content="Legg til forkortelse">
            <Button size="xsmall" variant="primary" onClick={onAdd} icon={<PlusIcon aria-hidden />} />
          </Tooltip>
        </Popup>
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  font-size: 12pt;
`;

const Popup = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: row;
  column-gap: 4px;
  background-color: white;
  padding: 4px;
  box-shadow: var(--a-shadow-medium);
  border-radius: var(--a-border-radius-medium);
`;
