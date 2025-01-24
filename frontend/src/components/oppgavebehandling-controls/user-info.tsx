import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { RelevantOppgaver } from '@app/components/relevant-oppgaver/relevant-oppgaver';
import { formatFoedselsnummer } from '@app/functions/format-id';
import type { IOppgavebehandlingBase } from '@app/types/oppgavebehandling/oppgavebehandling';
import { CopyButton } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { UserSex } from './user-sex';

export const UserInfo = ({ sakenGjelder, id }: IOppgavebehandlingBase) => (
  <>
    <User>
      <UserSex sex={sakenGjelder.sex} />
      <span>{sakenGjelder.name ?? '-'}</span>
      <CopyButton
        size="small"
        copyText={sakenGjelder.identifikator}
        text={formatFoedselsnummer(sakenGjelder.identifikator)}
      />
      <PartStatusList statusList={sakenGjelder.statusList} size="small" />
      <RelevantOppgaver oppgaveId={id} />
    </User>
  </>
);

const User = styled.section`
  display: flex;
  align-items: center;
  column-gap: var(--a-spacing-2);
  border-right: 1px solid #c9c9c9;
  padding-right: var(--a-spacing-4);
`;
