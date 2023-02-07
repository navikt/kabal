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
      <DigitalVarsel digitalpostSendt={utsendingsinfo.digitalpostSendt} />
      <FysiskVarsel fysiskpostSendt={utsendingsinfo.fysiskpostSendt} />
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

type DigitalVarselProps = Pick<Utsendingsinfo, 'digitalpostSendt'>;

const DigitalVarsel = ({ digitalpostSendt }: DigitalVarselProps) => {
  if (digitalpostSendt === null) {
    return null;
  }

  return (
    <section>
      <Label>Digitalt varsel sendt</Label>
      <Detail>{digitalpostSendt.adresse}</Detail>
    </section>
  );
};

type FysiskVarselProps = Pick<Utsendingsinfo, 'fysiskpostSendt'>;

const FysiskVarsel = ({ fysiskpostSendt }: FysiskVarselProps) => {
  if (fysiskpostSendt === null) {
    return null;
  }

  return (
    <section>
      <Label>Fysisk varsel sendt</Label>
      <Detail>{fysiskpostSendt.adressetekstKonvolutt}</Detail>
    </section>
  );
};

const VarslerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
`;
