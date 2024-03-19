import {
  ArrowUndoIcon,
  EnvelopeClosedIcon,
  FileCheckmarkIcon,
  FolderFileIcon,
  GlassesIcon,
  HddUpIcon,
  MobileSmallIcon,
  PrinterSmallIcon,
} from '@navikt/aksel-icons';
import React from 'react';
import { TimelineTypes, Utsendingsinfo } from '@app/types/arkiverte-documents';
import { StyledEmailContent, StyledLabel, StyledSmsContent } from './styled-components';

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

interface VarselData {
  title: string;
  content: JSX.Element;
}

export const getVarselData = (
  isSmsSent: boolean,
  isEmailSent: boolean,
  utsendingsinfo: Utsendingsinfo,
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
