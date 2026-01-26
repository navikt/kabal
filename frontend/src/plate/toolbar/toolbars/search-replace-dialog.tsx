import { SmartEditorContext } from '@app/components/smart-editor/context';
import { InsertPlugin } from '@app/plate/plugins/capitalise/capitalise';
import {
  getAllDecorations,
  mergeRanges,
  ReplaceOneHighlightPlugin,
  replaceText,
  SearchReplacePlugin,
} from '@app/plate/plugins/search-replace/search-replace';
import { useMyPlateEditorState } from '@app/plate/types';
import { ArrowDownIcon, ArrowUpIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HStack, TextField, VStack } from '@navikt/ds-react';
import { TextCaseTitle, TextChangeCase } from '@styled-icons/fluentui-system-regular';
import { useEditorPlugin, usePluginOption } from 'platejs/react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const useOnUnmount = (callback: () => void) => {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      setTimeout(() => {
        if (!isMounted.current) {
          callback();
        }
      });
    };
  }, [callback]);
};

export const SearchReplaceDialog = () => {
  const editor = useMyPlateEditorState();
  const { setOption: setSearchReplaceOption } = useEditorPlugin(SearchReplacePlugin);
  const { setOption: setHighlightOption } = useEditorPlugin(ReplaceOneHighlightPlugin);
  const searchString = usePluginOption(SearchReplacePlugin, 'search');
  const caseSensitive = usePluginOption(SearchReplacePlugin, 'caseSensitive');
  const [replaceString, setReplaceString] = useState('');
  const { setShowSearchReplace } = useContext(SmartEditorContext);
  const [hitIndex, setHitIndex] = useState(0);
  const [autoCapitalise, setAutoCapitalise] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Must also be recalculated when searchString changes
  const completeMatchRanges = useMemo(
    () => mergeRanges(editor, getAllDecorations(editor)),
    [editor.children, searchString, caseSensitive],
  );

  const close = useCallback(() => {
    setShowSearchReplace(false);
    setHighlightOption('highlight', []);
    setSearchReplaceOption('search', '');
    setSearchReplaceOption('caseSensitive', false);
    editor.api.redecorate();
    editor.tf.focus();
  }, [editor, setShowSearchReplace, setHighlightOption, setSearchReplaceOption]);

  useOnUnmount(close);

  const selectRange = (index: number) => {
    const ranges = mergeRanges(editor, getAllDecorations(editor));
    const range = ranges.at(index);

    if (range !== undefined) {
      setHighlightOption('highlight', [range]);
      editor.tf.setSelection(range);
      editor.api.scrollIntoView(range.anchor);
    } else {
      setHighlightOption('highlight', []);
    }

    editor.api.redecorate();
  };

  const setIndex = (index: number) => {
    const nextIndex = index >= completeMatchRanges.length ? 0 : index;
    selectRange(nextIndex);
    setHitIndex(nextIndex);
  };

  const findNext = () => setIndex(hitIndex + 1);
  const findPrevious = () => setIndex(hitIndex - 1);

  const replaceNext = () => {
    const at = completeMatchRanges.at(hitIndex);

    if (at === undefined) {
      return;
    }

    const { insertCapitalised } = editor.getTransforms(InsertPlugin);

    autoCapitalise ? insertCapitalised(replaceString, { at }) : editor.tf.insertText(replaceString, { at });

    const nextIndex = hitIndex > completeMatchRanges.length - 1 ? 0 : hitIndex;

    selectRange(nextIndex);

    if (nextIndex === 0) {
      setHitIndex(0);
    }
  };

  const replaceAll = () => {
    replaceText(editor, searchString, replaceString, autoCapitalise);
    setHighlightOption('highlight', []);
  };

  const disabled = completeMatchRanges.length === 0;

  return (
    <VStack asChild className="right-0 bottom-auto z-30 gap-2 opacity-90" position="absolute">
      <Box
        marginBlock="space-1 space-0"
        background="raised"
        borderRadius="12"
        shadow="dialog"
        padding="space-8"
        width="320px"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || ((e.ctrlKey || e.metaKey) && e.key === 'f')) {
            e.stopPropagation();
            e.preventDefault();
            close();
          }
        }}
      >
        <HStack gap="space-4">
          <TextField
            autoFocus
            size="small"
            label="Søk etter"
            hideLabel
            placeholder="Søk etter"
            className="grow"
            value={searchString}
            onChange={(e) => {
              setHighlightOption('highlight', []);
              setSearchReplaceOption('search', e.target.value);
              setHitIndex(0);
              selectRange(0);
            }}
            onKeyDown={({ key, shiftKey }) => {
              if (key === 'Enter') {
                shiftKey ? findPrevious() : findNext();
              }
            }}
          />
          <Button
            icon={<TextChangeCase aria-hidden width={24} />}
            title="Krev nøyaktig samsvar med store og små bokstaver"
            size="xsmall"
            role="switch"
            aria-checked={caseSensitive}
            onClick={() => {
              setSearchReplaceOption('caseSensitive', !caseSensitive);
              setHitIndex(0);
              selectRange(0);
            }}
            variant={caseSensitive ? 'primary' : 'tertiary-neutral'}
          />
        </HStack>

        <HStack gap="space-4">
          <TextField
            className="grow"
            size="small"
            label="Erstatt med"
            hideLabel
            placeholder="Erstatt med"
            value={replaceString}
            onChange={(e) => setReplaceString(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.metaKey || e.ctrlKey ? replaceAll() : replaceNext();
              }
            }}
          />

          <Button
            icon={<TextCaseTitle aria-hidden width={24} />}
            title="Sett inn med automatisk stor forbokstav"
            role="switch"
            aria-checked={autoCapitalise}
            size="xsmall"
            onClick={() => setAutoCapitalise(!autoCapitalise)}
            variant={autoCapitalise ? 'primary' : 'tertiary-neutral'}
          />
        </HStack>

        <BodyShort size="small" align="end">
          {completeMatchRanges.length > 0 ? `Treff ${hitIndex + 1} av ${completeMatchRanges.length}` : 'Ingen treff'}
        </BodyShort>

        <HStack
          gap="space-8"
          justify="end"
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
              e.stopPropagation();
              e.preventDefault();
              e.shiftKey ? editor.tf.redo() : editor.tf.undo();
              selectRange(hitIndex);
            }
          }}
        >
          <Button
            data-color="neutral"
            title="Finn neste"
            size="xsmall"
            onClick={findNext}
            disabled={disabled}
            icon={<ArrowDownIcon />}
            variant="tertiary"
          />

          <Button
            data-color="neutral"
            title="Finn forrige"
            size="xsmall"
            onClick={findPrevious}
            disabled={disabled}
            variant="tertiary"
            icon={<ArrowUpIcon />}
          />

          <Button data-color="neutral" disabled={disabled} size="xsmall" variant="secondary" onClick={replaceNext}>
            Erstatt neste
          </Button>

          <Button data-color="neutral" disabled={disabled} size="xsmall" variant="secondary" onClick={replaceAll}>
            Erstatt alle
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
};
