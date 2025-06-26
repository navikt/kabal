import type { AttachmentAccessEnum } from '@app/hooks/dua-access/attachment-access';
import type { DocumentAccessEnum } from '@app/hooks/dua-access/document-access';
import type { AttachmentAccess } from '@app/hooks/dua-access/use-attachment-access';
import type { DocumentAccess } from '@app/hooks/dua-access/use-document-access';

export const getAccessSummary = <
  T extends DocumentAccess | AttachmentAccess,
  E extends DocumentAccessEnum | AttachmentAccessEnum,
>(
  access: T,
  names: Record<keyof T, string>,
  texts: Record<E, string | null>,
): string | null => {
  const { read, ...rest } = access;

  interface ReasonGroup {
    title: string;
    reasons: string[];
  }

  const reasonGroups: ReasonGroup[] = read
    ? []
    : [{ title: 'Ingen tilgang', reasons: ['Du har ikke tilgang til dette dokumentet.'] }];

  const accessList = Object.entries(rest);

  const accessGroups = accessList.reduce<Map<E, (keyof T)[]>>((acc, [accessKey, reasonId]) => {
    const accessKeyTyped = accessKey as keyof T;
    const existing = acc.get(reasonId);

    acc.set(reasonId, existing === undefined ? [accessKeyTyped] : [...existing, accessKeyTyped]);

    return acc;
  }, new Map());

  for (const [accessKey, reasonIds] of accessGroups) {
    if (reasonIds.length === 0) {
      continue;
    }

    const title = texts[accessKey];

    if (title === null) {
      continue;
    }

    const reasons: string[] = [];

    for (const reasonId of reasonIds) {
      const reason = names[reasonId];
      if (reason !== null) {
        reasons.push(reason);
      }
    }

    if (reasons.length === 0) {
      continue;
    }

    reasonGroups.push({ title, reasons });
  }

  if (reasonGroups.length === 0) {
    return null;
  }

  let result = '';

  for (const { title, reasons } of reasonGroups) {
    result += `${title}:\n`;

    for (const reason of reasons) {
      result += `- ${reason}\n`;
    }

    result += '\n';
  }

  return result.trim();
};
