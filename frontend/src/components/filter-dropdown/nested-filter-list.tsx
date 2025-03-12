import { GLOBAL, LIST_DELIMITER } from '@app/components/smart-editor-texts/types';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { BulletListIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Checkbox, HStack, Search, Tag, VStack } from '@navikt/ds-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import type { BaseProps, IOption } from './props';

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

const WILDCARD_REGEX = /.*/;

export const NestedFilterList = ({
  selected,
  options,
  onChange,
  showFjernAlle = true,
  'data-testid': testId,
}: NestedDropdownProps): React.JSX.Element | null => {
  const [filter, setFilter] = useState<RegExp>(WILDCARD_REGEX);
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
    <VStack
      asChild
      width="600px"
      maxHeight="70vh"
      overflowY="auto"
      position="absolute"
      style={{ top: '100%', whiteSpace: 'nowrap', zIndex: 22 }}
      data-testid={testId}
      data-asdasdasf
    >
      <Box padding="2" background="bg-default" shadow="medium">
        <HStack asChild justify="space-between" padding="2" top="0" position="sticky" wrap={false}>
          <Box background="bg-default" borderWidth="0 0 1 0" borderColor="border-divider">
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
          </Box>
        </HStack>
        <OptionsList
          options={options}
          selected={selected}
          onCheck={toggle}
          filter={filter}
          hasFilter={rawFilter.length > 0}
        />
      </Box>
    </VStack>
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
  const { value, label, options, tags } = option;
  const hasOptionsOrGroups = options !== undefined && options.length > 0;

  const isInFilter = useMemo(() => filter.test(option.filterValue), [filter, option.filterValue]);

  const { subSelectionCount, isSubInFilter } = useMemo<SubOptions>(
    () =>
      hasOptionsOrGroups ? getAllSubOptions(options, selected, filter) : { subSelectionCount: 0, isSubInFilter: false },
    [filter, hasOptionsOrGroups, options, selected],
  );

  const [isExpanded, setIsExpaded] = useState<boolean | null>(null);

  if (!(isInFilter || isSubInFilter)) {
    return null;
  }

  return (
    <li key={value}>
      <CheckboxContainer>
        {isSubInFilter ? (
          <ExpandButton
            variant="tertiary-neutral"
            size="xsmall"
            onClick={() => setIsExpaded(!isExpanded)}
            icon={isExpanded ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
          />
        ) : null}
        <CheckboxOrGroup
          option={option}
          selected={selected}
          onCheck={(id) => {
            setIsExpaded(true);
            onCheck(id);
          }}
          subSelectionCount={subSelectionCount}
        >
          <span>{label}</span>
          {tags}
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
  children: React.ReactNode;
  onCheck: (id: string) => void;
}

const CheckboxOrGroup = ({ option, children, selected, onCheck, subSelectionCount }: CheckboxOrGroupProps) => {
  const { options, type, value } = option;
  const hasOptions = options !== undefined && options.length > 0;

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

  const isChecked = selected.includes(value);

  return (
    <StyledCheckbox
      value={value}
      size="small"
      checked={isChecked}
      indeterminate={!isChecked && option.indeterminate}
      onChange={() => onCheck(value)}
    >
      <HStack align="center" gap="0 2">
        <OptionLabel options={options} subOptionSelectedCount={subSelectionCount} totalOptions={totalOptions}>
          {children}
        </OptionLabel>
      </HStack>
    </StyledCheckbox>
  );
};

interface OptionLabelProps {
  children: React.ReactNode;
  subOptionSelectedCount: number;
  options: NestedOption[] | undefined;
  totalOptions: number;
}

const OptionLabel = ({ children, subOptionSelectedCount, options, totalOptions }: OptionLabelProps) => (
  <StyledOptionLabel>
    {children}
    {options !== undefined && options.length > 0 ? (
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

const StyledButton = styled(Button)`
  margin-left: 0.5em;
  flex-shrink: 0;
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

const GroupLabel = styled(BodyShort)`
  display: flex;
  align-items: center;
  column-gap: var(--a-spacing-2);
  height: 100%;
  overflow: hidden;
`;

const StyledOptionLabel = styled.span`
  display: flex;
  align-items: center;
  column-gap: var(--a-spacing-1);
  overflow: hidden;
  text-overflow: ellipsis;
`;
