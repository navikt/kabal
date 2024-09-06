/* eslint-disable max-lines */
import { BulletListIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Checkbox, Search, Tag } from '@navikt/ds-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { GLOBAL, LIST_DELIMITER } from '@app/components/smart-editor-texts/types';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { BaseProps, IOption } from './props';

export enum OptionType {
  GROUP = 'group',
  OPTION = 'option',
}

export interface NestedOption extends IOption<string> {
  type: OptionType;
  filterValue: string;
  options?: NestedOption[];
}

interface NestedDropdownProps extends BaseProps<string, NestedOption> {
  showFjernAlle?: boolean;
  'data-testid': string;
}

export const NestedFilterList = ({
  selected,
  options,
  onChange,
  showFjernAlle = true,
  'data-testid': testId,
}: NestedDropdownProps): JSX.Element | null => {
  const [filter, setFilter] = useState<RegExp>(/.*/);
  const [rawFilter, setRawFilter] = useState<string>('');

  useEffect(() => {
    const callback = requestIdleCallback(() => setFilter(stringToRegExp(rawFilter)));

    return () => cancelIdleCallback(callback);
  }, [rawFilter]);

  const reset = useCallback(() => onChange([]), [onChange]);
  const toggle = useCallback(
    (id: string) => onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]),
    [onChange, selected],
  );

  return (
    <Container data-testid={testId}>
      <StyledHeader>
        <Search
          value={rawFilter}
          onChange={setRawFilter}
          placeholder="Søk"
          label="Søk"
          hideLabel
          autoFocus
          size="small"
          variant="simple"
          data-testid="header-filter"
        />
        {showFjernAlle && (
          <StyledButton size="xsmall" variant="danger" onClick={reset} icon={<TrashIcon aria-hidden />}>
            Fjern alle
          </StyledButton>
        )}
      </StyledHeader>
      <OptionsList
        options={options}
        selected={selected}
        onCheck={toggle}
        filter={filter}
        hasFilter={rawFilter.length !== 0}
      />
    </Container>
  );
};

interface ListProps {
  options: NestedOption[];
  selected: string[];
  filter: RegExp;
  level?: number;
  onCheck: (id: string) => void;
  hasFilter: boolean;
}

const OptionsList = ({ options, level = 0, ...rest }: ListProps) => (
  <List $level={level}>
    {options.map((o) => (
      <ListItem key={o.value} {...rest} option={o} level={level} />
    ))}
  </List>
);

interface ListItemProps {
  option: NestedOption;
  selected: string[];
  filter: RegExp;
  level: number;
  onCheck: (id: string) => void;
  hasFilter: boolean;
}

