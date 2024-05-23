import { UploadIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps, Heading, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { forwardRef, useCallback, useRef } from 'react';
import { toast } from '@app/components/toast/store';
import { BYTES_PER_KB, formatFileSize } from '@app/functions/format-file-size';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useUploadFileDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DistribusjonsType } from '@app/types/documents/documents';

const MEBI = BYTES_PER_KB * BYTES_PER_KB;
const MAX_SIZE_MIB = 256;
const MAX_SIZE_BYTES = MAX_SIZE_MIB * MEBI - 288;

interface Props extends Pick<ButtonProps, 'variant' | 'size' | 'children'> {
  parentId?: string;
  dokumentTypeId: DistribusjonsType | null;
  'data-testid'?: string;
}

const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const INPUT_ACCEPT = ALLOWED_FILE_TYPES.join(', ');

export const UploadFileButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant, size, children, parentId, dokumentTypeId, 'data-testid': dataTestId }, ref) => {
    const oppgaveId = useOppgaveId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploadFile, { isLoading }] = useUploadFileDocumentMutation();

    const displayError = useCallback(
      (error: string) =>
        toast.error(
          <>
            <Heading size="xsmall" level="1">
              Kunne ikke laste opp dokument
            </Heading>
            <span>{error}</span>
          </>,
        ),
      [],
    );

    const onClick = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      inputRef.current?.click();
    }, []);

    const uploadVedlegg = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        if (oppgaveId === skipToken || dokumentTypeId === null) {
          return;
        }

        const { files } = event.target;

        if (files === null) {
          return displayError('Ingen filer valgt.');
        }

        for (const file of files) {
          if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            displayError(`«${file.name}» (${file.type}) har en ugyldig filtype.`);
            continue;
          }

          if (file.size > MAX_SIZE_BYTES) {
            displayError(
              `«${file.name}» (${formatFileSize(
                file.size,
              )} MiB) er større enn maksgrensen på ${MAX_SIZE_MIB.toLocaleString()} MiB.`,
            );
            continue;
          }

          try {
            await uploadFile({ file, dokumentTypeId, oppgaveId, parentId }).unwrap();
            toast.success(`«${file.name}» (${formatFileSize(file.size)}) ble lastet opp.`);
          } catch {
            displayError(`Kunne ikke laste opp «${file.name}» (${formatFileSize(file.size)}).`);
          }
        }

        event.target.value = '';
      },
      [oppgaveId, displayError, uploadFile, dokumentTypeId, parentId],
    );

    return (
      <>
        <input
          data-testid={`${dataTestId}-input`}
          type="file"
          accept={INPUT_ACCEPT}
          multiple
          ref={inputRef}
          onChange={uploadVedlegg}
          style={{ display: 'none' }}
          disabled={isLoading}
        />
        <Tooltip content="Last opp dokument">
          <Button
            ref={ref}
            variant={variant}
            size={size}
            icon={<UploadIcon aria-hidden />}
            onClick={onClick}
            loading={isLoading}
            data-testid={`${dataTestId}-button`}
            disabled={dokumentTypeId === null}
            title={dokumentTypeId === null ? 'Velg dokumenttype' : undefined}
          >
            {children}
          </Button>
        </Tooltip>
      </>
    );
  },
);

UploadFileButton.displayName = 'UploadFileButton';
