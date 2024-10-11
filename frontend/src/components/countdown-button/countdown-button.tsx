import { Button, type ButtonProps } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

interface Props extends ButtonProps {
  seconds: number;
}

export const CountdownButton = ({ seconds, children, ...props }: Props) => {
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const [isExpired, setIsExpired] = useState(seconds <= 0);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((value) => {
        if (value === 1) {
          clearInterval(interval);
          setIsExpired(true);
        }

        return value - 1;
      });
    }, 1_000);

    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <Button {...props} disabled={isExpired}>
      {children} ({secondsLeft})
    </Button>
  );
};
