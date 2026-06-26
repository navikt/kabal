import { Textarea } from '@navikt/ds-react';
import { type IKodeverkSimpleValue, SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

interface Props {
  beskrivelse: string;
  setBeskrivelse: (beskrivelse: string) => void;
}

const getPrefix = (type: SaksTypeEnum): string => {
  switch (type) {
    case SaksTypeEnum.KLAGE:
      return 'Klageinstansen har fullført behandling av klage';
    case SaksTypeEnum.ANKE:
      return 'Klageinstansen har fullført behandling av anken';
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return 'Trygderetten har fullført behandling av anken';
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
      return 'Klageinstansen har fullført ny behandling etter Trygderetten har opphevet';
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return 'Klageinstansen har fullført behandling av omgjøringskrav';
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
      return 'Klageinstansen har fullført behandling av begjæringen om gjenopptak';
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR:
      return 'Trygderetten har fullført behandling av begjæring om gjenopptak';
  }
};

const getBody = (
  utfallId: UtfallEnum | null,
  extraUtfallIdSet: UtfallEnum[],
  kodeverk: IKodeverkSimpleValue<UtfallEnum>[],
): string => {
  if (utfallId === null) {
    return '.';
  }

  const utfallName = kodeverk.find(({ id }) => id === utfallId)?.navn.toLowerCase() ?? `${utfallId} (navn ikke funnet)`;

  if (extraUtfallIdSet.length > 0) {
    const extraUtfallNameList = extraUtfallIdSet
      .filter((id) => id !== utfallId)
      .map((id) => kodeverk.find(({ id: uid }) => uid === id)?.navn.toLowerCase() ?? `${id} (navn ikke funnet)`);

    const [first] = extraUtfallNameList;

    if (first === undefined) {
      return ` med utfall ${utfallName}.`;
    }

    const extraUtfallNames =
      extraUtfallIdSet.length === 1
        ? first
        : `${extraUtfallNameList.slice(0, -1).join(', ')} og ${extraUtfallNameList.slice(-1)}`;

    return ` med hovedutfall ${utfallName} og ekstra utfall: ${extraUtfallNames}.`;
  }

  return ` med utfall ${utfallName}.`;
};

export const getSuffix = (type: SaksTypeEnum, utfallId: UtfallEnum | null): string => {
  switch (type) {
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN: {
      if (utfallId === UtfallEnum.OPPHEVET) {
        return ' Vedtaksinstans skal gjøre ny behandling i saken.';
      }

      return '';
    }
    default:
      return '';
  }
};

export const getInitialBeskrivelse = (
  { typeId, resultat }: IOppgavebehandling,
  utfall: IKodeverkSimpleValue<UtfallEnum>[],
) => {
  const prefix = getPrefix(typeId);
  const body = getBody(resultat.utfallId, resultat.extraUtfallIdSet, utfall);
  const suffix = getSuffix(typeId, resultat.utfallId);

  return `${prefix}${body}${suffix}`;
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
