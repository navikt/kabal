import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useKvalitetsvurdering } from '@app/hooks/use-kvalitetsvurdering';
import { useUpdateKvalitetsvurderingMutation } from '@app/redux-api/kaka-kvalitetsvurdering/v1';
import type { IKvalitetsvurderingTexts, IKvalitetsvurderingV1 } from '@app/types/kaka-kvalitetsvurdering/v1';
import { Textarea } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

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
  const canEdit = useIsTildeltSaksbehandler();

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
    <div className="ml-8 w-[calc(100%_-_var(--ax-space-32))]">
      <Textarea
        label="Oppsummert i stikkord"
        size="small"
        value={comment ?? ''}
        placeholder="NB: Ingen personopplysninger"
        maxLength={0}
        onChange={({ target }) => setComment(target.value)}
        disabled={!canEdit}
      />
    </div>
  );
};
