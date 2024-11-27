import { useCreateDraftFromVersionMutation } from '@app/redux-api/texts/mutations';
import type { IGetTextsParams } from '@app/types/common-text-types';
import type { IText } from '@app/types/texts/responses';
import { PlusIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { useCallback } from 'react';

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
      <Button size="small" variant="secondary" onClick={createDraftAndNotify} icon={<PlusIcon aria-hidden />}>
        Nytt utkast
      </Button>
    </Tooltip>
  );
};
