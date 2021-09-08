import { IKodeverkVerdi } from '../tilstand/moduler/kodeverk';
import { velgKodeverk } from '../tilstand/moduler/kodeverk.velgere';
import { useAppSelector } from '../tilstand/konfigurerTilstand';

export const getTemakodeById = (temaId?: string | null): string => {
  const kodeverk = useAppSelector(velgKodeverk);
  if (kodeverk.kodeverk.tema && typeof temaId === 'string') {
    return kodeverk.kodeverk.tema.find((t: IKodeverkVerdi) => t.id == temaId)?.navn ?? '';
  }
  return '';
};

export const getTypekodeById = (typeId?: string | null): string => {
  const kodeverk = useAppSelector(velgKodeverk);
  if (kodeverk.kodeverk.type && typeof typeId === 'string') {
    return kodeverk.kodeverk.type.find((t: IKodeverkVerdi) => t.id == typeId)?.navn ?? '';
  }
  return '';
};

export const getHjemmelkodeById = (hjemmelId?: string | null): string => {
  const kodeverk = useAppSelector(velgKodeverk);
  if (kodeverk.kodeverk.hjemmel && typeof hjemmelId === 'string') {
    return kodeverk.kodeverk.type.find((t: IKodeverkVerdi) => t.id == hjemmelId)?.navn ?? '';
  }
  return '';
};
