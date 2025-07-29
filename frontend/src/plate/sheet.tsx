import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { BASE_FONT_SIZE } from '@app/plate/components/get-scaled-em';
import { BoxNew } from '@navikt/ds-react';

interface Props {
  minHeight?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
}

const SHEET_CLASSES = 'first-of-type:mt-0';

export const Sheet = ({ minHeight = false, children, ref, className }: Props) => (
  <BoxNew
    position="relative"
    background="input"
    flexShrink="0"
    marginBlock="space-16 0"
    shadow="dialog"
    className={className === undefined ? SHEET_CLASSES : `${SHEET_CLASSES} ${className}`}
    style={{
      width: `calc(var(${EDITOR_SCALE_CSS_VAR}) * 210mm)`,
      minHeight: minHeight ? `calc(var(${EDITOR_SCALE_CSS_VAR}) * 297mm)` : 'unset',
      paddingInline: `calc(var(${EDITOR_SCALE_CSS_VAR}) * 20mm)`,
      paddingBottom: `calc(var(${EDITOR_SCALE_CSS_VAR}) * 20mm)`,
      paddingTop: `calc(var(${EDITOR_SCALE_CSS_VAR}) * 15mm)`,
      fontSize: `calc(var(${EDITOR_SCALE_CSS_VAR}) * ${BASE_FONT_SIZE}pt)`,
    }}
    ref={ref}
  >
    {children}
  </BoxNew>
);
