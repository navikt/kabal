import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useAllLovkildeToRegistreringshjemmelForYtelse } from '@app/hooks/use-kodeverk-value';
import type { ILovKildeToRegistreringshjemmel } from '@app/types/kodeverk';
import { BoxNew, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';

interface Props {
  selected: string[];
}

export const SelectedHjemlerList = ({ selected }: Props) => {
  const { data: oppgave } = useOppgave();

  const hjemler = useAllLovkildeToRegistreringshjemmelForYtelse(oppgave?.ytelseId ?? skipToken);

  const list = useMemo<ILovKildeToRegistreringshjemmel[]>(
    () =>
      hjemler
        .map(({ lovkilde, registreringshjemler }) => ({
          lovkilde,
          registreringshjemler: registreringshjemler.filter((registreringshjemmel) =>
            selected.includes(registreringshjemmel.id),
          ),
        }))
        .filter(({ registreringshjemler }) => registreringshjemler.length > 0),
    [selected, hjemler],
  );

  if (typeof oppgave === 'undefined') {
    return <Loader size="xlarge" />;
  }

  return (
    <BoxNew paddingBlock="2" paddingInline="1 0" marginBlock="2 0" borderWidth="0 0 0 2" borderColor="neutral">
      <SelectedChildren registreringshjemmelIdList={list} />
    </BoxNew>
  );
};

const SelectedChildren = ({
  registreringshjemmelIdList,
}: {
  registreringshjemmelIdList: ILovKildeToRegistreringshjemmel[];
}) => {
  if (registreringshjemmelIdList.length === 0) {
    return <p className="m-0 text-ax-text-neutral-subtle">Ingen valgte hjemler</p>;
  }

  return (
    <section data-testid="selected-hjemler-list">
      {registreringshjemmelIdList.map(({ lovkilde, registreringshjemler }) => (
        <div className="not-first-of-type:pt-1" key={lovkilde.id}>
          <h3 className="font-bold text-base">{lovkilde.navn}</h3>

          <ul className="m-0 list-none pl-2">
            {registreringshjemler.map(({ navn, id }) => (
              <li className="not-last:mb-2" key={id}>
                {navn}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};
