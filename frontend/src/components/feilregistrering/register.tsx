import { MOD_KEY } from '@app/keys';
import { useSetFeilregistrertMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { FileXMarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Textarea } from '@navikt/ds-react';
import { useCallback, useContext, useState } from 'react';
import { styled } from 'styled-components';
import { Context } from './context';
import type { OppgaveId } from './types';

const MAX_LENGTH = 250;

export const Register = ({ oppgaveId }: OppgaveId) => {
  const [reason, setReason] = useState('');
  const [showEmptyError, setShowEmptyError] = useState(false);
  const [setFeilregistrert, { isLoading }] = useSetFeilregistrertMutation({ fixedCacheKey: oppgaveId });
  const { close } = useContext(Context);

  const save = useCallback(
    (id: string, r: string) => {
      if (r.length > 0) {
        setFeilregistrert({ oppgaveId: id, reason: r });
        setShowEmptyError(false);
        close();
      } else {
        setShowEmptyError(true);
      }
    },
    [close, setFeilregistrert],
  );

  return (
    <>
      <Textarea
        label="Årsak"
        value={reason}
        autoFocus
        required
        maxLength={MAX_LENGTH}
        description={Description}
        onChange={(e) => setReason(e.target.value)}
        error={showEmptyError ? 'Skriv inn en årsak.' : undefined}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            save(oppgaveId, reason);
          } else if (e.key === 'Escape') {
            close();
          }
        }}
      />
      <HStack align="center" justify="space-between" gap="0 4">
        <Button
          size="small"
          variant="danger"
          onClick={() => save(oppgaveId, reason)}
          loading={isLoading}
          icon={<FileXMarkIcon aria-hidden />}
          disabled={reason.length > MAX_LENGTH}
        >
          Feilregistrer
        </Button>
        <Button size="small" variant="secondary" onClick={close} loading={isLoading} icon={<XMarkIcon aria-hidden />}>
          Avbryt
        </Button>
      </HStack>
    </>
  );
};

const Code = styled.code`
  background-color: var(--a-bg-subtle);
  padding: var(--a-spacing-05) var(--a-spacing-1);
  border-radius: var(--a-border-radius-medium);
  font-size: 13px;
`;

const Description = (
  <BodyShort>
    Skriv inn årsak og trykk <strong>Feilregistrer</strong> (<Code>{MOD_KEY} + Enter</Code>) eller{' '}
    <strong>Avbryt</strong> (<Code>Escape</Code>) for å avbryte.
  </BodyShort>
);
