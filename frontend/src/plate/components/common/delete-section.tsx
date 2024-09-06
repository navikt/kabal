import { CheckmarkIcon, TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, Tooltip } from '@navikt/ds-react';
import { removeNodes } from '@udecode/plate-common';
import { useRef, useState } from 'react';
import { Path } from 'slate';
import { styled } from 'styled-components';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { ToolbarButtonWithConfirm } from '@app/plate/components/common/toolbar-button-with-confirm';
import { MaltekstseksjonToolbarStyle } from '@app/plate/components/styled-components';
import { useMyPlateEditorRef } from '@app/plate/types';

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

  const onDelete = () => removeNodes(editor, { at: path });

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

  return (
    <DeleteMaltekstseksjonContainer ref={ref} contentEditable={false}>
      <Button
        icon={<TrashIcon aria-hidden />}
        variant="tertiary"
        size="xsmall"
        onClick={() => setShowConfirm(!showConfirm)}
      />
      {showConfirm ? (
        <StyledAlert variant="warning" size="small" $side={side}>
          {isChangedWarning}
          <Buttons>
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
          </Buttons>
        </StyledAlert>
      ) : null}
    </DeleteMaltekstseksjonContainer>
  );
};

const Buttons = styled.div`
  display: flex;
  gap: var(--a-spacing-1);
`;

const StyledAlert = styled(Alert)<{ $side: Side }>`
  position: absolute;
  top: 0;
  left: ${({ $side }) => ($side === 'right' ? '100%' : 'auto')};
  right: ${({ $side }) => ($side === 'left' ? '100%' : 'auto')};
  color: var(--a-text-default);
`;

const DeleteMaltekstseksjonContainer = styled.div`
  position: relative;
  display: flex;
  gap: var(--a-spacing-1);

  > ${MaltekstseksjonToolbarStyle} {
    opacity: 1;
  }
`;
