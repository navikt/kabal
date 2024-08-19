import { isConnectionContext } from '@app/plugins/crdt/context';
import { getLogger } from '@app/logger';
import { getDocument } from '@app/plugins/crdt/get-document';

const log = getLogger('collaboration');

interface Params {
  documentName: string;
  context: unknown;
}

export const fetchDocument = async ({ documentName, context }: Params) => {
  log.info({ msg: `Fetch ${documentName}` });

  if (!isConnectionContext(context)) {
    log.error({ msg: 'Tried to load document without context' });

    throw new Error('Invalid context');
  }

  log.info({ msg: 'Fetch document' });

  const { behandlingId, dokumentId, req } = context;

  try {
    const res = await getDocument(req, behandlingId, dokumentId);

    return Buffer.from(res.data, 'base64');
  } catch (error) {
    log.error({ error });
    throw error;
  }
};
