import { Tag } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { IOption } from '@app/components/filter-dropdown/props';
import { useKlageenheter, useSakstyperToUtfall } from '@app/simple-api-state/use-kodeverk';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';

const EMPTY_ARRAY: [] = [];

export const useUtfallOptions = (): IOption<UtfallEnum>[] => {
  const { data: sakstyperToUtfall = EMPTY_ARRAY } = useSakstyperToUtfall();

  return useMemo(() => {
    const utfallList: IOption<UtfallEnum>[] = [];

    for (const { utfall, navn, id } of sakstyperToUtfall) {
      for (const u of utfall) {
        const existing = utfallList.find(({ value }) => value === u.id);

        if (existing === undefined) {
          utfallList.push({
            value: u.id,
            label: u.navn,
            tags: [
              <Tag size="xsmall" variant={sakstypeToTagVariant(id)} key={id}>
                {navn}
              </Tag>,
            ],
          });
        } else {
          const tag = (
            <Tag size="xsmall" variant={sakstypeToTagVariant(id)} key={id}>
              {navn}
            </Tag>
          );

          if (existing.tags === undefined) {
            existing.tags = [tag];
          } else {
            existing.tags?.push(tag);
          }
        }
      }
    }

    return utfallList.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
  }, [sakstyperToUtfall]);
};

const sakstypeToTagVariant = (type: SaksTypeEnum) => {
  switch (type) {
    case SaksTypeEnum.KLAGE:
      return 'info';
    case SaksTypeEnum.ANKE:
      return 'warning';
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return 'error';
    default:
      return 'info';
  }
};

export const useKlageenheterOptions = (): IOption<string>[] => {
  const { data: values = EMPTY_ARRAY } = useKlageenheter();

  return useMemo(() => values.map(({ id, navn }) => ({ value: id, label: navn })), [values]);
};
