import { Box, CopyButton, HStack, type TagProps } from '@navikt/ds-react';
import { ProtectedFamilyMemberStatuses } from '@/components/oppgavebehandling-controls/family-members';
import { Sikkerhetstiltak } from '@/components/oppgavebehandling-controls/sikkerhetstiltak';
import { UserSex } from '@/components/oppgavebehandling-controls/user-sex';
import { PartStatusList } from '@/components/part-status-list/part-status-list';
import { RelevantOppgaver } from '@/components/relevant-oppgaver/relevant-oppgaver';
import { formatFoedselsnummer } from '@/functions/format-id';
import type { IOppgavebehandlingBase } from '@/types/oppgavebehandling/oppgavebehandling';

const SIZE: TagProps['size'] = 'small';

export const UserInfo = ({ sakenGjelder, id, sikkerhetstiltak }: IOppgavebehandlingBase) => (
  <HStack asChild align="center" gap="space-0 space-8" paddingInline="space-0 space-16">
    <Box borderWidth="0 1 0 0" borderColor="neutral">
      <UserSex sex={sakenGjelder.sex} size={SIZE} />
      <span>{sakenGjelder.name ?? '-'}</span>
      <CopyButton
        size={SIZE}
        copyText={sakenGjelder.identifikator}
        text={formatFoedselsnummer(sakenGjelder.identifikator)}
      />
      <PartStatusList statusList={sakenGjelder.statusList} size={SIZE} />
      <ProtectedFamilyMemberStatuses protectedFamilyMembers={sakenGjelder.protectedFamilyMembers} size={SIZE} />
      <Sikkerhetstiltak sikkerhetstiltak={sikkerhetstiltak} size={SIZE} />
      <RelevantOppgaver oppgaveId={id} size={SIZE} />
    </Box>
  </HStack>
);
