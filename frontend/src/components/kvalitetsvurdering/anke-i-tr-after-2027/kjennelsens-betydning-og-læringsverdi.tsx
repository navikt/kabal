import { HelpText, HStack, Radio } from '@navikt/ds-react';
import {
  getKjennelsensBetydningValidationField,
  KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_HELP_TEXTS,
  KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_LABELS,
  SECTION_LABELS,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/data';
import {
  useKvalitetsvurderingAnkeITRAfter2027State,
  useValidationError,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/hooks';
import { StyledRadioGroup } from '@/components/kvalitetsvurdering/common/styled-components';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { KjennelsensBetydningField, Section } from '@/types/kvalitetsvurdering/anke-i-tr-after-2027';

const KJENNELSENS_BETYDNING_HEADER = SECTION_LABELS[Section.KjennelsensBetydningOgLaeringsverdi];
const KJENNELSENS_BETYDNING_FIELDS = Object.values(KjennelsensBetydningField);

export const KjennelsensBetydningOgLæringsverdi = () => {
  const { isSuccess, kvalitetsvurdering, update } = useKvalitetsvurderingAnkeITRAfter2027State();

  if (!isSuccess) {
    return null;
  }

  const { kjennelsensBetydningOgLaeringsverdi } = kvalitetsvurdering;

  return (
    <SectionWithHeading heading={KJENNELSENS_BETYDNING_HEADER} size="small">
      {KJENNELSENS_BETYDNING_FIELDS.map((field) => (
        <JaNeiQuestion
          key={field}
          field={field}
          value={kjennelsensBetydningOgLaeringsverdi[field]}
          onChange={(value) =>
            update({
              kjennelsensBetydningOgLaeringsverdi: {
                ...kjennelsensBetydningOgLaeringsverdi,
                [field]: value,
              },
            })
          }
        />
      ))}
    </SectionWithHeading>
  );
};

interface JaNeiQuestionProps {
  field: KjennelsensBetydningField;
  value: boolean | null;
  onChange: (value: boolean) => void;
}

const JaNeiQuestion = ({ field, value, onChange }: JaNeiQuestionProps) => {
  const validationField = getKjennelsensBetydningValidationField(field);
  const canEdit = useCanEditBehandling();
  const validationError = useValidationError(validationField);

  return (
    <StyledRadioGroup
      legend={
        <span className="[&_.aksel-help-text]:inline-flex [&_.aksel-help-text]:align-middle">
          {KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_LABELS[field]}
          <HelpText className="ml-1">{KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_HELP_TEXTS[field]}</HelpText>
        </span>
      }
      value={value}
      error={validationError}
      onChange={onChange}
      id={validationField}
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
  );
};
