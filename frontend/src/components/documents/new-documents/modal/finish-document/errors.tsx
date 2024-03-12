import { Button, ErrorMessage, Heading, Label, List } from '@navikt/ds-react';
import React, { useContext, useMemo } from 'react';
import { styled } from 'styled-components';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { DocumentValidationErrorType } from '@app/types/documents/validation';

interface Props {
  updatePdf: () => void;
}

export const Errors = ({ updatePdf }: Props) => {
  const { validationErrors, setValidationErrors } = useContext(ModalContext);

  const hasFinishErrors = useMemo(
    () =>
      validationErrors.some(({ errors }) =>
        errors.some(
          ({ type }) =>
            type === DocumentValidationErrorType.DOCUMENT_MODIFIED || type === DocumentValidationErrorType.WRONG_DATE,
        ),
      ),
    [validationErrors],
  );

  if (validationErrors.length === 0) {
    return null;
  }

  return (
    <Section>
      <Heading level="1" size="xsmall">
        Følgende feil må rettes
      </Heading>

      <StyledOuterList>
        {validationErrors
          .filter((e) => e.errors.length !== 0)
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
      </StyledOuterList>

      {hasFinishErrors ? (
        <Button
          size="xsmall"
          onClick={() => {
            updatePdf();
            setValidationErrors(
              validationErrors
                .map(({ errors, ...rest }) => ({
                  ...rest,
                  errors: errors.filter(
                    ({ type }) =>
                      type !== DocumentValidationErrorType.DOCUMENT_MODIFIED &&
                      type !== DocumentValidationErrorType.WRONG_DATE,
                  ),
                }))
                .filter(({ errors }) => errors.length !== 0),
            );
          }}
          variant="secondary"
        >
          Oppdater
        </Button>
      ) : null}
    </Section>
  );
};

const StyledOuterList = styled(List)`
  > ul {
    margin-block-end: 0;
  }
`;

const Section = styled.section`
  margin-top: 8px;
`;
