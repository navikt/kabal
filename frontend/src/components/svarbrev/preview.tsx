import { FileSearchIcon, FloppydiskIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps, Tooltip } from '@navikt/ds-react';
import { Link } from 'react-router-dom';

interface Props {
  id: string;
}

export const Preview = ({ id }: Props) => (
  <ModalButton
    variant="secondary"
    size="small"
    tooltip="Forhåndsvisning"
    icon={<FileSearchIcon aria-hidden />}
    id={id}
  />
);

export const Submit = ({ id }: Props) => (
  <ModalButton variant="primary" size="small" tooltip="Lagre" icon={<FloppydiskIcon aria-hidden />} id={id} />
);

interface ModalButtonProps extends Props {
  id: string;
  variant: ButtonProps['variant'];
  size: ButtonProps['size'];
  icon: React.ReactNode;
  tooltip: string;
}

const ModalButton = ({ id, variant, size, icon, tooltip }: ModalButtonProps) => (
  <Tooltip content={tooltip} placement="top">
    <Button
      as={Link}
      variant={variant}
      size={size}
      icon={icon}
      to={{
        pathname: id,
        search: window.location.search,
        hash: window.location.hash,
      }}
    />
  </Tooltip>
);
