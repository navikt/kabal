import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  InformationSquareFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement> & { title?: string };

export const CheckmarkCircleFillIconColored = (props: Props) => (
  <CheckmarkCircleFillIcon aria-hidden {...props} color="var(--a-icon-success)" />
);

export const XMarkOctagonFillIconColored = (props: Props) => (
  <XMarkOctagonFillIcon aria-hidden {...props} color="var(--a-icon-error)" />
);

export const ExclamationmarkTriangleFillIconColored = (props: Props) => (
  <ExclamationmarkTriangleFillIcon aria-hidden {...props} color="var(--a-icon-warning)" />
);

export const InformationSquareFillIconColored = (props: Props) => (
  <InformationSquareFillIcon aria-hidden {...props} color="var(--a-icon-info)" />
);
