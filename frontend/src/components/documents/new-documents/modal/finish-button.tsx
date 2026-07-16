import { ArchiveButtons } from '@/components/documents/new-documents/modal/finish-document/archive-buttons';
import { SendButtons } from '@/components/documents/new-documents/modal/finish-document/send-buttons';
import type { ValidationError } from '@/components/documents/new-documents/modal/finish-document/types';
import type { IDocument } from '@/types/documents/documents';

interface CommonProps extends React.RefAttributes<HTMLDivElement> {
  document: IDocument;
}

interface Props extends CommonProps {
  innsendingshjemlerConfirmed: boolean;
  finishAccessError: string | null;
  validationErrors: ValidationError['errors'];
  isArchiveOnly: boolean;
}

export const FinishButton = ({
  document,
  innsendingshjemlerConfirmed,
  finishAccessError,
  validationErrors,
  isArchiveOnly,
  ...rest
}: Props) =>
  isArchiveOnly ? (
    <ArchiveButtons document={document} accessError={finishAccessError} validationErrors={validationErrors} {...rest} />
  ) : (
    <SendButtons document={document} accessError={finishAccessError} validationErrors={validationErrors} {...rest} />
  );
