import { BodyShort, Label } from '@navikt/ds-react';
import { getTitleCapitalized } from '@/components/behandling/behandlingsdialog/medunderskriver/get-title';
import { formatEmployeeNameAndIdFallback } from '@/domain/employee-name';
import type { SaksTypeEnum } from '@/types/kodeverk';
import type { IMedunderskriverRol } from '@/types/oppgave-common';

interface Props {
  medunderskriver: IMedunderskriverRol;
  typeId: SaksTypeEnum;
}

export const MedunderskriverReadOnly = ({ medunderskriver, typeId }: Props) => {
  const title = getTitleCapitalized(typeId);

  return (
    <>
      <Label size="small">{title}</Label>
      <BodyShort>{formatEmployeeNameAndIdFallback(medunderskriver.employee, 'Ikke satt')}</BodyShort>
    </>
  );
};
