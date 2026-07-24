import { CopyButton, HStack, Skeleton, Tag, type TagProps } from '@navikt/ds-react';
import { UserSex } from '@/components/oppgavebehandling-controls/user-sex';
import { PartStatusList } from '@/components/part-status-list/part-status-list';
import { formatFoedselsnummer } from '@/functions/format-id';
import { useSearchPersonByFnrQuery } from '@/redux-api/oppgaver/queries/oppgaver';

interface Props {
  fnr: string;
  size: TagProps['size'];
}

export const Person = ({ fnr, size }: Props) => {
  const { currentData, isFetching, isSuccess } = useSearchPersonByFnrQuery(fnr);

  if (isFetching) {
    return <Skeleton variant="rounded" height={32} width={360} />;
  }

  if (!isSuccess) {
    return (
      <Tag variant="outline" data-color="danger" size={size}>
        Kunne ikke hente person ({formatFoedselsnummer(fnr)})
      </Tag>
    );
  }

  return (
    <HStack wrap={false} align="center">
      <UserSex sex={currentData.sex} size={size} />
      <Tag variant="outline" data-color="success" size={size}>
        {currentData.name}
      </Tag>
      <CopyButton
        size={size}
        copyText={currentData.identifikator}
        text={formatFoedselsnummer(currentData.identifikator)}
        iconPosition="right"
      />
      <PartStatusList statusList={currentData.statusList} size={size} />
    </HStack>
  );
};
