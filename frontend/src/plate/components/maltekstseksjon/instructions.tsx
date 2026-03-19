import { BodyShort, Heading } from '@navikt/ds-react';
import { useEffect } from 'react';
import { Alert } from '@/components/alert/alert';
import { MALTEKST_SECTION_NAMES } from '@/components/smart-editor/constants';
import { useSmartEditorActiveDocument } from '@/hooks/settings/use-setting';
import { pushError } from '@/observability';
import type { ScoredText } from '@/plate/functions/lex-specialis/lex-specialis';
import type { TemplateSections } from '@/plate/template-sections';
import type { IMaltekstseksjon } from '@/types/maltekstseksjoner/responses';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

interface DebugData {
  tiedList: ScoredText<IMaltekstseksjon>[];
  templateId: string;
  section: TemplateSections;
}

interface Props extends DebugData {
  oppgave: IOppgavebehandling;
}

export const Instructions = ({ oppgave, section, tiedList, templateId }: Props) => {
  const text = getText(oppgave);

  const heading = (
    <Heading size="xsmall" level="1">
      {MALTEKST_SECTION_NAMES[section]}
    </Heading>
  );

  if (text !== null) {
    return (
      <Alert variant="info" contentEditable={false} className="my-4">
        {heading}
        {text}
      </Alert>
    );
  }

  if (tiedList.length === 0) {
    return null;
  }

  return (
    <Alert variant="warning" contentEditable={false} className="my-4">
      {heading}
      <TieText {...oppgave.resultat} section={section} templateId={templateId} tiedList={tiedList} />
    </Alert>
  );
};

const getText = (oppgave: IOppgavebehandling) => {
  const { utfallId, hjemmelIdSet, extraUtfallIdSet } = oppgave.resultat;
  const missingUtfall = utfallId === null && extraUtfallIdSet.length === 0;
  const missingHjemmel = hjemmelIdSet.length === 0;

  if (missingUtfall && missingHjemmel) {
    return (
      <>
        Velg <strong>utfall/resultat</strong> og <strong>hjemmel</strong> for å se tekst her.
      </>
    );
  }

  if (missingUtfall) {
    return (
      <>
        Velg <strong>utfall/resultat</strong> for å se tekst her.
      </>
    );
  }

  if (missingHjemmel) {
    return (
      <>
        Velg <strong>hjemmel</strong> for å se tekst her.
      </>
    );
  }

  return null;
};

type TieTextProps = DebugData & IOppgavebehandling['resultat'];

const TieText = ({ utfallId, extraUtfallIdSet, hjemmelIdSet, section, templateId, tiedList }: TieTextProps) => {
  const { value: documentId = 'UNKNOWN' } = useSmartEditorActiveDocument();

  useEffect(() => {
    const fields = Object.entries({
      documentId,
      utfallId: utfallId ?? 'null',
      extraUtfallIdSet: extraUtfallIdSet.join(', '),
      hjemmelIdSet: hjemmelIdSet.join(', '),
      section,
      templateId,
      scores: tiedList.map(({ maltekstseksjon, score }) => `${maltekstseksjon.id} (${score})`).join(', '),
    })
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    pushError(new Error(`Maltekstseksjon missing. ${fields}`));
  }, [documentId, extraUtfallIdSet, hjemmelIdSet, section, templateId, tiedList, utfallId]);

  return (
    <>
      <BodyShort size="small">Her skulle Kabal ha funnet passende tekst. 🤔</BodyShort>
      <BodyShort size="small" spacing>
        Enten mangler det tekster fra redaktør eller så er det en teknisk feil i Kabal.
      </BodyShort>
      <BodyShort size="small">
        <strong>Kontakt Team Klage i kanalen «Tilbakemelding til Kabal» på Teams.</strong>
      </BodyShort>
    </>
  );
};
