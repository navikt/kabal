import { AllRegistreringshjemler } from '@app/components/kvalitetsvurdering/v2/common/all-registreringshjemler';
import { KvalitetsskjemaTextarea } from '@app/components/kvalitetsvurdering/v2/common/textarea';
import type { IKvalitetsvurderingBooleans, IKvalitetsvurderingData } from '@app/types/kaka-kvalitetsvurdering/v2';
import { CheckboxGroup } from '@navikt/ds-react';
import { useMemo } from 'react';
import { KvalitetsskjemaCheckbox } from './kvalitetsvurdering-checkbox';
import { Oppgavehjemler } from './oppgavehjemler';
import { SubSection } from './styled-components';
import { type CheckboxParams, type InputParams, KvalitetsvurderingInput } from './types';
import type { KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES } from './use-field-name';
import { useKvalitetsvurderingV2 } from './use-kvalitetsvurdering-v2';
import { useValidationError } from './use-validation-error';

interface Props {
  kvalitetsvurdering: IKvalitetsvurderingData;
  update: (data: Partial<IKvalitetsvurderingData>) => void;
  checkboxes: InputParams[];
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
        {checkboxes.map((m) => {
          if (isCheckbox(m)) {
            return <Checkbox key={m.field} {...m} />;
          }

          return <KvalitetsskjemaTextarea key={m.field} {...m} />;
        })}
      </CheckboxGroup>
    </SubSection>
  );
};

const Checkbox = ({
  field,
  label,
  helpText,
  saksdatahjemler,
  allRegistreringshjemler,
  checkboxes,
  groupErrorField,
}: CheckboxParams) => {
  const { kvalitetsvurdering, isLoading, update } = useKvalitetsvurderingV2();

  if (isLoading) {
    return null;
  }

  const show = checkboxes !== undefined && checkboxes.length !== 0 && kvalitetsvurdering[field] === true;

  return (
    <>
      <KvalitetsskjemaCheckbox field={field} helpText={helpText}>
        {label}
      </KvalitetsskjemaCheckbox>
      {typeof saksdatahjemler === 'undefined' ? null : <Oppgavehjemler field={saksdatahjemler} parentKey={field} />}
      {typeof allRegistreringshjemler === 'undefined' ? null : (
        <AllRegistreringshjemler field={allRegistreringshjemler} parentKey={field} />
      )}
      {typeof checkboxes === 'undefined' ? null : (
        <Checkboxes
          kvalitetsvurdering={kvalitetsvurdering}
          checkboxes={checkboxes}
          label={label}
          hideLegend
          groupErrorField={groupErrorField}
          update={update}
          show={show}
        />
      )}
    </>
  );
};

const getFields = (checkboxes: InputParams[]): (keyof IKvalitetsvurderingBooleans)[] =>
  checkboxes.filter(isCheckbox).flatMap((checkbox) => [checkbox.field, ...getFields(checkbox.checkboxes ?? [])]);

const isCheckbox = (checkbox: InputParams): checkbox is CheckboxParams =>
  checkbox.type === KvalitetsvurderingInput.CHECKBOX;
