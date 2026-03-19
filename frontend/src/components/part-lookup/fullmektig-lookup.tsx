import { CheckmarkIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Popover, TextField, ToggleGroup } from '@navikt/ds-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cleanAndValidate } from '@/components/part/validate';
import { isPartSelectable } from '@/components/part-lookup/is-part-selectable';
import { KeyboardHelp } from '@/components/part-lookup/keyboard-help';
import { ManualEntry } from '@/components/part-lookup/manual-entry';
import { Messages } from '@/components/part-lookup/messages';
import { SearchResult } from '@/components/part-lookup/search-result';
import { TriggerButton } from '@/components/part-lookup/trigger-button';
import type { InvalidReceiver } from '@/components/part-lookup/types';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { isMetaKey, Keys } from '@/keys';
import { useLazySearchpartwithutsendingskanalQuery } from '@/redux-api/search';
import type { IdentifikatorPart, IFullmektig } from '@/types/oppgave-common';

export type { InvalidReceiver } from '@/components/part-lookup/types';

enum Mode {
  ID = 'id',
  MANUAL = 'manual',
}

const MODES = Object.values(Mode);
const isMode = (value: string): value is Mode => MODES.some((mode) => mode === value);

const getInitialMode = (part: IFullmektig | null): Mode => {
  if (part === null) {
    return Mode.ID;
  }

  return part.identifikator === null ? Mode.MANUAL : Mode.ID;
};

interface FullmektigLookupProps {
  /** Used for aria-label on the trigger button and internal fields. Not rendered visually. */
  label: string;
  part: IFullmektig | null;
  onChange: (part: IdentifikatorPart | IFullmektig) => void;
  onClear: () => void;
  isLoading?: boolean;
  isClearLoading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
  /** List of receiver IDs that are invalid and should show a warning instead of being selectable. */
  invalidReceivers?: InvalidReceiver[];
  /** List of receiver IDs that should show a warning but still be selectable. */
  warningReceivers?: InvalidReceiver[];
}

