import {
  FILE_TYPE_NAMES,
  FileType,
  canDistribute,
  canOpenInKabal,
  getDefaultVariant,
  hasRedactedVariant,
} from '@app/components/documents/filetype';
import type { Variants } from '@app/types/arkiverte-documents';
import { ExclamationmarkTriangleIcon, EyeObfuscatedIcon } from '@navikt/aksel-icons';
import { HStack, Tag, Tooltip } from '@navikt/ds-react';

interface Props {
  varianter: Variants;
}

export const DocumentWarnings = ({ varianter }: Props) => {
  const variant = getDefaultVariant(varianter);

  if (variant === null) {
    return null;
  }

  return (
    <HStack wrap={false} gap="2" className="empty:hidden">
      {canDistribute(variant) ? null : (
        <Tooltip content={`Filtype ${FILE_TYPE_NAMES[variant.filtype]} kan ikke distribueres`}>
          <ExclamationmarkTriangleIcon aria-hidden className="text-icon-danger" />
        </Tooltip>
      )}

      {canOpenInKabal(varianter) ? null : <FileType varianter={varianter} />}

      {hasRedactedVariant(varianter) ? (
        <Tooltip content="Dokumentet har sladdet versjon">
          <Tag size="xsmall" variant="alt1-filled">
            <EyeObfuscatedIcon aria-hidden />
          </Tag>
        </Tooltip>
      ) : null}
    </HStack>
  );
};
