import { Checkbox } from '@navikt/ds-react';
import React, { useCallback, useContext } from 'react';
import { SelectContext } from '../../select-context/select-context';
import { ISelectedDocument } from '../../select-context/types';

export const SelectRow = (props: ISelectedDocument) => {
  const { isSelected, selectOne, unselectOne, selectRangeTo } = useContext(SelectContext);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => (e.target.checked ? selectOne(props) : unselectOne(props)),
    [props, selectOne, unselectOne],
  );

  const onClick: React.MouseEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.shiftKey) {
        selectRangeTo(props);
      }
    },
    [props, selectRangeTo],
  );

  const selected = isSelected(props);

  return (
    <Checkbox
      size="small"
      hideLabel
      title="Velg dokument"
      value={selected}
      checked={selected}
      onChange={onChange}
      onClick={onClick}
    >
      Velg dokument
    </Checkbox>
  );
};
