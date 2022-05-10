import React, { useEffect, useState } from 'react';
import { Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { getFullName } from '../../../domain/name';
import { formatPersonNum } from '../../../functions/format-id';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { IOppgavebehandling } from '../../../types/oppgavebehandling/oppgavebehandling';
import { ParagraphStyle } from '../styled-elements/content';
import { TextAlignEnum } from '../types/editor-enums';
import { LabelContentElementType } from '../types/editor-void-types';
import { voidStyle } from './style';

interface Props {
  element: LabelContentElementType;
}

export const LabelElement = ({ element }: Props) => {
  const editor = useSlateStatic();
  const { data: oppgave } = useOppgave();
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (result === null) {
      return;
    }

    Transforms.setNodes<LabelContentElementType>(editor, { result }, { at: [], match: (n) => n === element });
  }, [editor, element, result]);

  useEffect(() => {
    if (typeof oppgave === 'undefined') {
      return;
    }

    const content = getContent(oppgave, element.source);

    if (element.label.length === 0) {
      setResult(content);
    } else {
      setResult(`${element.label}: ${content}`);
    }
  }, [element.label, element.source, oppgave]);

  if (typeof oppgave === 'undefined') {
    return null;
  }

  return (
    <VoidParagraphStyle textAlign={TextAlignEnum.TEXT_ALIGN_LEFT} contentEditable={false}>
      {result}
    </VoidParagraphStyle>
  );
};

const getContent = (oppgave: IOppgavebehandling, source: string): string => {
  if (source === 'sakenGjelder.name') {
    return getFullName(oppgave.sakenGjelder.person?.navn);
  }

  if (source === 'sakenGjelder.fnr') {
    return formatPersonNum(oppgave.sakenGjelder.person?.foedselsnummer);
  }

  return 'Verdi mangler';
};

const VoidParagraphStyle = styled(ParagraphStyle)`
  ${voidStyle}
`;
