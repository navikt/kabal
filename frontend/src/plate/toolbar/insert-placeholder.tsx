import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { Keys, MOD_KEY_TEXT } from '@app/keys';
import { useSelection } from '@app/plate/hooks/use-selection';
import { createPlaceHolder } from '@app/plate/templates/helpers';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useMyPlateEditorRef } from '@app/plate/types';
import { isPlaceholderActive } from '@app/plate/utils/queries';
import { insertPlaceholderFromSelection, removePlaceholder } from '@app/plate/utils/transforms';
import { PencilWritingIcon, PlusIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BoxNew, Button, HStack, TextField } from '@navikt/ds-react';
import { useEditorRef } from '@platejs/core/react';
import { RangeApi } from 'platejs';
import { useRef, useState } from 'react';

export const InsertPlaceholder = () => {
  const editor = useEditorRef();
  const selection = useSelection();
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const ref = useRef<HTMLSpanElement>(null);
  const [placeholder, setPlaceholder] = useState('');

  const resetAndClose = () => {
    setPlaceholder('');
    setIsOpen(false);
  };

  useOnClickOutside(ref, resetAndClose, true);

  const onClick = () => {
    if (RangeApi.isCollapsed(selection)) {
      if (isPlaceholderActive(editor)) {
        removePlaceholder(editor);
      } else {
        toggleOpen();
      }
    } else {
      insertPlaceholderFromSelection(editor, selection);
    }
  };

  const disabled = selection === null || (RangeApi.isExpanded(selection) && isPlaceholderActive(editor));

  return (
    <span ref={ref}>
      <ToolbarIconButton
        label="Sett inn innfyllingsfelt"
        keys={[MOD_KEY_TEXT, 'J']}
        onClick={onClick}
        icon={<PencilWritingIcon aria-hidden />}
        active={isPlaceholderActive(editor)}
        disabled={disabled}
      />
      <PlaceholderText show={isOpen} close={resetAndClose} placeholder={placeholder} setPlaceholder={setPlaceholder} />
    </span>
  );
};

interface PlaceholderProps {
  show: boolean;
  close: () => void;
  placeholder: string;
  setPlaceholder: (value: string) => void;
}

const PlaceholderText = ({ show, close, placeholder, setPlaceholder }: PlaceholderProps) => {
  const editor = useMyPlateEditorRef();

  if (!show) {
    return null;
  }

  const addPlaceholder = () => {
    editor.tf.insertNodes(createPlaceHolder(placeholder), { select: true });
    close();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === Keys.Enter) {
      event.preventDefault();
      addPlaceholder();
    } else if (event.key === Keys.Escape) {
      event.preventDefault();
      close();
    }
  };

  return (
    <HStack asChild position="absolute" gap="1" minWidth="220px" right="0" className="top-full">
      <BoxNew background="neutral-soft" padding="2" borderWidth="1" borderColor="neutral-strong" borderRadius="medium">
        <TextField
          autoFocus
          size="small"
          label="Innfyllingsfelt"
          placeholder="Innfyllingsfelt"
          hideLabel
          value={placeholder}
          onChange={({ target }) => setPlaceholder(target.value)}
          onKeyDown={onKeyDown}
        />
        <Button
          size="small"
          onClick={addPlaceholder}
          icon={<PlusIcon aria-hidden />}
          variant="primary"
          title="Sett inn"
        />
        <Button size="small" onClick={close} icon={<XMarkIcon aria-hidden />} variant="danger" title="Avbryt" />
      </BoxNew>
    </HStack>
  );
};
