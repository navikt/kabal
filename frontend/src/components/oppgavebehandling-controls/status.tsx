import { FlowerPetalFallingIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';
import React from 'react';
import { isoDateToPretty } from '@app/domain/date';
import { IOppgavebehandlingBase } from '@app/types/oppgavebehandling/oppgavebehandling';

export const Fortrolig = ({ fortrolig }: Pick<IOppgavebehandlingBase, 'fortrolig'>) =>
  fortrolig === true ? (
    <Tag size="small" variant="info">
      Fortrolig
    </Tag>
  ) : null;

export const StrengtFortrolig = ({ strengtFortrolig }: Pick<IOppgavebehandlingBase, 'strengtFortrolig'>) =>
  strengtFortrolig === true ? (
    <Tag size="small" variant="alt1">
      Strengt fortrolig
    </Tag>
  ) : null;

export const EgenAnsatt = ({ egenansatt }: Pick<IOppgavebehandlingBase, 'egenansatt'>) =>
  egenansatt === true ? (
    <Tag size="small" variant="warning">
      Egen ansatt
    </Tag>
  ) : null;

export const Dead = ({ dead }: Pick<IOppgavebehandlingBase, 'dead'>) =>
  dead !== null ? (
    <Tag size="small" variant="error">
      <FlowerPetalFallingIcon aria-hidden /> Død ({isoDateToPretty(dead)})
    </Tag>
  ) : null;

export const Verge = ({
  vergemaalEllerFremtidsfullmakt,
}: Pick<IOppgavebehandlingBase, 'vergemaalEllerFremtidsfullmakt'>) =>
  vergemaalEllerFremtidsfullmakt === true ? (
    <Tag size="small" variant="success" title="Vergemål eller fremtidsfullmakt. Sjekk Modia for detaljer.">
      Vergemål
    </Tag>
  ) : null;

export const Fullmakt = ({ fullmakt }: Pick<IOppgavebehandlingBase, 'fullmakt'>) =>
  fullmakt === true ? (
    <Tag size="small" variant="success">
      Fullmakt
    </Tag>
  ) : null;
