import { CheckboxGroup } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { IKvalitetsvurderingData } from '@app/types/kaka-kvalitetsvurdering/v2';
import { Hjemler } from './hjemler';
import { KvalitetsskjemaCheckbox } from './kvalitetsvurdering-checkbox';
import { SubSection } from './styled-components';
import { ICheckboxParams } from './types';
import { KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES } from './use-field-name';
import { useKvalitetsvurderingV2 } from './use-kvalitetsvurdering-v2';
import { useValidationError } from './use-validation-error';

interface Props {
  kvalitetsvurdering: IKvalitetsvurderingData;
  update: (data: Partial<IKvalitetsvurderingData>) => void;
  checkboxes: ICheckboxParams[];
  show: boolean;
  groupErrorField?: keyof typeof KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES;
  hideLegend?: boolean;
  label: string;
}

export const Checkboxes = ({
  kvalitetsvurdering,
  label,
  update,
  checkboxes,
  show,
  groupErrorField,
  hideLegend,
}: Props) => {
  const allFields = useMemo(() => getFields(checkboxes), [checkboxes]);
  const value = useMemo(() => allFields.filter((f) => kvalitetsvurdering[f]), [allFields, kvalitetsvurdering]);
  const error = useValidationError(groupErrorField);

  if (!show) {
    return null;
  }

  const onChange = (fields: string[]) => {
    const newFields = allFields.reduce((acc, field) => {
      const isFieldChecked = fields.includes(field);

      if (kvalitetsvurdering[field] === isFieldChecked) {
        return acc;
      }

      return { ...acc, [field]: isFieldChecked };
    }, {});
    update(newFields);
  };

  return (
    <SubSection>
      <CheckboxGroup
        legend={label}
        hideLegend={hideLegend}
        value={value}
        onChange={onChange}
        error={error}
        id={groupErrorField}
      >
        {checkboxes.map((m) => (
          <Checkbox key={m.field} {...m} />
        ))}
      </CheckboxGroup>
    </SubSection>
  );
};

const Checkbox = ({ field, label, helpText, hjemler, checkboxes, groupErrorField }: ICheckboxParams) => {
  const { kvalitetsvurdering, isLoading, update } = useKvalitetsvurderingV2();

  if (isLoading) {
    return null;
  }

  return (
    <>
      <KvalitetsskjemaCheckbox field={field} helpText={helpText}>
        {label}
      </KvalitetsskjemaCheckbox>
      {typeof hjemler === 'undefined' ? null : <Hjemler field={hjemler} show={kvalitetsvurdering[field]} />}
      {typeof checkboxes === 'undefined' ? null : (
        <Checkboxes
          kvalitetsvurdering={kvalitetsvurdering}
          checkboxes={checkboxes}
          show={kvalitetsvurdering[field]}
          label={label}
          hideLegend
          groupErrorField={groupErrorField}
          update={update}
        />
      )}
    </>
  );
};

const getFields = (checkboxes: ICheckboxParams[]): ICheckboxParams['field'][] =>
  checkboxes.flatMap((checkbox) => [checkbox.field, ...getFields(checkbox.checkboxes ?? [])]);
