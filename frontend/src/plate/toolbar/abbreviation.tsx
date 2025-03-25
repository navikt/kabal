import { toast } from '@app/components/toast/store';
import { ABBREVIATIONS } from '@app/custom-data/abbreviations';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { Keys, isMetaKey } from '@app/keys';
import { pushEvent } from '@app/observability';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useMyPlateEditorRef, useMyPlateEditorState } from '@app/plate/types';
import { useAddAbbreviationMutation } from '@app/redux-api/bruker';
import { PlusIcon, TagIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, TextField, Tooltip } from '@navikt/ds-react';
import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

export const Abbreviation = () => {
  const [addAbbreviation] = useAddAbbreviationMutation();
  const editor = useMyPlateEditorState();
  const editorRef = useMyPlateEditorRef();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [localShort, setLocalShort] = useState('');

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === Keys.Escape) {
        setIsOpen(false);
        editorRef.tf.focus();
      }

      if (e.shiftKey && isMetaKey(e) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsOpen((o) => !o);
      }
    };

    window.addEventListener('keydown', listener);

    return () => window.removeEventListener('keydown', listener);
  }, [editorRef.tf.focus]);

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

    const long = editor.api.string(editor.selection).trim();

    if (long.length === 0) {
      toast.warning('Du må markere teksten du vil forkorte.');

      return;
    }

    if (short === long) {
      toast.warning(`Forkortelsen «${short}» kan ikke være lik den lange teksten.`);

      return;
    }

    await addAbbreviation({ short, long }).unwrap();
    editor.tf.focus();
    setIsOpen(false);

    pushEvent('smart-editor-add-abbreviation', 'smart-editor', { short, long });
  };

  useOnClickOutside(containerRef, () => {
    if (isOpen) {
      setIsOpen(false);
      editor.tf.focus();
    }
  });

  return (
    <Container ref={containerRef}>
      <ToolbarIconButton
        label="Legg til forkortelse"
        icon={<TagIcon aria-hidden />}
        onClick={() => setIsOpen(!isOpen)}
        active={isOpen}
        variant={isOpen ? 'primary' : 'tertiary-neutral'}
        keys={['Ctrl', 'Shift', 'F']}
      />
      {isOpen ? (
        <HStack asChild gap="0 1" position="absolute" right="0" className="top-full">
          <Box background="bg-default" padding="1" borderRadius="medium" shadow="medium">
            <Tooltip content="Den korte teksten du vil skal ekspandere til markert tekst">
              <TextField
                autoFocus
                label="Forkortelse"
                hideLabel
                value={localShort}
                onChange={(e) => setLocalShort(e.target.value)}
                onKeyDown={({ key }) => {
                  if (key === Keys.Enter) {
                    onAdd();
                  }

                  if (key === Keys.Escape) {
                    setIsOpen(false);
                    editor.tf.focus();
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
          </Box>
        </HStack>
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  font-size: 12pt;
`;
