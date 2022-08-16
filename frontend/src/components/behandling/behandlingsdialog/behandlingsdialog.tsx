import { Heading } from '@navikt/ds-react';
import React from 'react';
import { StyledBehandlingSection } from '../styled-components';
import { Medunderskriver } from './medunderskriver/medunderskriver';
import { Messages } from './messages/messages';

export const Behandlingsdialog = () => (
  <StyledBehandlingSection>
    <Heading level="1" size="medium" spacing>
      Behandlingsdialog
    </Heading>
    <Medunderskriver />
    <Messages />
  </StyledBehandlingSection>
);
