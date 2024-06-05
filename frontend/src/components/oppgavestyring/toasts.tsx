import { Button } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { CountdownButton } from '@app/components/countdown-button/countdown-button';
import { OnChange } from '@app/components/oppgavestyring/types';
import { toast } from '../toast/store';

interface ToastProps {
  testId: string;
  oppgaveId: string;
  label: string;
  fromNavIdent: string | null;
  toNavIdent: string | null;
  onChange: OnChange;
  name: string;
}

export const successToast = (props: ToastProps) => toast.success(<Tildelt {...props} />);

const Tildelt = ({ oppgaveId, testId, fromNavIdent, toNavIdent, label, name, onChange }: ToastProps) => (
  <div data-testid={testId} data-oppgaveid={oppgaveId}>
    <span>
      {label} {name}.
    </span>
    <ButtonRow>
      <CountdownButton size="small" variant="tertiary" onClick={() => onChange(fromNavIdent, toNavIdent)} seconds={10}>
        Angre
      </CountdownButton>
    </ButtonRow>
  </div>
);

export const errorToast = ({ testId, fromNavIdent, label, name, onChange, oppgaveId, toNavIdent }: ToastProps) => {
  toast.error(
    <div data-testid={testId} data-oppgaveid={oppgaveId}>
      <span>
        Kunne ikke sette {name} ({toNavIdent}) som {label}.
      </span>
      <ButtonRow>
        <Button size="small" variant="tertiary" onClick={() => onChange(toNavIdent, fromNavIdent)}>
          Prøv igjen
        </Button>
      </ButtonRow>
    </div>,
  );
};

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  column-gap: 8px;
`;
