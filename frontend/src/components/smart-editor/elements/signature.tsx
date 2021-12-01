import { skipToken } from '@reduxjs/toolkit/query/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useKlagebehandling } from '../../../hooks/use-klagebehandling';
import { useGetMedunderskriverInfoQuery } from '../../../redux-api/oppgave';
import { ISignatureContent, ISignatureElement, ISigner } from '../../../redux-api/smart-editor-types';
import { AutofillInput } from './autofill-input';
import { StyledInput } from './text-input';

interface SignatureElementProps extends Pick<ISignatureElement, 'content'> {
  onChange: (content: ISignatureContent) => void;
}

export const SignatureElement = ({ content, onChange }: SignatureElementProps) => {
  const [klagebehandling] = useKlagebehandling();
  const { data: medunderskriverInfo } = useGetMedunderskriverInfoQuery(klagebehandling?.id ?? skipToken);
  const [medunderskriver, setMedunderskriver] = useState(content.medunderskriver);
  const [saksbehandler, setSaksbehandler] = useState(content.saksbehandler);

  useEffect(() => {
    if (
      medunderskriver.name === content.medunderskriver.name &&
      medunderskriver.title === content.medunderskriver.title &&
      saksbehandler.name === content.saksbehandler.name &&
      saksbehandler.title === content.saksbehandler.title
    ) {
      return;
    }

    onChange({
      medunderskriver,
      saksbehandler,
    });
  }, [medunderskriver, saksbehandler, content, onChange]);

  return (
    <SignatureContainer>
      <Signer
        name={content.medunderskriver.name}
        defaultName={medunderskriverInfo?.medunderskriver?.navn ?? ''}
        title={content.medunderskriver.title.length === 0 ? 'Rådgiver' : content.medunderskriver.title}
        nameLabel="Medunderskrivernavn"
        titleLabel="Medunderskrivertittel"
        onChange={setMedunderskriver}
      />
      <Signer
        name={content.saksbehandler.name}
        defaultName={klagebehandling?.tildeltSaksbehandler?.navn ?? ''}
        title={content.saksbehandler.title.length === 0 ? 'Saksbehandler' : content.saksbehandler.title}
        nameLabel="Saksbehandlernavn"
        titleLabel="Saksbehandlertittel"
        onChange={setSaksbehandler}
      />
    </SignatureContainer>
  );
};

interface SignerProps {
  name: string;
  defaultName: string;
  nameLabel: string;
  title: string;
  titleLabel: string;
  onChange: (signer: ISigner) => void;
}

const Signer = ({ defaultName, title, nameLabel, titleLabel, name, onChange }: SignerProps) => (
  <StyledSigner>
    <AutofillInput
      placeholder={nameLabel}
      title={nameLabel}
      value={name}
      defaultValue={defaultName}
      onChange={(value) => onChange({ name: value, title })}
    />
    <StyledInput
      placeholder={titleLabel}
      title={titleLabel}
      value={title}
      onChange={({ target }) => onChange({ name, title: target.value })}
    />
  </StyledSigner>
);

const StyledSigner = styled.div`
  width: 40%;
`;

const SignatureContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2em;
  margin-bottom: 1em;
`;
