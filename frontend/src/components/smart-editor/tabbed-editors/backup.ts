import { format } from 'date-fns';
import { serializeBackup } from '@/components/smart-editor/tabbed-editors/backup-storage';
import {
  BACKUP_DATE_FORMAT,
  BACKUP_EVENT_NAME,
  BACKUP_KEY_DATE_FORMAT,
  BACKUP_RESOLUTION_MS,
  KEY_PREFIX,
} from '@/components/smart-editor/tabbed-editors/constants';
import { setLocalStorageItem } from '@/localstorage';
import { pushError } from '@/observability';
import type { KabalValue } from '@/plate/types';
import type { INavEmployee } from '@/types/bruker';

export const createLocalStorageBackup = (
  oppgaveId: string,
  documentId: string,
  content: KabalValue,
  author: INavEmployee,
) =>
  requestIdleCallback(
    () => {
      const now = new Date();
      // Coarse backup key (floored to the resolution) deduplicates saves within the same window by overwriting.
      const windowStart = Math.floor(now.getTime() / BACKUP_RESOLUTION_MS) * BACKUP_RESOLUTION_MS;
      const key = `${KEY_PREFIX}${oppgaveId}/${documentId}/${format(windowStart, BACKUP_KEY_DATE_FORMAT)}`;

      try {
        // The real modified time and author are stored as metadata, decoupled from the coarse key.
        setLocalStorageItem(key, serializeBackup(content, format(now, BACKUP_DATE_FORMAT), author));
        // `storage` event does not fire in the writing tab. Custom event is used to notify same-tab listeners.
        window.dispatchEvent(new CustomEvent(BACKUP_EVENT_NAME, { detail: { key } }));
      } catch (error) {
        if (error instanceof Error) {
          pushError(new Error(`Failed to backup smart document to localStorage - ${error.name} - ${error.message}`), {
            context: { documentId, oppgaveId },
          });
        }

        console.error('Failed to backup smart document to localStorage', error);
      }
    },
    { timeout: 100 },
  );
