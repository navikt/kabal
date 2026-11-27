import { Box, CheckboxGroup, HStack, Radio } from '@navikt/ds-react';
import { Fragment } from 'react';
import {
  OMGJØRING_HELP_TEXTS,
  OMGJØRING_LABELS,
  OmgjøringErrorFields,
  SECTION_LABELS,
  ValidationField,
} from '@/components/kvalitetsvurdering/anke-after-2027/data';
import { OmgjøringHjemler } from '@/components/kvalitetsvurdering/anke-after-2027/hjemler';
import {
  useKvalitetsvurderingAnkeAfter2027State,
  useValidationError,
} from '@/components/kvalitetsvurdering/anke-after-2027/hooks';
import { HelpTextCheckBox } from '@/components/kvalitetsvurdering/common/kvalitetsvurdering-checkbox';
import { StyledRadioGroup } from '@/components/kvalitetsvurdering/common/styled-components';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { OmgjøringHjemlerField, Section } from '@/types/kvalitetsvurdering/anke-after-2027';

const OMGJØRING_HEADER = SECTION_LABELS[Section.OmgjortIKlageomgangen];
const ÅRSAKER = Object.values(OmgjøringHjemlerField);

export const Omgjøring = () => {
  const { isSuccess, kvalitetsvurdering, update, hjemler } = useKvalitetsvurderingAnkeAfter2027State();
  const canEdit = useCanEditBehandling();
  const validationError = useValidationError(ValidationField.OmgjøringIKlageomgangen);

  if (!isSuccess) {
    return null;
  }

  const { omgjortIKlageomgangen } = kvalitetsvurdering;
  const { vedtaketBurdeVaertOmgjortIKlageomgangen } = omgjortIKlageomgangen;
  const checked = ÅRSAKER.filter((field) => omgjortIKlageomgangen[field].selected);

  const onRadioChange = (answer: boolean) =>
    update({ omgjortIKlageomgangen: { ...omgjortIKlageomgangen, vedtaketBurdeVaertOmgjortIKlageomgangen: answer } });

  const onCheckboxChange = (fields: OmgjøringHjemlerField[]) => {
    const changed = ÅRSAKER.find((field) => omgjortIKlageomgangen[field].selected !== fields.includes(field));

    if (changed === undefined) {
      return;
    }

    const selected = fields.includes(changed);
    const registreringshjemler = selected
      ? hjemler.length === 1
        ? hjemler
        : omgjortIKlageomgangen[changed].registreringshjemler
      : [];

    update({
      omgjortIKlageomgangen: {
        ...omgjortIKlageomgangen,
        [changed]: { selected, registreringshjemler },
      },
    });
  };

  return (
    <SectionWithHeading heading={OMGJØRING_HEADER} size="small">
      <StyledRadioGroup
        legend={OMGJØRING_HEADER}
        hideLegend
        value={vedtaketBurdeVaertOmgjortIKlageomgangen}
        error={vedtaketBurdeVaertOmgjortIKlageomgangen === true ? undefined : validationError}
        onChange={onRadioChange}
        id={ValidationField.OmgjøringIKlageomgangen}
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

      {vedtaketBurdeVaertOmgjortIKlageomgangen === true ? (
        <Box marginBlock="space-0 space-1" marginInline="space-32 space-0">
          <CheckboxGroup
            legend="Hva er årsaken(e)?"
            value={checked}
            onChange={onCheckboxChange}
            error={validationError}
            id={OmgjøringErrorFields.omgjøringGroup}
          >
            {ÅRSAKER.map((field) => (
              <Fragment key={field}>
                <HelpTextCheckBox value={field} disabled={!canEdit} helpText={OMGJØRING_HELP_TEXTS[field]}>
                  {OMGJØRING_LABELS[field]}
                </HelpTextCheckBox>
                {omgjortIKlageomgangen[field].selected ? <OmgjøringHjemler field={field} /> : null}
              </Fragment>
            ))}
          </CheckboxGroup>
        </Box>
      ) : null}
    </SectionWithHeading>
  );
};
