import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { Keys } from '@app/keys';
import { useUpdateCommentOrReplyMutation } from '@app/redux-api/smart-editor-comments';
import { Textarea } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import type React from 'react';
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useContext } from 'react';

interface Props {
  commentId: string;
  text: string;
  label: string;
}

export const WriteComment = memo(
  ({ commentId, text, label }: Props) => {
    const [value, setValue] = useState(text);
    const ref = useRef<HTMLTextAreaElement>(null);
    const { dokumentId, setEditCommentId } = useContext(SmartEditorContext);
    const [editComment] = useUpdateCommentOrReplyMutation();
    const oppgaveId = useOppgaveId();

    useLayoutEffect(() => {
      ref.current?.focus();
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    useEffect(() => {
      if (value === text || oppgaveId === skipToken) {
        return;
      }

      const timeout = setTimeout(async () => {
        await editComment({ commentId, text: value, oppgaveId, dokumentId }).unwrap();
      }, 500);

      return () => clearTimeout(timeout);
    }, [value, text, commentId, oppgaveId, dokumentId, editComment]);

    const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
      if (event.key === Keys.Escape) {
        close?.();
      }
    };

    return (
      <Textarea
        ref={ref}
        hideLabel
        label={label}
        maxLength={0}
        minRows={1}
        onChange={({ target }) => setValue(target.value)}
        onKeyDown={onKeyDown}
        placeholder="Skriv inn en kommentar"
        size="small"
        value={value}
        onBlur={async () => {
          setEditCommentId(null);
          setValue('');

          if (text === value || oppgaveId === skipToken) {
            return;
          }

          const data = await editComment({ commentId, text: value, oppgaveId, dokumentId }).unwrap();
          setValue(data.text);
        }}
      />
    );
  },
  (p, n) => p.commentId === n.commentId && p.label === n.label,
);
