import { isoDateTimeToPretty } from '@app/domain/date';
import { TextChangeType } from '@app/types/common-text-types';
import type { IPublishedText, IText } from '@app/types/texts/responses';
import { ClockDashedIcon } from '@navikt/aksel-icons';
import { Button, Modal, Table } from '@navikt/ds-react';
import { Fragment, useCallback, useRef } from 'react';

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
      <Button onClick={openModal} size="xsmall" variant="tertiary-neutral" icon={<ClockDashedIcon aria-hidden />}>
        Vis endringslogg
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
                  {version.edits.map(({ created, changeType, actor }) => (
                    <Table.Row key={`${changeType}-${created}-${actor.navIdent}`}>
                      <Table.DataCell>{isoDateTimeToPretty(created)}</Table.DataCell>
                      <Table.DataCell>{CHANGE_TYPE_NAMES[changeType]}</Table.DataCell>
                      <Table.DataCell>{actor.navn}</Table.DataCell>
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

const Version = ({ publishedByActor, publishedDateTime }: IPublishedText) => (
  <Table.Row className="font-bold">
    <Table.DataCell>{isoDateTimeToPretty(publishedDateTime)}</Table.DataCell>
    <Table.DataCell>Publisert</Table.DataCell>
    <Table.DataCell>{publishedByActor.navn}</Table.DataCell>
  </Table.Row>
);

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
