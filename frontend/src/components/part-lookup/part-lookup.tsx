import { cleanAndValidate } from '@app/components/part/validate';
import { isPartSelectable } from '@app/components/part-lookup/is-part-selectable';
import { KeyboardHelp } from '@app/components/part-lookup/keyboard-help';
import { Messages } from '@app/components/part-lookup/messages';
import { SearchResult } from '@app/components/part-lookup/search-result';
import { TriggerButton } from '@app/components/part-lookup/trigger-button';
import type { InvalidReceiver } from '@app/components/part-lookup/types';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { isMetaKey, Keys } from '@app/keys';
import { useLazySearchpartwithutsendingskanalQuery } from '@app/redux-api/search';
import type { IdentifikatorPart } from '@app/types/oppgave-common';
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Popover, TextField } from '@navikt/ds-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

export type { InvalidReceiver } from '@app/components/part-lookup/types';

interface PartLookupProps {
  /** Used for aria-label on the trigger button and internal fields. Not rendered visually. */
  label: string;
  onChange: (part: IdentifikatorPart) => void;
  onClear?: () => void;
  /** Whether the current value is non-null, used to show the clear button. */
  hasValue?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
  /** If true, allows selecting parts that are dead/deleted. */
  allowUnreachable?: boolean;
  /** List of receiver IDs that are invalid and should show a warning instead of being selectable. */
  invalidReceivers?: InvalidReceiver[];
  /** List of receiver IDs that should show a warning but still be selectable. */
  warningReceivers?: InvalidReceiver[];
}

export const PartLookup = ({
  label,
  onChange,
  onClear,
  hasValue = false,
  isLoading: externalLoading = false,
  disabled = false,
  size = 'small',
  allowUnreachable = false,
  invalidReceivers = [],
  warningReceivers = [],
}: PartLookupProps) => {
  const { data: oppgave } = useOppgave();
  const [open, setOpen] = useState(false);
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
    setRawSearch('');
    setInputError(undefined);
    setInvalidReceiverMessage(null);
    setWarningReceiverMessage(null);
    resetSearch();
  }, [resetSearch]);

  const handleClose = useCallback(() => {
    setOpen(false);
    closedByPopoverRef.current = true;
    requestAnimationFrame(() => {
      closedByPopoverRef.current = false;
    });
    buttonRef.current?.focus();
  }, []);

  const applyResult = useCallback(
    (part: IdentifikatorPart) => {
      onChange(part);
      handleClose();
    },
    [onChange, handleClose],
  );

  const handleClear = useCallback(() => {
    onClear?.();
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case Keys.Enter: {
          if (!isMetaKey(e)) {
            return;
          }

          e.preventDefault();

          if (searchResult !== undefined && isPartSelectable(searchResult, allowUnreachable)) {
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
    [searchResult, allowUnreachable, applyResult, handleSearchSubmit, handleClose],
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
    if (open) {
      requestAnimationFrame(() => {
        searchRef.current?.focus();
      });
    }
  }, [open]);

  const popoverId = useId();

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
        onKeyDown={handleKeyDown}
      >
        <Popover.Content className="flex min-w-72 flex-col gap-2">
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
            allowUnreachable={allowUnreachable}
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
            Endre
          </Button>

          {onClear !== undefined && hasValue ? (
            <Button
              size="small"
              variant="tertiary-neutral"
              onClick={handleClear}
              className="w-full"
              icon={<XMarkIcon aria-hidden />}
            >
              Fjern
            </Button>
          ) : null}

          <KeyboardHelp submitLabel={label} />
        </Popover.Content>
      </Popover>
    </>
  );
};
