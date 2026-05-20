import { Box } from '@navikt/ds-react';
import { EDITOR_SCALE_CSS_VAR } from '@/components/smart-editor/hooks/use-scale';
import {
  PADDING_BOTTOM_PX,
  PADDING_INLINE_PX,
  PADDING_TOP_PX,
  SCREEN_FONT_SIZE_PX,
  SHEET_MIN_HEIGHT_PX,
  SHEET_WIDTH_PX,
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
      width: `calc(var(${scaleCssVar}) * ${SHEET_WIDTH_PX}px)`,
      minHeight: minHeight ? `calc(var(${scaleCssVar}) * ${SHEET_MIN_HEIGHT_PX}px)` : 'unset',
      paddingInline: `calc(var(${scaleCssVar}) * ${PADDING_INLINE_PX}px)`,
      paddingTop: `calc(var(${scaleCssVar}) * ${PADDING_TOP_PX}px)`,
      paddingBottom: `calc(var(${scaleCssVar}) * ${PADDING_BOTTOM_PX}px)`,
      fontSize: `calc(var(${scaleCssVar}) * ${SCREEN_FONT_SIZE_PX}px)`,
    }}
    ref={ref}
    data-element="sheet"
  >
    {children}
  </Box>
);
