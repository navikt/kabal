import { Tag, Tooltip } from '@navikt/ds-react';
import { getActiveVariant } from '@/components/documents/variants';
import { Filtype, type Variant, VariantFormat, type Variants } from '@/types/arkiverte-documents';

/** The variant shown by default: SLADDET, then ARKIV, then FULLVERSJON, preferring accessible variants. */
export const getDefaultVariant = (varianter: Variants): Variant | null =>
  getActiveVariant(varianter, VariantFormat.SLADDET) ?? null;

export const canDistribute = ({ filtype }: Variant): boolean => filtype === Filtype.PDF;

export const canDistributeAny = (varianter: Variants): boolean => varianter.some((v) => canDistribute(v));

export const canOpenInKabal = (varianter: Variants): boolean =>
  varianter.some(({ filtype }) => filtype === Filtype.PDF || filtype === Filtype.XLSX);

export const hasRedactedVariant = (varianter: Variants): boolean =>
  varianter.some(({ format }) => format === VariantFormat.SLADDET);

export const FILE_TYPE_NAMES: Record<Filtype, string> = {
  [Filtype.PDF]: 'PDF',
  [Filtype.XLSX]: 'Excel',
  [Filtype.JPEG]: 'JPEG',
  [Filtype.PNG]: 'PNG',
  [Filtype.TIFF]: 'TIFF',
  [Filtype.JSON]: 'JSON',
  [Filtype.XML]: 'XML',
  [Filtype.AXML]: 'AXML',
  [Filtype.DXML]: 'DXML',
  [Filtype.RTF]: 'RTF',
};

interface FiletypeProps {
  varianter: Variants;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const FileType = ({ varianter, className, ref }: FiletypeProps) => {
  const variant = getDefaultVariant(varianter);

  if (variant === null) {
    return null;
  }

  return (
    <Tooltip content={`Filtype ${FILE_TYPE_NAMES[variant.filtype]} kan ikke åpnes i Kabal. Må lastes ned.`}>
      <Tag data-color="neutral" variant="strong" size="xsmall" className={className} ref={ref}>
        {FILE_TYPE_NAMES[variant.filtype]}
      </Tag>
    </Tooltip>
  );
};
