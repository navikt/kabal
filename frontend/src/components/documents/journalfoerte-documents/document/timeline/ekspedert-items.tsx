import {
  BellIcon,
  EnvelopeClosedIcon,
  FingerMobileIcon,
  MobileSmallIcon,
  PrinterSmallIcon,
  InformationSquareIcon,
} from '@navikt/aksel-icons';
import React from 'react';
import { IArkivertDocument, Kanal, RelevantDatotype, Utsendingsinfo } from '@app/types/arkiverte-documents';
import { StyledAlert, StyledEmailContent, StyledHeading, StyledLabel, StyledSmsContent } from './styled-components';
import { RelevantDateTimelineItem, TimelineItem } from './timeline-item';

interface Props extends Pick<IArkivertDocument, 'utsendingsinfo' | 'kanal' | 'kanalnavn'> {
  datotype: RelevantDatotype;
  dato: string;
  isLast: boolean;
}

export const EkspedertItems = ({ utsendingsinfo, datotype, dato, kanal, kanalnavn, isLast }: Props) => {
  const hasUtsendingsinfo = utsendingsinfo !== null;
  const isSmsSent = hasUtsendingsinfo && utsendingsinfo.smsVarselSendt !== null;
  const isEmailSent = hasUtsendingsinfo && utsendingsinfo.epostVarselSendt !== null;
  const hasVarsler = isSmsSent || isEmailSent;

  const varselData = hasUtsendingsinfo ? getVarselData(isSmsSent, isEmailSent, utsendingsinfo) : [];
  const lastIndex = varselData.length - 1;

  return (
    <>
      <RelevantDateTimelineItem datotype={datotype} dato={dato} hideNext={isLast && !hasVarsler} />

      {varselData.map(({ title, content }, i) => (
        <TimelineItem
          key={i}
          dato={dato}
          title={title}
          icon={<BellIcon aria-hidden />}
          color="var(--a-lightblue-50)"
          popover={{ buttonText: 'Vis varsel', content }}
          hideNext={isLast && i === lastIndex}
        />
      ))}
      {hasVarsler ? null : <OtherVarselInfo dato={dato} kanal={kanal} kanalnavn={kanalnavn} isLast={isLast} />}
    </>
  );
};

interface VarselData {
  title: string;
  content: JSX.Element;
}

const getVarselData = (
  isSmsSent: boolean,
  isEmailSent: boolean,
  utsendingsinfo: Utsendingsinfo
): [VarselData, VarselData] | [VarselData] | [] => {
  if (isSmsSent && isEmailSent) {
    return [getSmsPopoverContent(utsendingsinfo), getEmailPopoverContent(utsendingsinfo)];
  }

  if (isSmsSent) {
    return [getSmsPopoverContent(utsendingsinfo)];
  }

  if (isEmailSent) {
    return [getEmailPopoverContent(utsendingsinfo)];
  }

  return [];
};

const getSmsPopoverContent = (utsendingsinfo: Utsendingsinfo): VarselData => ({
  title: 'SMS-varsel sendt',
  content: (
    <>
      <StyledLabel size="small">
        <MobileSmallIcon aria-hidden /> {utsendingsinfo.smsVarselSendt?.adresse}
      </StyledLabel>
      <StyledSmsContent>{utsendingsinfo.smsVarselSendt?.varslingstekst}</StyledSmsContent>
    </>
  ),
});

const getEmailPopoverContent = (utsendingsinfo: Utsendingsinfo): VarselData => ({
  title: 'E-post-varsel sendt',
  content: (
    <>
      <StyledLabel size="small">
        <EnvelopeClosedIcon aria-hidden /> {utsendingsinfo.epostVarselSendt?.adresse}
      </StyledLabel>
      <EmailContent varslingstekst={utsendingsinfo.epostVarselSendt?.varslingstekst} />
    </>
  ),
});

interface VarselInfoProps {
  dato: string;
  kanal: Kanal;
  kanalnavn: string;
  isLast: boolean;
}

const OtherVarselInfo = ({ dato, kanal, kanalnavn, isLast }: VarselInfoProps) => {
  const { icon: Icon, title, info, color } = getOtherVarselData(kanal);

  return (
    <TimelineItem
      dato={dato}
      title={title}
      icon={<BellIcon aria-hidden />}
      color={color}
      popover={{
        buttonText: 'Vis forklaring',
        content: (
          <StyledAlert variant="info">
            <StyledHeading size="xsmall" level="3">
              <Icon aria-hidden /> {kanalnavn}
            </StyledHeading>
            {info}
          </StyledAlert>
        ),
      }}
      hideNext={isLast}
    />
  );
};

const getOtherVarselData = (kanal: Kanal) => {
  switch (kanal) {
    case Kanal.SENTRAL_UTSKRIFT:
      return {
        icon: EnvelopeClosedIcon,
        title: 'Ingen varsling',
        info: 'Dokumentet er sendt til brukerens fysiske postkasse.',
        color: 'var(--a-gray-50)',
      };
    case Kanal.LOKAL_UTSKRIFT:
      return {
        icon: PrinterSmallIcon,
        title: 'Ingen varsling',
        info: 'Dokumentet er skrevet ut lokalt.',
        color: 'var(--a-gray-50)',
      };
    case Kanal.NAV_NO:
      return {
        icon: InformationSquareIcon,
        title: 'Info om varsling mangler',
        info: 'NAV jobber med å utvide informasjon om varsel sendt.',
        color: 'var(--a-gray-50)',
      };
    default:
      return {
        icon: FingerMobileIcon,
        title: 'Ekstern varsling',
        info: 'Dokumentet er sendt til brukeren via en ekstern tjeneste.',
        color: 'var(--a-gray-50)',
      };
  }
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
