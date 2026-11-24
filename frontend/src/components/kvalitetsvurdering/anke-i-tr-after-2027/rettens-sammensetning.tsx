import { Radio } from '@navikt/ds-react';
import {
  getRettensSammensetningValidationField,
  KYNDIGE_MEDLEMMER_LABELS,
  KyndigeMedlemmer,
  RETTENS_SAMMENSETNING_LABELS,
  RETTENS_SAMMENSETNING_VALG_LABELS,
  RettensSammensetning,
  SECTION_LABELS,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/data';
import {
  useKvalitetsvurderingAnkeITRAfter2027State,
  useValidationError,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/hooks';
import { StyledRadioGroup } from '@/components/kvalitetsvurdering/common/styled-components';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { RettensSammensetningField, Section } from '@/types/kvalitetsvurdering/anke-i-tr-after-2027';

const RETTENS_SAMMENSETNING_HEADER = SECTION_LABELS[Section.RettensSammensetning];
const SAMMENSETNING_VALUES = Object.values(RettensSammensetning);
const KYNDIGE_VALUES = Object.values(KyndigeMedlemmer);
const SAMMENSETNING_VALIDATION_FIELD = getRettensSammensetningValidationField(
  RettensSammensetningField.RettensSammensetning,
);
const KYNDIGE_VALIDATION_FIELD = getRettensSammensetningValidationField(
  RettensSammensetningField.AttfoeringskyndigEllerMedisinskKyndig,
);

export const RettensSammensetningSection = () => {
  const { isSuccess, kvalitetsvurdering, update } = useKvalitetsvurderingAnkeITRAfter2027State();
  const canEdit = useCanEditBehandling();
  const sammensetningError = useValidationError(SAMMENSETNING_VALIDATION_FIELD);
  const kyndigeError = useValidationError(KYNDIGE_VALIDATION_FIELD);

  if (!isSuccess) {
    return null;
  }

  const { rettensSammensetning } = kvalitetsvurdering;

  return (
    <SectionWithHeading heading={RETTENS_SAMMENSETNING_HEADER} size="small">
      <StyledRadioGroup
        legend={RETTENS_SAMMENSETNING_LABELS[RettensSammensetningField.RettensSammensetning]}
        value={rettensSammensetning.rettensSammensetning}
        error={sammensetningError}
        onChange={(value: RettensSammensetning) =>
          update({ rettensSammensetning: { ...rettensSammensetning, rettensSammensetning: value } })
        }
        id={SAMMENSETNING_VALIDATION_FIELD}
      >
        {SAMMENSETNING_VALUES.map((v) => (
          <Radio key={v} value={v} disabled={!canEdit}>
            {RETTENS_SAMMENSETNING_VALG_LABELS[v]}
          </Radio>
        ))}
      </StyledRadioGroup>

      <StyledRadioGroup
        legend={RETTENS_SAMMENSETNING_LABELS[RettensSammensetningField.AttfoeringskyndigEllerMedisinskKyndig]}
        value={rettensSammensetning.attfoeringskyndigEllerMedisinskKyndig}
        error={kyndigeError}
        onChange={(value: KyndigeMedlemmer) =>
          update({ rettensSammensetning: { ...rettensSammensetning, attfoeringskyndigEllerMedisinskKyndig: value } })
        }
        id={KYNDIGE_VALIDATION_FIELD}
      >
        {KYNDIGE_VALUES.map((v) => (
          <Radio key={v} value={v} disabled={!canEdit}>
            {KYNDIGE_MEDLEMMER_LABELS[v]}
          </Radio>
        ))}
      </StyledRadioGroup>
    </SectionWithHeading>
  );
};
