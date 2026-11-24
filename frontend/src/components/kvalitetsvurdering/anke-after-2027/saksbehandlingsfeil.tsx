import { CheckboxGroup } from '@navikt/ds-react';
import {
  SAKSBEHANDLINGSFEIL_HELP_TEXTS,
  SAKSBEHANDLINGSFEIL_LABELS,
  SECTION_LABELS,
} from '@/components/kvalitetsvurdering/anke-after-2027/data';
import { useKvalitetsvurderingAnkeAfter2027State } from '@/components/kvalitetsvurdering/anke-after-2027/hooks';
import { HelpTextCheckBox } from '@/components/kvalitetsvurdering/common/kvalitetsvurdering-checkbox';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { SaksbehandlingsfeilField, Section } from '@/types/kvalitetsvurdering/anke-after-2027';

const SAKSBEHANDLINGSFEIL_HEADER = SECTION_LABELS[Section.SaksbehandlingsfeilIKlageomgangen];
const SAKSBEHANDLINGSFEIL_FIELDS = Object.values(SaksbehandlingsfeilField);

export const Saksbehandlingsfeil = () => {
  const { isSuccess, kvalitetsvurdering, update } = useKvalitetsvurderingAnkeAfter2027State();
  const canEdit = useIsTildeltSaksbehandler();

  if (!isSuccess) {
    return null;
  }

  const { saksbehandlingsfeilIKlageomgangen } = kvalitetsvurdering;
  const checked = SAKSBEHANDLINGSFEIL_FIELDS.filter((field) => saksbehandlingsfeilIKlageomgangen[field]);

  const onChange = (fields: SaksbehandlingsfeilField[]) => {
    const changed = SAKSBEHANDLINGSFEIL_FIELDS.find(
      (field) => saksbehandlingsfeilIKlageomgangen[field] !== fields.includes(field),
    );

    if (changed === undefined) {
      return;
    }

    update({
      saksbehandlingsfeilIKlageomgangen: {
        ...saksbehandlingsfeilIKlageomgangen,
        [changed]: fields.includes(changed),
      },
    });
  };

  return (
    <SectionWithHeading heading={SAKSBEHANDLINGSFEIL_HEADER} size="small">
      <CheckboxGroup legend={SAKSBEHANDLINGSFEIL_HEADER} hideLegend value={checked} onChange={onChange}>
        {SAKSBEHANDLINGSFEIL_FIELDS.map((field) => (
          <HelpTextCheckBox
            key={field}
            value={field}
            disabled={!canEdit}
            helpText={SAKSBEHANDLINGSFEIL_HELP_TEXTS[field]}
          >
            {SAKSBEHANDLINGSFEIL_LABELS[field]}
          </HelpTextCheckBox>
        ))}
      </CheckboxGroup>
    </SectionWithHeading>
  );
};
