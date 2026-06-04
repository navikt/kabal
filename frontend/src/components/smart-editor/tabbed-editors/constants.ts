/** Format used for the `modified` timestamp stored inside backup metadata. */
export const BACKUP_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
/** Format used for the localStorage key bucket segment. Minute precision is sufficient since buckets are 5 minutes wide. */
export const BACKUP_KEY_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm";
export const KEY_PREFIX = 'smart-document-backup/';
export const BACKUP_EVENT_NAME = 'smart-document-backup';
// Local backups are downsampled to at most one entry per this window.
export const BACKUP_RESOLUTION_MS = 5 * 60 * 1000;
