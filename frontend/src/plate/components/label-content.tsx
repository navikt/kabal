import { formatFoedselsnummer } from '@app/functions/format-id';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { ToolbarButtonWithConfirm } from '@app/plate/components/common/toolbar-button-with-confirm';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { type LabelContentElement, LabelContentSource } from '@app/plate/types';
import { useYtelserAll } from '@app/simple-api-state/use-kodeverk';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { TrashIcon } from '@navikt/aksel-icons';
import { PlateElement, type PlateElementProps, useEditorReadOnly } from 'platejs/react';
import { useEffect, useMemo } from 'react';

export const LabelContent = (props: PlateElementProps<LabelContentElement>) => {
  const { children, element, editor, path } = props;
  const content = useContent(element.source);
  const label = useLabel(element.source);
  const readOnly = useEditorReadOnly();

  useEffect(() => {
    editor.tf.setNodes({ result: content }, { at: path });
  }, [content, editor, path]);

  useEffect(() => {
    editor.tf.setNodes({ label }, { at: path });
  }, [label, editor, path]);

  return (
    <PlateElement<LabelContentElement>
      {...props}
      as="div"
      attributes={{
        ...props.attributes,
        contentEditable: false,
        onDragStart: (event) => event.preventDefault(),
        onDrop: (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
      }}
    >
      <SectionContainer data-element={element.type} sectionType={SectionTypeEnum.LABEL}>
        {content === null ? null : (
          <span className="text-gray-700">
            <b>{label}</b>: {content}
          </span>
        )}
        {children}
        {readOnly ? null : (
          <SectionToolbar>
            <ToolbarButtonWithConfirm
              onClick={() => editor.tf.removeNodes({ match: (n) => n === element, at: [] })}
              icon={<TrashIcon aria-hidden />}
              tooltip={`Slett ${label?.toLowerCase()}`}
            />
          </SectionToolbar>
        )}
      </SectionContainer>
    </PlateElement>
  );
};

const getKlagerLabel = (sakstype: SaksTypeEnum): string => {
  switch (sakstype) {
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
    case SaksTypeEnum.KLAGE:
      return 'Klager';
    case SaksTypeEnum.ANKE:
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return 'Den ankende part';
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR:
      return 'Den som begjærer gjenopptak';
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return 'Den som krever omgjøring';
  }
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
        return getKlagerLabel(oppgave.typeId);
      }
      case LabelContentSource.SAKSNUMMER:
        return 'Saksnummer';
      case LabelContentSource.ANKEMOTPART:
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

    if (source === LabelContentSource.ANKEMOTPART) {
      return 'Nav klageinstans\n';
    }

    return 'Verdi mangler\n';
  }, [oppgave, source, ytelser]);
};
