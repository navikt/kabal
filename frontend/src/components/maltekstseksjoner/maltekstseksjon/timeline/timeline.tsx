/* eslint-disable max-lines */
import { Alert, Button, DatePicker, Modal, Tag, Timeline } from '@navikt/ds-react';
import { format, parseISO } from 'date-fns';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { PRETTY_DATETIME_FORMAT } from '@app/components/date-picker/constants';
import { PinTime } from '@app/components/maltekstseksjoner/maltekstseksjon/timeline/pin-time';
import { useTimelineData } from '@app/components/maltekstseksjoner/maltekstseksjon/timeline/use-timeline';
import { RedaktoerRichText } from '@app/components/redaktoer-rich-text/redaktoer-rich-text';
import { isoDateTimeToPretty } from '@app/domain/date';
import { omit } from '@app/functions/omit';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { SPELL_CHECK_LANGUAGES } from '@app/hooks/use-smart-editor-language';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';

interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

interface MaltekstHistoryProps {
  maltekstseksjon: IMaltekstseksjon;
  nextMaltekstseksjonDate?: string | null;
}

export const MaltekstHistoryModal = (props: MaltekstHistoryProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button size="small" variant="tertiary" onClick={() => modalRef.current?.showModal()}>
        Vis tidslinje
      </Button>
      <Modal ref={modalRef} header={{ heading: 'Tidslinje' }} closeOnBackdropClick width="100%">
        <Modal.Body>
          <MaltekstHistory {...props} />
        </Modal.Body>
      </Modal>
    </>
  );
};

const MaltekstHistory = ({ maltekstseksjon, nextMaltekstseksjonDate }: MaltekstHistoryProps) => {
  const lang = useRedaktoerLanguage();
  const [pinDate, setPinDate] = useState<Date>(new Date());

  const hasNextMaltekstseksjon = typeof nextMaltekstseksjonDate === 'string';

  const initialStartDate = useMemo(
    () =>
      maltekstseksjon.publishedDateTime === null
        ? parseISO(maltekstseksjon.created)
        : parseISO(maltekstseksjon.publishedDateTime),
    [maltekstseksjon.created, maltekstseksjon.publishedDateTime],
  );

  const [startDate, setStartDate] = useState<Date>(initialStartDate);

  const initialEndDate = useMemo(
    () => (hasNextMaltekstseksjon ? parseISO(nextMaltekstseksjonDate) : undefined),
    [hasNextMaltekstseksjon, nextMaltekstseksjonDate],
  );

  const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate);

  const data = useTimelineData(maltekstseksjon, setPinDate);

  const onSelectRange = useCallback(
    (range?: DateRange) => {
      if (range === undefined) {
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);
      } else {
        const { from = initialStartDate, to = initialEndDate } = range;
        setStartDate(from);
        setEndDate(to);
      }
    },
    [initialEndDate, initialStartDate],
  );

  const description = useMemo(() => {
    if (maltekstseksjon.publishedDateTime === null) {
      return 'Denne versjonen er et utkast.';
    }

    const publishedDate = isoDateTimeToPretty(maltekstseksjon.publishedDateTime);

    if (!hasNextMaltekstseksjon) {
      return (
        <>
          Denne versjonen ble publisert <strong>{publishedDate}</strong> og er den <strong>siste publiserte</strong>{' '}
          versjonen.
        </>
      );
    }

    const nextPublishedDate = isoDateTimeToPretty(nextMaltekstseksjonDate);

    return (
      <>
        Denne versjonen ble publisert <strong>{publishedDate}</strong> og ble erstattet av en ny maltekstseksjon
        publisert <strong>{nextPublishedDate}</strong>.
      </>
    );
  }, [hasNextMaltekstseksjon, maltekstseksjon.publishedDateTime, nextMaltekstseksjonDate]);

  const maxDate = useMemo(() => initialEndDate ?? new Date(), [initialEndDate]);
  const toDate = useMemo(() => endDate ?? new Date(), [endDate]);

  const activePeriods = useMemo(() => {
    if (data === null) {
      return [];
    }

    return data.rows.flatMap((row) => row.periods).filter((period) => period.start <= pinDate && period.end >= pinDate);
  }, [data, pinDate]);

  if (data === null) {
    return null;
  }

  return (
    <Container>
      <Alert variant="info" size="small">
        {description}
      </Alert>

      <StyledTimeline startDate={startDate} endDate={endDate} direction="right">
        <Timeline.Pin date={pinDate}>Nå</Timeline.Pin>
        {data.rows.map(({ periods, ...row }) => (
          <Timeline.Row key={row.key} label={row.label} icon={row.icon}>
            {periods.map((period) => (
              <Timeline.Period {...omit(period, 'richText')} key={period.key} />
            ))}
          </Timeline.Row>
        ))}
        <Timeline.Row key={data.allRow.key} label={data.allRow.label} icon={data.allRow.icon}>
          {data.allRow.periods.map((period) => (
            <Timeline.Period {...omit(period, 'richText')} key={period.key} />
          ))}
        </Timeline.Row>
      </StyledTimeline>

      <List>
        {data.allRow.periods.toReversed().map((period) => (
          <li key={period.key}>
            <Button variant="tertiary" size="xsmall" onClick={period.onSelectPeriod}>
              {format(period.start, PRETTY_DATETIME_FORMAT)} - {format(period.end, PRETTY_DATETIME_FORMAT)}
            </Button>
          </li>
        ))}
      </List>

      <PinTime from={startDate} to={toDate} onChange={(v) => setPinDate(v)} value={pinDate} />

      <div>
        <Tag variant="alt1">
          {format(startDate, PRETTY_DATETIME_FORMAT)} - {format(toDate, PRETTY_DATETIME_FORMAT)}
        </Tag>
      </div>

      <RowContainer>
        <DatePicker.Standalone
          mode="range"
          onSelect={onSelectRange}
          selected={{ from: startDate, to: toDate }}
          fromDate={initialStartDate}
          toDate={maxDate}
        />
        <RedaktoerRichText
          editorId={activePeriods.map((p) => p.key).join('-')}
          savedContent={activePeriods.flatMap((p) => p.richText[lang] ?? [])}
          readOnly
          lang={SPELL_CHECK_LANGUAGES[lang]}
        />
      </RowContainer>
    </Container>
  );
};

const StyledTimeline = styled(Timeline)`
  min-width: 800px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const List = styled.ul`
  display: flex;
  flex-direction: row;
  padding: 0;
  margin: 0;
  list-style: none;
  width: 100%;
  overflow: auto;
`;
