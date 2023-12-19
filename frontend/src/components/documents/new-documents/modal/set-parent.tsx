import { Alert, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { styled } from 'styled-components';
import { DocumentIcon, ModalDocumentType } from '@app/components/documents/new-documents/shared/document-icon';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useSetParentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DistribusjonsType, DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

const IS_PARENT_DOCUMENT = 'PARENT_DOCUMENT_VALUE';

interface Props {
  document: IMainDocument;
  hasAttachments: boolean;
}

export const SetParentDocument = ({ document, hasAttachments }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading: isLoadingDocuments } = useGetDocumentsQuery(oppgaveId);
  const [setParent, { isLoading: isSetting }] = useSetParentMutation();
  const isRol = useIsRol();

  const potentialParents = useMemo(() => {
    if (data === undefined) {
      return [];
    }

    if (isRol || document.type !== DocumentTypeEnum.JOURNALFOERT) {
      return data.filter(
        (d) => d.isSmartDokument && document.id !== d.id && d.templateId === TemplateIdEnum.ROL_QUESTIONS,
      );
    }

    return data.filter((d) => document.id !== d.id && d.parentId === null);
  }, [data, document.id, document.type, isRol]);

  if (
    isLoadingDocuments ||
    typeof data === 'undefined' ||
    potentialParents.length === 0 ||
    typeof oppgaveId !== 'string'
  ) {
    return null;
  }

  if (document.dokumentTypeId === DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN && hasAttachments) {
    return null;
  }

  const setParentFn = (parentId: string | null = null) => setParent({ dokumentId: document.id, oppgaveId, parentId });

  const onChange = (id: string) => setParentFn(id === IS_PARENT_DOCUMENT ? null : id);

  return (
    <VedleggSection>
      <Heading level="1" size="xsmall">
        Vedlegg eller hoveddokument
      </Heading>

      <MainDocument document={document} onClick={() => setParentFn(null)} isLoading={isSetting} />

      <RadioGroup
        size="small"
        value={document.parentId ?? IS_PARENT_DOCUMENT}
        onChange={onChange}
        title="Vedlegg til"
        legend="Vedlegg til"
        data-testid="document-set-parent-document"
        disabled={isSetting}
      >
        {potentialParents.map(({ tittel, id, type }) => (
          <RadioOption key={id} value={id} type={type} text={tittel} />
        ))}
      </RadioGroup>
    </VedleggSection>
  );
};

interface MainDocumentProps {
  document: IMainDocument;
  onClick: () => void;
  isLoading: boolean;
}

const MainDocument = ({ document, onClick, isLoading }: MainDocumentProps) => {
  const isJournalfoert = document.type === DocumentTypeEnum.JOURNALFOERT;
  const isSaksbehandler = useIsSaksbehandler();

  if (document.parentId === null) {
    return (
      <Alert variant="info" size="small" inline>
        Dette dokumentet er et hoveddokument.
      </Alert>
    );
  }

  if (isJournalfoert) {
    return (
      <Alert variant="info" size="small" inline>
        Journalførte dokumenter kan kun være vedlegg.
      </Alert>
    );
  }

  if (!isSaksbehandler) {
    return (
      <Alert variant="info" size="small" inline>
        Bare tildelt saksbehandler kan gjøre et dokument til hoveddokument.
      </Alert>
    );
  }

  return (
    <Button size="small" variant="secondary-neutral" onClick={onClick} loading={isLoading}>
      Gjør til hoveddokument
    </Button>
  );
};

interface RadioOptionProps {
  value: string;
  type: ModalDocumentType;
  text: string;
}

const RadioOption = ({ value, type, text }: RadioOptionProps) => (
  <Radio key={value} value={value} title={text}>
    <RadioContent>
      <DocumentIcon type={type} />
      <RadioText>{text}</RadioText>
    </RadioContent>
  </Radio>
);

const RadioContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  column-gap: 4px;
`;

const RadioText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const VedleggSection = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  align-items: flex-start;
`;
