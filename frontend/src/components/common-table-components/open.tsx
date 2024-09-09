import { Button, ButtonProps } from '@navikt/ds-react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { useHasRole } from '@app/hooks/use-has-role';
import { useHasYtelseAccess } from '@app/hooks/use-has-ytelse-access';
import { Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState, IHelper } from '@app/types/oppgave-common';
import { IOppgave } from '@app/types/oppgaver';

interface Props
  extends Pick<ButtonProps, 'variant' | 'size'>,
    Pick<IOppgave, 'id' | 'tildeltSaksbehandlerident' | 'ytelseId' | 'typeId'> {
  children?: string;
  medunderskriverident: string | null;
  rol: IHelper | null;
}

export const OpenOppgavebehandling = ({
  id,
  tildeltSaksbehandlerident,
  medunderskriverident,
  ytelseId,
  typeId,
  rol,
  children = 'Åpne',
  variant = 'primary',
  size = 'small',
}: Props) => {
  const isMerkantil = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const hasYtelseAccess = useHasYtelseAccess(ytelseId);
  const { user } = useContext(StaticDataContext);
  const isKrol = useHasRole(Role.KABAL_KROL);

  const canOpen =
    isMerkantil ||
    hasYtelseAccess ||
    user.navIdent === tildeltSaksbehandlerident ||
    user.navIdent === medunderskriverident ||
    (rol !== null && user.navIdent === rol.employee?.navIdent) ||
    (rol !== null && rol.flowState === FlowState.SENT && isKrol);

  if (!canOpen) {
    return null;
  }

  const commonProps = { as: Link, variant, size, children, 'data-oppgavebehandlingid': id };

  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return (
        <Button
          {...commonProps}
          to={`/klagebehandling/${id}`}
          data-testid="klagebehandling-open-link"
          data-klagebehandlingid={id}
        />
      );
    case SaksTypeEnum.ANKE:
      return (
        <Button
          {...commonProps}
          to={`/ankebehandling/${id}`}
          data-testid="ankebehandling-open-link"
          data-ankebehandlingid={id}
        />
      );
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return (
        <Button
          {...commonProps}
          to={`/trygderettsankebehandling/${id}`}
          data-testid="trygderettsankebehandling-open-link"
          data-trygderettsankebehandlingid={id}
        />
      );
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
      return (
        <Button
          {...commonProps}
          to={`/behandling-etter-tr-opphevet/${id}`}
          data-testid="behandling-etter-tr-opphevet-open-link"
          data-behandling-etter-tr-opphevet-id={id}
        />
      );
  }
};
