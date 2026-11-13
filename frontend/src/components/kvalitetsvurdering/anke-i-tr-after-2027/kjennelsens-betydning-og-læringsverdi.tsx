import { HelpText, HStack, Radio } from '@navikt/ds-react';
import {
  JA_NEI_LABELS,
  KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_HELP_TEXTS,
  KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_LABELS,
  KjennelsensBetydningOgLæringsverdiFields,
  MAIN_REASON_LABELS,
  MainReason,
  YesNo,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/data';
import {
  useKvalitetsvurderingAnkeITRAfter2027State,
  useValidationError,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/hooks';
import { StyledRadioGroup } from '@/components/kvalitetsvurdering/common/styled-components';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { useCanEditBehandling } from '@/hooks/use-can-edit';

const KJENNELSENS_BETYDNING_HEADER = MAIN_REASON_LABELS[MainReason.KjennelsensBetydningOgLæringsverdi];
const KJENNELSENS_BETYDNING_FIELDS = Object.values(KjennelsensBetydningOgLæringsverdiFields);

export const KjennelsensBetydningOgLæringsverdi = () => {
  const { isSuccess, kvalitetsvurdering, update } = useKvalitetsvurderingAnkeITRAfter2027State();

  if (!isSuccess) {
    return null;
  }

  return (
    <SectionWithHeading heading={KJENNELSENS_BETYDNING_HEADER} size="small">
      {KJENNELSENS_BETYDNING_FIELDS.map((field) => (
        <JaNeiQuestion
          key={field}
          field={field}
          value={kvalitetsvurdering[field]}
          onChange={(value) => update({ [field]: value })}
        />
      ))}
    </SectionWithHeading>
  );
};

interface JaNeiQuestionProps {
  field: KjennelsensBetydningOgLæringsverdiFields;
  value: YesNo | null;
  onChange: (value: YesNo) => void;
}

const JaNeiQuestion = ({ field, value, onChange }: JaNeiQuestionProps) => {
  const canEdit = useCanEditBehandling();
  const validationError = useValidationError(field);

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
      id={field}
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
  );
};
