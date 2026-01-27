import { RotateLeftIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { type Dispatch, type SetStateAction, useCallback } from 'react';

export type RotationDegrees = 0 | 90 | 180 | 270;

interface Props {
  setRotation: Dispatch<SetStateAction<RotationDegrees>>;
}

export const Rotation = ({ setRotation }: Props) => {
  const rotateLeft = useCallback(() => {
    setRotation((prev) => ((prev - 90 + 360) % 360) as RotationDegrees);
  }, [setRotation]);

  return (
    <Tooltip content="Roter mot klokken / til venstre" describesChild>
      <Button
        size="xsmall"
        variant="tertiary"
        onClick={rotateLeft}
        data-color="neutral"
        icon={<RotateLeftIcon aria-hidden />}
      />
    </Tooltip>
  );
};
