import { type IKodeverkSimpleValue, SaksTypeEnum, type UtfallEnum } from '@app/types/kodeverk';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Textarea } from '@navikt/ds-react';

const getTypeName = (typeId: SaksTypeEnum) => {
  switch (typeId) {
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return 'anke i Trygderetten';
    case SaksTypeEnum.KLAGE:
      return 'klage';
    case SaksTypeEnum.ANKE:
      return 'anke';
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
      return 'behandling etter at Trygderetten har opphevet';
  }
};

interface Props {
  beskrivelse: string;
  setBeskrivelse: (beskrivelse: string) => void;
}

export const getInitialBeskrivelse = (oppgave: IOppgavebehandling, utfall: IKodeverkSimpleValue<UtfallEnum>[]) => {
  const typeName = getTypeName(oppgave.typeId);

  const utfallName =
    utfall.find(({ id }) => id === oppgave.resultat.utfallId)?.navn.toLowerCase() ??
    `${oppgave.resultat.utfallId} (navn ikke funnet)`;

  if (oppgave.resultat.extraUtfallIdSet.length > 0) {
    const extraUtfallNameList = oppgave.resultat.extraUtfallIdSet.map(
      (id) => utfall.find(({ id: utfallId }) => utfallId === id)?.navn.toLowerCase() ?? `${id} (navn ikke funnet)`,
    );

    const [first] = extraUtfallNameList;

    if (first === undefined) {
      ('');
    }

    const extraUtfallNames =
      oppgave.resultat.extraUtfallIdSet.length === 1
        ? first
        : `${extraUtfallNameList.slice(0, -1).join(', ')} og ${extraUtfallNameList.slice(-1)}`;

    return `Klageinstansen har fullført behandling av ${typeName} med hovedutfall ${utfallName} og ekstra utfall ${extraUtfallNames}.`;
  }

  return `Klageinstansen har fullført behandling av ${typeName} med utfall ${utfallName}.`;
};

export const Beskrivelse = ({ setBeskrivelse, beskrivelse }: Props) => (
  <Textarea
    size="small"
    label="Beskrivelse"
    placeholder="Beskrivelse"
    value={beskrivelse}
    onChange={({ target }) => setBeskrivelse(target.value)}
    maxRows={5}
    minRows={5}
  />
);
