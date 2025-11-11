import { StaticDataContext } from '@app/components/app/static-data-context';
import { useHasRole } from '@app/hooks/use-has-role';
import { useHasYtelseAccess } from '@app/hooks/use-has-ytelse-access';
import { Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState, type IHelper } from '@app/types/oppgave-common';
import type { IOppgave } from '@app/types/oppgaver';
import { Button, type ButtonProps } from '@navikt/ds-react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

interface BaseProps extends Pick<ButtonProps, 'variant' | 'size' | 'className'> {
  children?: string;
}

interface RoleAccessedProps
  extends BaseProps,
    Pick<IOppgave, 'id' | 'tildeltSaksbehandlerident' | 'ytelseId' | 'typeId'> {
  medunderskriverident: string | null;
  rol: IHelper | null;
}

export const OpenForRoleAccess = ({
  id,
  tildeltSaksbehandlerident,
  medunderskriverident,
  typeId,
  rol,
  children = 'Åpne',
  variant = 'primary',
  size = 'small',
  className,
}: RoleAccessedProps) => {
  const isMerkantil = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const { user } = useContext(StaticDataContext);
  const isKrol = useHasRole(Role.KABAL_KROL);

  const canOpen =
    isMerkantil ||
    user.navIdent === tildeltSaksbehandlerident ||
    user.navIdent === medunderskriverident ||
    (rol !== null && user.navIdent === rol.employee?.navIdent) ||
    (rol !== null && rol.flowState === FlowState.SENT && isKrol);

  if (!canOpen) {
    return null;
  }

  return (
    <Button
      as={Link}
      variant={variant}
      size={size}
      to={`${BEHANDLING_PATH_PREFIX[typeId]}/${id}`}
      className={className}
    >
      {children}
    </Button>
  );
};

interface YtelseAccessedProps extends BaseProps, Pick<IOppgave, 'id' | 'ytelseId' | 'typeId'> {}

/** Only access to the ytelse is enough to be allowed to open the case. */
export const OpenForYtelseAccess = ({
  id,
  ytelseId,
  typeId,
  children = 'Åpne',
  variant = 'primary',
  size = 'small',
  className,
}: YtelseAccessedProps) => {
  const isMerkantil = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const hasYtelseAccess = useHasYtelseAccess(ytelseId);

  const canOpen = isMerkantil || hasYtelseAccess;

  if (!canOpen) {
    return null;
  }

  return (
    <Button
      as={Link}
      variant={variant}
      size={size}
      to={`${BEHANDLING_PATH_PREFIX[typeId]}/${id}`}
      className={className}
    >
      {children}
    </Button>
  );
};

const BEHANDLING_PATH_PREFIX: Record<SaksTypeEnum, string> = {
  [SaksTypeEnum.KLAGE]: '/klagebehandling',
  [SaksTypeEnum.ANKE]: '/ankebehandling',
  [SaksTypeEnum.ANKE_I_TRYGDERETTEN]: '/trygderettsankebehandling',
  [SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET]: '/behandling-etter-tr-opphevet',
  [SaksTypeEnum.OMGJØRINGSKRAV]: '/omgjøringskravbehandling',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK]: '/begjaering-om-gjenopptak-behandling',
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR]: '/begjaering-om-gjenopptak-i-tr-behandling',
};
