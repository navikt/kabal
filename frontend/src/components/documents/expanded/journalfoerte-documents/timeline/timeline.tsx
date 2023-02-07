import { Bell, Email, Mobile } from '@navikt/ds-icons';
import { Button, Detail, Popover } from '@navikt/ds-react';
import React, { Fragment, useMemo, useRef, useState } from 'react';
import { isoDateTimeToPretty } from '../../../../../domain/date';
import { IArkivertDocument, Journalposttype, Kanal, RelevantDatotype } from '../../../../../types/arkiverte-documents';
import { BACKGROUND_COLOR, DATOTYPE_NAME, ICON, KANAL_NAME } from './helpers';
import {
  NextArrow,
  StyledEmailContent,
  StyledLabel,
  StyledSmsContent,
  StyledTimelineItem,
  TimelineContainer,
} from './styled-components';

export const Timeline = ({ relevanteDatoer, kanal, journalposttype, utsendingsinfo }: IArkivertDocument) => {
  const lastIndex = relevanteDatoer.length - 1;

  const sorted = useMemo(() => [...relevanteDatoer].sort((a, b) => a.dato.localeCompare(b.dato)), [relevanteDatoer]);

  return (
    <TimelineContainer>
      {sorted.map(({ datotype, dato }, index) => {
        const isVarselSendt =
          datotype === RelevantDatotype.DATO_EKSPEDERT &&
          journalposttype === Journalposttype.UTGAAENDE &&
          kanal === Kanal.NAV_NO;

        const isLast = index === lastIndex;

        if (!isVarselSendt) {
          return (
            <RelevantDateTimelineItem
              key={`${datotype}-${dato}`}
              datotype={datotype}
              dato={dato}
              kanal={kanal}
              hideNext={isLast}
            />
          );
        }

        const hasVarsler = utsendingsinfo !== null;
        const isSmsSendt = hasVarsler && utsendingsinfo.smsVarselSendt !== null;
        const isEmailSendt = hasVarsler && utsendingsinfo.epostVarselSendt !== null;

        return (
          <Fragment key={`${datotype}-${dato}`}>
            <RelevantDateTimelineItem datotype={datotype} dato={dato} kanal={kanal} hideNext={isLast && !hasVarsler} />
            {isEmailSendt ? (
              <TimelineItem
                dato={dato}
                title={<span>E-post-varsel sendt</span>}
                icon={<Bell aria-hidden />}
                color="var(--a-lightblue-50)"
                popoverContent={
                  <>
                    <StyledLabel size="small">
                      <Email aria-hidden /> {utsendingsinfo.epostVarselSendt?.adresse}
                    </StyledLabel>
                    <EmailContent varslingstekst={utsendingsinfo.epostVarselSendt?.varslingstekst} />
                  </>
                }
                hideNext={isLast && !isSmsSendt}
              />
            ) : null}
            {isSmsSendt ? (
              <TimelineItem
                dato={dato}
                title={<span>SMS-varsel sendt</span>}
                icon={<Mobile aria-hidden />}
                color="var(--a-lightblue-50)"
                popoverContent={
                  <>
                    <StyledLabel size="small">
                      <Mobile aria-hidden /> {utsendingsinfo.smsVarselSendt?.adresse}
                    </StyledLabel>
                    <StyledSmsContent>{utsendingsinfo.smsVarselSendt?.varslingstekst}</StyledSmsContent>
                  </>
                }
                hideNext={isLast}
              />
            ) : null}
          </Fragment>
        );
      })}
    </TimelineContainer>
  );
};

interface RelevantDateTimelineItemProps {
  dato: string;
  datotype: RelevantDatotype;
  hideNext: boolean;
  kanal: Kanal;
}

const RelevantDateTimelineItem = ({ datotype, kanal, ...rest }: RelevantDateTimelineItemProps) => (
  <TimelineItem {...rest} {...getTitleAndIcon(datotype, kanal)} color={BACKGROUND_COLOR[datotype]} />
);

interface TimelineItemProps {
  title: React.ReactNode;
  icon: React.ReactNode;
  dato: string;
  hideNext: boolean;
  color: string;
  popoverContent?: React.ReactNode;
}

const TimelineItem = ({ icon, title, dato, color, popoverContent = null, hideNext }: TimelineItemProps) => (
  <StyledTimelineItem $color={color}>
    <StyledLabel size="small">
      {icon} {title}
    </StyledLabel>
    <Detail>{isoDateTimeToPretty(dato)}</Detail>
    {popoverContent === null ? null : <TimelinePopover>{popoverContent}</TimelinePopover>}
    {hideNext ? null : <NextArrow aria-hidden />}
  </StyledTimelineItem>
);

interface TimelinePopoverProps {
  children: React.ReactNode;
}

const TimelinePopover = ({ children }: TimelinePopoverProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button ref={ref} onClick={() => setIsOpen(!isOpen)} size="xsmall" variant="tertiary">
        Se varsel
      </Button>
      <Popover open={isOpen} onClose={() => setIsOpen(false)} anchorEl={ref.current}>
        <Popover.Content>{children}</Popover.Content>
      </Popover>
    </div>
  );
};

const getTitleAndIcon = (
  datotype: RelevantDatotype,
  kanal: Kanal
): { icon: React.ReactNode; title: React.ReactNode } => {
  const Icon = ICON[datotype];

  if (datotype === RelevantDatotype.DATO_EKSPEDERT || datotype === RelevantDatotype.DATO_REGISTRERT) {
    const [shortName, longName] = KANAL_NAME[kanal];

    return {
      icon: <Icon aria-hidden />,
      title: (
        <>
          <span>{DATOTYPE_NAME[datotype]}</span> <span title={longName}>({shortName})</span>
        </>
      ),
    };
  }

  return { icon: <Icon aria-hidden />, title: <span key="title">{DATOTYPE_NAME[datotype]}</span> };
};

const BODY_REGEX = /<body>((?:.|\n|\r)*)<\/body>/i;

const EmailContent = ({ varslingstekst }: { varslingstekst: string | undefined }): JSX.Element | null => {
  if (varslingstekst === undefined) {
    return null;
  }

  const __html = varslingstekst.match(BODY_REGEX)?.[1];

  if (__html === undefined) {
    return null;
  }

  return <StyledEmailContent dangerouslySetInnerHTML={{ __html }} />;
};
