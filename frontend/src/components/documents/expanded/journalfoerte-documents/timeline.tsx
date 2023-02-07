import { Next } from '@navikt/ds-icons';
import { Detail, Label } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { isoDateTimeToPretty } from '../../../../domain/date';
import { IArkivertDocument, Kanal, RelevantDatotype } from '../../../../types/arkiverte-documents';

export const Timeline = ({ relevanteDatoer, kanal }: IArkivertDocument) => {
  const lastIndex = relevanteDatoer.length - 1;

  return (
    <TimelineContainer>
      {relevanteDatoer.map((d, i) => (
        <TimelineItemContainer key={`${d.datotype}-${d.dato}`} {...d} kanal={kanal} isLast={i === lastIndex} />
      ))}
    </TimelineContainer>
  );
};

interface TimelineItemProps {
  dato: string;
  datotype: RelevantDatotype;
  isLast: boolean;
  kanal: Kanal;
}

const TimelineItemContainer = ({ dato, datotype, isLast, kanal }: TimelineItemProps) => (
  <TimelineItem $datoType={datotype}>
    <Title datotype={datotype} kanal={kanal} />
    <Detail>{isoDateTimeToPretty(dato)}</Detail>
    {isLast ? null : <NextArrow aria-hidden />}
  </TimelineItem>
);

interface TitleProps {
  datotype: RelevantDatotype;
  kanal: Kanal;
}

const Title = ({ datotype, kanal }: TitleProps) => {
  if (datotype === RelevantDatotype.DATO_EKSPEDERT || datotype === RelevantDatotype.DATO_REGISTRERT) {
    const [shortName, longName] = KANAL_NAME[kanal];

    return (
      <Label size="small">
        <span>{DATOTYPE_NAME[datotype]}</span> <span title={longName}>({shortName})</span>
      </Label>
    );
  }

  return (
    <Label size="small">
      <span>{DATOTYPE_NAME[datotype]}</span>
    </Label>
  );
};

const DATOTYPE_NAME: Record<RelevantDatotype, string> = {
  [RelevantDatotype.DATO_SENDT_PRINT]: 'Sendt print',
  [RelevantDatotype.DATO_EKSPEDERT]: 'Ekspedert',
  [RelevantDatotype.DATO_JOURNALFOERT]: 'Journalført',
  [RelevantDatotype.DATO_REGISTRERT]: 'Registrert',
  [RelevantDatotype.DATO_AVS_RETUR]: 'Avsender retur',
  [RelevantDatotype.DATO_DOKUMENT]: 'Opprettet',
  [RelevantDatotype.DATO_LEST]: 'Lest',
};

const KANAL_NAME: Record<Kanal, [string, string] | [string]> = {
  ALTINN: ['Altinn'],
  EIA: ['EIA'],
  NAV_NO: ['nav.no'],
  NAV_NO_UINNLOGGET: ['nav.no (uinnlogget)'],
  NAV_NO_CHAT: ['Innlogget chat'],
  SKAN_NETS: ['Skanning', 'Skanning Nets'],
  SKAN_PEN: ['Skanning', 'Skanning Pensjon'],
  SKAN_IM: ['Skanning', 'Skanning Iron Mountain'],
  INNSENDT_NAV_ANSATT: ['Innsendt av NAV-ansatt'],
  EESSI: ['EESSI'],
  EKST_OPPS: ['Eksternt oppslag'],
  SENTRAL_UTSKRIFT: ['Sentral utskrift'],
  LOKAL_UTSKRIFT: ['Lokal utskrift'],
  SDP: ['SDP', 'Digital postkasse til innbyggere'],
  TRYGDERETTEN: ['Trygderetten'],
  HELSENETTET: ['Helsenettet'],
  INGEN_DISTRIBUSJON: ['Ingen distribusjon'],
  DPV: ['DPV', 'Digital Post til Virksomhet'],
  DPVS: ['DPVS', 'Digital Post til Virksomhet (sensitiv)'],
  UKJENT: ['Ukjent'],
};

const getBackgroundColor = (datotype: RelevantDatotype) => {
  switch (datotype) {
    case RelevantDatotype.DATO_SENDT_PRINT:
      return 'var(--a-orange-50)';
    case RelevantDatotype.DATO_EKSPEDERT:
      return 'var(--a-deepblue-50)';
    case RelevantDatotype.DATO_JOURNALFOERT:
      return 'var(--a-blue-50)';
    case RelevantDatotype.DATO_REGISTRERT:
      return 'var(--a-purple-50)';
    case RelevantDatotype.DATO_AVS_RETUR:
      return 'var(--a-red-50)';
    case RelevantDatotype.DATO_DOKUMENT:
      return 'var(--a-green-50)';
    case RelevantDatotype.DATO_LEST:
      return 'var(--a-limegreen-50)';
  }
};

const TimelineContainer = styled.ol`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
`;

interface TimelineItemStyleProps {
  $datoType: RelevantDatotype;
}

const TimelineItem = styled.li<TimelineItemStyleProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  padding: 4px;
  border: 1px solid var(--a-border-default);
  border-radius: 4px;
  background-color: ${({ $datoType }) => getBackgroundColor($datoType)};
  white-space: nowrap;
`;

const NextArrow = styled(Next)`
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%) translateX(-22.5%);
  width: 16px;
`;
