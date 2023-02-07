import { Detail, Label } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { IArkivertDocument, Journalposttype, Utsendingsinfo } from '../../../../types/arkiverte-documents';

export const Varsler = ({ utsendingsinfo, journalposttype }: IArkivertDocument) => {
  if (utsendingsinfo === null || journalposttype !== Journalposttype.UTGAAENDE) {
    return null;
  }

  return (
    <VarslerWrapper>
      <SmsVarsel smsVarselSendt={utsendingsinfo.smsVarselSendt} />
      <EpostVarsel epostVarselSendt={utsendingsinfo.epostVarselSendt} />
    </VarslerWrapper>
  );
};

type SmsVarselProps = Pick<Utsendingsinfo, 'smsVarselSendt'>;

const SmsVarsel = ({ smsVarselSendt }: SmsVarselProps) => {
  if (smsVarselSendt === null) {
    return null;
  }

  return (
    <section>
      <Label>SMS sendt</Label>
      <Detail>{smsVarselSendt.adresse}</Detail>
      <Detail>{smsVarselSendt.varslingstekst}</Detail>
    </section>
  );
};

type EpostVarselProps = Pick<Utsendingsinfo, 'epostVarselSendt'>;

const EpostVarsel = ({ epostVarselSendt }: EpostVarselProps) => {
  if (epostVarselSendt === null) {
    return null;
  }

  return (
    <section>
      <Label>E-post sendt</Label>
      <Detail>{epostVarselSendt.adresse}</Detail>
      <Detail>{epostVarselSendt.tittel}</Detail>
      <Detail>{epostVarselSendt.varslingstekst}</Detail>
    </section>
  );
};

const VarslerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
`;
