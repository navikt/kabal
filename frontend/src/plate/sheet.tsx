import { Box } from '@navikt/ds-react';
import { EDITOR_SCALE_CSS_VAR } from '@/components/smart-editor/hooks/use-scale';
import {
  FONT_SIZE_PT,
  PADDING_BOTTOM_PT,
  PADDING_INLINE_PT,
  PADDING_TOP_PT,
  SHEET_HEIGHT_PT,
  SHEET_WIDTH_PT,
} from '@/plate/components/get-scaled-em';

interface Props {
  minHeight?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
  scaleCssVar?: string;
}

const SHEET_CLASSES = 'first-of-type:mt-0';

export const Sheet = ({ minHeight = false, children, ref, className, scaleCssVar = EDITOR_SCALE_CSS_VAR }: Props) => (
  <Box
    position="relative"
    background="input"
    flexShrink="0"
    marginBlock="space-16 space-0"
    shadow="dialog"
    className={className === undefined ? SHEET_CLASSES : `${SHEET_CLASSES} ${className}`}
    style={{
      width: `calc(var(${scaleCssVar}) * ${SHEET_WIDTH_PT}pt)`,
      minHeight: minHeight ? `calc(var(${scaleCssVar}) * ${SHEET_HEIGHT_PT}pt)` : 'unset',
      paddingInline: `calc(var(${scaleCssVar}) * ${PADDING_INLINE_PT}pt)`,
      paddingTop: `calc(var(${scaleCssVar}) * ${PADDING_TOP_PT}pt)`,
      paddingBottom: `calc(var(${scaleCssVar}) * ${PADDING_BOTTOM_PT}pt)`,
      fontSize: `calc(var(${scaleCssVar}) * ${FONT_SIZE_PT}pt)`,
    }}
    ref={ref}
    data-element="sheet"
  >
    {children}
  </Box>
);
