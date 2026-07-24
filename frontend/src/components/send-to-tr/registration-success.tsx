import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Label, LocalAlert, Tag } from '@navikt/ds-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Person } from '@/components/send-to-tr/person';
import type { RegisteredAnke } from '@/components/send-to-tr/types';
import { isoDateToPretty } from '@/domain/date';
import type { ListGosysOppgave } from '@/types/oppgavebehandling/oppgavebehandling';

interface RegistrationSuccessProps {
  registeredAnke: RegisteredAnke;
}

export const RegistrationSuccess = ({ registeredAnke }: RegistrationSuccessProps) => {
  const { ankeId, fnr, ytelse, fields, gosysOppgave } = registeredAnke;
  const { fagsakId, sakMottattKlageinstans, sendtTilTrygderetten, hjemmelIdList } = fields;

  const hjemler = hjemmelIdList.map((id) => (
    <Tag key={id} size="xsmall" data-color="meta-purple" variant="outline">
      {ytelse.innsendingshjemler.find((h) => h.id === id)?.beskrivelse ?? id}
    </Tag>
  ));

  return (
    <LocalAlert status="success" size="small" className="my-4 w-fit">
      <LocalAlert.Header>
        <LocalAlert.Title>Anke i Trygderetten fra Arena opprettet i Kabal</LocalAlert.Title>
      </LocalAlert.Header>

      <LocalAlert.Content className="flex flex-col">
        <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <Row label="Saken gjelder">
            <Person fnr={fnr} size="xsmall" />
          </Row>
          <Row label="Ytelse">
            <Tag data-color="info" variant="outline" size="xsmall">
              {ytelse.navn}
            </Tag>
          </Row>
          <Row label="Arkivsaksnummer">{fagsakId}</Row>
          <Row label="Anke mottatt klageinstans">{isoDateToPretty(sakMottattKlageinstans) ?? EMPTY}</Row>
          <Row label="Anke sendt til Trygderetten">{isoDateToPretty(sendtTilTrygderetten) ?? EMPTY}</Row>
          <Row label={hjemmelIdList.length === 1 ? 'Hjemmel' : 'Hjemler'}>{hjemler.length === 0 ? EMPTY : hjemler}</Row>
          <Row label="Gosys-oppgave">
            <GosysOppgave gosysOppgave={gosysOppgave} />
          </Row>
        </dl>

        <Button
          as={Link}
          to={`/behandling/${ankeId}`}
          target="_blank"
          icon={<ExternalLinkIcon aria-hidden />}
          size="small"
          className="w-fit self-end"
        >
          Åpne anke i Trygderetten
        </Button>
      </LocalAlert.Content>
    </LocalAlert>
  );
};

const EMPTY = 'Ikke satt';

interface RowProps {
  label: string;
  children: ReactNode;
}

const Row = ({ label, children }: RowProps) => (
  <>
    <Label as="dt" size="small">
      {label}
    </Label>
    <BodyShort as="dd" size="small" className="flex gap-x-2">
      {children}
    </BodyShort>
  </>
);

const GosysOppgave = ({ gosysOppgave }: { gosysOppgave: ListGosysOppgave | undefined }) => {
  if (gosysOppgave === undefined) {
    return EMPTY;
  }

  return (
    <>
      <Tag data-color="meta-lime" variant="outline" size="xsmall">
        {gosysOppgave.oppgavetype ?? 'Ukjent oppgavetype'}
      </Tag>
      <Tag data-color="neutral" variant="outline" size="xsmall">
        {gosysOppgave.id}
      </Tag>
    </>
  );
};
