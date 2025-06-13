import { toast } from '@app/components/toast/store';
import { BYTES_PER_KB, formatFileSize } from '@app/functions/format-file-size';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useUploadFileDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import type { DistribusjonsType } from '@app/types/documents/documents';
import { UploadIcon } from '@navikt/aksel-icons';
import { Button, type ButtonProps, Heading, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useRef } from 'react';

const MEBI = BYTES_PER_KB * BYTES_PER_KB;
const MAX_SIZE_MIB = 500;
const MAX_SIZE_BYTES = MAX_SIZE_MIB * MEBI - 288;

interface Props extends Pick<ButtonProps, 'variant' | 'size' | 'children'> {
  parentId?: string;
  distributionType: DistribusjonsType | null;
  'data-testid'?: string;
}

const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const INPUT_ACCEPT = ALLOWED_FILE_TYPES.join(', ');

const displayError = (error: string) =>
  toast.error(
    <>
      <Heading size="xsmall" level="1">
        Kunne ikke laste opp dokument
      </Heading>
      <span>{error}</span>
    </>,
  );

export const UploadFileButton = ({
  variant,
  size,
  children,
  parentId,
  distributionType,
  'data-testid': dataTestId,
}: Props) => {
  const oppgaveId = useOppgaveId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, { isLoading }] = useUploadFileDocumentMutation();

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (distributionType === null) {
        return displayError('Du må velge en dokumenttype før du kan laste opp et dokument.');
      }

      event.preventDefault();
      inputRef.current?.click();
    },
    [distributionType],
  );

  const uploadVedlegg = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      if (oppgaveId === skipToken || distributionType === null) {
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
          await uploadFile({ file, dokumentTypeId: distributionType, oppgaveId, parentId }).unwrap();
          toast.success(`«${file.name}» (${formatFileSize(file.size)}) ble lastet opp.`);
        } catch {
          displayError(`Kunne ikke laste opp «${file.name}» (${formatFileSize(file.size)}).`);
        }
      }

      event.target.value = '';
    },
    [oppgaveId, uploadFile, distributionType, parentId],
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
        className="hidden"
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
    </>
  );
};
