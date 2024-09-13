import { formatEmployeeNameAndId } from '@app/domain/employee-name';
import type { INavEmployee } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { Alert } from '@navikt/ds-react';

interface Props {
  previousSaksbehandler: INavEmployee | null;
  type: SaksTypeEnum.ANKE_I_TRYGDERETTEN | SaksTypeEnum.ANKE;
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

const getTypeName = (type: SaksTypeEnum.ANKE_I_TRYGDERETTEN | SaksTypeEnum.ANKE) => {
  switch (type) {
    case SaksTypeEnum.ANKE:
      return 'klagebehandling';
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return 'ankebehandling';
  }
};
