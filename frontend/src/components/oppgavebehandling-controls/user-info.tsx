import { Box, CopyButton, HStack } from '@navikt/ds-react';
import { Sikkerhetstiltak } from '@/components/oppgavebehandling-controls/sikkerhetstiltak';
import { UserSex } from '@/components/oppgavebehandling-controls/user-sex';
import { PartStatusList } from '@/components/part-status-list/part-status-list';
import { RelevantOppgaver } from '@/components/relevant-oppgaver/relevant-oppgaver';
import { formatFoedselsnummer } from '@/functions/format-id';
import type { IOppgavebehandlingBase } from '@/types/oppgavebehandling/oppgavebehandling';

export const UserInfo = ({ sakenGjelder, id, sikkerhetstiltak }: IOppgavebehandlingBase) => (
  <HStack asChild align="center" gap="space-0 space-8" paddingInline="space-0 space-1">
    <Box borderWidth="0 1 0 0" borderColor="neutral">
      <UserSex sex={sakenGjelder.sex} />
      <span>{sakenGjelder.name ?? '-'}</span>
      <CopyButton
        size="small"
        copyText={sakenGjelder.identifikator}
        text={formatFoedselsnummer(sakenGjelder.identifikator)}
      />
      <PartStatusList statusList={sakenGjelder.statusList} size="small" />
      <Sikkerhetstiltak sikkerhetstiltak={sikkerhetstiltak} />
      <RelevantOppgaver oppgaveId={id} />
    </Box>
  </HStack>
);
