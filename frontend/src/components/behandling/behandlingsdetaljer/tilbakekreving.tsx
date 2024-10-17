import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useSetTilbakekrevingMutation } from '@app/redux-api/oppgaver/mutations/set-tilbakekreving';
import { Alert, BodyShort, Checkbox, CheckboxGroup, Heading, HelpText } from '@navikt/ds-react';
import { styled } from 'styled-components';

const TILBAKEKREVING_IDS = [
  '144',
  '145',
  '146',
  '147',
  '148',
  '149',
  '268',
  'FORSKL_8',
  'INNKL_25_T',
  'INNKL_26A_T',
  'INNKL_26B_T',
  'INNKL_29',
];

export const Tilbakekreving = () => {
  const { data: oppgave } = useOppgave();
  const [setTilbakekreving] = useSetTilbakekrevingMutation();
  const canEdit = useCanEditBehandling();

  if (oppgave === undefined) {
    return null;
  }

  const {
    id,
    tilbakekreving,
    resultat: { hjemmelIdSet },
  } = oppgave;

  if (!canEdit) {
    return (
      <Container>
        <Heading size="xsmall" style={{ fontSize: 16 }}>
          Tilbakekreving
        </Heading>
        <BodyShort size="small">Gjelder{tilbakekreving ? ' ' : ' ikke '}en tilbakekrevingssak</BodyShort>
      </Container>
    );
  }

  const showWarning = !tilbakekreving && TILBAKEKREVING_IDS.some((tid) => hjemmelIdSet.includes(tid));

  const legend = (
    <LegendContainer>
      Velg om det gjelder en tilbakekrevingssak
      <HelpText>
        Du skal huke av for at det gjelder en tilbakekrevingssak uavhengig av ytelse eller hjemmel for tilbakekreving.
        Du skal også huke av for at det gjelder en tilbakekrevingssak selv om du omgjør på det stønadsrettslige, og ikke
        går videre til spørsmålet om tilbakekreving, eller om tilbakekrevingssaken for eksempel gjelder klage- eller
        ankefrist.
      </HelpText>
    </LegendContainer>
  );

  return (
    <Container>
      <CheckboxGroup
        legend={legend}
        size="small"
        value={[tilbakekreving]}
        onChange={(v) => setTilbakekreving({ oppgaveId: id, tilbakekreving: v.includes(true) })}
      >
        <Checkbox value={true}>Tilbakekreving</Checkbox>
      </CheckboxGroup>

      {showWarning ? <Warning /> : null}
    </Container>
  );
};

const Warning = () => (
  <Alert variant="warning" size="small">
    Saken inneholder hjemler som er knyttet til tilbakekreving, men tilbakekreving er ikke huket av for. Er du sikker på
    at dette er riktig?
  </Alert>
);

const Container = styled.div`
  margin-top: var(--a-spacing-4);
`;

const LegendContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--a-spacing-1);
`;
