import type { DocumentAccess } from '@app/hooks/dua-access/use-document-access';

export const documentAccessAreEqual = (prev: DocumentAccess, next: DocumentAccess) =>
  prev.write === next.write &&
  prev.rename === next.rename &&
  prev.remove === next.remove &&
  prev.changeType === next.changeType &&
  prev.finish === next.finish &&
  prev.changeType === next.changeType &&
  prev.referAttachments === next.referAttachments &&
  prev.uploadAttachments === next.uploadAttachments &&
  prev.read === next.read;
