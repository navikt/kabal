import { PadlockLockedIcon, PencilWritingIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Dialog } from '@navikt/ds-react';
import {
  AvailableTextsByType,
  type AvailableTextsByTypeProps,
} from '@/components/maltekstseksjoner/maltekstseksjon/draft/available-texts/available-texts-by-type';
import { RichTextTypes } from '@/types/common-text-types';

export const AvailableTexts = ({ onAdd, onRemove, usedIds, textType }: AvailableTextsByTypeProps) => {
  const Icon = textType === RichTextTypes.MALTEKST ? PadlockLockedIcon : PencilWritingIcon;

  const typeLabel = textType === RichTextTypes.MALTEKST ? 'låst' : 'redigerbar';

  return (
    <Dialog>
      <Dialog.Trigger>
        <Button
          data-color="neutral"
          variant="tertiary"
          size="small"
          icon={<Icon aria-hidden />}
          className="justify-start"
        >
          Legg til eksisterende {typeLabel} tekst
        </Button>
      </Dialog.Trigger>
      <Dialog.Popup width="1500px">
        <Dialog.Header>
          <Dialog.Title>{textType === RichTextTypes.MALTEKST ? 'Låste tekster' : 'Redigerbare tekster'}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <AvailableTextsByType onAdd={onAdd} onRemove={onRemove} usedIds={usedIds} textType={textType} />
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button data-color="neutral" size="small" variant="secondary" icon={<XMarkIcon aria-hidden />}>
              Lukk
            </Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
