import { PlusIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { useCallback } from 'react';
import { useCreateDraftFromVersionMutation } from '@/redux-api/texts/mutations';
import type { IGetTextsParams } from '@/types/common-text-types';
import type { IText } from '@/types/texts/responses';

interface Props {
  text: IText;
  onDraftCreated: (versionId: string) => void;
  query: IGetTextsParams;
}

export const CreateDraftTextButton = ({ text, onDraftCreated, query }: Props) => {
  const { id, versionId, title } = text;
  const [createDraft] = useCreateDraftFromVersionMutation();

  const createDraftAndNotify = useCallback(async () => {
    const draft = await createDraft({ id, title, versionId, query }).unwrap();
    onDraftCreated(draft.versionId);
  }, [createDraft, id, title, versionId, query, onDraftCreated]);

  return (
    <Tooltip content="Opprett et utkast basert på denne versjonen.">
      <Button
        data-color="neutral"
        size="small"
        variant="secondary"
        onClick={createDraftAndNotify}
        icon={<PlusIcon aria-hidden />}
      >
        Nytt utkast
      </Button>
    </Tooltip>
  );
};
