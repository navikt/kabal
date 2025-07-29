import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { ToolbarButtonWithConfirm } from '@app/plate/components/common/toolbar-button-with-confirm';
import { useMyPlateEditorRef } from '@app/plate/types';
import { CheckmarkIcon, TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, HStack, Tooltip } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import type { Path } from 'slate';

const DummyButton = ({ loading }: { loading?: boolean }) => (
  <Button
    icon={<TrashIcon aria-hidden />}
    variant="tertiary"
    size="xsmall"
    contentEditable={false}
    disabled
    loading={loading}
  />
);

interface Props {
  isLoading: boolean;
  isChanged: boolean;
  path: Path | undefined;
  errorTooltip: string;
  defaultTooltip: string;
  isChangedWarning: string;
  side?: Side;
}

export const DeleteSection = ({
  isChanged,
  isLoading,
  path,
  errorTooltip,
  defaultTooltip,
  isChangedWarning,
  side,
}: Props) => {
  const editor = useMyPlateEditorRef();

  if (path === undefined) {
    return (
      <Tooltip content={errorTooltip} delay={0}>
        <DummyButton />
      </Tooltip>
    );
  }

  if (isLoading) {
    return <DummyButton loading />;
  }

  const onDelete = () => editor.tf.removeNodes({ at: path });

  if (isChanged) {
    return <IsChanged onConfirm={onDelete} isChangedWarning={isChangedWarning} side={side} />;
  }

  return (
    <ToolbarButtonWithConfirm
      onClick={onDelete}
      tooltip={defaultTooltip}
      icon={<TrashIcon aria-hidden />}
      loading={isLoading}
    />
  );
};

type Side = 'left' | 'right';

interface IsChangedProps {
  onConfirm: () => void;
  isChangedWarning: string;
  side?: Side;
}

const IsChanged = ({ onConfirm, isChangedWarning, side = 'left' }: IsChangedProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setShowConfirm(false));

  const isLeft = side === 'left';

  return (
    <HStack position="relative" gap="1" ref={ref} contentEditable={false}>
      <Button
        icon={<TrashIcon aria-hidden />}
        variant="tertiary"
        size="xsmall"
        onClick={() => setShowConfirm(!showConfirm)}
      />
      {showConfirm ? (
        <Alert
          variant="warning"
          size="small"
          className={`absolute top-0 text-ax-text-neutral ${isLeft ? 'left-full' : 'right-full'}`}
        >
          {isChangedWarning}
          <HStack gap="1" wrap={false}>
            <Button icon={<CheckmarkIcon aria-hidden />} onClick={onConfirm} variant="tertiary" size="xsmall">
              Ja
            </Button>
            <Button
              icon={<XMarkIcon aria-hidden />}
              onClick={() => setShowConfirm(false)}
              variant="tertiary"
              size="xsmall"
              style={{ whiteSpace: 'nowrap' }}
            >
              Nei, avbryt
            </Button>
          </HStack>
        </Alert>
      ) : null}
    </HStack>
  );
};
