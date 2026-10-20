import {
  CheckmarkCircleIcon,
  ExclamationmarkTriangleIcon,
  InformationSquareIcon,
  XMarkOctagonIcon,
} from '@navikt/aksel-icons';
import type { InfoCardProps } from '@navikt/ds-react';
import { InfoCard } from '@navikt/ds-react';

type Variant = Extract<NonNullable<InfoCardProps['data-color']>, 'info' | 'success' | 'warning' | 'danger'>;

interface AlertProps extends Pick<InfoCardProps, 'children' | 'className' | 'contentEditable'> {
  variant: Variant;
  size?: InfoCardProps['size'];
}

const ICON_MAP: Record<Variant, React.ReactNode> = {
  info: <InformationSquareIcon aria-hidden />,
  success: <CheckmarkCircleIcon aria-hidden />,
  warning: <ExclamationmarkTriangleIcon aria-hidden />,
  danger: <XMarkOctagonIcon aria-hidden />,
};

export const InfoBox = ({ variant, size = 'small', children, ...props }: AlertProps) => (
  <InfoCard data-color={variant} size={size} {...props}>
    <InfoCard.Message icon={ICON_MAP[variant]}>{children}</InfoCard.Message>
  </InfoCard>
);
