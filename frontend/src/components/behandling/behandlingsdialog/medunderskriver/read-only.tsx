import { getTitleCapitalized } from '@app/components/behandling/behandlingsdialog/medunderskriver/get-title';
import { formatEmployeeNameAndIdFallback } from '@app/domain/employee-name';
import type { SaksTypeEnum } from '@app/types/kodeverk';
import type { IMedunderskriverRol } from '@app/types/oppgave-common';
import { BodyShort, Label } from '@navikt/ds-react';

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
