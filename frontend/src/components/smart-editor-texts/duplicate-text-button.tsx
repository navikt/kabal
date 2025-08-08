import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { useNavigateToStandaloneTextVersion } from '@app/hooks/use-navigate-to-standalone-text-version';
import { useDuplicateVersionMutation } from '@app/redux-api/texts/mutations';
import type { IText } from '@app/types/texts/responses';
import { FilesIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { useCallback } from 'react';

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
