import {
  CheckmarkCircleFillIconColored,
  ExclamationmarkTriangleFillIconColored,
  InformationSquareFillIconColored,
  XMarkOctagonFillIconColored,
} from '@/components/colored-icons/colored-icons';
import { ToastType } from '@/components/toast/types';

interface IconProps {
  type: ToastType;
}

export const Icon = ({ type }: IconProps) => {
  switch (type) {
    case ToastType.SUCCESS:
      return <CheckmarkCircleFillIconColored aria-hidden />;
    case ToastType.ERROR:
      return <XMarkOctagonFillIconColored aria-hidden />;
    case ToastType.INFO:
      return <InformationSquareFillIconColored aria-hidden />;
    case ToastType.WARNING:
      return <ExclamationmarkTriangleFillIconColored aria-hidden />;
  }
};
