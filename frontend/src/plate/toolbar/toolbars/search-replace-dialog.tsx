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
import { BodyShort, BoxNew, Button, HStack, TextField, VStack } from '@navikt/ds-react';
import { TextChangeCase } from '@styled-icons/fluentui-system-regular';
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
  const [replaceString, setReplaceString] = useState('');
  const { setShowSearchReplace } = useContext(SmartEditorContext);
  const [hitIndex, setHitIndex] = useState(0);
  const [autoCapitalise, setAutoCapitalise] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Must also be recalculated when searchString changes
  const completeMatchRanges = useMemo(
    () => mergeRanges(editor, getAllDecorations(editor)),
    [editor.children, searchString],
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
      <BoxNew
        marginBlock="1 0"
        background="raised"
        borderRadius="large"
        shadow="dialog"
        padding="2"
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

        <HStack gap="1">
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
            icon={<TextChangeCase aria-hidden width={24} />}
            title="Automatisk stor forbokstav"
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
          gap="2"
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
            title="Finn neste"
            size="xsmall"
            onClick={findNext}
            disabled={disabled}
            icon={<ArrowDownIcon />}
            variant="tertiary-neutral"
          />

          <Button
            title="Finn forrige"
            size="xsmall"
            onClick={findPrevious}
            disabled={disabled}
            variant="tertiary-neutral"
            icon={<ArrowUpIcon />}
          />

          <Button disabled={disabled} size="xsmall" variant="secondary-neutral" onClick={replaceNext}>
            Erstatt neste
          </Button>

          <Button disabled={disabled} size="xsmall" variant="secondary-neutral" onClick={replaceAll}>
            Erstatt alle
          </Button>
        </HStack>
      </BoxNew>
    </VStack>
  );
};
