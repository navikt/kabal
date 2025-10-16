import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { formatEmployeeNameAndId } from '@app/domain/employee-name';
import type { INavEmployee } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { Alert } from '@navikt/ds-react';

type Type =
  | SaksTypeEnum.ANKE_I_TRYGDERETTEN
  | SaksTypeEnum.ANKE
  | SaksTypeEnum.OMGJØRINGSKRAV
  | SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK
  | SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR;

interface Props {
  previousSaksbehandler: INavEmployee | null;
  type: Type;
}

export const PreviousSaksbehandler = ({ previousSaksbehandler, type }: Props) => {
  const heading = getHeading(type);

  if (previousSaksbehandler === null) {
    return (
      <BehandlingSection label={heading}>
        <Alert variant="info" size="small" inline>
          Bruk «Søk på person» for å finne hvem som fullførte tidligere {getTypeName(type)}.
        </Alert>
      </BehandlingSection>
    );
  }

  return <BehandlingSection label={heading}>{formatEmployeeNameAndId(previousSaksbehandler)}</BehandlingSection>;
};

const getTypeName = (type: Type): string => {
  switch (type) {
    case SaksTypeEnum.ANKE:
      return 'klagebehandling';
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return 'ankebehandling';
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return 'omgjøringskrav';
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
      return 'anke i Trygderetten-behandling';
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR:
      return 'begjæring om gjenopptak-behandling';
  }
};

const getHeading = (type: Type): string => {
  switch (type) {
    case SaksTypeEnum.ANKE:
      return 'Klagebehandling fullført av';
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return 'Ankebehandling fullført av';
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return 'Behandlingen som kreves omgjort er tidligere fullført av';
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
      return 'Anke i Trygderetten-oppgave fullført av';
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR:
      return 'Begjæring om gjenopptak-oppgave fullført av';
  }
};
