import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { EditPart } from '@app/components/part/edit-part';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetAvsenderMutation, useSetInngaaendeKanalMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DocumentTypeEnum, type IDocument, InngaaendeKanal } from '@app/types/documents/documents';
import { PencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Label, Radio, RadioGroup } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

const INNGAAENDE_KANALER = Object.values(InngaaendeKanal);
const isInngaaendeKanal = (type: string): type is InngaaendeKanal => INNGAAENDE_KANALER.some((t) => t === type);

interface Props {
  document: IDocument;
  hasAccess: boolean;
}

export const AnnenInngaaende = ({ document, hasAccess }: Props) => {
  const [setKanal] = useSetInngaaendeKanalMutation();
  const [setAvsender, { isLoading }] = useSetAvsenderMutation();
  const isUploaded = document.type === DocumentTypeEnum.UPLOADED;
  const [editAvsender, setEditAvsender] = useState(hasAccess && isUploaded && document.avsender === null);
  const oppgaveId = useOppgaveId();

  if (oppgaveId === skipToken || !isUploaded) {
    return null;
  }

  return (
    <>
      <RadioGroup
        legend="Inngående kanal"
        onChange={(inngaaendeKanal) => {
          if (isInngaaendeKanal(inngaaendeKanal)) {
            setKanal({ dokumentId: document.id, oppgaveId, inngaaendeKanal });
          }
        }}
        size="small"
        value={document.inngaaendeKanal?.toString() ?? null}
        disabled={!hasAccess}
      >
        <Radio value={InngaaendeKanal.ALTINN}>Altinn Innboks</Radio>
        <Radio value={InngaaendeKanal.E_POST}>E-post</Radio>
      </RadioGroup>

      <div>
        <Label size="small" htmlFor="avsender">
          Avsender
        </Label>
        <HStack align="center" gap="2">
          <BodyShort size="small">{document.avsender?.name ?? 'Ikke satt'}</BodyShort>
          <PartStatusList statusList={document.avsender?.statusList ?? []} size="xsmall" />
          {hasAccess && document.avsender !== null ? (
            <Button
              size="xsmall"
              variant="tertiary"
              onClick={() => setEditAvsender(!editAvsender)}
              icon={editAvsender ? <XMarkIcon aria-hidden /> : <PencilIcon aria-hidden />}
            />
          ) : null}
        </HStack>

        {editAvsender ? (
          <EditPart
            onChange={(part) => {
              setAvsender({ dokumentId: document.id, oppgaveId, avsender: part }).then(() => setEditAvsender(false));
            }}
            onClose={() => setEditAvsender(false)}
            isLoading={isLoading}
            id="avsender"
          />
        ) : null}
      </div>
    </>
  );
};
