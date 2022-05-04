import { Loader } from '@navikt/ds-react';
import { Textarea } from 'nav-frontend-skjema';
import React, { useEffect, useState } from 'react';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useKvalitetsvurdering } from '../../hooks/use-kvalitetsvurdering';
import { useUpdateKvalitetsvurderingMutation } from '../../redux-api/kaka-kvalitetsvurdering';
import { StyledCommentField } from './styled-components';

interface CommentFieldProps {
  textareaId: string;
}

export const CommentField = ({ textareaId }: CommentFieldProps) => {
  const [kvalitetsvurdering, isLoading] = useKvalitetsvurdering();
  const [updateKvalitetsvurdering] = useUpdateKvalitetsvurderingMutation();
  const canEdit = useCanEdit();

  const [comment, setComment] = useState<string>(kvalitetsvurdering ? kvalitetsvurdering[textareaId] : '');

  useEffect(() => {
    if (typeof kvalitetsvurdering === 'undefined' || kvalitetsvurdering[textareaId] === comment) {
      return;
    }

    const { id } = kvalitetsvurdering;

    const timeout = setTimeout(() => {
      updateKvalitetsvurdering({ id, [textareaId]: comment });
    }, 1000);
    return () => clearTimeout(timeout); // Clear existing timer every time it runs.
  }, [comment, kvalitetsvurdering, textareaId, updateKvalitetsvurdering]);

  if (isLoading) {
    return <Loader size="xlarge" />;
  }

  if (typeof kvalitetsvurdering === 'undefined') {
    return null;
  }

  return (
    <StyledCommentField>
      <Textarea
        label="Oppsummert i stikkord:"
        value={comment ?? ''}
        placeholder="NB: Ingen personopplysninger"
        maxLength={0}
        onChange={({ target }) => setComment(target.value)}
        disabled={!canEdit}
      />
    </StyledCommentField>
  );
};
