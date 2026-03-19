import { FilesIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { useCallback } from 'react';
import { useTextQuery } from '@/components/smart-editor-texts/hooks/use-text-query';
import { useNavigateToStandaloneTextVersion } from '@/hooks/use-navigate-to-standalone-text-version';
import { useDuplicateVersionMutation } from '@/redux-api/texts/mutations';
import type { IText } from '@/types/texts/responses';

export const DuplicateTextButton = ({ id, versionId, title, textType }: IText) => {
  const query = useTextQuery();
  const [duplicateTextVersion, { isLoading }] = useDuplicateVersionMutation();
  const navigate = useNavigateToStandaloneTextVersion(textType);

  const onClick = useCallback(async () => {
    const duplicateText = await duplicateTextVersion({ id, title, versionId, query }).unwrap();
    navigate({ id: duplicateText.id, versionId: duplicateText.versionId });
  }, [duplicateTextVersion, id, navigate, title, versionId, query]);

  return (
    <Tooltip content="Opprett ny tekst basert på denne versjonen.">
      <Button
        data-color="neutral"
        size="small"
        variant="secondary"
        onClick={onClick}
        icon={<FilesIcon aria-hidden />}
        loading={isLoading}
      >
        Dupliser
      </Button>
    </Tooltip>
  );
};
