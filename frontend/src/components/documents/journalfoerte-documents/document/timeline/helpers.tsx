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
import { RelevantDatotype, Utsendingsinfo } from '@app/types/arkiverte-documents';
import { StyledEmailContent, StyledLabel, StyledSmsContent } from './styled-components';

export const DATOTYPE_NAME: Record<RelevantDatotype, string> = {
  [RelevantDatotype.DATO_SENDT_PRINT]: 'Sendt print',
  [RelevantDatotype.DATO_EKSPEDERT]: 'Ekspedert',
  [RelevantDatotype.DATO_JOURNALFOERT]: 'Journalført',
  [RelevantDatotype.DATO_REGISTRERT]: 'Registrert',
  [RelevantDatotype.DATO_AVS_RETUR]: 'Avsender retur',
  [RelevantDatotype.DATO_DOKUMENT]: 'Opprettet',
  [RelevantDatotype.DATO_LEST]: 'Lest',
};

export const BACKGROUND_COLOR: Record<RelevantDatotype, string> = {
  [RelevantDatotype.DATO_SENDT_PRINT]: 'var(--a-orange-50)',
  [RelevantDatotype.DATO_EKSPEDERT]: 'var(--a-deepblue-50)',
  [RelevantDatotype.DATO_JOURNALFOERT]: 'var(--a-blue-50)',
  [RelevantDatotype.DATO_REGISTRERT]: 'var(--a-purple-50)',
  [RelevantDatotype.DATO_AVS_RETUR]: 'var(--a-red-50)',
  [RelevantDatotype.DATO_DOKUMENT]: 'var(--a-limegreen-50)',
  [RelevantDatotype.DATO_LEST]: 'var(--a-green-50)',
};

export const ICON: Record<RelevantDatotype, React.FC> = {
  [RelevantDatotype.DATO_SENDT_PRINT]: PrinterSmallIcon,
  [RelevantDatotype.DATO_EKSPEDERT]: EnvelopeClosedIcon,
  [RelevantDatotype.DATO_JOURNALFOERT]: FolderFileIcon,
  [RelevantDatotype.DATO_REGISTRERT]: HddUpIcon,
  [RelevantDatotype.DATO_AVS_RETUR]: ArrowUndoIcon,
  [RelevantDatotype.DATO_DOKUMENT]: FileCheckmarkIcon,
  [RelevantDatotype.DATO_LEST]: GlassesIcon,
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
