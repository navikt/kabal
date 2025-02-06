import { CheckmarkIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage, TextField } from '@navikt/ds-react';
import { type KeyboardEventHandler, useEffect, useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  short: string;
  setShort: (short: string) => void;
  long: string;
  setLong: (long: string) => void;
  onSave: () => void;
  onDelete?: () => void;
  isSaving: boolean;
  isDeleting?: boolean;
  isDuplicate: boolean;
  isSaved?: boolean;
  showLabels?: boolean;
  containsSpace: boolean;
  hasEmptyField: boolean;
}

export const Abbreviation = ({
  short,
  setShort,
  long,
  setLong,
  onSave,
  onDelete,
  isDuplicate,
  isSaving,
  isDeleting,
  isSaved = false,
  showLabels = false,
  containsSpace,
  hasEmptyField,
}: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const save = () => {
    if (hasEmptyField) {
      return setError('Begge feltene må fylles ut');
    }

    onSave();
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      save();
    }
  };

  useEffect(() => {
    if (!hasEmptyField) {
      setError(undefined);
    }

    setError(getErrorMessage(isDuplicate, containsSpace));
  }, [isDuplicate, containsSpace, hasEmptyField]);

  return (
    <div>
      <StyledAbbreviation>
        <TextField
          size="small"
          label="Kortform"
          hideLabel={!showLabels}
          value={short}
          onChange={({ target }) => setShort(target.value)}
          onKeyDown={onKeyDown}
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
        />

        <TextField
          size="small"
          label="Langform"
          hideLabel={!showLabels}
          value={long}
          onChange={({ target }) => setLong(target.value)}
          onKeyDown={onKeyDown}
          autoCorrect="off"
          autoComplete="off"
          spellCheck
        />

        {isSaved ? null : (
          <Button
            size="small"
            variant="primary"
            icon={<CheckmarkIcon aria-hidden />}
            onClick={save}
            loading={isSaving}
            title="Lagre forkortelse"
            disabled={isSaved || isDuplicate || containsSpace || isDeleting}
            className={showLabels ? 'mt-7' : undefined}
          />
        )}

        {onDelete === undefined ? null : (
          <Button
            size="small"
            variant="danger"
            icon={<TrashIcon aria-hidden />}
            onClick={onDelete}
            loading={isDeleting}
            disabled={(isDeleting ?? false) || isSaving}
            title="Slett forkortelse"
            className={showLabels ? 'mt-7' : undefined}
          />
        )}
      </StyledAbbreviation>

      {error === undefined ? null : (
        <ErrorMessage size="small" className="[grid-area:error]" spacing>
          {error}
        </ErrorMessage>
      )}
    </div>
  );
};

const StyledAbbreviation = styled.div`
  display: grid;
  gap: var(--a-spacing-2);
  grid-template-columns: 250px 500px min-content min-content;
  align-items: start;
`;

const getErrorMessage = (isDuplicate: boolean, containsSpace: boolean) => {
  if (isDuplicate) {
    return 'Forkortelsen finnes allerede';
  }

  if (containsSpace) {
    return 'Kortformen kan ikke inneholde mellomrom';
  }

  return undefined;
};
