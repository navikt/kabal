import { Button, ButtonProps } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';

interface Props extends ButtonProps {
  seconds: number;
}

export const CountdownButton = ({ seconds, children, ...props }: Props) => {
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
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
  }, []);

  return (
    <Button {...props} disabled={isExpired}>
      {children} ({secondsLeft})
    </Button>
  );
};
