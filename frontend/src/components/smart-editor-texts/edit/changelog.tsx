import { Button, Modal, Table } from '@navikt/ds-react';
import React, { Fragment, useCallback, useRef } from 'react';
import { styled } from 'styled-components';
import { isoDateTimeToPretty } from '@app/domain/date';
import { TextChangeType } from '@app/types/common-text-types';
import { IText } from '@app/types/texts/responses';

interface Props {
  versions: IText[];
}

export const Changelog = ({ versions }: Props) => {
  const ref = useRef<HTMLDialogElement>(null);

  const openModal = useCallback(() => {
    ref.current?.showModal();
  }, []);

  if (versions.length === 0) {
    return null;
  }

  return (
    <>
      <Button onClick={openModal} size="xsmall" variant="tertiary">
        Endringslogg
      </Button>
      <Modal header={{ heading: 'Endringslogg' }} ref={ref} closeOnBackdropClick>
        <Modal.Body>
          <Table zebraStripes>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Dato</Table.HeaderCell>
                <Table.HeaderCell>Endring</Table.HeaderCell>
                <Table.HeaderCell>Redaktør</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {versions.flatMap((version) => (
                <Fragment key={version.versionId}>
                  {version.published ? <Version {...version} /> : null}
                  {version.editors.map(({ created, changeType, navIdent }) => (
                    <Table.Row key={`${changeType}-${created}-${navIdent}`}>
                      <Table.DataCell>{isoDateTimeToPretty(created)}</Table.DataCell>
                      <Table.DataCell>{CHANGE_TYPE_NAMES[changeType]}</Table.DataCell>
                      <Table.DataCell>{navIdent}</Table.DataCell>
                    </Table.Row>
                  ))}
                </Fragment>
              ))}
            </Table.Body>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
};

const Version = ({ publishedBy, publishedDateTime }: IText) => (
  <VersionRow>
    <Table.DataCell>{isoDateTimeToPretty(publishedDateTime)}</Table.DataCell>
    <Table.DataCell>Publisert</Table.DataCell>
    <Table.DataCell>{publishedBy}</Table.DataCell>
  </VersionRow>
);

const VersionRow = styled(Table.Row)`
  font-weight: bold;
`;

const CHANGE_TYPE_NAMES: Record<TextChangeType, string> = {
  [TextChangeType.PLAIN_TEXT_NB]: 'Endret tekst (bokmål)',
  [TextChangeType.PLAIN_TEXT_NN]: 'Endret tekst (nynorsk)',
  [TextChangeType.RICH_TEXT_NB]: 'Endret tekst (bokmål)',
  [TextChangeType.RICH_TEXT_NN]: 'Endret tekst (nynorsk)',
  [TextChangeType.RICH_TEXT_UNTRANSLATED]: 'Endret tekst (ikke oversatt)',
  [TextChangeType.TEXT_TITLE]: 'Endret tittel',
  [TextChangeType.TEXT_TYPE]: 'Endret teksttype',
  [TextChangeType.TEXT_VERSION_CREATED]: 'Opprettet versjon',
  [TextChangeType.TEXT_ENHETER]: 'Endret enheter',
  [TextChangeType.TEXT_SECTIONS]: 'Endret seksjoner',
  [TextChangeType.TEXT_UTFALL]: 'Endret utfall',
  [TextChangeType.TEXT_YTELSE_HJEMMEL]: 'Endret ytelser/hjemler',
  [TextChangeType.UNKNOWN]: 'Ukjent endring',
  [TextChangeType.SMART_EDITOR_VERSION]: 'Endret smart editor-versjon',
};
