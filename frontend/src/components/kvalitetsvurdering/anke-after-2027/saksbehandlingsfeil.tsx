import { CheckboxGroup } from '@navikt/ds-react';
import {
  MAIN_REASON_LABELS,
  MainReason,
  SAKSBEHANDLINGSFEIL_HELP_TEXTS,
  SAKSBEHANDLINGSFEIL_LABELS,
  SaksbehandlingsfeilBoolean,
} from '@/components/kvalitetsvurdering/anke-after-2027/data';
import { useKvalitetsvurderingAnkeAfter2027State } from '@/components/kvalitetsvurdering/anke-after-2027/hooks';
import { KvalitetsskjemaCheckbox } from '@/components/kvalitetsvurdering/common/kvalitetsvurdering-checkbox';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';

const SAKSBEHANDLINGSFEIL_HEADER = MAIN_REASON_LABELS[MainReason.Saksbehandlingsfeil];
const SAKSBEHANDLINGSFEIL_FIELDS = Object.values(SaksbehandlingsfeilBoolean);

export const Saksbehandlingsfeil = () => {
  const { isSuccess, kvalitetsvurdering, update } = useKvalitetsvurderingAnkeAfter2027State();

  if (!isSuccess) {
    return null;
  }

  const checked = SAKSBEHANDLINGSFEIL_FIELDS.filter((field) => kvalitetsvurdering[field]);

  const onChange = (fields: SaksbehandlingsfeilBoolean[]) => {
    const changed = SAKSBEHANDLINGSFEIL_FIELDS.find((field) => kvalitetsvurdering[field] !== fields.includes(field));

    if (changed !== undefined) {
      update({ [changed]: fields.includes(changed) });
    }
  };

  return (
    <SectionWithHeading heading={SAKSBEHANDLINGSFEIL_HEADER} size="small">
      <CheckboxGroup legend={SAKSBEHANDLINGSFEIL_HEADER} hideLegend value={checked} onChange={onChange}>
        {SAKSBEHANDLINGSFEIL_FIELDS.map((field) => (
          <KvalitetsskjemaCheckbox key={field} field={field} helpText={SAKSBEHANDLINGSFEIL_HELP_TEXTS[field]}>
            {SAKSBEHANDLINGSFEIL_LABELS[field]}
          </KvalitetsskjemaCheckbox>
        ))}
      </CheckboxGroup>
    </SectionWithHeading>
  );
};
