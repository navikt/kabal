import { TimelineItem } from '@app/components/documents/journalfoerte-documents/document/timeline/timeline-item';
import type { Utsendingsinfo } from '@app/types/arkiverte-documents';
import { BellIcon, EnvelopeClosedIcon, MobileSmallIcon } from '@navikt/aksel-icons';
import { BoxNew, Label } from '@navikt/ds-react';
import type { HTMLAttributes } from 'react';

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
      <VarselLabel icon={<MobileSmallIcon aria-hidden />}>{utsendingsinfo.smsVarselSendt?.adresse}</VarselLabel>
      <MessageContainer>{utsendingsinfo.smsVarselSendt?.varslingstekst}</MessageContainer>
    </>
  );

  return <VarselTimelineItem timestamp={timestamp} title={title} content={content} isLast={isLast} />;
};

const EmailVarsel = ({ utsendingsinfo, timestamp, isLast }: VarselProps) => {
  const title = 'E-post-varsel sendt';
  const content = (
    <>
      <VarselLabel icon={<EnvelopeClosedIcon aria-hidden />}>{utsendingsinfo.epostVarselSendt?.adresse}</VarselLabel>
      <EmailContent varslingstekst={utsendingsinfo.epostVarselSendt?.varslingstekst} />
    </>
  );

  return <VarselTimelineItem timestamp={timestamp} title={title} content={content} isLast={isLast} />;
};

interface VarselLabelProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

const VarselLabel = ({ icon, children }: VarselLabelProps) => (
  <Label size="small" className="flex items-center gap-1">
    {icon} {children}
  </Label>
);

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
    background="brand-blue-soft"
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

  return (
    <MessageContainer
      // biome-ignore lint/security/noDangerouslySetInnerHtml: This content is trusted.
      dangerouslySetInnerHTML={{ __html }}
      className="[&_h1]:text-heading-medium [&_h2]:text-heading-small [&_h3,h4,h5,h6]:text-base [&_ol,ul]:pl-4 [&_p,ol,ul,li,h1,h2,h3]:mt-0 [&_p,ol,ul,li,h1,h2,h3]:mb-1"
    />
  );
};

const MessageContainer = ({ children, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <BoxNew
    as="blockquote"
    borderWidth="0 0 0 1"
    borderColor="neutral"
    paddingInline="1 0"
    borderRadius="medium"
    marginBlock="2 0"
    {...rest}
  >
    {children}
  </BoxNew>
);
