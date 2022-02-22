import { Upload, Warning } from '@navikt/ds-icons';
import { Knapp } from 'nav-frontend-knapper';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useOnClickOutside } from '../../../hooks/use-on-click-outside';
import { useUploadFileDocumentMutation } from '../../../redux-api/documents';

const MAX_SIZE_BYTES = 8388608;
const MEBI = 1024 * 1024;
const MAX_SIZE_MIB = MAX_SIZE_BYTES / MEBI;

export const UploadFileButton = () => {
  const [uploadFile, { isLoading }] = useUploadFileDocumentMutation();
  const oppgaveId = useOppgaveId();
  const { data: oppgave } = useOppgave();
  const canEdit = useCanEdit();
  const [error, setError] = useState<string | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      fileInput.current?.click();
    },
    [fileInput]
  );

  const uploadVedlegg = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      if (typeof oppgave === 'undefined') {
        return;
      }

      const { files } = event.target;

      if (files === null || files.length !== 1) {
        return setError('Kun én fil kan lastes opp av gangen.');
      }

      const [file] = files;

      if (file.size > MAX_SIZE_BYTES) {
        return setError(
          `Filstørrelsen (${(
            file.size / MEBI
          ).toLocaleString()} MiB) er større enn maksgrensen på ${MAX_SIZE_MIB.toLocaleString()} MiB.`
        );
      }

      setError(null);

      uploadFile({
        file,
        oppgaveId,
      });

      event.currentTarget.value = '';
    },
    [oppgaveId, oppgave, uploadFile, setError]
  );

  if (!canEdit || typeof oppgave === 'undefined') {
    return null;
  }

  return (
    <>
      <ErrorInfo error={error} />

      <StyledUploadButton onClick={handleClick} disabled={isLoading} mini spinner={isLoading}>
        <Upload /> Last opp dokument
      </StyledUploadButton>

      <input
        type="file"
        accept=".pdf"
        ref={fileInput}
        onChange={uploadVedlegg}
        style={{ display: 'none' }}
        disabled={isLoading}
      />
    </>
  );
};

interface ErrorInfoProps {
  error: string | null;
}

const ErrorInfo = ({ error }: ErrorInfoProps) => {
  const [open, setOpen] = useState(true);
  const [ref, setRef] = useState<HTMLButtonElement | null>(null);

  useOnClickOutside(() => setOpen(false), { current: ref }, true);

  if (error === null) {
    return null;
  }

  const toggleOpen = () => setOpen(!open);

  return (
    <StyledErrorInfo>
      <StyledButton onClick={toggleOpen} ref={setRef}>
        <Warning />
      </StyledButton>
      <Popover
        ankerEl={open ? ref ?? undefined : undefined}
        onRequestClose={() => setOpen(false)}
        autoFokus={false}
        orientering={PopoverOrientering.Under}
      >
        <StyledErrorMessage>{error}</StyledErrorMessage>
      </Popover>
    </StyledErrorInfo>
  );
};

const StyledUploadButton = styled(Knapp)`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const StyledButton = styled.button`
  color: #ba3a26;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 24px;
  line-height: 0;
  padding: 2px;
  padding-left: 0.5em;
`;

const StyledErrorMessage = styled.p`
  padding: 0.5em;
  margin: 0;
  color: #ba3a26;
`;

const StyledErrorInfo = styled.div`
  margin-right: 0.5em;
`;
