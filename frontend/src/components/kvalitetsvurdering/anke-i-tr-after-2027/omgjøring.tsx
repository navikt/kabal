import { Box, CheckboxGroup, HStack, Radio } from '@navikt/ds-react';
import { Fragment } from 'react';
import {
  OMGJØRING_HELP_TEXTS,
  OMGJØRING_LABELS,
  OmgjøringErrorFields,
  SECTION_LABELS,
  ValidationField,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/data';
import { OmgjøringHjemler } from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/hjemler';
import {
  useKvalitetsvurderingAnkeITRAfter2027State,
  useValidationError,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/hooks';
import { HelpTextCheckBox } from '@/components/kvalitetsvurdering/common/kvalitetsvurdering-checkbox';
import { StyledRadioGroup } from '@/components/kvalitetsvurdering/common/styled-components';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { OmgjøringHjemlerField, Section } from '@/types/kvalitetsvurdering/anke-i-tr-after-2027';

const OMGJØRING_HEADER = SECTION_LABELS[Section.OmgjortIAnkeomgangen];
const ÅRSAKER = Object.values(OmgjøringHjemlerField);

export const Omgjøring = () => {
  const { isSuccess, kvalitetsvurdering, update, hjemler } = useKvalitetsvurderingAnkeITRAfter2027State();
  const canEdit = useCanEditBehandling();
  const validationError = useValidationError(ValidationField.OmgjøringIAnkeomgangen);

  if (!isSuccess) {
    return null;
  }

  const { omgjortIAnkeomgangen } = kvalitetsvurdering;
  const value = omgjortIAnkeomgangen.vedtaketBurdeVaertOmgjortIAnkeomgangen;
  const checked = ÅRSAKER.filter((field) => omgjortIAnkeomgangen[field].selected);

  const onAnswerChange = (answer: boolean) =>
    update({ omgjortIAnkeomgangen: { ...omgjortIAnkeomgangen, vedtaketBurdeVaertOmgjortIAnkeomgangen: answer } });

  const onChange = (fields: OmgjøringHjemlerField[]) => {
    const changed = ÅRSAKER.find((field) => omgjortIAnkeomgangen[field].selected !== fields.includes(field));

    if (changed === undefined) {
      return;
    }

    const selector = omgjortIAnkeomgangen[changed];
    const selected = fields.includes(changed);
    const registreringshjemler = selected ? (hjemler.length === 1 ? hjemler : selector.registreringshjemler) : [];

    update({
      omgjortIAnkeomgangen: {
        ...omgjortIAnkeomgangen,
        [changed]: { selected, registreringshjemler },
      },
    });
  };

  return (
    <SectionWithHeading heading={OMGJØRING_HEADER} size="small">
      <StyledRadioGroup
        legend={OMGJØRING_HEADER}
        hideLegend
        value={value}
        error={value === true ? undefined : validationError}
        onChange={onAnswerChange}
        id={ValidationField.OmgjøringIAnkeomgangen}
      >
        <HStack gap="space-16" width="100%">
          <Radio value={true} disabled={!canEdit}>
            Ja
          </Radio>
          <Radio value={false} disabled={!canEdit}>
            Nei
          </Radio>
        </HStack>
      </StyledRadioGroup>

      {value === true ? (
        <Box marginBlock="space-0 space-1" marginInline="space-32 space-0">
          <CheckboxGroup
            legend="Hva er årsaken(e)?"
            value={checked}
            onChange={onChange}
            error={validationError}
            id={OmgjøringErrorFields.omgjøringGroup}
          >
            {ÅRSAKER.map((field) => (
              <Fragment key={field}>
                <HelpTextCheckBox value={field} disabled={!canEdit} helpText={OMGJØRING_HELP_TEXTS[field]}>
                  {OMGJØRING_LABELS[field]}
                </HelpTextCheckBox>
                {omgjortIAnkeomgangen[field].selected ? <OmgjøringHjemler field={field} /> : null}
              </Fragment>
            ))}
          </CheckboxGroup>
        </Box>
      ) : null}
    </SectionWithHeading>
  );
};
