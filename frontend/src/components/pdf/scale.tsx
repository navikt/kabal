import { clamp } from '@app/functions/clamp';
import { snapDown, snapUp } from '@app/functions/snap';
import { ZoomMinusIcon, ZoomPlusIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { type Dispatch, type KeyboardEvent, type SetStateAction, useCallback, useEffect, useState } from 'react';

interface Props {
  scale: number;
  setScale: Dispatch<SetStateAction<number>>;
}

const MIN_SCALE = 50;
const MAX_SCALE = 500;
const SCALE_STEP = 25;

export const ScaleInput = ({ scale, setScale }: Props) => {
  const [input, setInput] = useState('');

  useEffect(() => setInput(scale.toString(10)), [scale]);

  const submit = () => {
    const parsed = Number.parseInt(input, 10);

    if (Number.isNaN(parsed)) {
      return;
    }

    setScale(clamp(parsed, MIN_SCALE, MAX_SCALE));
  };

  const handleZoomIn = useCallback(
    () =>
      setScale((prev) => {
        const snapped = snapUp(prev, SCALE_STEP, MAX_SCALE);
        setInput(snapped.toString(10));
        return snapped;
      }),
    [setScale],
  );

  const handleZoomOut = useCallback(
    () =>
      setScale((prev) => {
        const snapped = snapDown(prev, SCALE_STEP, MIN_SCALE);
        setInput(snapped.toString(10));
        return snapped;
      }),
    [setScale],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        event.stopPropagation();
        submit();
        break;
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        setInput(scale.toString(10));
        break;
      case 'ArrowUp': {
        event.preventDefault();
        event.stopPropagation();
        if (event.ctrlKey || event.metaKey) {
          handleZoomIn();
          break;
        }

        const newValue = clamp(scale + 1, MIN_SCALE, MAX_SCALE);
        setInput(newValue.toString(10));
        setScale(newValue);
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        event.stopPropagation();
        if (event.ctrlKey || event.metaKey) {
          handleZoomOut();
          break;
        }
        const newValue = clamp(scale - 1, MIN_SCALE, MAX_SCALE);
        setInput(newValue.toString(10));
        setScale(newValue);
        break;
      }
    }
  };

  return (
    <HStack gap="space-4" wrap={false}>
      <Button
        size="xsmall"
        variant="tertiary"
        onClick={handleZoomOut}
        data-color="neutral"
        icon={<ZoomMinusIcon aria-hidden />}
      />

      <label className="whitespace-nowrap rounded border border-ax-border-neutral px-2 outline-ax-border-focus focus-within:outline-2">
        <input
          type="text"
          className="w-6 text-right text-sm focus:outline-none"
          value={input}
          onChange={({ target }) => setInput(target.value)}
          onBlur={submit}
          onKeyDown={onKeyDown}
        />
        <span className="ml-2">%</span>
      </label>

      <Button
        size="xsmall"
        variant="tertiary"
        onClick={handleZoomIn}
        data-color="neutral"
        icon={<ZoomPlusIcon aria-hidden />}
      />
    </HStack>
  );
};
