import { PauseIcon, PencilIcon, PlayIcon } from '@navikt/aksel-icons';
import { Heading, TimelinePeriodProps, TimelineRowProps } from '@navikt/ds-react';
import { compareAsc, max, min, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { RedaktoerRichText } from '@app/components/redaktoer-rich-text/redaktoer-rich-text';
import { Time } from '@app/components/time/time';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { isRichText } from '@app/functions/is-rich-plain-text';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { SPELL_CHECK_LANGUAGES } from '@app/hooks/use-smart-editor-language';
import { useLazyGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { IRichText, IText } from '@app/types/texts/responses';

interface PeriodData extends TimelinePeriodProps {
  key: string;
  richText: IRichText['richText'];
}

interface RowData extends TimelineRowProps {
  key: string;
  periods: PeriodData[];
}

interface TimelineData {
  rows: RowData[];
  allRow: RowData;
}

export const useTimelineData = (
  maltekstseksjon: IMaltekstseksjon,
  setPinDate: (pinDate: Date) => void,
): TimelineData | null => {
  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const [getTextVersions] = useLazyGetTextVersionsQuery();

  useEffect(() => {
    const allTextsPromises = maltekstseksjon.textIdList.map((textId) => getTextVersions(textId).unwrap());

    Promise.all(allTextsPromises).then((allTextsVersions) => {
      const textRows: RowData[] = allTextsVersions
        .map<RowData | null>((textVersions) => {
          const reversedTextVersions = textVersions.filter(isRichText).toReversed();
          const [firstTextVersion] = reversedTextVersions;

          if (firstTextVersion === undefined) {
            return null;
          }

          return {
            key: firstTextVersion.id,
            label: firstTextVersion.title,
            periods: reversedTextVersions.map<PeriodData>((t, i) => {
              const next = reversedTextVersions[i + 1];

              const created = parseISO(t.created);
              const published = t.publishedDateTime === null ? null : parseISO(t.publishedDateTime);
              const nextStart =
                next === undefined || next.publishedDateTime === null ? null : parseISO(next.publishedDateTime);

              const { status, icon } = getStatusAndIcon(t);

              return {
                key: t.versionId,
                richText: t.richText,
                start: published ?? created,
                end: nextStart ?? new Date(),
                status,
                icon,
                statusLabel: t.title,
                children: <PeriodContent text={t} created={created} published={published} end={nextStart} />,
              };
            }),
          };
        })
        .filter(isNotNull);

      const allPeriods = textRows.flatMap((row) => row.periods).toSorted((a, b) => compareAsc(a.start, b.start));
      const lastIndex = allPeriods.length - 1;

      const allRow: RowData = {
        key: maltekstseksjon.id,
        label: maltekstseksjon.title,
        periods: allPeriods.map<PeriodData>((p, i) => {
          const next = allPeriods[i + 1];
          const end = next === undefined ? p.end : min([p.end, next.start]);
          const isPublished = maltekstseksjon.published && i === lastIndex;

          return {
            key: `all-${p.key}`,
            richText: p.richText,
            start: p.start,
            end,
            status: isPublished ? 'info' : 'neutral',
            icon: isPublished ? <PlayIcon aria-hidden /> : <PauseIcon aria-hidden />,
            onSelectPeriod: () => setPinDate(max([p.start, maltekstseksjon.publishedDateTime ?? new Date()])),
          };
        }),
      };

      setTimeline({ rows: textRows, allRow });
    });
  }, [getTextVersions, maltekstseksjon, setPinDate]);

  return timeline;
};

interface StatusAndIcon {
  status: TimelinePeriodProps['status'];
  icon: React.ReactNode;
}

const getStatusAndIcon = (version: IMaltekstseksjon | IText): StatusAndIcon => {
  if (version.published) {
    return { status: 'info', icon: <PlayIcon aria-hidden /> };
  }

  if (version.publishedDateTime === null) {
    return { status: 'warning', icon: <PencilIcon aria-hidden /> };
  }

  return { status: 'neutral', icon: <PauseIcon aria-hidden /> };
};

interface PeriodContentProps extends TimeSpanProps {
  text: IText;
}

const PeriodContent = ({ text, ...timeSpanProps }: PeriodContentProps) => {
  const lang = useRedaktoerLanguage();

  return (
    <section>
      <Heading level="1" size="xsmall">
        {text.title}
      </Heading>
      <TimeSpan {...timeSpanProps} />
      {isRichText(text) ? (
        <RedaktoerRichText
          editorId={text.versionId}
          savedContent={text.richText[lang] ?? []}
          readOnly
          lang={SPELL_CHECK_LANGUAGES[lang]}
        />
      ) : null}
    </section>
  );
};

interface TimeSpanProps {
  created: Date;
  published: Date | null;
  end: Date | null;
}

const TimeSpan = ({ created, published, end }: TimeSpanProps) => {
  if (published === null) {
    return (
      <span>
        Utkast opprettet <StyledTime date={created} />.
      </span>
    );
  }

  if (end === null) {
    return (
      <span>
        Nåværende aktive versjon. Publisert <StyledTime date={published} />.
      </span>
    );
  }

  return (
    <span>
      Tidligere aktiv version fra <StyledTime date={published} /> til <StyledTime date={end} />.
    </span>
  );
};

const StyledTime = styled(Time)`
  font-weight: bold;
`;
