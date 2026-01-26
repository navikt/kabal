import { isMetaKey, Keys, MOD_KEY_TEXT } from '@app/keys';
import { useSetFeilregistrertMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { FileXMarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HStack, Textarea } from '@navikt/ds-react';
import { useCallback, useContext, useState } from 'react';
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
          if (isMetaKey(e) && e.key === Keys.Enter) {
            save(oppgaveId, reason);
          } else if (e.key === Keys.Escape) {
            close();
          }
        }}
      />
      <HStack align="center" justify="space-between" gap="space-0 space-16">
        <Button
          data-color="danger"
          size="small"
          variant="primary"
          onClick={() => save(oppgaveId, reason)}
          loading={isLoading}
          icon={<FileXMarkIcon aria-hidden />}
          disabled={reason.length > MAX_LENGTH}
        >
          Feilregistrer
        </Button>

        <Button
          data-color="neutral"
          size="small"
          variant="secondary"
          onClick={close}
          loading={isLoading}
          icon={<XMarkIcon aria-hidden />}
        >
          Avbryt
        </Button>
      </HStack>
    </>
  );
};

interface CodeProps {
  children: React.ReactNode;
}

const Code = ({ children }: CodeProps) => (
  <Box
    as="code"
    background="sunken"
    paddingBlock="space-2"
    paddingInline="space-4"
    marginInline="space-2"
    borderRadius="4"
    className="inline whitespace-nowrap text-sm"
  >
    {children}
  </Box>
);

const Description = (
  <BodyShort>
    Skriv inn årsak og trykk <strong>Feilregistrer</strong> <Code>{MOD_KEY_TEXT} + Enter</Code> eller{' '}
    <strong>Avbryt</strong> <Code>Escape</Code> for å avbryte.
  </BodyShort>
);
