import { GroupedFilterList, type OptionGroup } from '@app/components/filter-dropdown/grouped-filter-list';
import { InputError } from '@app/components/input-error/input-error';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useLovkildeToRegistreringshjemmelForYtelse } from '@app/hooks/use-kodeverk-value';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo, useRef, useState } from 'react';

type Direction = 'down' | 'right';

interface LovhjemmelSelectProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
  error?: string;
  showFjernAlle?: boolean;
  show: boolean;
  children: string;
  openDirection?: Direction;
}

export const LovhjemmelSelect = ({
  onChange,
  selected,
  disabled,
  error,
  showFjernAlle,
  show,
  children,
  openDirection = 'right',
}: LovhjemmelSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: oppgave } = useOppgave();
  const lovKildeToRegistreringshjemler = useLovkildeToRegistreringshjemmelForYtelse(oppgave?.ytelseId ?? skipToken);

  const options: OptionGroup<string>[] = useMemo(
    () =>
      lovKildeToRegistreringshjemler.map(({ lovkilde, registreringshjemler }) => ({
        sectionHeader: {
          id: lovkilde.id,
          name: lovkilde.navn,
        },
        sectionOptions: registreringshjemler.map(({ id, navn }) => ({
          value: id,
          label: navn,
        })),
      })),
    [lovKildeToRegistreringshjemler],
  );

  useOnClickOutside(ref, () => setOpen(false), true);

  if (!show) {
    return null;
  }

  const toggleOpen = () => setOpen(!open);
  const close = () => setOpen(false);

  return (
    <>
      <div className="relative" ref={ref} data-testid="lovhjemmel-select" data-selected={selected.join(',')}>
        <Button
          size="small"
          variant="secondary"
          onClick={toggleOpen}
          disabled={disabled}
          data-testid="lovhjemmel-button"
          icon={<MagnifyingGlassIcon aria-hidden />}
          className="w-full"
        >
          {children}
        </Button>

        {open ? (
          <GroupedFilterList
            selected={selected}
            options={options}
            onChange={onChange}
            close={close}
            showFjernAlle={showFjernAlle}
            testType="lovhjemmel"
            openDirection={openDirection}
          />
        ) : null}
      </div>
      <InputError error={error} />
    </>
  );
};
