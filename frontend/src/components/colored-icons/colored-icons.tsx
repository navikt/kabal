import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  InformationSquareFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { forwardRef } from 'react';

type Props = React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement> & { title?: string };

export const CheckmarkCircleFillIconColored = forwardRef<SVGSVGElement, Props>((props, ref) => (
  <CheckmarkCircleFillIcon aria-hidden {...props} color="var(--a-icon-success)" ref={ref} />
));

CheckmarkCircleFillIconColored.displayName = 'CheckmarkCircleFillIconColored';

export const XMarkOctagonFillIconColored = forwardRef<SVGSVGElement, Props>((props, ref) => (
  <XMarkOctagonFillIcon aria-hidden {...props} color="var(--a-icon-danger)" ref={ref} />
));

XMarkOctagonFillIconColored.displayName = 'XMarkOctagonFillIconColored';

export const ExclamationmarkTriangleFillIconColored = forwardRef<SVGSVGElement, Props>((props, ref) => (
  <ExclamationmarkTriangleFillIcon aria-hidden {...props} color="var(--a-icon-warning)" ref={ref} />
));

ExclamationmarkTriangleFillIconColored.displayName = 'ExclamationmarkTriangleFillIconColored';

export const InformationSquareFillIconColored = forwardRef<SVGSVGElement, Props>((props, ref) => (
  <InformationSquareFillIcon aria-hidden {...props} color="var(--a-icon-info)" ref={ref} />
));

InformationSquareFillIconColored.displayName = 'InformationSquareFillIconColored';
