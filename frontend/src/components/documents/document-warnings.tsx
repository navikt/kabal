import {
  canDistribute,
  canOpenInKabal,
  FILE_TYPE_NAMES,
  FileType,
  getDefaultVariant,
  hasRedactedVariant,
} from '@app/components/documents/filetype';
import { Skjerming, type Variants } from '@app/types/arkiverte-documents';
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
    <HStack wrap={false} gap="space-8" className="empty:hidden">
      {canDistribute(variant) ? null : (
        <Tooltip content={`Filtype ${FILE_TYPE_NAMES[variant.filtype]} kan ikke distribueres`}>
          <ExclamationmarkTriangleIcon aria-hidden className="text-ax-text-danger-decoration" />
        </Tooltip>
      )}
      {canOpenInKabal(varianter) ? null : <FileType varianter={varianter} />}
      {hasRedactedVariant(varianter) ? (
        <Tooltip content="Dokumentet har sladdet versjon">
          <Tag data-color="meta-purple" size="xsmall" variant="strong">
            <EyeObfuscatedIcon aria-hidden />
          </Tag>
        </Tooltip>
      ) : null}
      {variant.skjerming === Skjerming.POL ? <PolTag /> : null}
      {variant.skjerming === Skjerming.FEIL ? <FeilTag /> : null}
    </HStack>
  );
};

export const PolTag = () => (
  <Tooltip content="Dokumentet er begrenset basert på personopplysningsloven">
    <Tag data-color="warning" size="xsmall" variant="strong">
      Begrenset
    </Tag>
  </Tooltip>
);

export const FeilTag = () => (
  <Tooltip content="Dokumentet er markert for sletting">
    <Tag data-color="danger" size="xsmall" variant="strong">
      Slettes
    </Tag>
  </Tooltip>
);
