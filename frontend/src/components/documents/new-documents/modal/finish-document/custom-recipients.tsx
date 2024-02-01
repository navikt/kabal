import { CheckmarkCircleIcon, TrashIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { Button, Label, Table, Tag } from '@navikt/ds-react';
import React from 'react';
import { EditPart } from '@app/components/part/edit-part';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { formatIdNumber } from '@app/functions/format-id';
import { IPart } from '@app/types/oppgave-common';
import { IErrorProperty } from './is-send-error';

interface Props {
  brevMottakere: IPart[];
  setBrevMottakere: (brevMottakerIds: IPart[]) => void;
  sendErrors: IErrorProperty[];
}

export const CustomRecipients = ({ brevMottakere, setBrevMottakere, sendErrors }: Props) => (
  <section>
    <Label size="small" htmlFor="extra-recipients">
      Ekstra mottakere
    </Label>
    <EditPart
      isLoading={false}
      id="extra-recipients"
      onChange={(part) => {
        if (!brevMottakere.some(({ id }) => id === part.id)) {
          setBrevMottakere([...brevMottakere, part]);
        }
      }}
      buttonText="Legg til mottaker"
    />
    <Recipients brevMottakere={brevMottakere} setBrevMottakere={setBrevMottakere} sendErrors={sendErrors} />
  </section>
);

const Recipients = ({ brevMottakere, setBrevMottakere, sendErrors }: Props) => {
  if (brevMottakere.length === 0) {
    return null;
  }

  return (
    <Table size="small" zebraStripes>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell>ID-nummer</Table.HeaderCell>
          <Table.HeaderCell>Navn</Table.HeaderCell>
          <Table.HeaderCell />
          <Table.HeaderCell />
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {brevMottakere.map(({ id, name, statusList }) => {
          const error = sendErrors.find((e) => e.field === id)?.reason ?? null;

          return (
            <Table.Row key={id}>
              <Table.DataCell>
                {error === null ? (
                  <CheckmarkCircleIcon aria-hidden color="var(--a-icon-success)" />
                ) : (
                  <XMarkOctagonFillIcon aria-hidden color="var(--a-icon-danger)" />
                )}
              </Table.DataCell>
              <Table.DataCell>{formatIdNumber(id)}</Table.DataCell>
              <Table.DataCell>{name ?? 'Navn mangler'}</Table.DataCell>
              <Table.DataCell>
                <PartStatusList statusList={statusList} size="xsmall" />
              </Table.DataCell>
              <Table.DataCell>
                <Button
                  variant="danger"
                  icon={<TrashIcon aria-hidden />}
                  onClick={() => setBrevMottakere(brevMottakere.filter((p) => p.id !== id))}
                  size="xsmall"
                />
              </Table.DataCell>
              <Table.DataCell>
                {error === null ? null : (
                  <Tag variant="error" size="xsmall">
                    {error}
                  </Tag>
                )}
              </Table.DataCell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};
