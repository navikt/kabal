import { LovhjemmelSelect } from '@app/components/behandling/behandlingsdetaljer/lovhjemmel/lovhjemmel-select';
import { SelectedHjemlerList } from '@app/components/behandling/behandlingsdetaljer/lovhjemmel/selected-hjemler-list';
import { useKvalitetsvurderingV2 } from '@app/components/kvalitetsvurdering/v2/common/use-kvalitetsvurdering-v2';
import { useCanEdit } from '@app/hooks/use-can-edit';
import {
  IKvalitetsvurderingAllRegistreringshjemler,
  IKvalitetsvurderingBooleans,
} from '@app/types/kaka-kvalitetsvurdering/v2';

const EMPTY_ARRAY: string[] = [];

interface AllRegistreringshjemlerProps {
  field: keyof IKvalitetsvurderingAllRegistreringshjemler;
  parentKey?: keyof IKvalitetsvurderingBooleans;
}

export const AllRegistreringshjemler = ({ field, parentKey }: AllRegistreringshjemlerProps) => {
  const { update, isLoading, kvalitetsvurdering } = useKvalitetsvurderingV2();
  const canEdit = useCanEdit();

  if (isLoading) {
    return null;
  }

  const show = parentKey === undefined || kvalitetsvurdering[parentKey];

  if (!show) {
    return null;
  }

  const onChange = (newHjemler: string[]) => update({ [field]: newHjemler });

  const selected = kvalitetsvurdering[field] ?? EMPTY_ARRAY;

  return (
    <>
      {canEdit ? (
        <LovhjemmelSelect onChange={onChange} selected={selected} showFjernAlle show openDirection="down">
          Velg hjemmel/hjemler
        </LovhjemmelSelect>
      ) : null}
      <SelectedHjemlerList selected={selected} />
    </>
  );
};
