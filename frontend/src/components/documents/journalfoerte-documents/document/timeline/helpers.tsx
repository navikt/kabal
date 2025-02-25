import {
  StyledEmailContent,
  StyledLabel,
  StyledSmsContent,
} from '@app/components/documents/journalfoerte-documents/document/timeline/styled-components';
import { TimelineItem } from '@app/components/documents/journalfoerte-documents/document/timeline/timeline-item';
import { TimelineTypes, type Utsendingsinfo } from '@app/types/arkiverte-documents';
import {
  ArrowUndoIcon,
  BellIcon,
  EnvelopeClosedIcon,
  FileCheckmarkIcon,
  FolderFileIcon,
  GlassesIcon,
  HddUpIcon,
  MobileSmallIcon,
  PrinterSmallIcon,
} from '@navikt/aksel-icons';

export const DATOTYPE_NAME: Record<TimelineTypes, string> = {
  [TimelineTypes.OPPRETTET]: 'Opprettet',
  [TimelineTypes.SENDT_PRINT]: 'Sendt print',
  [TimelineTypes.EKSPEDERT]: 'Ekspedert',
  [TimelineTypes.JOURNALFOERT]: 'Journalført',
  [TimelineTypes.REGISTRERT]: 'Registrert',
  [TimelineTypes.AVSENDER_RETUR]: 'Avsender retur',
  [TimelineTypes.LEST]: 'Lest',
};

export const BACKGROUND_COLOR: Record<TimelineTypes, string> = {
  [TimelineTypes.OPPRETTET]: 'var(--a-limegreen-50)',
  [TimelineTypes.SENDT_PRINT]: 'var(--a-orange-50)',
  [TimelineTypes.EKSPEDERT]: 'var(--a-deepblue-50)',
  [TimelineTypes.JOURNALFOERT]: 'var(--a-blue-50)',
  [TimelineTypes.REGISTRERT]: 'var(--a-purple-50)',
  [TimelineTypes.AVSENDER_RETUR]: 'var(--a-red-50)',
  [TimelineTypes.LEST]: 'var(--a-green-50)',
};

export const ICON: Record<TimelineTypes, React.FC> = {
  [TimelineTypes.OPPRETTET]: FileCheckmarkIcon,
  [TimelineTypes.SENDT_PRINT]: PrinterSmallIcon,
  [TimelineTypes.EKSPEDERT]: EnvelopeClosedIcon,
  [TimelineTypes.JOURNALFOERT]: FolderFileIcon,
  [TimelineTypes.REGISTRERT]: HddUpIcon,
  [TimelineTypes.AVSENDER_RETUR]: ArrowUndoIcon,
  [TimelineTypes.LEST]: GlassesIcon,
};

interface VarslerProps {
  isEmailSent: boolean;
  isSmsSent: boolean;
  utsendingsinfo: Utsendingsinfo;
  timestamp: string;
  isLast: boolean;
}

export const Varsler = ({ isEmailSent, isSmsSent, timestamp, utsendingsinfo, isLast }: VarslerProps) => {
  if (isSmsSent && isEmailSent) {
    return (
      <>
        <SmsVarsel utsendingsinfo={utsendingsinfo} timestamp={timestamp} />
        <EmailVarsel utsendingsinfo={utsendingsinfo} timestamp={timestamp} isLast={isLast} />
      </>
    );
  }

  if (isSmsSent) {
    return <SmsVarsel utsendingsinfo={utsendingsinfo} timestamp={timestamp} isLast={isLast} />;
  }

  if (isEmailSent) {
    return <EmailVarsel utsendingsinfo={utsendingsinfo} timestamp={timestamp} isLast={isLast} />;
  }

  return null;
};

interface VarselProps {
  utsendingsinfo: Utsendingsinfo;
  timestamp: string;
  isLast?: boolean;
}

const SmsVarsel = ({ utsendingsinfo, timestamp, isLast = false }: VarselProps) => {
  const title = 'SMS-varsel sendt';
  const content = (
    <>
      <StyledLabel size="small">
        <MobileSmallIcon aria-hidden /> {utsendingsinfo.smsVarselSendt?.adresse}
      </StyledLabel>
      <StyledSmsContent>{utsendingsinfo.smsVarselSendt?.varslingstekst}</StyledSmsContent>
    </>
  );

  return <VarselTimelineItem timestamp={timestamp} title={title} content={content} isLast={isLast} />;
};

const EmailVarsel = ({ utsendingsinfo, timestamp, isLast }: VarselProps) => {
  const title = 'E-post-varsel sendt';
  const content = (
    <>
      <StyledLabel size="small">
        <EnvelopeClosedIcon aria-hidden /> {utsendingsinfo.epostVarselSendt?.adresse}
      </StyledLabel>
      <EmailContent varslingstekst={utsendingsinfo.epostVarselSendt?.varslingstekst} />
    </>
  );

  return <VarselTimelineItem timestamp={timestamp} title={title} content={content} isLast={isLast} />;
};

interface VarselTimelineItemProps {
  timestamp: string;
  title: string;
  content: React.JSX.Element;
  isLast?: boolean;
}

const VarselTimelineItem = ({ timestamp, title, content, isLast = false }: VarselTimelineItemProps) => (
  <TimelineItem
    timestamp={timestamp}
    title={title}
    icon={<BellIcon aria-hidden />}
    color="var(--a-lightblue-50)"
    popover={{ buttonText: 'Vis varsel', content }}
    hideNext={isLast}
  />
);

const BODY_REGEX = /<body>((?:.|\n|\r)*)<\/body>/i;

const EmailContent = ({ varslingstekst }: { varslingstekst: string | undefined }): React.JSX.Element | null => {
  if (varslingstekst === undefined) {
    return null;
  }

  const __html = varslingstekst.match(BODY_REGEX)?.[1];

  if (__html === undefined) {
    return null;
  }

  // biome-ignore lint/security/noDangerouslySetInnerHtml: This content is trusted.
  return <StyledEmailContent dangerouslySetInnerHTML={{ __html }} />;
};
