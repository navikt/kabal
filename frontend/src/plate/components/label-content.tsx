import { SmartEditorContext } from '@app/components/smart-editor/context';
import { formatFoedselsnummer } from '@app/functions/format-id';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { ToolbarButtonWithConfirm } from '@app/plate/components/common/toolbar-button-with-confirm';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { type LabelContentElement, LabelContentSource } from '@app/plate/types';
import { useYtelserAll } from '@app/simple-api-state/use-kodeverk';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { TrashIcon } from '@navikt/aksel-icons';
import { PlateElement, type PlateElementProps } from '@udecode/plate/react';
import { useContext, useEffect, useMemo } from 'react';

export const LabelContent = (props: PlateElementProps<LabelContentElement>) => {
  const { children, element, editor } = props;
  const content = useContent(element.source);
  const label = useLabel(element.source);
  const { canManage } = useContext(SmartEditorContext);

  useEffect(() => {
    editor.tf.setNodes({ result: content }, { at: [], match: (n) => n === element });
  }, [content, editor, element]);

  useEffect(() => {
    editor.tf.setNodes({ label }, { at: [], match: (n) => n === element });
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
      <SectionContainer data-element={element.type} $sectionType={SectionTypeEnum.LABEL}>
        {content === null ? null : (
          <span className="text-gray-700">
            <b>{label}</b>: {content}
          </span>
        )}
        {children}
        {canManage ? (
          <SectionToolbar>
            <ToolbarButtonWithConfirm
              onClick={() => editor.tf.removeNodes({ match: (n) => n === element, at: [] })}
              icon={<TrashIcon aria-hidden />}
              tooltip={`Slett ${label?.toLowerCase()}`}
            />
          </SectionToolbar>
        ) : null}
      </SectionContainer>
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
      case LabelContentSource.EKSPEDISJONSBREV_ANKEMOTPART:
        return 'Ankemotpart';
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

    if (source === LabelContentSource.EKSPEDISJONSBREV_ANKEMOTPART) {
      return 'Nav klageinstans\n';
    }

    return 'Verdi mangler\n';
  }, [oppgave, source, ytelser]);
};
