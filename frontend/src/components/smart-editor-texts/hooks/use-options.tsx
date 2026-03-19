import { Tag } from '@navikt/ds-react';
import { useMemo } from 'react';
import type { IOption } from '@/components/filter-dropdown/props';
import { SAKSTYPE_TO_TAG_VARIANT } from '@/components/type/sakstype-to-tag-variant';
import { useKlageenheter, useSakstyperToUtfall } from '@/simple-api-state/use-kodeverk';
import type { UtfallEnum } from '@/types/kodeverk';

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
              <Tag size="xsmall" variant={SAKSTYPE_TO_TAG_VARIANT[id]} key={id} className="whitespace-nowrap">
                {navn}
              </Tag>,
            ],
          });
        } else {
          const tag = (
            <Tag size="xsmall" variant={SAKSTYPE_TO_TAG_VARIANT[id]} key={id} className="whitespace-nowrap">
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

    return utfallList.sort((a, b) => Number.parseInt(a.value, 10) - Number.parseInt(b.value, 10));
  }, [shortNames]);
};

export const useKlageenheterOptions = (): IOption<string>[] => {
  const { data: values = EMPTY_ARRAY } = useKlageenheter();

  return useMemo(() => values.map(({ id, navn }) => ({ value: id, label: navn })), [values]);
};
