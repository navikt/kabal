import { Box, CheckboxGroup, HStack, Radio } from '@navikt/ds-react';
import { Fragment } from 'react';
import {
  JA_NEI_LABELS,
  MAIN_REASON_LABELS,
  MainReason,
  OMGJØRING_HELP_TEXTS,
  OMGJØRING_LABELS,
  OmgjøringBoolean,
  OmgjøringErrorFields,
  OmgjøringSaksdataHjemlerList,
  YesNo,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/data';
import { OmgjøringHjemler } from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/hjemler';
import {
  useKvalitetsvurderingAnkeITRAfter2027State,
  useValidationError,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/hooks';
import { KvalitetsskjemaCheckbox } from '@/components/kvalitetsvurdering/common/kvalitetsvurdering-checkbox';
import { StyledRadioGroup } from '@/components/kvalitetsvurdering/common/styled-components';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { useCanEditBehandling } from '@/hooks/use-can-edit';

const OMGJØRING_FIELD = MainReason.OmgjøringIAnkeomgangen;
const OMGJØRING_HEADER = MAIN_REASON_LABELS[OMGJØRING_FIELD];

export const Omgjøring = () => {
  const { isSuccess, kvalitetsvurdering, update } = useKvalitetsvurderingAnkeITRAfter2027State();
  const canEdit = useCanEditBehandling();
  const validationError = useValidationError(OMGJØRING_FIELD);
  const groupValidationError = useValidationError(OmgjøringErrorFields.omgjøringGroup);

  if (!isSuccess) {
    return null;
  }

  const value = kvalitetsvurdering[OMGJØRING_FIELD];
  const checked = ÅRSAKER.filter(({ field }) => kvalitetsvurdering[field]).map(({ field }) => field);

  const onChange = (fields: OmgjøringBoolean[]) => {
    const changed = ÅRSAKER.find(({ field }) => kvalitetsvurdering[field] !== fields.includes(field));

    if (changed !== undefined) {
      update({ [changed.field]: fields.includes(changed.field) });
    }
  };

  return (
    <SectionWithHeading heading={OMGJØRING_HEADER} size="small">
      <StyledRadioGroup
        legend={OMGJØRING_HEADER}
        hideLegend
        value={value}
        error={validationError}
        onChange={(v: YesNo) => update({ [OMGJØRING_FIELD]: v })}
        id={OMGJØRING_FIELD}
      >
        <HStack gap="space-16" width="100%">
          <Radio value={YesNo.JA} disabled={!canEdit}>
            {JA_NEI_LABELS[YesNo.JA]}
          </Radio>
          <Radio value={YesNo.NEI} disabled={!canEdit}>
            {JA_NEI_LABELS[YesNo.NEI]}
          </Radio>
        </HStack>
      </StyledRadioGroup>

      {value === YesNo.JA ? (
        <Box marginBlock="space-0 space-1" marginInline="space-32 space-0">
          <CheckboxGroup
            legend="Hva er årsaken(e)?"
            value={checked}
            onChange={onChange}
            error={groupValidationError}
            id={OmgjøringErrorFields.omgjøringGroup}
          >
            {ÅRSAKER.map(({ field, hjemlerField }) => (
              <Fragment key={field}>
                <KvalitetsskjemaCheckbox field={field} helpText={OMGJØRING_HELP_TEXTS[field]}>
                  {OMGJØRING_LABELS[field]}
                </KvalitetsskjemaCheckbox>
                {kvalitetsvurdering[field] ? <OmgjøringHjemler field={hjemlerField} /> : null}
              </Fragment>
            ))}
          </CheckboxGroup>
        </Box>
      ) : null}
    </SectionWithHeading>
  );
};

const ÅRSAKER: { field: OmgjøringBoolean; hjemlerField: OmgjøringSaksdataHjemlerList }[] = [
  {
    field: OmgjøringBoolean.omgjøringFeilILovtolkningen,
    hjemlerField: OmgjøringSaksdataHjemlerList.omgjøringFeilILovtolkningenHjemlerList,
  },
  {
    field: OmgjøringBoolean.omgjøringFeilIFaktagrunnlaget,
    hjemlerField: OmgjøringSaksdataHjemlerList.omgjøringFeilIFaktagrunnlagetHjemlerList,
  },
  {
    field: OmgjøringBoolean.omgjøringFeilIRettsanvendelsen,
    hjemlerField: OmgjøringSaksdataHjemlerList.omgjøringFeilIRettsanvendelsenHjemlerList,
  },
];
