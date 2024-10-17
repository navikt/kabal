import type { IOption } from '@app/components/filter-dropdown/props';
import { useKlageenheter, useSakstyperToUtfall } from '@app/simple-api-state/use-kodeverk';
import { SaksTypeEnum, type UtfallEnum } from '@app/types/kodeverk';
import { Tag, type TagProps } from '@navikt/ds-react';
import { useMemo } from 'react';
import { styled } from 'styled-components';

const EMPTY_ARRAY: [] = [];

export const useUtfallOptions = (): IOption<UtfallEnum>[] => {
  const { data: sakstyperToUtfall = EMPTY_ARRAY } = useSakstyperToUtfall();
  const shortNames = useMemo(
    () =>
      sakstyperToUtfall.map(({ navn, ...rest }) => ({
        ...rest,
        navn: navn.replace('Trygderetten', 'TR'),
      })),
    [sakstyperToUtfall],
  );

  return useMemo(() => {
    const utfallList: IOption<UtfallEnum>[] = [];

    for (const { utfall, navn, id } of shortNames) {
      for (const u of utfall) {
        const existing = utfallList.find(({ value }) => value === u.id);

        if (existing === undefined) {
          utfallList.push({
            value: u.id,
            label: u.navn,
            tags: [
              <StyledTag size="xsmall" variant={sakstypeToTagVariant(id)} key={id}>
                {navn}
              </StyledTag>,
            ],
          });
        } else {
          const tag = (
            <StyledTag size="xsmall" variant={sakstypeToTagVariant(id)} key={id}>
              {navn}
            </StyledTag>
          );

          if (existing.tags === undefined) {
            existing.tags = [tag];
          } else {
            existing.tags?.push(tag);
          }
        }
      }
    }

    return utfallList.sort((a, b) => Number.parseInt(a.value, 10) - Number.parseInt(b.value, 10));
  }, [shortNames]);
};

const sakstypeToTagVariant = (type: SaksTypeEnum): TagProps['variant'] => {
  switch (type) {
    case SaksTypeEnum.KLAGE:
      return 'info';
    case SaksTypeEnum.ANKE:
      return 'warning';
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return 'error';
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
      return 'alt1';
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return 'alt2';
    default:
      return 'info';
  }
};

export const useKlageenheterOptions = (): IOption<string>[] => {
  const { data: values = EMPTY_ARRAY } = useKlageenheter();

  return useMemo(() => values.map(({ id, navn }) => ({ value: id, label: navn })), [values]);
};

const StyledTag = styled(Tag)`
  white-space: nowrap;
`;
