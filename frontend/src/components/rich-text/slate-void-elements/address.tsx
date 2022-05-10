import React from 'react';
import { RenderElementProps } from 'slate-react';
import styled from 'styled-components';
import { useGetBrukerQuery } from '../../../redux-api/bruker';

export const AddressElement = ({ attributes, children }: RenderElementProps) => {
  const { data, isLoading } = useGetBrukerQuery();

  if (isLoading || typeof data === 'undefined') {
    return null;
  }

  const { name, street, postalCode, city } = getAddress(data.ansattEnhet.id);

  return (
    <div {...attributes}>
      {children}
      <StyledAddress contentEditable={false}>
        <StyledName>{name}</StyledName>
        <StyledStreet>{street}</StyledStreet>
        <StyledPostalCodeCity>
          {postalCode} {city}
        </StyledPostalCodeCity>
      </StyledAddress>
    </div>
  );
};

interface IAddress {
  name: string;
  street: string;
  postalCode: string;
  city: string;
}

enum KlageEnhet {
  NAV_KLAGEINSTANS_NORD = ' 4295',
}

const getAddress = (enhet: string): IAddress => {
  switch (enhet) {
    case KlageEnhet.NAV_KLAGEINSTANS_NORD:
      return {
        name: 'NAV Klageinstans Nord',
        street: 'Postboks 1234',
        postalCode: '1234',
        city: 'Ikke Oslo',
      };
    default:
      return {
        name: 'NAV Klageinstans Nord',
        street: 'Postboks 1234',
        postalCode: '1234',
        city: 'Ikke Oslo',
      };
  }
};

const StyledAddress = styled.address`
  font-style: normal;
`;

const StyledStreet = styled.span`
  display: block;
`;

const StyledPostalCodeCity = styled.span`
  display: block;
`;

const StyledName = styled.span`
  font-weight: bold;
  display: block;
`;
