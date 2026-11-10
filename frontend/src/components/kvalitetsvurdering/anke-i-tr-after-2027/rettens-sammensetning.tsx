import { Radio } from '@navikt/ds-react';
import {
  KYNDIGE_MEDLEMMER_LABELS,
  KyndigeMedlemmer,
  MAIN_REASON_LABELS,
  MainReason,
  RETTENS_SAMMENSETNING_LABELS,
  RETTENS_SAMMENSETNING_VALG_LABELS,
  RettensSammensetning,
  RettensSammensetningFields,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/data';
import {
  useKvalitetsvurderingAnkeITRAfter2027State,
  useValidationError,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/hooks';
import { StyledRadioGroup } from '@/components/kvalitetsvurdering/common/styled-components';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { useCanEditBehandling } from '@/hooks/use-can-edit';

const RETTENS_SAMMENSETNING_HEADER = MAIN_REASON_LABELS[MainReason.RettensSammensetning];
const SAMMENSETNING_FIELD = RettensSammensetningFields.hvilkenSammensetningHaddeRetten;
const KYNDIGE_FIELD = RettensSammensetningFields.varRettenSattMedAttføringskyndigEllerMedisinskKyndigMedlem;

const SAMMENSETNING_VALUES = Object.values(RettensSammensetning);
const KYNDIGE_VALUES = Object.values(KyndigeMedlemmer);

export const RettensSammensetningSection = () => {
  const { isLoading, kvalitetsvurdering, update } = useKvalitetsvurderingAnkeITRAfter2027State();
  const canEdit = useCanEditBehandling();
  const sammensetningError = useValidationError(SAMMENSETNING_FIELD);
  const kyndigeError = useValidationError(KYNDIGE_FIELD);

  if (isLoading) {
    return null;
  }

  return (
    <SectionWithHeading heading={RETTENS_SAMMENSETNING_HEADER} size="small">
      <StyledRadioGroup
        legend={RETTENS_SAMMENSETNING_LABELS[SAMMENSETNING_FIELD]}
        value={kvalitetsvurdering[SAMMENSETNING_FIELD]}
        error={sammensetningError}
        onChange={(v: RettensSammensetning) => update({ [SAMMENSETNING_FIELD]: v })}
        id={SAMMENSETNING_FIELD}
      >
        {SAMMENSETNING_VALUES.map((v) => (
          <Radio key={v} value={v} disabled={!canEdit}>
            {RETTENS_SAMMENSETNING_VALG_LABELS[v]}
          </Radio>
        ))}
      </StyledRadioGroup>

      <StyledRadioGroup
        legend={RETTENS_SAMMENSETNING_LABELS[KYNDIGE_FIELD]}
        value={kvalitetsvurdering[KYNDIGE_FIELD]}
        error={kyndigeError}
        onChange={(v: KyndigeMedlemmer) => update({ [KYNDIGE_FIELD]: v })}
        id={KYNDIGE_FIELD}
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
