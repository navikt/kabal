import { formatFoedselsnummer } from '@app/functions/format-id';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { type LabelContentElement, LabelContentSource } from '@app/plate/types';
import { useYtelserAll } from '@app/simple-api-state/use-kodeverk';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { PlateElement, type PlateElementProps } from '@udecode/plate-common/react';
import { setNodes } from '@udecode/slate';
import { useEffect, useMemo } from 'react';
import { styled } from 'styled-components';

export const LabelContent = (props: PlateElementProps<LabelContentElement>) => {
  const { children, element, editor } = props;
  const content = useContent(element.source);
  const label = useLabel(element.source);

  useEffect(() => {
    setNodes(editor, { result: content }, { at: [], match: (n) => n === element });
  }, [content, editor, element]);

  useEffect(() => {
    setNodes(editor, { label }, { at: [], match: (n) => n === element });
  }, [label, editor, element]);

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
            <b>{label}</b>: {content}
          </StyledLabelContent>
        )}
        {children}
      </span>
    </PlateElement>
  );
};

const useLabel = (source: LabelContentSource): string | undefined => {
  const { data: oppgave } = useOppgave();

  return useMemo(() => {
    if (oppgave === undefined) {
      return undefined;
    }

    switch (source) {
      case LabelContentSource.YTELSE:
        return 'Ytelse';
      case LabelContentSource.SAKEN_GJELDER_NAME:
      case LabelContentSource.SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME:
        return 'Saken gjelder';
      case LabelContentSource.SAKEN_GJELDER_FNR:
        return 'Fødselsnummer';
      case LabelContentSource.KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME:
      case LabelContentSource.KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME: {
        switch (oppgave.typeId) {
          case SaksTypeEnum.ANKE:
            return 'Den ankende part';
          case SaksTypeEnum.OMGJØRINGSKRAV:
            return 'Den som krever omgjøring';
          default:
            return 'Klager';
        }
      }
      case LabelContentSource.SAKSNUMMER:
        return 'Saksnummer';
    }
  }, [oppgave, source]);
};

const useContent = (source: LabelContentSource): string | null => {
  const { data: oppgave } = useOppgave();
  const { data: ytelser = [] } = useYtelserAll();

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  return useMemo(() => {
    if (oppgave === undefined) {
      return null;
    }

    if (source === LabelContentSource.YTELSE) {
      const ytelse = ytelser.find(({ id }) => id === oppgave.ytelseId)?.navn ?? oppgave.ytelseId;

      return `${ytelse}\n`;
    }

    if (source === LabelContentSource.SAKEN_GJELDER_NAME) {
      return `${oppgave.sakenGjelder.name ?? '-'}\n`;
    }

    if (source === LabelContentSource.SAKEN_GJELDER_FNR) {
      return `${formatFoedselsnummer(oppgave.sakenGjelder.identifikator)}\n`;
    }

    if (source === LabelContentSource.SAKSNUMMER) {
      return oppgave.saksnummer;
    }

    const { klager, sakenGjelder } = oppgave;

    if (source === LabelContentSource.SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME) {
      if (klager.identifikator !== sakenGjelder.identifikator) {
        return `${sakenGjelder.name ?? '-'}\n`;
      }

      return null;
    }

    if (source === LabelContentSource.KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME) {
      if (klager.identifikator === sakenGjelder.identifikator) {
        return `${klager.name ?? '-'}\n`;
      }

      return null;
    }

    if (source === LabelContentSource.KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME) {
      if (klager.identifikator !== sakenGjelder.identifikator) {
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
