import { Keys, MOD_KEY_TEXT } from '@app/keys';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, HStack, Tooltip } from '@navikt/ds-react';
import { useCallback, useEffect, useState } from 'react';

interface PageSelectorProps {
  currentPage: number;
  totalPages: number;
  onPageSelect: (page: number) => void;
}

export const PageSelector = ({ currentPage, totalPages, onPageSelect }: PageSelectorProps) => {
  const [inputValue, setInputValue] = useState(currentPage.toString());

  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const pageNumber = Number.parseInt(inputValue, 10);

    if (Number.isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
      setInputValue(currentPage.toString(10));
    } else {
      onPageSelect(pageNumber);
    }
  };

  const previousPage = useCallback(
    (page: number) => {
      const newValue = Math.max(1, page - 1);
      setInputValue(newValue.toString(10));
      onPageSelect(newValue);
    },
    [onPageSelect],
  );

  const nextPage = useCallback(
    (page: number) => {
      const newValue = Math.min(totalPages, page + 1);
      setInputValue(newValue.toString(10));
      onPageSelect(newValue);
    },
    [totalPages, onPageSelect],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case Keys.Enter: {
        e.currentTarget.blur();
        break;
      }
      case Keys.Escape: {
        setInputValue(currentPage.toString(10));
        e.currentTarget.blur();
        break;
      }
      case Keys.ArrowUp: {
        e.preventDefault();
        const parsed = Number.parseInt(inputValue, 10);
        if (Number.isNaN(parsed)) {
          return;
        }
        nextPage(parsed);
        break;
      }
      case Keys.ArrowDown: {
        e.preventDefault();
        const parsed = Number.parseInt(inputValue, 10);
        if (Number.isNaN(parsed)) {
          return;
        }
        previousPage(parsed);
        break;
      }
    }
  };

  const width = totalPages.toString(10).length * 8 + 16; // Approximate width based on number of digits

  return (
    <HStack gap="space-4" align="center" wrap={false}>
      <HStack align="center" wrap={false}>
        <Tooltip content="Forrige side" placement="top" keys={[MOD_KEY_TEXT, '↑']}>
          <Button
            variant="tertiary-neutral"
            size="xsmall"
            icon={<ChevronUpIcon aria-hidden />}
            onClick={() => previousPage(currentPage)}
          />
        </Tooltip>

        <Tooltip content="Neste side" placement="top" keys={[MOD_KEY_TEXT, '↓']}>
          <Button
            variant="tertiary-neutral"
            size="xsmall"
            icon={<ChevronDownIcon aria-hidden />}
            onClick={() => nextPage(currentPage)}
          />
        </Tooltip>
      </HStack>

      <span className="whitespace-nowrap text-ax-text-neutral text-sm">Side</span>

      <Tooltip content="Gå til side (Enter)" placement="top" keys={[Keys.Enter]} describesChild>
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="rounded border border-ax-border-neutral bg-ax-bg-default text-center text-ax-text-neutral text-sm"
          style={{ width: `${width}px` }}
        />
      </Tooltip>

      <span className="whitespace-nowrap text-ax-text-neutral text-sm">av {totalPages}</span>
    </HStack>
  );
};

export const SinglePage = () => <span className="whitespace-nowrap text-ax-text-neutral text-sm">Side 1 av 1</span>;
