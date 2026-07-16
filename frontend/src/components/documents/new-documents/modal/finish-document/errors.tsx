import { ErrorMessage, Heading, Label, List } from '@navikt/ds-react';
import { useContext } from 'react';
import { VALIDATION_ERROR_MESSAGES } from '@/components/documents/new-documents/modal/finish-document/error-messages';
import type { ValidationError } from '@/components/documents/new-documents/modal/finish-document/types';
import { ModalContext } from '@/components/documents/new-documents/modal/modal-context';
import { DOCUMENT_VALIDATION_ERROR_ORDER } from '@/types/documents/validation';

export const Errors = () => {
  const { validationErrors } = useContext(ModalContext);

  if (validationErrors.length === 0) {
    return null;
  }

  return (
    <section className="mt-2">
      <Heading level="1" size="xsmall">
        Følgende feil må rettes
      </Heading>
      <List>
        {validationErrors
          .filter((e) => e.errors.length > 0)
          .map((e) => (
            <List.Item key={e.dokumentId}>
              <Label size="small">{e.title}</Label>
              <DocumentErrorsList dokumentId={e.dokumentId} errors={e.errors} />
            </List.Item>
          ))}
      </List>
    </section>
  );
};

interface DocumentErrorsListProps {
  dokumentId: string;
  errors: ValidationError['errors'];
}

const DocumentErrorsList = ({ dokumentId, errors }: DocumentErrorsListProps) => {
  const items: React.ReactNode[] = [];

  for (const type of DOCUMENT_VALIDATION_ERROR_ORDER) {
    if (!errors.includes(type)) {
      continue;
    }

    items.push(
      <List.Item key={`${dokumentId}-${type}`}>
        <ErrorMessage id={`${dokumentId}-${type}`} size="small">
          {VALIDATION_ERROR_MESSAGES[type]}
        </ErrorMessage>
      </List.Item>,
    );
  }

  return <List>{items}</List>;
};
