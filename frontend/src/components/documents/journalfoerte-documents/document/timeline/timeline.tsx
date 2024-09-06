import { styled } from 'styled-components';
import { IArkivertDocument, Journalposttype, TimelineTypes } from '@app/types/arkiverte-documents';
import { EkspedertItems } from './ekspedert-items';
import { RelevantDateTimelineItem } from './timeline-item';

export const Timeline = ({ timeline, journalposttype, utsendingsinfo, kanal, kanalnavn }: IArkivertDocument) => {
  const lastIndex = timeline.length - 1;

  return (
    <TimelineContainer>
      {timeline.map(({ type, timestamp }, index) => {
        const key = `${type}-${timestamp}`;
        const isLast = index === lastIndex;

        if (type === TimelineTypes.EKSPEDERT && journalposttype === Journalposttype.UTGAAENDE) {
          return (
            <EkspedertItems
              key={key}
              type={type}
              timestamp={timestamp}
              utsendingsinfo={utsendingsinfo}
              kanal={kanal}
              kanalnavn={kanalnavn}
              isLast={isLast}
            />
          );
        }

        return <RelevantDateTimelineItem key={key} type={type} timestamp={timestamp} hideNext={isLast} />;
      })}
    </TimelineContainer>
  );
};

const TimelineContainer = styled.ol`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: var(--a-spacing-2);
  padding: 0;
`;
