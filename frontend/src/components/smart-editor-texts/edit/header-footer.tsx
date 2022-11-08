import { Textarea } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { PlainTextTypes } from '../../../types/texts/texts';

type HeaderFooter = PlainTextTypes.HEADER | PlainTextTypes.FOOTER;

interface Props {
  textId: string;
  savedPlainText?: string;
  type: HeaderFooter;
  setContent: (content: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

export const HeaderFooterEditor = ({ textId, savedPlainText, type, setContent, onKeyDown }: Props) => (
  <StyledTextarea
    minRows={4}
    label={getLabel(type)}
    key={textId}
    id={textId}
    value={savedPlainText}
    onChange={({ target }) => setContent(target.value)}
    onKeyDown={onKeyDown}
  />
);

const getLabel = (type: PlainTextTypes.HEADER | PlainTextTypes.FOOTER) =>
  type === PlainTextTypes.HEADER ? 'Topptekst' : 'Bunntekst';

const StyledTextarea = styled(Textarea)`
  margin: 16px;
`;
