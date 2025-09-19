import type { CloseEvent } from '@hocuspocus/common';

export const getCloseEvent = (reason: string, code: number): CloseEvent => ({ reason, code });
