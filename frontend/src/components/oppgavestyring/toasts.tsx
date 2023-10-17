import { Button } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
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

export const successToast = ({ testId, fromNavIdent, label, name, onChange, oppgaveId, toNavIdent }: ToastProps) => {
  toast.success(
    <div data-testid={testId} data-oppgaveid={oppgaveId}>
      <span>
        {label} {name}.
      </span>
      <ButtonRow>
        <Button size="small" variant="tertiary" onClick={() => onChange(fromNavIdent, toNavIdent)}>
          Angre
        </Button>
      </ButtonRow>
    </div>,
  );
};

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
