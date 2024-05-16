import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps, Tooltip } from '@navikt/ds-react';
import React, { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';

interface Props extends Omit<ButtonProps, 'variant' | 'size'> {
  tooltip: string;
}

export const ToolbarButtonWithConfirm = ({ onClick, icon, tooltip, loading, ...rest }: Props) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setShowConfirm(false));

  return (
    <Container ref={ref} contentEditable={false}>
      <Tooltip content={tooltip} maxChar={Infinity} delay={0}>
        <Button
          {...rest}
          style={showConfirm ? { ...rest.style, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : rest.style}
          icon={icon}
          onClick={() => setShowConfirm(!showConfirm)}
          variant="tertiary"
          size="xsmall"
          loading={loading}
        />
      </Tooltip>

      {showConfirm ? (
        <ConfirmContainer>
          <Tooltip content="Bekreft" delay={0} placement="right">
            <Button
              icon={<CheckmarkIcon aria-hidden />}
              onClick={onClick}
              variant="tertiary"
              size="xsmall"
              loading={loading}
            />
          </Tooltip>
          <Tooltip content="Avbryt" delay={0} placement="right">
            <Button
              icon={<XMarkIcon aria-hidden />}
              onClick={() => setShowConfirm(false)}
              variant="tertiary"
              size="xsmall"
              loading={loading}
            />
          </Tooltip>
        </ConfirmContainer>
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
`;

const ConfirmContainer = styled.div`
  position: absolute;
  top: 100%;
  background-color: var(--a-bg-subtle);
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  box-shadow: var(--a-shadow-medium);
`;
