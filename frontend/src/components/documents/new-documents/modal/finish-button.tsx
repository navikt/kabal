import { AccessErrorsSummary } from '@/components/documents/new-documents/modal/access-errors-summary';
import { ArchiveButtons } from '@/components/documents/new-documents/modal/finish-document/archive-buttons';
import { SendButtons } from '@/components/documents/new-documents/modal/finish-document/send-buttons';
import type { IDocument } from '@/types/documents/documents';

interface CommonProps extends React.RefAttributes<HTMLDivElement> {
  document: IDocument;
}

interface Props extends CommonProps {
  innsendingshjemlerConfirmed: boolean;
  finishAccessError: string | null;
  finishValidationErrors: string[];
  isArchiveOnly: boolean;
}

export const FinishButton = ({
  document,
  innsendingshjemlerConfirmed,
  finishAccessError,
  finishValidationErrors,
  isArchiveOnly,
  ...rest
}: Props) => {
  const documentErrors: string[] =
    finishAccessError === null ? finishValidationErrors : [finishAccessError, ...finishValidationErrors];

  return (
    <AccessErrorsSummary documentErrors={documentErrors}>
      {isArchiveOnly ? (
        <ArchiveButtons document={document} disabled={documentErrors.length !== 0} {...rest} />
      ) : (
        <SendButtons document={document} disabled={documentErrors.length !== 0} {...rest} />
      )}
    </AccessErrorsSummary>
  );
};
