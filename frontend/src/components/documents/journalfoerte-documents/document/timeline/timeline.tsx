import { HStack } from '@navikt/ds-react';
import { EkspedertItems } from '@/components/documents/journalfoerte-documents/document/timeline/ekspedert-items';
import { RelevantDateTimelineItem } from '@/components/documents/journalfoerte-documents/document/timeline/timeline-item';
import { type IArkivertDocument, Journalposttype, TimelineTypes } from '@/types/arkiverte-documents';

export const Timeline = ({ timeline, journalposttype, utsendingsinfo, kanal, kanalnavn }: IArkivertDocument) => {
  const lastIndex = timeline.length - 1;

  return (
    <HStack wrap={false} gap="space-8" as="ol">
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
