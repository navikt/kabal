import { CheckmarkIcon, TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, Popover, Portal, Tooltip, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import type { Path } from 'slate';
import { InfoBox } from '@/components/info-box/info-box';
import { ToolbarButtonWithConfirm } from '@/plate/components/common/toolbar-button-with-confirm';
import { useMyPlateEditorRef } from '@/plate/types';

const DummyButton = ({ loading }: { loading?: boolean }) => (
  <Button
    data-color="neutral"
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
}

export const DeleteSection = ({
  isChanged,
  isLoading,
  path,
  errorTooltip,
  defaultTooltip,
  isChangedWarning,
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
    return <IsChanged onConfirm={onDelete} isChangedWarning={isChangedWarning} />;
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

interface IsChangedProps {
  onConfirm: () => void;
  isChangedWarning: string;
}

const IsChanged = ({ onConfirm, isChangedWarning }: IsChangedProps) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={buttonRef}
        data-color="neutral"
        icon={<TrashIcon aria-hidden />}
        variant="tertiary"
        size="xsmall"
        contentEditable={false}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      />
      <Portal>
        <Popover open={open} onClose={() => setOpen(false)} anchorEl={buttonRef.current}>
          <Popover.Content>
            <VStack gap="space-8">
              <InfoBox variant="warning">
                {isChangedWarning}
                <HStack gap="space-4" wrap={false}>
                  <Button
                    data-color="neutral"
                    icon={<CheckmarkIcon aria-hidden />}
                    onClick={onConfirm}
                    variant="tertiary"
                    size="xsmall"
                  >
                    Ja
                  </Button>
                  <Button
                    data-color="neutral"
                    icon={<XMarkIcon aria-hidden />}
                    onClick={() => setOpen(false)}
                    variant="tertiary"
                    size="xsmall"
                    className="whitespace-nowrap"
                  >
                    Nei, avbryt
                  </Button>
                </HStack>
              </InfoBox>
            </VStack>
          </Popover.Content>
        </Popover>
      </Portal>
    </>
  );
};
