import { Search, ToggleGroup, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { SaksTypeEnum } from '@app/types/kodeverk';

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
  <FilterContainer>
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

    <SearchContainer>
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
    </SearchContainer>

    <SearchContainer>
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
    </SearchContainer>
  </FilterContainer>
);

const FilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 16px;
  width: 100%;
  padding-right: 3px;
  padding-bottom: 16px;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const SearchContainer = styled.div`
  flex-grow: 1;
`;