export const FullmektigLookup = ({
  label,
  part,
  onChange,
  onClear,
  isLoading: externalLoading = false,
  isClearLoading = false,
  disabled = false,
  size = 'small',
  invalidReceivers = [],
  warningReceivers = [],
}: FullmektigLookupProps) => {
  const { data: oppgave } = useOppgave();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(getInitialMode(part));
  const [rawSearch, setRawSearch] = useState('');
  const [inputError, setInputError] = useState<string>();
  const [invalidReceiverMessage, setInvalidReceiverMessage] = useState<string | null>(null);
  const [warningReceiverMessage, setWarningReceiverMessage] = useState<string | null>(null);

  const [search, { data: searchResult, isLoading: isSearchLoading, isFetching, isError, reset: resetSearch }] =
    useLazySearchpartwithutsendingskanalQuery();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const closedByPopoverRef = useRef(false);

  const isSearching = isSearchLoading || isFetching;

  const handleOpen = useCallback(() => {
    setOpen(true);
    setMode(getInitialMode(part));
    setRawSearch('');
    setInputError(undefined);
    setInvalidReceiverMessage(null);
    setWarningReceiverMessage(null);
    resetSearch();
  }, [resetSearch, part]);

  const handleClose = useCallback(() => {
    setOpen(false);
    closedByPopoverRef.current = true;
    requestAnimationFrame(() => {
      closedByPopoverRef.current = false;
    });
    buttonRef.current?.focus();
  }, []);

  const applyResult = useCallback(
    (selectedPart: IdentifikatorPart) => {
      onChange(selectedPart);
      handleClose();
    },
    [onChange, handleClose],
  );

  const handleManualSave = useCallback(
    (fullmektig: IFullmektig) => {
      onChange(fullmektig);
      handleClose();
    },
    [onChange, handleClose],
  );

  const handleClear = useCallback(() => {
    onClear();
    handleClose();
  }, [onClear, handleClose]);

  const doSearch = useCallback(
    (rawValue: string) => {
      if (oppgave === undefined) {
        return;
      }

      const [identifikator, validationError] = cleanAndValidate(rawValue);

      if (validationError !== undefined) {
        return;
      }

      const invalidMatch = invalidReceivers.find((r) => r.id === identifikator);

      if (invalidMatch !== undefined) {
        setInvalidReceiverMessage(invalidMatch.message);

        return;
      }

      const warningMatch = warningReceivers.find((r) => r.id === identifikator);

      if (warningMatch !== undefined) {
        setWarningReceiverMessage(warningMatch.message);
      }

      const { ytelseId, sakenGjelder } = oppgave;

      search({ identifikator, sakenGjelderId: sakenGjelder.identifikator, ytelseId });
    },
    [oppgave, invalidReceivers, warningReceivers, search],
  );

  const handleSearchChange = useCallback(
    (newValue: string) => {
      setRawSearch(newValue);
      setInputError(undefined);
      setInvalidReceiverMessage(null);
      setWarningReceiverMessage(null);
      resetSearch();
      doSearch(newValue);
    },
    [resetSearch, doSearch],
  );

  const handleSearchSubmit = useCallback(() => {
    const [, validationError] = cleanAndValidate(rawSearch);

    if (validationError !== undefined) {
      setInputError(validationError);

      return;
    }

    doSearch(rawSearch);
  }, [rawSearch, doSearch]);

  const handlePopoverKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case Keys.Enter: {
          if (mode !== Mode.ID || !isMetaKey(e)) {
            return;
          }

          e.preventDefault();

          if (searchResult !== undefined && isPartSelectable(searchResult, false)) {
            applyResult(searchResult);
          } else {
            handleSearchSubmit();
          }
          break;
        }
        case Keys.Escape: {
          e.preventDefault();
          handleClose();
          break;
        }
      }
    },
    [mode, searchResult, applyResult, handleSearchSubmit, handleClose],
  );

  const handleButtonClick = useCallback(() => {
    if (closedByPopoverRef.current) {
      closedByPopoverRef.current = false;

      return;
    }

    if (open) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [open, handleClose, handleOpen]);

  const onButtonKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === Keys.ArrowDown || e.key === Keys.ArrowUp) {
        e.preventDefault();
        handleOpen();
      }
    },
    [handleOpen],
  );

  useEffect(() => {
    if (open && mode === Mode.ID) {
      requestAnimationFrame(() => {
        searchRef.current?.focus();
      });
    }
  }, [open, mode]);

  const handleModeChange = useCallback(
    (value: string) => {
      if (isMode(value)) {
        setMode(value);
        setRawSearch('');
        setInputError(undefined);
        setInvalidReceiverMessage(null);
        setWarningReceiverMessage(null);
        resetSearch();
      }
    },
    [resetSearch],
  );

  const popoverId = useId();
  const hasValue = part !== null;

  return (
    <>
      <TriggerButton
        ref={buttonRef}
        label={label}
        size={size}
        disabled={disabled}
        open={open}
        externalLoading={externalLoading}
        popoverId={popoverId}
        onClick={handleButtonClick}
        onKeyDown={onButtonKeyDown}
      />

      <Popover
        id={popoverId}
        open={open}
        onClose={handleClose}
        anchorEl={buttonRef.current}
        placement="bottom-end"
        offset={0}
        tabIndex={-1}
        onKeyDown={handlePopoverKeyDown}
      >
        <Popover.Content className="flex min-w-80 flex-col gap-2">
          <ToggleGroup size="small" onChange={handleModeChange} value={mode}>
            <ToggleGroup.Item value={Mode.ID}>ID-nummer</ToggleGroup.Item>
            <ToggleGroup.Item value={Mode.MANUAL}>Navn og adresse</ToggleGroup.Item>
          </ToggleGroup>

          {mode === Mode.ID ? (
            <>
              <TextField
                ref={searchRef}
                size="small"
                label={label}
                hideLabel
                placeholder="Søk med fødselsnummer eller org.nr..."
                value={rawSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                error={inputError}
                autoFocus
                autoComplete="off"
                inputMode="numeric"
              />

              <Messages
                warningReceiverMessage={warningReceiverMessage}
                invalidReceiverMessage={invalidReceiverMessage}
                isSearching={isSearching}
                isError={isError}
              />

              <SearchResult
                result={searchResult}
                isSearching={isSearching}
                isError={isError}
                invalidReceiverMessage={invalidReceiverMessage}
                allowUnreachable={false}
                onSelect={applyResult}
              />

              <Button
                size="small"
                data-color={searchResult !== undefined ? undefined : 'neutral'}
                variant={searchResult !== undefined ? 'primary' : 'secondary'}
                onClick={searchResult === undefined ? undefined : () => applyResult(searchResult)}
                disabled={searchResult === undefined}
                className="w-full"
                icon={<CheckmarkIcon aria-hidden />}
              >
                Endre fullmektig
              </Button>
            </>
          ) : (
            <ManualEntry part={part} onSave={handleManualSave} onCancel={handleClose} isLoading={externalLoading} />
          )}

          <Button
            data-color="neutral"
            size="small"
            variant="tertiary"
            onClick={handleClear}
            className="w-full"
            icon={<TrashIcon aria-hidden />}
            loading={isClearLoading}
            disabled={!hasValue}
          >
            Fjern fullmektig
          </Button>

          <KeyboardHelp submitLabel="Endre fullmektig" />
        </Popover.Content>
      </Popover>
    </>
  );
};
