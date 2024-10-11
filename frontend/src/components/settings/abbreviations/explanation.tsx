import { AbbrevationExample } from '@app/components/settings/abbreviations/example';
import { format } from '@app/components/settings/abbreviations/format';
import { ExpansionTypeEnum } from '@app/components/settings/abbreviations/types';
import { pushEvent } from '@app/observability';
import { BodyShort, ReadMore } from '@navikt/ds-react';
import { useCallback } from 'react';

export const AbbreviationsExplanation = () => {
  const onOpenChange = useCallback((open: boolean) => {
    if (open) {
      pushEvent('open-abbreviations-explanation', 'abbreviations');
    }
  }, []);

  return (
    <ReadMore size="small" header="Forklaring av forkortelser" onOpenChange={onOpenChange}>
      <BodyShort size="small" spacing>
        Forkortelser er tegn som Kabal automatisk vil utvide til langformen under skriving.
      </BodyShort>

      <BodyShort size="small" spacing>
        <strong>Det fungerer veldig likt som i Word.</strong>
      </BodyShort>

      <BodyShort size="small" spacing>
        Kortversjonen kan ikke inneholde mellomrom. Men kan inneholde bokstaver, tall og spesialtegn.
      </BodyShort>

      <BodyShort size="small" spacing>
        Tall og spesialtegn i kortformen kan være en måte å tydelig skille forkortelser fra ord eller unngå konflikter
        på. F.eks. {format('k9')} til {format('kapittel 9 i folketrygdloven')} og {format('@om')} til{' '}
        {format('omsorgspenger')}.
      </BodyShort>

      <BodyShort size="small" spacing>
        Det anbefales å bruke kun <strong>små bokstaver, tall og spesialtegn i kortformen</strong>. Dvs. unngå store
        bokstaver. Kortformer som består helt eller delvis av store bokstaver vil ikke støtte kontroll over store og små
        bokstaver. Se eksempler under.
      </BodyShort>

      <BodyShort size="small" spacing>
        Det anbefales å bruke <strong>liten forbokstav i langformen</strong>, med mindre langformen <em>alltid</em> skal
        ha stor forbokstav.
      </BodyShort>

      <BodyShort size="small" spacing>
        <em>Kabal vil automatisk sette stor forbokstav dersom kortformen er starten av en setning.</em>
      </BodyShort>

      <AbbrevationExample
        title="Eksempel på kortform med kun små bokstaver"
        recommended
        examples={[
          { short: 'aap', long: 'Arbeidsavklaringspenger', cap: ExpansionTypeEnum.AutoCap },
          { short: 'Aap', long: 'Arbeidsavklaringspenger', cap: ExpansionTypeEnum.AlwaysCap },
          { short: 'AAP', long: 'ARBEIDSAVKLARINGSPENGER', cap: ExpansionTypeEnum.AlwaysAllCaps },
        ]}
      >
        Kortform {format('aap')} med langform {format('arbeidsavklaringspenger')}
      </AbbrevationExample>

      <AbbrevationExample
        title="Eksempel på kortform med spesialtegn"
        recommended
        examples={[
          { short: '@om', long: 'Omsorgspenger', cap: ExpansionTypeEnum.AutoCap },
          { short: '@Om', long: 'Omsorgspenger', cap: ExpansionTypeEnum.AlwaysCap },
          { short: '@OM', long: 'OMSORGSPENGER', cap: ExpansionTypeEnum.AlwaysAllCaps },
        ]}
      >
        Kortform {format('@om')} med langform {format('omsorgspenger')}
      </AbbrevationExample>

      <AbbrevationExample
        title="Eksempel på kortform med tall"
        recommended
        examples={[
          { short: 'k9', long: 'Kapittel 9 i folketrygdloven', cap: ExpansionTypeEnum.AutoCap },
          { short: 'K9', long: 'Kapittel 9 i folketrygdloven', cap: ExpansionTypeEnum.AlwaysCap },
        ]}
      >
        Kortform {format('k9')} med langform {format('kapittel 9 i folketrygdloven')}
      </AbbrevationExample>

      <AbbrevationExample
        title="Eksempel på kortform med kun store bokstaver"
        examples={[
          { short: 'AAP' },
          { short: 'Aap' },
          { short: 'aap', long: 'Arbeidsavklaringspenger', cap: ExpansionTypeEnum.AutoCap },
        ]}
      >
        Kortform {format('AAP')} med langform {format('arbeidsavklaringspenger')}
      </AbbrevationExample>

      <AbbrevationExample
        title="Eksempel på kortform med både store og små bokstaver"
        examples={[
          { short: 'aap' },
          { short: 'Aap', long: 'Arbeidsavklaringspenger', cap: ExpansionTypeEnum.AutoCap },
          { short: 'AAP' },
        ]}
      >
        Kortform {format('Aap')} med langform {format('arbeidsavklaringspenger')}
      </AbbrevationExample>

      <AbbrevationExample
        title="Eksempel på kortform med kun én bokstav"
        examples={[
          { short: 'x', long: 'Høyesterettsjustitiarius', cap: ExpansionTypeEnum.AutoCap },
          {
            short: 'X',
            long: 'Høyesterettsjustitiarius',
            cap: ExpansionTypeEnum.AlwaysCap,
            tag: 'Umulig å få bare store boktaver siden kortformen består av kun én bokstav.',
          },
        ]}
      >
        Kortform {format('x')} med langform {format('høyesterettsjustitiarius')}
      </AbbrevationExample>
    </ReadMore>
  );
};
