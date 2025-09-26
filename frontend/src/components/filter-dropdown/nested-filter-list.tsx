import { GLOBAL, LIST_DELIMITER } from '@app/components/smart-editor-texts/types';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { BulletListIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, BoxNew, Button, Checkbox, HGrid, HStack, Search, Tag, VStack } from '@navikt/ds-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
      <BoxNew padding="2" background="default" shadow="dialog">
        <HStack asChild justify="space-between" padding="2" top="0" position="sticky" wrap={false}>
          <BoxNew background="default" borderWidth="0 0 1 0" borderColor="neutral">
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
              <Button
                size="xsmall"
                variant="danger"
                onClick={reset}
                icon={<TrashIcon aria-hidden />}
                className="ml-2 shrink-0"
              >
                Fjern alle
              </Button>
            )}
          </BoxNew>
        </HStack>

        <OptionsList
          options={options}
          selected={selected}
          onCheck={toggle}
          filter={filter}
          hasFilter={rawFilter.length > 0}
        />
      </BoxNew>
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
  <VStack as="ul" overflowY="auto" paddingInline={level === 0 ? '0 0' : '6 0'}>
    {options.map((o) => (
      <ListItem key={o.value} {...rest} option={o} level={level} />
    ))}
  </VStack>
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
      <HGrid columns="32px auto" align="start" style={{ gridTemplateAreas: '"expand checkbox"' }}>
        {isSubInFilter ? (
          <Button
            variant="tertiary-neutral"
            size="xsmall"
            onClick={() => setIsExpaded(!isExpanded)}
            icon={isExpanded ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
            className="h-8 [grid-area:expand]"
          />
        ) : null}
        <CheckboxOrGroup option={option} selected={selected} onCheck={onCheck} subSelectionCount={subSelectionCount}>
          <span>{label}</span>
          {tags}
        </CheckboxOrGroup>
      </HGrid>

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
      <HStack as={BodyShort} align="center" gap="2" height="100%" overflow="hidden" size="small">
        <BulletListIcon aria-hidden height={20} width={20} style={{ flexShrink: 0 }} />
        <OptionLabel options={options} subOptionSelectedCount={subSelectionCount} totalOptions={totalOptions}>
          {children}
        </OptionLabel>
      </HStack>
    );
  }

  const isChecked = selected.includes(value);

  return (
    <Checkbox
      value={value}
      size="small"
      checked={isChecked}
      indeterminate={!isChecked && option.indeterminate}
      onChange={() => onCheck(value)}
      className="[grid-area:checkbox]"
    >
      <HStack align="center" gap="0 2">
        <OptionLabel options={options} subOptionSelectedCount={subSelectionCount} totalOptions={totalOptions}>
          {children}
        </OptionLabel>
      </HStack>
    </Checkbox>
  );
};

interface OptionLabelProps {
  children: React.ReactNode;
  subOptionSelectedCount: number;
  options: NestedOption[] | undefined;
  totalOptions: number;
}

const OptionLabel = ({ children, subOptionSelectedCount, options, totalOptions }: OptionLabelProps) => (
  <HStack as="span" align="center" gap="1" overflow="hidden" className="truncate">
    {children}
    {options !== undefined && options.length > 0 ? (
      <Tag
        variant={getTagVariant(subOptionSelectedCount, totalOptions)}
        size="xsmall"
      >{`${subOptionSelectedCount}/${totalOptions}`}</Tag>
    ) : null}
  </HStack>
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
