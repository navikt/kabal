import { InlineMessage, Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { useIsAnkeOrGbWithUtfallToTr } from '@/components/oppgavebehandling-footer/update-in-gosys/use-is-anke-or-gb-with-utfall-to-tr';
import { useValidationError } from '@/hooks/use-validation-error';
import { useSearchEnhetmappeQuery } from '@/redux-api/search';

interface Props {
  enhetId: string | null;
  selectedMappe: number | null;
  setSelectedMappe: (mappe: number | null) => void;
}

const getValue = (enhetId: string | null, selectedMappe: number | null) => {
  if (enhetId === null) {
    return NO_ENHET_ID;
  }

  return selectedMappe ?? NONE;
};

export const Enhetmappe = ({ enhetId, selectedMappe, setSelectedMappe }: Props) => {
  const { data = [], isLoading } = useSearchEnhetmappeQuery(enhetId ?? skipToken);
  const shouldSelectTr = useIsAnkeOrGbWithUtfallToTr();
  const validationError = useValidationError('gosysOppgaveUpdate');

  const options = useMemo(() => {
    if (isLoading) {
      return <option disabled>Laster...</option>;
    }

    if (enhetId === null) {
      return (
        <option disabled value={NO_ENHET_ID}>
          Velg enhet først
        </option>
      );
    }

    return (
      <>
        <option value={NONE}>Ingen</option>

        {data.map(({ id, navn }) => (
          <option key={id} value={id}>
            {navn}
          </option>
        ))}
      </>
    );
  }, [data, enhetId, isLoading]);

  return (
    <>
      {/* Can't be autoselected because there are rare exceptions where Sendt TR should not be selected */}
      {shouldSelectTr ? (
        <InlineMessage status="info" size="small">
          Velg enhetsmappen «Sendt Trygderetten».
        </InlineMessage>
      ) : null}

      <Select
        title={enhetId === null ? 'Velg enhet først' : undefined}
        label={`Velg enhetmappe${shouldSelectTr ? '' : ' (valgfri)'}`}
        size="small"
        value={getValue(enhetId, selectedMappe)}
        onChange={({ target }) => setSelectedMappe(target.value === NONE ? null : Number.parseInt(target.value, 10))}
        className="w-64"
        error={validationError}
      >
        {options}
      </Select>
    </>
  );
};

const NONE = 'NONE';
const NO_ENHET_ID = 'NO_ENHET_ID';
