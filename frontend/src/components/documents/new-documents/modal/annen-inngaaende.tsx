import { PencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Label, Radio, RadioGroup } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useState } from 'react';
import { styled } from 'styled-components';
import { EditPart } from '@app/components/part/edit-part';
import { PartStatusList } from '@app/components/part-status-list/part-status-list';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetAvsenderMutation, useSetInngaaendeKanalMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DocumentTypeEnum, IMainDocument, InngaaendeKanal } from '@app/types/documents/documents';

const INNGAAENDE_KANALER = Object.values(InngaaendeKanal);
const isInngaaendeKanal = (type: string): type is InngaaendeKanal => INNGAAENDE_KANALER.some((t) => t === type);

interface Props {
  document: IMainDocument;
  canEditDocument: boolean;
}

export const AnnenInngaaende = ({ document, canEditDocument }: Props) => {
  const [setKanal] = useSetInngaaendeKanalMutation();
  const [setAvsender, { isLoading }] = useSetAvsenderMutation();
  const isUploaded = document.type === DocumentTypeEnum.UPLOADED;
  const [editAvsender, setEditAvsender] = useState(canEditDocument && isUploaded && document.avsender === null);
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
        disabled={!canEditDocument}
      >
        <Radio value={InngaaendeKanal.ALTINN}>Altinn</Radio>
        <Radio value={InngaaendeKanal.E_POST}>E-post</Radio>
      </RadioGroup>

      <div>
        <Label size="small" htmlFor="avsender">
          Avsender
        </Label>
        <AvsenderContainer>
          <BodyShort size="small">{document.avsender?.name ?? 'Ikke satt'}</BodyShort>
          <PartStatusList statusList={document.avsender?.statusList ?? []} size="xsmall" />
          {canEditDocument && document.avsender !== null ? (
            <Button
              size="xsmall"
              variant="tertiary"
              onClick={() => setEditAvsender(!editAvsender)}
              icon={editAvsender ? <XMarkIcon aria-hidden /> : <PencilIcon aria-hidden />}
            />
          ) : null}
        </AvsenderContainer>

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

const AvsenderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
