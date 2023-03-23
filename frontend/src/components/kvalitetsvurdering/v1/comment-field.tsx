import { Textarea } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useKvalitetsvurdering } from '../../../hooks/use-kvalitetsvurdering';
import { useUpdateKvalitetsvurderingMutation } from '../../../redux-api/kaka-kvalitetsvurdering/v1';
import { IKvalitetsvurderingTexts, IKvalitetsvurderingV1 } from '../../../types/kaka-kvalitetsvurdering/v1';
import { StyledCommentField } from './styled-components';

interface Props {
  textareaId: keyof IKvalitetsvurderingTexts;
}

export const CommentField = ({ textareaId }: Props) => {
  const [kvalitetsvurdering, isLoading] = useKvalitetsvurdering();

  if (isLoading || typeof kvalitetsvurdering === 'undefined') {
    return null;
  }

  return <CommentFieldContent textareaId={textareaId} kvalitetsvurdering={kvalitetsvurdering} />;
};

interface CommentFieldContentProps extends Props {
  kvalitetsvurdering: IKvalitetsvurderingV1;
}

const CommentFieldContent = ({ textareaId, kvalitetsvurdering }: CommentFieldContentProps) => {
  const [updateKvalitetsvurdering] = useUpdateKvalitetsvurderingMutation();
  const canEdit = useCanEdit();

  const [comment, setComment] = useState<string>(kvalitetsvurdering[textareaId] ?? '');

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

  if (typeof kvalitetsvurdering === 'undefined') {
    return null;
  }

  return (
    <StyledCommentField>
      <Textarea
        label="Oppsummert i stikkord:"
        size="small"
        value={comment ?? ''}
        placeholder="NB: Ingen personopplysninger"
        maxLength={0}
        onChange={({ target }) => setComment(target.value)}
        disabled={!canEdit}
      />
    </StyledCommentField>
  );
};
