import type { SettingSetter } from '@app/hooks/settings/helpers';
import { RotateLeftIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { useCallback } from 'react';

export type RotationDegrees = 0 | 90 | 180 | 270;

export type SetRotation = SettingSetter<RotationDegrees>;

interface Props {
  setRotation: SetRotation;
}

export const Rotation = ({ setRotation }: Props) => {
  const rotateLeft = useCallback(() => {
    setRotation((prev = 0) => ((prev - 90 + 360) % 360) as RotationDegrees);
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
