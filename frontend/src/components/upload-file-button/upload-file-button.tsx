import { UploadIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps, ErrorMessage, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useUploadFileDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DistribusjonsType } from '@app/types/documents/documents';

const MEBI = 1024 * 1024;
const MAX_SIZE_MIB = 8;
// const MAX_SIZE_BYTES = MAX_SIZE_MIB * MEBI - 288;
const MAX_SIZE_BYTES = MAX_SIZE_MIB * MEBI;

interface Props extends Pick<ButtonProps, 'variant' | 'size' | 'children'> {
  parentId?: string;
  dokumentTypeId: DistribusjonsType | null;
  setDocumentTypeError?: (error: string | undefined) => void;
  'data-testid'?: string;
}

export const UploadFileButton = forwardRef<HTMLDivElement, Props>(
  ({ variant, size, children, parentId, dokumentTypeId, setDocumentTypeError, 'data-testid': dataTestId }, ref) => {
    const oppgaveId = useOppgaveId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploadFile, { isLoading }] = useUploadFileDocumentMutation();
    const [uploadError, setUploadError] = useState<string>();

    const onClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (dokumentTypeId === null) {
          if (setDocumentTypeError !== undefined) {
            setDocumentTypeError('Dokumenttype må velges.');
          }

          return;
        }

        event.preventDefault();
        inputRef.current?.click();
      },
      [dokumentTypeId, setDocumentTypeError],
    );

    const uploadVedlegg = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        if (oppgaveId === skipToken || dokumentTypeId === null) {
          return;
        }

        const { files } = event.target;

        if (files === null || files.length !== 1) {
          return setUploadError('Kun én fil kan lastes opp av gangen.');
        }

        const [file] = files;

        if (file === undefined) {
          return setUploadError('Ingen fil valgt.');
        }

        if (file.size > MAX_SIZE_BYTES) {
          return setUploadError(
            `Filstørrelsen (${(
              file.size / MEBI
            ).toLocaleString()} MiB) er større enn maksgrensen på ${MAX_SIZE_MIB.toLocaleString()} MiB.`,
          );
        }

        setUploadError(undefined);

        uploadFile({ file, dokumentTypeId, oppgaveId, parentId });

        event.currentTarget.value = '';
      },
      [oppgaveId, dokumentTypeId, uploadFile, parentId],
    );

    return (
      <Container ref={ref}>
        <input
          data-testid={`${dataTestId}-input`}
          type="file"
          accept="application/pdf, image/jpeg, image/png"
          multiple={false}
          ref={inputRef}
          onChange={uploadVedlegg}
          style={{ display: 'none' }}
          disabled={isLoading}
        />
        <Tooltip content="Last opp dokument">
          <Button
            variant={variant}
            size={size}
            icon={<UploadIcon aria-hidden />}
            onClick={onClick}
            loading={isLoading}
            data-testid={`${dataTestId}-button`}
          >
            {children}
          </Button>
        </Tooltip>

        {typeof uploadError === 'undefined' ? null : <ErrorMessage size="small">{uploadError}</ErrorMessage>}
      </Container>
    );
  },
);

UploadFileButton.displayName = 'UploadFileButton';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;
