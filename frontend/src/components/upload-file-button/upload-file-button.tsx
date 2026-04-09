import { UploadIcon } from '@navikt/aksel-icons';
import { Button, type ButtonProps, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useRef } from 'react';
import { toast } from '@/components/toast/store';
import { genericErrorToast } from '@/components/toast/toast-content/api-error-toast';
import { BYTES_PER_KB, formatFileSize } from '@/functions/format-file-size';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useUploadFileDocumentMutation } from '@/redux-api/oppgaver/mutations/documents';
import type { DistribusjonsType } from '@/types/documents/documents';

const MEBI = BYTES_PER_KB * BYTES_PER_KB;
const MAX_SIZE_MIB = 500;
const MAX_SIZE_BYTES = MAX_SIZE_MIB * MEBI - 288;

interface Props extends Pick<ButtonProps, 'variant' | 'size' | 'children'> {
  parentId?: string;
  distributionType: DistribusjonsType | null;
}

const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const INPUT_ACCEPT = ALLOWED_FILE_TYPES.join(', ');

const displayError = (error: string) => genericErrorToast('Kunne ikke laste opp dokument', error);

export const UploadFileButton = ({
  variant,
  size,
  children,
  parentId,
  distributionType,
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
            )}) er større enn maksgrensen på ${MAX_SIZE_MIB.toLocaleString()} MiB.`,
          );
          continue;
        }

        try {
          await uploadFile({ file, dokumentTypeId: distributionType, oppgaveId, parentId }).unwrap();
          toast.success(`«${file.name}» (${formatFileSize(file.size)}) ble lastet opp.`);
        } catch {
          // Error already handled in RTKQ file.
        }
      }

      event.target.value = '';
    },
    [oppgaveId, uploadFile, distributionType, parentId],
  );

  return (
    <>
      <input
        type="file"
        accept={INPUT_ACCEPT}
        multiple
        ref={inputRef}
        onChange={uploadVedlegg}
        className="hidden"
        disabled={isLoading}
        aria-label="Last opp dokument"
      />
      <Tooltip content="Last opp dokument">
        <Button
          variant={variant}
          size={size}
          icon={<UploadIcon aria-hidden />}
          onClick={onClick}
          loading={isLoading}
        >
          {children === undefined ? null : <span className="font-normal">{children}</span>}
        </Button>
      </Tooltip>
    </>
  );
};
