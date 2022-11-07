import { Textarea } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { TextTypes } from '../../../types/texts/texts';

type HeaderFooter = TextTypes.HEADER | TextTypes.FOOTER;

interface Props {
  textId: string;
  savedPlainText?: string;
  type: HeaderFooter;
  setContent: (content: string) => void;
}

export const HeaderFooterEditor = ({ textId, savedPlainText, type, setContent }: Props) => (
  <StyledTextarea
    minRows={4}
    label={getLabel(type)}
    key={textId}
    id={textId}
    value={savedPlainText}
    onChange={({ target }) => setContent(target.value)}
  />
);

const getLabel = (type: TextTypes.HEADER | TextTypes.FOOTER) => (type === TextTypes.HEADER ? 'Topptekst' : 'Bunntekst');

const StyledTextarea = styled(Textarea)`
  margin: 16px;
`;
