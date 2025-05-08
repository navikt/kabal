import { Varsler } from '@app/components/documents/journalfoerte-documents/document/timeline/helpers';
import { type IArkivertDocument, Kanal, type TimelineTypes } from '@app/types/arkiverte-documents';
import {
  BellIcon,
  EnvelopeClosedIcon,
  FingerMobileIcon,
  InformationSquareIcon,
  PrinterSmallIcon,
} from '@navikt/aksel-icons';
import { CopyButton, Heading, VStack } from '@navikt/ds-react';
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
                  <PopupContainer heading="Adresse" icon={<EnvelopeClosedIcon aria-hidden />}>
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

      {hasUtsendingsinfo ? (
        <Varsler
          isEmailSent={isEmailSent}
          isSmsSent={isSmsSent}
          utsendingsinfo={utsendingsinfo}
          timestamp={timestamp}
          isLast={isLast}
        />
      ) : null}

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
          <PopupContainer heading={kanalnavn} icon={<Icon aria-hidden />}>
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
        info: 'Ikke alle journalposter har informasjon om varsling. Nav jobber med å utvide dette.',
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

interface PopupContainerProps {
  heading: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const PopupContainer = ({ heading, icon, children }: PopupContainerProps) => (
  <VStack className="whitespace-pre">
    <Heading size="xsmall" level="3" spacing className="flex items-center gap-1">
      {icon} {heading}
    </Heading>

    {children}
  </VStack>
);
