import { SaksTypeEnum } from '@app/types/kodeverk';
import { BoxNew, HStack, Search, ToggleGroup, Tooltip } from '@navikt/ds-react';

export enum ActiveEnum {
  ALL = '0',
  ACTIVE = '1',
  INACTIVE = '2',
}

const ACTIVE_VALUES = Object.values(ActiveEnum);

export const isActiveValue = (value: string | null): value is ActiveEnum => ACTIVE_VALUES.some((v) => v === value);

export const ALL_TYPES = 'ALL';

export type TypeFilter = SaksTypeEnum.KLAGE | SaksTypeEnum.ANKE | typeof ALL_TYPES;

export const isTypeFilter = (value: string | null): value is TypeFilter =>
  value === ALL_TYPES || value === SaksTypeEnum.KLAGE || value === SaksTypeEnum.ANKE;

export interface FilterProps {
  ytelseFilter: string;
  setYtelseFilter: (filter: string) => void;
  textFilter: string;
  setTextFilter: (filter: string) => void;
  typeFilter: TypeFilter;
  setTypeFilter: (type: TypeFilter) => void;
  activeFilter: ActiveEnum;
  setActiveFilter: (active: ActiveEnum) => void;
}

export const Filters = ({
  ytelseFilter,
  setYtelseFilter,
  textFilter,
  setTextFilter,
  typeFilter,
  setTypeFilter,
  activeFilter,
  setActiveFilter,
}: FilterProps) => (
  <HStack asChild wrap={false} gap="4" width="100%" position="sticky" top="0" className="-top-4 z-1">
    <BoxNew background="default" paddingInline="0 1" paddingBlock="4">
      <ToggleGroup
        size="small"
        value={activeFilter}
        onChange={(a) => setActiveFilter(isActiveValue(a) ? a : activeFilter)}
      >
        <ToggleGroup.Item value={ActiveEnum.ALL}>Alle</ToggleGroup.Item>
        <ToggleGroup.Item value={ActiveEnum.ACTIVE}>Aktive</ToggleGroup.Item>
        <ToggleGroup.Item value={ActiveEnum.INACTIVE}>Inaktive</ToggleGroup.Item>
      </ToggleGroup>

      <ToggleGroup size="small" value={typeFilter} onChange={(t) => setTypeFilter(isTypeFilter(t) ? t : typeFilter)}>
        <ToggleGroup.Item value={ALL_TYPES}>Alle</ToggleGroup.Item>
        <ToggleGroup.Item value={SaksTypeEnum.KLAGE}>Klage</ToggleGroup.Item>
        <ToggleGroup.Item value={SaksTypeEnum.ANKE}>Anke</ToggleGroup.Item>
      </ToggleGroup>

      <div className="grow">
        <Tooltip content="Filtrer på ytelse.">
          <Search
            placeholder="Filtrer på ytelse"
            label="Filtrer på ytelse"
            size="small"
            hideLabel
            onChange={setYtelseFilter}
            value={ytelseFilter}
            variant="simple"
          />
        </Tooltip>
      </div>

      <div className="grow">
        <Tooltip content="Filtrer på tekst.">
          <Search
            placeholder="Filtrer på tekst"
            label="Filtrer på tekst"
            size="small"
            hideLabel
            onChange={setTextFilter}
            value={textFilter}
            variant="simple"
          />
        </Tooltip>
      </div>
    </BoxNew>
  </HStack>
);
