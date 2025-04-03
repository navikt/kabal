import { Checkbox } from '@navikt/ds-react';
import { useCallback, useContext, useMemo } from 'react';
import { SelectContext } from '../../select-context/select-context';

interface Props {
  journalpostId: string;
  dokumentInfoId: string;
  hasAccess: boolean;
}

export const SelectRow = ({ hasAccess, dokumentInfoId, journalpostId }: Props) => {
  const { isSelected, selectOne, unselectOne, selectRangeTo } = useContext(SelectContext);
  const ids = useMemo(() => ({ journalpostId, dokumentInfoId }), [journalpostId, dokumentInfoId]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => (e.target.checked ? selectOne(ids) : unselectOne(ids)),
    [ids, selectOne, unselectOne],
  );

  const onClick: React.MouseEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.shiftKey) {
        selectRangeTo(ids);
      }
    },
    [ids, selectRangeTo],
  );

  const selected = isSelected(ids);

  return (
    <Checkbox
      size="small"
      hideLabel
      title="Velg dokument"
      value={selected}
      checked={selected}
      onChange={onChange}
      onClick={onClick}
      disabled={!hasAccess}
    >
      Velg dokument
    </Checkbox>
  );
};
