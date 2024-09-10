import { AbbrevationExample } from '@app/components/settings/abbreviations/example';
import { pushEvent } from '@app/observability';
import { BodyShort, ReadMore, Tag, Tooltip } from '@navikt/ds-react';
import { Fragment, useCallback } from 'react';

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
        på. F.eks. <b>«k9»</b> til <b>«kapittel 9 i folketrygdloven»</b> og <b>«@om»</b> til <b>«omsorgspenger»</b>.
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
          <Fragment key="1">
            <b>«aap»</b> blir utvidet til <b>«arbeidsavklaringspenger»</b>/<b>«Arbeidsavklaringspenger»</b>. <AutoCap />
          </Fragment>,
          <Fragment key="2">
            <b>«Aap»</b> blir utvidet til <b>«Arbeidsavklaringspenger»</b>. <AlwaysCap />
          </Fragment>,
          <Fragment key="3">
            <b>«AAP»</b> blir utvidet til <b>«ARBEIDSAVKLARINGSPENGER»</b>. <AlwaysAllCaps />
          </Fragment>,
        ]}
      >
        Kortform <b>«aap»</b> med langform <b>«arbeidsavklaringspenger»</b>
      </AbbrevationExample>

      <AbbrevationExample
        title="Eksempel på kortform med spesialtegn"
        recommended
        examples={[
          <Fragment key="1">
            <b>«@om»</b> blir utvidet til <b>«omsorgspenger»</b>/<b>«Omsorgspenger»</b>. <AutoCap />
          </Fragment>,
          <Fragment key="2">
            <b>«@Om»</b> blir utvidet til <b>«Omsorgspenger»</b>. <AlwaysCap />
          </Fragment>,
          <Fragment key="3">
            <b>«@OM»</b> blir utvidet til <b>«OMSORGSPENGER»</b>. <AlwaysAllCaps />
          </Fragment>,
        ]}
      >
        Kortform <b>«@om»</b> med langform <b>«omsorgspenger»</b>
      </AbbrevationExample>

      <AbbrevationExample
        title="Eksempel på kortform med tall"
        recommended
        examples={[
          <Fragment key="1">
            <b>«k9»</b> blir utvidet til <b>«kapittel 9 i folketrygdloven»</b>/<b>«Kapittel 9 i folketrygdloven»</b>.{' '}
            <AutoCap />
          </Fragment>,
          <Fragment key="2">
            <b>«K9»</b> blir utvidet til <b>«Kapittel 9 i folketrygdloven»</b>. <AlwaysCap />
          </Fragment>,
        ]}
      >
        Kortform <b>«k9»</b> med langform <b>«kapittel 9 i folketrygdloven»</b>
      </AbbrevationExample>

      <AbbrevationExample
        title="Eksempel på kortform med kun store bokstaver"
        examples={[
          <Fragment key="1">
            <b>«aap»</b> blir <NotRecognised />.
          </Fragment>,
          <Fragment key="2">
            <b>«Aap»</b> blir <NotRecognised />.
          </Fragment>,
          <Fragment key="3">
            <b>«AAP»</b> blir utvidet til <b>«arbeidsavklaringspenger»</b>/<b>«Arbeidsavklaringspenger»</b>. <AutoCap />
          </Fragment>,
        ]}
      >
        Kortform <b>«AAP»</b> med langform <b>«arbeidsavklaringspenger»</b>
      </AbbrevationExample>

      <AbbrevationExample
        title="Eksempel på kortform med både store og små bokstaver"
        examples={[
          <Fragment key="1">
            <b>«aap»</b> blir <NotRecognised />.
          </Fragment>,
          <Fragment key="2">
            <b>«Aap»</b> blir utvidet til <b>«arbeidsavklaringspenger»</b>/<b>«Arbeidsavklaringspenger»</b>. <AutoCap />
          </Fragment>,
          <Fragment key="3">
            <b>«AAP»</b> blir <NotRecognised />.
          </Fragment>,
        ]}
      >
        Kortform <b>«Aap»</b> med langform <b>«arbeidsavklaringspenger»</b>
      </AbbrevationExample>

      <AbbrevationExample
        title="Eksempel på kortform med kun én bokstav"
        examples={[
          <Fragment key="1">
            <b>«x»</b> blir utvidet til <b>«høyesterettsjustitiarius»</b>/<b>«Høyesterettsjustitiarius»</b>. <AutoCap />
          </Fragment>,
          <Fragment key="2">
            <b>«X»</b> blir utvidet til <b>«Høyesterettsjustitiarius»</b>. <AlwaysCap />
            <Tag variant="neutral" size="xsmall">
              Umulig å få bare store boktaver siden kortformen består av kun én bokstav.
            </Tag>
          </Fragment>,
        ]}
      >
        Kortform <b>«x»</b> med langform <b>«høyesterettsjustitiarius»</b>
      </AbbrevationExample>
    </ReadMore>
  );
};

const AutoCap = () => (
  <Tooltip content="Automatisk stor forbokstav på starten av en setning">
    <Tag variant="info" size="xsmall">
      Automatisk stor forbokstav
    </Tag>
  </Tooltip>
);

const AlwaysCap = () => (
  <Tag variant="info" size="xsmall">
    Alltid stor forbokstav
  </Tag>
);

const AlwaysAllCaps = () => (
  <Tag variant="info" size="xsmall">
    Alltid bare store bokstaver
  </Tag>
);

const NotRecognised = () => (
  <Tag variant="error" size="xsmall">
    Ikke gjenkjent
  </Tag>
);
