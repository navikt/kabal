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

  const prefix = `Klageinstansen har fullført behandling av ${typeName}`;

  const { utfallId, extraUtfallIdSet } = oppgave.resultat;

  if (utfallId === null) {
    return `${prefix}.`;
  }

  const utfallName = utfall.find(({ id }) => id === utfallId)?.navn.toLowerCase() ?? `${utfallId} (navn ikke funnet)`;

  if (extraUtfallIdSet.length > 0) {
    const extraUtfallNameList = extraUtfallIdSet
      .filter((id) => id !== utfallId)
      .map((id) => utfall.find(({ id: uid }) => uid === id)?.navn.toLowerCase() ?? `${id} (navn ikke funnet)`);

    const [first] = extraUtfallNameList;

    if (first === undefined) {
      return `${prefix} med utfall ${utfallName}.`;
    }

    const extraUtfallNames =
      extraUtfallIdSet.length === 1
        ? first
        : `${extraUtfallNameList.slice(0, -1).join(', ')} og ${extraUtfallNameList.slice(-1)}`;

    return `${prefix} med hovedutfall ${utfallName} og ekstra utfall ${extraUtfallNames}.`;
  }

  return `${prefix} med utfall ${utfallName}.`;
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
