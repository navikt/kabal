import { CheckmarkIcon, FileSearchIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps } from '@navikt/ds-react';
import { useState } from 'react';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { PdfModal, PreviewProps } from './pdf-modal';

type Type = SaksTypeEnum.KLAGE | SaksTypeEnum.ANKE;

export const Preview = ({ type, ...props }: PreviewProps & { type: Type }) => {
  const title = getTitle(type);

  return (
    <ModalButton
      {...props}
      variant="secondary"
      icon={<FileSearchIcon aria-hidden />}
      title={title}
      buttonText={getButtonText(type)}
      heading={title}
    />
  );
};

export const Submit = (props: PreviewProps) => (
  <ModalButton
    {...props}
    variant="primary"
    icon={<CheckmarkIcon aria-hidden />}
    title="Lagre"
    heading="Bekreft endringer"
    submit
  />
);

interface ModalButtonProps extends PreviewProps {
  variant: ButtonProps['variant'];
  icon: React.ReactNode;
  title: string;
  buttonText?: string;
  heading: string;
  submit?: boolean;
}

const ModalButton = ({ heading, variant, icon, title, buttonText, ...props }: ModalButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="small" variant={variant} icon={icon} onClick={() => setIsOpen(true)} title={title}>
        {buttonText}
      </Button>
      <PdfModal {...props} isOpen={isOpen} close={() => setIsOpen(false)} heading={heading} />
    </>
  );
};

const getTitle = (type: Type) => {
  switch (type) {
    case SaksTypeEnum.KLAGE:
      return 'Forhåndsvisning av svarbrev for klage';
    case SaksTypeEnum.ANKE:
      return 'Forhåndsvisning av svarbrev for anke';
  }
};

const getButtonText = (type: Type) => {
  switch (type) {
    case SaksTypeEnum.KLAGE:
      return 'Klage';
    case SaksTypeEnum.ANKE:
      return 'Anke';
  }
};