const ListItem = ({ option, selected, level, filter, onCheck, hasFilter }: ListItemProps) => {
  const { value, label, options } = option;
  const hasOptionsOrGroups = options !== undefined && options.length !== 0;

  const isInFilter = useMemo(() => filter.test(option.filterValue), [filter, option.filterValue]);

  const filteredSubCount = useMemo(
    () => (hasOptionsOrGroups ? options.reduce((count, o) => (filter.test(o.filterValue) ? count + 1 : count), 0) : 0),
    [filter, hasOptionsOrGroups, options],
  );

  const { subSelectionCount, isSubInFilter } = useMemo<SubOptions>(
    () =>
      hasOptionsOrGroups ? getAllSubOptions(options, selected, filter) : { subSelectionCount: 0, isSubInFilter: false },
    [filter, hasOptionsOrGroups, options, selected],
  );

  const hasSubSelection = subSelectionCount !== 0;
  const [isManualExpanded, setIsManualExpaded] = useState<boolean | null>(null);
  const isExpanded = isManualExpanded ?? (hasSubSelection || (hasFilter && filteredSubCount <= 3));

  if (!isInFilter && !isSubInFilter) {
    return null;
  }

  return (
    <li key={value}>
      <CheckboxContainer>
        {isSubInFilter ? (
          <ExpandButton
            variant="tertiary-neutral"
            size="xsmall"
            onClick={() => setIsManualExpaded(!isExpanded)}
            icon={isExpanded ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
          />
        ) : null}
        <CheckboxOrGroup
          option={option}
          selected={selected}
          onCheck={(id) => {
            setIsManualExpaded(true);
            onCheck(id);
          }}
          subSelectionCount={subSelectionCount}
        >
          {label}
        </CheckboxOrGroup>
      </CheckboxContainer>

      {isSubInFilter && hasOptionsOrGroups && isExpanded ? (
        <OptionsList
          options={options}
          selected={selected}
          level={level + 1}
          onCheck={onCheck}
          filter={filter}
          hasFilter={hasFilter}
        />
      ) : null}
    </li>
  );
};

interface CheckboxOrGroupProps {
  option: NestedOption;
  selected: string[];
  subSelectionCount: number;
  children: string;
  onCheck: (id: string) => void;
}

const CheckboxOrGroup = ({ option, children, selected, onCheck, subSelectionCount }: CheckboxOrGroupProps) => {
  const { options, type, value } = option;
  const hasOptions = options !== undefined && options.length !== 0;

  const totalOptions = hasOptions
    ? options.reduce((count, o) => {
        if (o.type === OptionType.GROUP) {
          return count + (o.options?.length ?? 0);
        }

        return count + 1 + (o.options?.length ?? 0);
      }, 0)
    : 0;

  if (type === OptionType.GROUP) {
    return (
      <GroupLabel size="small">
        <BulletListIcon aria-hidden height={20} width={20} style={{ flexShrink: 0 }} />
        <OptionLabel options={options} subOptionSelectedCount={subSelectionCount} totalOptions={totalOptions}>
          {children}
        </OptionLabel>
      </GroupLabel>
    );
  }

  return (
    <StyledCheckbox
      value={value}
      size="small"
      checked={selected.includes(value)}
      indeterminate={option.indeterminate}
      onChange={() => onCheck(value)}
    >
      <CheckboxLabel>
        <OptionLabel options={options} subOptionSelectedCount={subSelectionCount} totalOptions={totalOptions}>
          {children}
        </OptionLabel>
      </CheckboxLabel>
    </StyledCheckbox>
  );
};

interface OptionLabelProps {
  children: string;
  subOptionSelectedCount: number;
  options: NestedOption[] | undefined;
  totalOptions: number;
}

const OptionLabel = ({ children, subOptionSelectedCount, options, totalOptions }: OptionLabelProps) => (
  <StyledOptionLabel title={children}>
    {children}
    {options !== undefined && options.length !== 0 ? (
      <Tag
        variant={getTagVariant(subOptionSelectedCount, totalOptions)}
        size="xsmall"
      >{`${subOptionSelectedCount}/${totalOptions}`}</Tag>
    ) : null}
  </StyledOptionLabel>
);

const getTagVariant = (
  subOptionSelectedCount: number,
  optionCount: number | undefined,
): 'neutral' | 'warning' | 'info' => {
  if (subOptionSelectedCount === 0) {
    return 'neutral';
  }

  if (subOptionSelectedCount === optionCount) {
    return 'info';
  }

  return 'warning';
};

interface SubOptions {
  isSubInFilter: boolean;
  subSelectionCount: number;
}

const getAllSubOptions = (options: NestedOption[], selected: string[], filter: RegExp): SubOptions => {
  let isSubInFilter = false;
  let subSelectionCount = 0;

  for (const subOpt of options) {
    if (!isSubInFilter && filter.test(subOpt.filterValue)) {
      isSubInFilter = true;
    }

    if (
      selected.includes(subOpt.value) ||
      selected.includes(`${GLOBAL}${LIST_DELIMITER}${subOpt.value.split(LIST_DELIMITER)[1]}`)
    ) {
      subSelectionCount++;
    }

    if (subOpt.options === undefined || subOpt.options.length === 0) {
      continue;
    }

    const res = getAllSubOptions(subOpt.options, selected, filter);
    subSelectionCount += res.subSelectionCount;
    isSubInFilter = isSubInFilter || res.isSubInFilter;
  }

  return { subSelectionCount, isSubInFilter };
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  z-index: 22;
  background-color: var(--a-bg-default);
  padding: var(--a-spacing-2);
  margin: 0;
  overflow-y: auto;
  box-shadow: var(--a-shadow-medium);
  max-height: 70vh;
  white-space: nowrap;
  width: 600px;
`;

const StyledButton = styled(Button)`
  margin-left: 0.5em;
  flex-shrink: 0;
`;

const StyledHeader = styled.div`
  position: sticky;
  top: 0;
  border-bottom: 1px solid var(--a-border-divider);
  background-color: var(--a-bg-default);
  padding: var(--a-spacing-2);
  display: flex;
  justify-content: space-between;
`;

const List = styled.ul<{ $level: number }>`
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
  overflow-x: hidden;
  text-overflow: ellipsis;
  flex: 1;
  padding-left: ${({ $level }) => ($level === 0 ? 0 : 26)}px;
`;

const CHECKBOX_SIZE = 32;

const CheckboxContainer = styled.div`
  display: grid;
  grid-template-columns: ${CHECKBOX_SIZE}px auto;
  grid-template-areas: 'expand checkbox';
  align-items: flex-start;
`;

const ExpandButton = styled(Button)`
  grid-area: expand;
  height: ${CHECKBOX_SIZE}px;
`;

const StyledCheckbox = styled(Checkbox)`
  grid-area: checkbox;
  column-gap: var(--a-spacing-2);
`;

const CheckboxLabel = styled.span`
  display: flex;
  align-items: center;
  column-gap: var(--a-spacing-2);
`;

const GroupLabel = styled(BodyShort)`
  display: flex;
  align-items: center;
  column-gap: var(--a-spacing-2);
  height: 100%;
  overflow: hidden;
`;

const StyledOptionLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;
