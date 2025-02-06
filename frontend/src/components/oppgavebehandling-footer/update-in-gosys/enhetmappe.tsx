import { useSearchEnhetmappeQuery } from '@app/redux-api/search';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Alert, HStack, Loader, Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';

interface Props {
  enhetId: string | null;
  selectedMappe: number | null;
  setSelectedMappe: (mappe: number | null) => void;
  oppgavebehandling: IOppgavebehandling;
}

const getValue = (enhetId: string | null, selectedMappe: number | null) => {
  if (enhetId === null) {
    return NO_ENHET_ID;
  }

  return selectedMappe ?? NONE;
};

export const Enhetmappe = ({ enhetId, selectedMappe, setSelectedMappe, oppgavebehandling }: Props) => {
  const { data = [], isLoading } = useSearchEnhetmappeQuery(enhetId ?? skipToken);

  const { typeId } = oppgavebehandling;
  const { utfallId } = oppgavebehandling.resultat;

  const showEnhetmappeInfo = useMemo(() => {
    if (typeId !== SaksTypeEnum.ANKE) {
      return false;
    }

    return (
      utfallId === UtfallEnum.DELVIS_MEDHOLD ||
      utfallId === UtfallEnum.INNSTILLING_STADFESTELSE ||
      utfallId === UtfallEnum.INNSTILLING_AVVIST
    );
  }, [typeId, utfallId]);

  return (
    <HStack align="end" gap="2">
      {showEnhetmappeInfo ? (
        <Alert variant="info" size="small">
          Velg enhetsmappen «Sendt til Trygderetten».
        </Alert>
      ) : null}

      <Select
        title={enhetId === null ? 'Velg enhet først' : undefined}
        label="Velg enhetmappe (valgfri)"
        size="small"
        value={getValue(enhetId, selectedMappe)}
        onChange={({ target }) => setSelectedMappe(target.value === NONE ? null : Number.parseInt(target.value, 10))}
        className="w-64"
      >
        {enhetId === null ? (
          <option disabled value={NO_ENHET_ID}>
            Velg enhet først
          </option>
        ) : (
          <>
            <option value={NONE}>Ingen</option>

            {data.map(({ id, navn }) => (
              <option key={id} value={id}>
                {navn}
              </option>
            ))}
          </>
        )}
      </Select>

      {isLoading ? <Loader title="Laster..." className="mb-1" /> : null}
    </HStack>
  );
};

const NONE = 'NONE';
const NO_ENHET_ID = 'NO_ENHET_ID';
