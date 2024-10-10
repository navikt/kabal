import { Loader, Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { styled } from 'styled-components';
import { useSearchEnhetmappeQuery } from '@app/redux-api/search';

interface Props {
  enhetId: string | null;
  selectedMappe: number | null;
  setSelectedMappe: (mappe: number | null) => void;
}

export const Enhetmappe = ({ enhetId, selectedMappe, setSelectedMappe }: Props) => {
  const { data = [], isLoading } = useSearchEnhetmappeQuery(enhetId ?? skipToken);

  return (
    <Container>
      <Select
        disabled={isLoading || enhetId === null}
        title={enhetId === null ? 'Velg enhet først' : undefined}
        label="Velg enhetmappe (valgfri)"
        size="small"
        value={selectedMappe ?? NONE}
        onChange={({ target }) => setSelectedMappe(target.value === NONE ? null : Number.parseInt(target.value, 10))}
        style={{ width: 250 }}
      >
        {enhetId === null ? (
          <option value="" disabled>
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

      {isLoading ? <Loader title="Laster..." style={{ marginBottom: 4 }} /> : null}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: flex-end;
  gap: var(--a-spacing-2);
`;

const NONE = 'NONE';
