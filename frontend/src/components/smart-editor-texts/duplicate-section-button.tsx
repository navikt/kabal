import { useNavigateMaltekstseksjoner } from '@app/hooks/use-navigate-maltekstseksjoner';
import { useDuplicateVersionMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import { FilesIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { useCallback } from 'react';

interface Props {
  id: string;
  versionId: string;
  query: IGetMaltekstseksjonParams;
}

export const DuplicateSectionButton = ({ id, versionId, query }: Props) => {
  const [duplicateSectionVersion, { isLoading }] = useDuplicateVersionMutation();
  const navigate = useNavigateMaltekstseksjoner();

  const onClick = useCallback(async () => {
    const duplicateSection = await duplicateSectionVersion({ id, versionId, query }).unwrap();
    navigate({ maltekstseksjonId: duplicateSection.id, maltekstseksjonVersionId: duplicateSection.versionId });
  }, [duplicateSectionVersion, id, navigate, versionId, query]);

  return (
    <Tooltip content="Opprett ny maltekstseksjon basert på denne versjonen.">
      <Button
        size="small"
        variant="secondary-neutral"
        onClick={onClick}
        icon={<FilesIcon aria-hidden />}
        loading={isLoading}
      >
        Dupliser
      </Button>
    </Tooltip>
  );
};
