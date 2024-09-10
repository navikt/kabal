import { MinusIcon, PlusIcon } from '@navikt/aksel-icons';
import { Button, Radio, RadioGroup, TextField } from '@navikt/ds-react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { MAX, MIN, STEP } from '@app/components/smart-editor/hooks/use-scale';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { ScaleContext } from '@app/plate/status-bar/scale-context';

export const Scaling = () => {
  const { scale, setScale, scaleUp, scaleDown } = useContext(ScaleContext);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <Container>
      <SliderContainer>
        <Button icon={<MinusIcon aria-hidden />} size="xsmall" variant="tertiary-neutral" onClick={scaleDown} />
        <Slider
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={scale}
          onChange={(e) => setScale(Number.parseInt(e.target.value, 10))}
        />
        <Button icon={<PlusIcon aria-hidden />} size="xsmall" variant="tertiary-neutral" onClick={scaleUp} />
      </SliderContainer>
      <ScaleSelectorContainer ref={ref}>
        <Button onClick={() => setIsOpen((o) => !o)} size="xsmall" variant="tertiary-neutral">
          {scale} %
        </Button>
        {isOpen ? <ScaleSelector close={() => setIsOpen(false)} /> : null}
      </ScaleSelectorContainer>
    </Container>
  );
};

const Slider = styled.input`
  width: 200px;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const ScaleSelectorContainer = styled.div`
  position: relative;
`;

const PRESETS: string[] = ['75', '90', '100', '125', '150', '200'];
const CUSTOM = 'CUSTOM';

interface ScaleSelectorProps {
  close: () => void;
}

const ScaleSelector = ({ close }: ScaleSelectorProps) => {
  const { scale, setScale, scaleUp, scaleDown } = useContext(ScaleContext);
  const [inputValue, setInputValue] = useState<string>(scale.toString());

  const handleChange = (val: unknown) => {
    if (typeof val === 'string') {
      setScale(Number.parseInt(val, 10));
    }
  };

  useEffect(() => {
    setInputValue(scale.toString(10));
  }, [scale]);

  const stringValue = scale.toString();
  const radioValue = PRESETS.includes(stringValue) ? stringValue : CUSTOM;

  const setStringValue = useCallback(
    (newStringValue: string) => {
      if (newStringValue.length === 0) {
        return;
      }

      const parsed = Number.parseInt(newStringValue, 10);

      if (Number.isNaN(parsed)) {
        return;
      }

      if (parsed < MIN) {
        return setScale(MIN);
      }

      return setScale(parsed);
    },
    [setScale],
  );

  return (
    <ScaleSelectorContent>
      <RadioGroup legend="Skalering" onChange={handleChange} value={radioValue} size="small">
        {PRESETS.map((p) => (
          <Radio key={p} value={p} size="small">
            {p} %
          </Radio>
        ))}
        <Radio value={CUSTOM}>Egendefinert</Radio>
      </RadioGroup>
      <Row>
        <TextField
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);

            const number = Number.parseInt(e.target.value, 10);

            if (!Number.isNaN(number) && number > 0) {
              setScale(number);
            }
          }}
          onBlur={() => setStringValue(inputValue)}
          onKeyDown={(e) => {
            switch (e.key) {
              case 'Enter':
              case 'Escape':
                close();
                break;
              case 'ArrowUp':
                e.preventDefault();
                scaleUp();
                break;
              case 'ArrowDown':
                e.preventDefault();
                scaleDown();
                break;
            }
          }}
          size="small"
          label="Skalering"
          hideLabel
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <span>%</span>
      </Row>
    </ScaleSelectorContent>
  );
};

const ScaleSelectorContent = styled.div`
  position: absolute;
  bottom: 100%;
  background-color: white;
  box-shadow: var(--a-shadow-medium);
  padding: 8px;
  border-radius: var(--a-border-radius-medium);
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
