import { KvalitetsskjemaCheckbox } from '@app/components/kvalitetsvurdering/common/kvalitetsvurdering-checkbox';
import { AllRegistreringshjemler } from '@app/components/kvalitetsvurdering/v3/common/all-registreringshjemler';
import { Oppgavehjemler } from '@app/components/kvalitetsvurdering/v3/common/oppgavehjemler';
import { KvalitetsskjemaTextarea } from '@app/components/kvalitetsvurdering/v3/common/textarea';
import type { CheckboxParams, InputParams } from '@app/components/kvalitetsvurdering/v3/common/types';
import { type GroupErrorField, TypeEnum } from '@app/components/kvalitetsvurdering/v3/common/types';
import { useKvalitetsvurderingV3 } from '@app/components/kvalitetsvurdering/v3/common/use-kvalitetsvurdering-v3';
import { useValidationError } from '@app/components/kvalitetsvurdering/v3/common/use-validation-error';
import type { KvalitetsvurderingDataV3, KvalitetsvurderingV3Boolean } from '@app/types/kaka-kvalitetsvurdering/v3';
import { BoxNew, CheckboxGroup } from '@navikt/ds-react';
import { useMemo } from 'react';

interface Props {
  kvalitetsvurdering: KvalitetsvurderingDataV3;
  update: (data: Partial<KvalitetsvurderingDataV3>) => void;
  childList: InputParams[];
  groupErrorField?: GroupErrorField;
  hideLegend?: boolean;
  label: string;
  parentKey?: keyof KvalitetsvurderingV3Boolean;
}

export const Checkboxes = ({
  kvalitetsvurdering,
  label,
  update,
  childList,
  groupErrorField,
  hideLegend,
  parentKey,
}: Props) => {
  const allFields = useMemo(() => getFields(childList), [childList]);
  const value = useMemo(() => allFields.filter((f) => kvalitetsvurdering[f]), [allFields, kvalitetsvurdering]);
  const error = useValidationError(groupErrorField);

  const onChange = (fields: string[]) => {
    for (const field of allFields) {
      const isFieldChecked = fields.includes(field);
      const hasChange = kvalitetsvurdering[field] !== isFieldChecked;

      if (hasChange) {
        update({ [field]: isFieldChecked });
        break;
      }
    }
  };

  return (
    <BoxNew marginBlock="0 4" marginInline="8 0">
      <CheckboxGroup
        legend={label}
        hideLegend={hideLegend}
        value={value}
        onChange={onChange}
        error={error}
        id={groupErrorField}
      >
        {childList.map((m) => {
          if (isCheckbox(m)) {
            return <Checkbox key={m.field} checkbox={m} />;
          }

          return <KvalitetsskjemaTextarea key={m.field} {...m} parentKey={parentKey} />;
        })}
      </CheckboxGroup>
    </BoxNew>
  );
};

interface CheckboxProps {
  checkbox: CheckboxParams;
}

const Checkbox = ({ checkbox }: CheckboxProps) => {
  const { field, label, helpText, saksdatahjemler, allRegistreringshjemler, childList, groupErrorField } = checkbox;

  const { kvalitetsvurdering, isLoading, update } = useKvalitetsvurderingV3();

  if (isLoading) {
    return null;
  }

  const show = childList !== undefined && childList.length > 0 && kvalitetsvurdering[field] === true;

  return (
    <>
      <KvalitetsskjemaCheckbox field={field} helpText={helpText}>
        {label}
      </KvalitetsskjemaCheckbox>
      {typeof saksdatahjemler === 'undefined' ? null : <Oppgavehjemler field={saksdatahjemler} parentKey={field} />}
      {typeof allRegistreringshjemler === 'undefined' ? null : (
        <AllRegistreringshjemler field={allRegistreringshjemler} parentKey={field} />
      )}
      {show ? (
        <Checkboxes
          kvalitetsvurdering={kvalitetsvurdering}
          childList={childList}
          label={label}
          hideLegend
          groupErrorField={groupErrorField}
          update={update}
          parentKey={field}
        />
      ) : null}
    </>
  );
};

const getFields = (checkboxes: InputParams[]): (keyof KvalitetsvurderingV3Boolean)[] =>
  checkboxes.filter(isCheckbox).flatMap((checkbox) => [checkbox.field, ...getFields(checkbox.childList ?? [])]);

const isCheckbox = (checkbox: InputParams): checkbox is CheckboxParams => checkbox.type === TypeEnum.CHECKBOX;
