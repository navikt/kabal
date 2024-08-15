import { fetchDocument } from '@app/plugins/crdt/api/fetch';
import { saveDocument } from '@app/plugins/crdt/api/store';
import { Database } from '@hocuspocus/extension-database';

export const getApiExtension = () =>
  new Database({
    fetch: fetchDocument,
    store: saveDocument,
  });
