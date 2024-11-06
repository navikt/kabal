import { formatEmployeeNameAndId } from '@app/domain/employee-name';
import type { INavEmployee } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { Alert } from '@navikt/ds-react';

type Type = SaksTypeEnum.ANKE_I_TRYGDERETTEN | SaksTypeEnum.ANKE | SaksTypeEnum.OMGJØRINGSKRAV;

interface Props {
  previousSaksbehandler: INavEmployee | null;
  type: Type;
}

export const PreviousSaksbehandler = ({ previousSaksbehandler, type }: Props) => {
  if (previousSaksbehandler === null) {
    return (
      <Alert variant="info" size="small" inline>
        Bruk «Søk på person» for å finne hvem som fullførte tidligere {getTypeName(type)}.
      </Alert>
    );
  }

  return formatEmployeeNameAndId(previousSaksbehandler);
};

const getTypeName = (type: Type) => {
  switch (type) {
    case SaksTypeEnum.ANKE:
      return 'klagebehandling';
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return 'ankebehandling';
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return 'omgjøringskrav';
  }
};
