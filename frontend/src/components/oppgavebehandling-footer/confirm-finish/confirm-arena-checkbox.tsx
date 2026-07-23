import { Checkbox } from '@navikt/ds-react';
import { useMemo } from 'react';
import { useIsFakeArenaCase } from '@/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { SaksTypeEnum } from '@/types/kodeverk';

interface ConfirmArenaCheckboxProps {
  typeId: SaksTypeEnum;
  confirmed: boolean;
  setConfirmed: (confirmed: boolean) => void;
}

export const ConfirmArenaCheckbox = ({ typeId, confirmed, setConfirmed }: ConfirmArenaCheckboxProps) => {
  const isFakeArenaCase = useIsFakeArenaCase();

  const text = useMemo(() => {
    switch (typeId) {
      case SaksTypeEnum.KLAGE:
      case SaksTypeEnum.ANKE:
      case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
        return 'Jeg bekrefter at saken er besluttet i Arena.';
      case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
        return 'Jeg bekrefter at jeg har registrert utfallet fra Trygderetten i Arena';
      default:
        return null;
    }
  }, [typeId]);

  if (!isFakeArenaCase || text === null) {
    return null;
  }

  return (
    <Checkbox onChange={(e) => setConfirmed(e.target.checked)} checked={confirmed} size="small">
      {text}
    </Checkbox>
  );
};
