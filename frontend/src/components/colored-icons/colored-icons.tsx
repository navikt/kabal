import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  InformationSquareFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';

type Props = React.SVGProps<SVGSVGElement> &
  React.RefAttributes<SVGSVGElement> & { title?: string; ref?: React.RefObject<SVGSVGElement | null> };

export const CheckmarkCircleFillIconColored = ({ className, ...rest }: Props) => (
  <CheckmarkCircleFillIcon aria-hidden {...rest} className={`${className} text-icon-success`} />
);

export const XMarkOctagonFillIconColored = ({ className, ...rest }: Props) => (
  <XMarkOctagonFillIcon aria-hidden {...rest} className={`${className} text-icon-danger`} />
);

export const ExclamationmarkTriangleFillIconColored = ({ className, ...rest }: Props) => (
  <ExclamationmarkTriangleFillIcon aria-hidden {...rest} className={`${className} text-icon-warning`} />
);

export const InformationSquareFillIconColored = ({ className, ...rest }: Props) => (
  <InformationSquareFillIcon aria-hidden {...rest} className={`${className} text-icon-info`} />
);
