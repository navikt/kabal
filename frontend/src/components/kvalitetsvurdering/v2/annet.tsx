import { Textarea } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { HeadingWithHelpText } from './common/heading-with-helptext';
import { useKvalitetsvurderingV2 } from './common/use-kvalitetsvurdering-v2';
import { useValidationError } from './common/use-validation-error';

export const Annet = () => {
  const { isLoading, kvalitetsvurdering, update } = useKvalitetsvurderingV2();
  const validationError = useValidationError('annetFritekst');

  if (isLoading) {
    return null;
  }

  const onChange = (annetFritekst: string) => update({ annetFritekst });

  return <Comment value={kvalitetsvurdering.annetFritekst} onChange={onChange} error={validationError} />;
};

interface CommentProps {
  value: string | null;
  error?: string;
  onChange: (value: string) => void;
}

const Comment = ({ onChange, value, error }: CommentProps) => {
  const [text, setText] = useState(value ?? '');
  const canEdit = useCanEdit();

  useEffect(() => {
    if (value === text) {
      return;
    }

    const timeout = setTimeout(() => onChange(text), 1000);

    return () => clearTimeout(timeout);
  }, [text, onChange, value]);

  return (
    <Textarea
      label={
        <HeadingWithHelpText helpText="Det du skriver her er kun for klageinstansens interne bruk og blir ikke synlig for vedtaksinstansen. Har saken andre avvik som ikke passer med noen av de andre registreringsmulighetene i Kaka, kan du skrive dette her. Husk å skrive kort / med stikkord. Ikke skriv personopplysninger eller detaljer om saken. Du kan også skrive stikkord dersom saken gjelder et typetilfelle.">
          Annet (valgfri)
        </HeadingWithHelpText>
      }
      description="Det du skriver her er kun synlig for klageinstansen og ikke for vedtaksinstansen. Husk å ikke skrive personopplysninger."
      onChange={({ target }) => setText(target.value)}
      disabled={!canEdit}
      value={text}
      error={error}
      data-testid="annetFritekst"
      size="small"
    />
  );
};
