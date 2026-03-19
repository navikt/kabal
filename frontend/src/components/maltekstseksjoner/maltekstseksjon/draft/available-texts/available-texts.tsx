import { PadlockLockedIcon, PencilWritingIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Modal } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
import {
  AvailableTextsByType,
  type AvailableTextsByTypeProps,
} from '@/components/maltekstseksjoner/maltekstseksjon/draft/available-texts/available-texts-by-type';
import { RichTextTypes } from '@/types/common-text-types';

export const AvailableTexts = ({ onAdd, onRemove, usedIds, textType }: AvailableTextsByTypeProps) => {
  const Icon = textType === RichTextTypes.MALTEKST ? PadlockLockedIcon : PencilWritingIcon;

  const typeLabel = textType === RichTextTypes.MALTEKST ? 'låst' : 'redigerbar';
  const [open, setOpen] = useState(false);

  const onClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <Button
        data-color="neutral"
        variant="tertiary"
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
          <Button
            data-color="neutral"
            size="small"
            variant="secondary"
            onClick={onClose}
            icon={<XMarkIcon aria-hidden />}
          >
            Lukk
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
