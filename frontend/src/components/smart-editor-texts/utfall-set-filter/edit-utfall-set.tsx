import { useSakstyperToUtfall } from '@app/simple-api-state/use-kodeverk';
import { type IKodeverkSimpleValue, type ISakstyperToUtfall, UtfallEnum } from '@app/types/kodeverk';
import { PlusIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, CheckboxGroup, Tag } from '@navikt/ds-react';
import { useCallback, useMemo, useState } from 'react';
import { styled } from 'styled-components';

interface EditUtfallSetProps {
  utfallSet: UtfallEnum[];
  onChange: (utfall: UtfallEnum[]) => void;
  onCancel: () => void;
  title: string;
  icon: React.ReactNode;
}

export const EditUtfallSet = ({ utfallSet, onChange, onCancel, title, icon }: EditUtfallSetProps) => {
  const [newUtfallSet, setNewUtfallSet] = useState(utfallSet);
  const sakstyperToUtfall = useUtfall();
  const allUtfall = useMemo(() => {
    if (sakstyperToUtfall === undefined) {
      return [];
    }

    const _allUtfall: IKodeverkSimpleValue<UtfallEnum>[] = [];

    for (const sakstype of sakstyperToUtfall) {
      for (const utfall of sakstype.utfall) {
        const exists = _allUtfall.some((u) => u.id === utfall.id);

        if (!exists) {
          _allUtfall.push(utfall);
        }
      }
    }

    return _allUtfall;
  }, [sakstyperToUtfall]);

  const onDoneClick = useCallback(() => {
    onChange(newUtfallSet.sort());
    onCancel();
  }, [newUtfallSet, onChange, onCancel]);

  if (sakstyperToUtfall === undefined) {
    return null;
  }

  const availableUtfall = getAvailableUtfall(newUtfallSet, sakstyperToUtfall);

  const disabledText =
    newUtfallSet.length === 1
      ? 'Dette utfallet tilhører en annen sakstype enn valgt utfall'
      : 'Dette utfallet tilhører en annen sakstype enn valgte utfall';

  const addDisabled = newUtfallSet.length === 0;

  return (
    <Container>
      <CheckboxGroup
        legend={
          <Legend>
            {icon}
            {title}
          </Legend>
        }
        value={newUtfallSet}
        onChange={setNewUtfallSet}
        size="small"
      >
        {allUtfall.map((u) => {
          const disabled = !availableUtfall.includes(u.id);

          return (
            <Checkbox value={u.id} key={u.id} disabled={disabled} title={disabled ? disabledText : undefined}>
              {u.navn}{' '}
              {disabled ? (
                <Tag variant="warning" size="xsmall">
                  Ugyldig kombinasjon
                </Tag>
              ) : null}
            </Checkbox>
          );
        })}
      </CheckboxGroup>
      <ButtonContainer>
        <Button
          size="small"
          variant="primary"
          onClick={onDoneClick}
          icon={<PlusIcon aria-hidden />}
          disabled={addDisabled}
          title={addDisabled ? 'Kan ikke legge til tomt utfallsett' : undefined}
        >
          Legg til
        </Button>
        <Button size="small" variant="secondary" onClick={onCancel} icon={<XMarkIcon aria-hidden />}>
          Avbryt
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const useUtfall = () => {
  const { data: sakstyperToUtfall } = useSakstyperToUtfall();

  return useMemo(
    () =>
      sakstyperToUtfall?.map((s) => ({
        ...s,
        utfall: s.utfall.filter((u) => u.id !== UtfallEnum.HEVET && u.id !== UtfallEnum.HENVIST),
      })),
    [sakstyperToUtfall],
  );
};

const getAvailableUtfall = (selected: UtfallEnum[], sakstyperToUtfall: ISakstyperToUtfall[]): UtfallEnum[] => {
  const sakstyper = sakstyperToUtfall.filter((s) => selected.every((u) => s.utfall.some((su) => su.id === u)));

  return sakstyper.flatMap((s) => s.utfall.map((u) => u.id));
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-2);
`;

const Legend = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: var(--a-spacing-2);
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: var(--a-spacing-2);
`;
