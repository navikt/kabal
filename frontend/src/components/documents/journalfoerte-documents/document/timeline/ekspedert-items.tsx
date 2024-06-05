import {
  BellIcon,
  EnvelopeClosedIcon,
  FingerMobileIcon,
  InformationSquareIcon,
  PrinterSmallIcon,
} from '@navikt/aksel-icons';
import { CopyButton } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { getVarselData } from '@app/components/documents/journalfoerte-documents/document/timeline/helpers';
import { IArkivertDocument, Kanal, TimelineTypes } from '@app/types/arkiverte-documents';
import { StyledHeading } from './styled-components';
import { RelevantDateTimelineItem, TimelineItem } from './timeline-item';

interface Props extends Pick<IArkivertDocument, 'utsendingsinfo' | 'kanal' | 'kanalnavn'> {
  type: TimelineTypes;
  timestamp: string;
  isLast: boolean;
}

export const EkspedertItems = ({ utsendingsinfo, type, timestamp, kanal, kanalnavn, isLast }: Props) => {
  const hasUtsendingsinfo = utsendingsinfo !== null;
  const isSmsSent = hasUtsendingsinfo && utsendingsinfo.smsVarselSendt !== null;
  const isEmailSent = hasUtsendingsinfo && utsendingsinfo.epostVarselSendt !== null;
  const hasVarsler = isSmsSent || isEmailSent;

  const varselData = hasUtsendingsinfo ? getVarselData(isSmsSent, isEmailSent, utsendingsinfo) : [];
  const lastIndex = varselData.length - 1;

  return (
    <>
      <RelevantDateTimelineItem
        type={type}
        timestamp={timestamp}
        hideNext={false}
        popover={
          utsendingsinfo !== null && utsendingsinfo.fysiskpostSendt !== null
            ? {
                buttonText: 'Vis adresse',
                content: (
                  <PopupContainer>
                    <StyledHeading size="xsmall" level="3" spacing>
                      <EnvelopeClosedIcon aria-hidden /> Adresse
                    </StyledHeading>
                    {utsendingsinfo.fysiskpostSendt.adressetekstKonvolutt}
                    <CopyButton
                      copyText={utsendingsinfo.fysiskpostSendt.adressetekstKonvolutt}
                      text="Kopier adresse"
                      size="small"
                    />
                  </PopupContainer>
                ),
              }
            : null
        }
      />

      {varselData.map(({ title, content }, i) => (
        <TimelineItem
          key={i}
          timestamp={timestamp}
          title={title}
          icon={<BellIcon aria-hidden />}
          color="var(--a-lightblue-50)"
          popover={{ buttonText: 'Vis varsel', content }}
          hideNext={isLast && i === lastIndex}
        />
      ))}

      {hasVarsler ? null : <OtherVarselInfo dato={timestamp} kanal={kanal} kanalnavn={kanalnavn} isLast={isLast} />}
    </>
  );
};

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
      timestamp={dato}
      title={title}
      icon={<BellIcon aria-hidden />}
      color={color}
      popover={{
        buttonText: 'Vis forklaring',
        content: (
          <PopupContainer>
            <StyledHeading size="xsmall" level="3" spacing>
              <Icon aria-hidden /> {kanalnavn}
            </StyledHeading>
            {info}
          </PopupContainer>
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
        info: 'Dokumentet er sendt til mottakers fysiske postkasse.',
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
        info: 'Ikke alle journalposter har informasjon om varsling. NAV jobber med å utvide dette.',
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

const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  white-space: pre;
`;
