import { format } from 'date-fns';
import React from 'react';
import { styled } from 'styled-components';
import { ISO_DATETIME_FORMAT } from '@app/components/date-picker/constants';
import { Time } from '@app/components/time/time';

interface Props {
  from: Date;
  to: Date;
  value: Date;
  onChange: (value: Date) => void;
}

export const PinTime = ({ from, to, value, onChange }: Props) => {
  const minTime = from.getTime();
  const maxTime = to.getTime();
  const length = maxTime - minTime;
  const min = 0;
  const max = length;
  const step = length / 1_000;

  return (
    <Container>
      <Time date={to} />
      <input
        type="datetime-local"
        value={format(value, ISO_DATETIME_FORMAT)}
        onChange={(e) => onChange(new Date(Number.parseInt(e.target.value, 10)))}
      />
      <RangeInput
        type="range"
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(new Date(maxTime - Number.parseInt(e.target.value, 10)))}
        value={maxTime - value.getTime()}
      />
      <Time date={from} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const RangeInput = styled.input`
  flex-grow: 1;
`;
