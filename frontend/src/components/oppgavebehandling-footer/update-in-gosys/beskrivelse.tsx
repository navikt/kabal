import { type IKodeverkSimpleValue, SaksTypeEnum, type UtfallEnum } from '@app/types/kodeverk';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Textarea } from '@navikt/ds-react';

interface Props {
  beskrivelse: string;
  setBeskrivelse: (beskrivelse: string) => void;
}

const getPrefix = (type: SaksTypeEnum) => {
  switch (type) {
    case SaksTypeEnum.KLAGE:
      return 'Klageinstansen har fullført behandling av klage';
    case SaksTypeEnum.ANKE:
      return 'Klageinstansen har sendt anken til Trygderetten';
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return 'Trygderetten har fullført behandling av anken';
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
      return 'Klageinstansen har fullført ny behandling etter Trygderetten har opphevet';
  }
};

export const getInitialBeskrivelse = (oppgave: IOppgavebehandling, utfall: IKodeverkSimpleValue<UtfallEnum>[]) => {
  const prefix = getPrefix(oppgave.typeId);

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
