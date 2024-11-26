import { formatFoedselsnummer } from '@app/functions/format-id';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import type { LabelContentElement } from '@app/plate/types';
import { useYtelserAll } from '@app/simple-api-state/use-kodeverk';
import { PlateElement, type PlateElementProps } from '@udecode/plate-common/react';
import { setNodes } from '@udecode/slate';
import { useEffect, useMemo } from 'react';
import { styled } from 'styled-components';

export const LabelContent = (props: PlateElementProps<LabelContentElement>) => {
  const { children, element, editor } = props;
  const content = useContent(element.source);

  useEffect(() => {
    setNodes(editor, { result: content }, { at: [], match: (n) => n === element });
  }, [content, editor, element]);

  return (
    <PlateElement<LabelContentElement>
      {...props}
      asChild
      contentEditable={false}
      onDragStart={(event) => event.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <span>
        {content === null ? null : (
          <StyledLabelContent>
            <b>{element.label}</b>: {content}
          </StyledLabelContent>
        )}
        {children}
      </span>
    </PlateElement>
  );
};

export enum Source {
  YTELSE = 'ytelse',
  SAKEN_GJELDER_NAME = 'sakenGjelder.name',
  SAKEN_GJELDER_FNR = 'sakenGjelder.fnr',
  SAKSNUMMER = 'saksnummer',
  SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME = 'sakenGjelderIfDifferentFromKlager.name',
  KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME = 'klagerIfEqualToSakenGjelder.name',
  KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME = 'klagerIfDifferentFromSakenGjelder.name',
}

const useContent = (source: Source): string | null => {
  const { data: oppgave } = useOppgave();
  const { data: ytelser = [] } = useYtelserAll();

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  return useMemo(() => {
    if (oppgave === undefined) {
      return null;
    }

    if (source === Source.YTELSE) {
      const ytelse = ytelser.find(({ id }) => id === oppgave.ytelseId)?.navn ?? oppgave.ytelseId;

      return `${ytelse}\n`;
    }

    if (source === Source.SAKEN_GJELDER_NAME) {
      return `${oppgave.sakenGjelder.name ?? '-'}\n`;
    }

    if (source === Source.SAKEN_GJELDER_FNR) {
      return `${formatFoedselsnummer(oppgave.sakenGjelder.id)}\n`;
    }

    if (source === Source.SAKSNUMMER) {
      return oppgave.saksnummer;
    }

    const { klager, sakenGjelder } = oppgave;

    if (source === Source.SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME) {
      if (klager.id !== sakenGjelder.id) {
        return `${sakenGjelder.name ?? '-'}\n`;
      }

      return null;
    }

    if (source === Source.KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME) {
      if (klager.id === sakenGjelder.id) {
        return `${klager.name ?? '-'}\n`;
      }

      return null;
    }

    if (source === Source.KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME) {
      if (klager.id !== sakenGjelder.id) {
        return `${klager.name ?? '-'}\n`;
      }

      return null;
    }

    return 'Verdi mangler\n';
  }, [oppgave, source, ytelser]);
};

const StyledLabelContent = styled.span`
  color: var(--a-gray-700);
`;
