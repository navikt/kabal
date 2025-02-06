import { type IArkivertDocument, Journalposttype, TimelineTypes } from '@app/types/arkiverte-documents';
import { HStack } from '@navikt/ds-react';
import { EkspedertItems } from './ekspedert-items';
import { RelevantDateTimelineItem } from './timeline-item';

export const Timeline = ({ timeline, journalposttype, utsendingsinfo, kanal, kanalnavn }: IArkivertDocument) => {
  const lastIndex = timeline.length - 1;

  return (
    <HStack wrap={false} gap="2" as="ol">
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
    </HStack>
  );
};
