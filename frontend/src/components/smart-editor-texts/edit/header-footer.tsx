import { Textarea } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useUpdateTextPropertyMutation } from '../../../redux-api/texts';
import { TextTypes } from '../../../types/texts/texts';
import { useTextQuery } from '../hooks/use-text-query';

type HeaderFooter = TextTypes.HEADER | TextTypes.FOOTER;

interface Props {
  textId: string;
  savedPlainText?: string;
  type: HeaderFooter;
}

export const HeaderFooterEditor = ({ textId, savedPlainText, type }: Props) => {
  const [value, setValue] = useState(savedPlainText ?? '');
  const [updateProperty] = useUpdateTextPropertyMutation({ fixedCacheKey: textId });
  const query = useTextQuery();

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateProperty({ id: textId, key: 'plainText', value, query });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [query, textId, updateProperty, value]);

  const onChange = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(target.value);
  };

  return (
    <StyledTextarea minRows={4} label={getLabel(type)} key={textId} id={textId} value={value} onChange={onChange} />
  );
};

const getLabel = (type: TextTypes.HEADER | TextTypes.FOOTER) => (type === TextTypes.HEADER ? 'Topptekst' : 'Bunntekst');

const StyledTextarea = styled(Textarea)`
  margin: 16px;
`;
