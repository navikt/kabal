import { type Variant, VariantFormat } from '@/types/arkiverte-documents';

/** All variant formats, in display and priority order. */
export const VARIANT_FORMATS: readonly VariantFormat[] = [
  VariantFormat.SLADDET,
  VariantFormat.ARKIV,
  VariantFormat.FULLVERSJON,
];

export const findVariant = (varianter: readonly Variant[], format: VariantFormat): Variant | undefined =>
  varianter.find((v) => v.format === format);

/** The first accessible variant in order of preference, or the first existing one if none are accessible. */
export const getActiveVariant = (varianter: readonly Variant[], selectedFormat: VariantFormat): Variant | undefined => {
  const candidates = [selectedFormat, ...VARIANT_FORMATS]
    .map((format) => findVariant(varianter, format))
    .filter((v) => v !== undefined);

  return candidates.find((v) => v.hasAccess) ?? candidates[0] ?? varianter[0];
};

/** Formats with at least one accessible variant, in display order. */
export const getSelectableFormats = (varianter: readonly Variant[]): VariantFormat[] =>
  VARIANT_FORMATS.filter((format) => varianter.some((v) => v.hasAccess && v.format === format));

/** The selected format if selectable, otherwise the first selectable format in priority order. */
export const getActiveFormat = (
  selectableFormats: readonly VariantFormat[],
  selectedFormat: VariantFormat,
): VariantFormat | undefined =>
  [selectedFormat, ...VARIANT_FORMATS].find((format) => selectableFormats.includes(format));
