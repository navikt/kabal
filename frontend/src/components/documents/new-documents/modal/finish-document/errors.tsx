import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { ErrorMessage, Heading, Label, List } from '@navikt/ds-react';
import { useContext } from 'react';

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
              <List>
                {e.errors.map(({ type, message }) => (
                  <List.Item key={`${e.dokumentId}-${type}`}>
                    <ErrorMessage size="small">{message}</ErrorMessage>
                  </List.Item>
                ))}
              </List>
            </List.Item>
          ))}
      </List>
    </section>
  );
};
