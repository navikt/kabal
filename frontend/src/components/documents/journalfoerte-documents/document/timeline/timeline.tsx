import React, { useMemo } from 'react';
import { styled } from 'styled-components';
import { IArkivertDocument, Journalposttype, RelevantDatotype } from '@app/types/arkiverte-documents';
import { EkspedertItems } from './ekspedert-items';
import { RelevantDateTimelineItem } from './timeline-item';

export const Timeline = ({ relevanteDatoer, journalposttype, utsendingsinfo, kanal, kanalnavn }: IArkivertDocument) => {
  const lastIndex = relevanteDatoer.length - 1;

  const sorted = useMemo(() => [...relevanteDatoer].sort((a, b) => a.dato.localeCompare(b.dato)), [relevanteDatoer]);

  return (
    <TimelineContainer>
      {sorted.map(({ datotype, dato }, index) => {
        const key = `${datotype}-${dato}`;
        const isLast = index === lastIndex;

        if (datotype === RelevantDatotype.DATO_EKSPEDERT && journalposttype === Journalposttype.UTGAAENDE) {
          return (
            <EkspedertItems
              key={key}
              datotype={datotype}
              dato={dato}
              utsendingsinfo={utsendingsinfo}
              kanal={kanal}
              kanalnavn={kanalnavn}
              isLast={isLast}
            />
          );
        }

        return <RelevantDateTimelineItem key={key} datotype={datotype} dato={dato} hideNext={isLast} />;
      })}
    </TimelineContainer>
  );
};

const TimelineContainer = styled.ol`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 8px;
  padding: 0;
`;
