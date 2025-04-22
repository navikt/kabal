import { Sikkerhetstiltak } from '@app/components/oppgavebehandling-controls/sikkerhetstiltak';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { RelevantOppgaver } from '@app/components/relevant-oppgaver/relevant-oppgaver';
import { formatFoedselsnummer } from '@app/functions/format-id';
import type { IOppgavebehandlingBase } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Box, CopyButton, HStack } from '@navikt/ds-react';
import { UserSex } from './user-sex';

export const UserInfo = ({ sakenGjelder, id, sikkerhetstiltak }: IOppgavebehandlingBase) => (
  <HStack asChild align="center" gap="0 2" paddingInline="0 4">
    <Box borderWidth="0 1 0 0" borderColor="border-divider">
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
