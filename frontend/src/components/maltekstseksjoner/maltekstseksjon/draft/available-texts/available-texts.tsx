import { RichTextTypes } from '@app/types/common-text-types';
import { PadlockLockedIcon, PencilWritingIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Modal } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
import { AvailableTextsByType, type AvailableTextsByTypeProps } from './available-texts-by-type';

export const AvailableTexts = ({ onAdd, onRemove, usedIds, textType }: AvailableTextsByTypeProps) => {
  const Icon = textType === RichTextTypes.MALTEKST ? PadlockLockedIcon : PencilWritingIcon;

  const typeLabel = textType === RichTextTypes.MALTEKST ? 'låst' : 'redigerbar';
  const [open, setOpen] = useState(false);

  const onClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <Button
        variant="tertiary-neutral"
        size="small"
        onClick={() => setOpen(!open)}
        icon={<Icon aria-hidden />}
        className="justify-start"
      >
        Legg til eksisterende {typeLabel} tekst
      </Button>

      <Modal
        header={{ heading: textType === RichTextTypes.MALTEKST ? 'Låste tekster' : 'Redigerbare tekster' }}
        width={1500}
        open={open}
        onClose={onClose}
        closeOnBackdropClick
      >
        <Modal.Body>
          {/* Ensures JIT loading */}
          {open ? (
            <AvailableTextsByType onAdd={onAdd} onRemove={onRemove} usedIds={usedIds} textType={textType} />
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button size="small" variant="secondary-neutral" onClick={onClose} icon={<XMarkIcon aria-hidden />}>
            Lukk
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
