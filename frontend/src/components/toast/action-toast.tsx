import { styled } from 'styled-components';
import { sendCloseEvent } from '@app/components/toast/toast/helpers';

interface Props {
  children: React.ReactNode;
  primary?: React.ReactNode;
  secondary?: React.ReactNode;
  attrs?: {
    [key: string]: string;
  };
}

export const ActionToast = ({ children, primary, secondary, attrs }: Props) => (
  <div {...attrs}>
    <span>{children}</span>
    <ButtonRow onClick={({ target }) => sendCloseEvent(target)}>
      {secondary}
      {primary}
    </ButtonRow>
  </div>
);

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  column-gap: var(--a-spacing-2);
`;
