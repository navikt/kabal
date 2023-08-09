import { Loader } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { ANKE_TEMPLATES, KLAGE_TEMPLATES } from '@app/plate/templates/templates';
import { useCreateSmartDocumentMutation } from '@app/redux-api/oppgaver/mutations/smart-editor';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { ISmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { AvslagBrevIcon } from './avslag-brev-icon';
import { GenereltBrevIcon } from './generelt-brev-icon';
import { getDocumentCount } from './get-document-count';
import { MedholdBrevIcon } from './medhold-brev-icon';
import {
  StyledHeader,
  StyledLoadingOverlay,
  StyledNewDocument,
  StyledTemplateButton,
  StyledTemplateButtonIcon,
  StyledTemplates,
} from './styled-components';

interface Props {
  onCreate: (id: string) => void;
}

export const NewDocument = ({ onCreate }: Props) => {
  const oppgaveId = useOppgaveId();
  const [createSmartDocument, { isLoading }] = useCreateSmartDocumentMutation();
  const canEdit = useCanEdit();
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);
  const { data: oppgave } = useOppgave();
  const { data: documents = [] } = useGetDocumentsQuery(oppgaveId);

  if (!canEdit || typeof oppgave === 'undefined') {
    return null;
  }

  const onClick = (template: ISmartEditorTemplate) => {
    setLoadingTemplate(template.templateId);

    const count = getDocumentCount(documents, template);

    const tittel = count === 0 ? template.tittel : `${template.tittel} (${count})`;

    return createSmartDocument({ ...template, tittel, oppgaveId: oppgave.id })
      .unwrap()
      .then(({ id }) => onCreate(id))
      .finally(() => setLoadingTemplate(null));
  };

  const templates = oppgave.typeId === SaksTypeEnum.KLAGE ? KLAGE_TEMPLATES : ANKE_TEMPLATES;

  return (
    <StyledNewDocument>
      <StyledHeader>Opprett nytt dokument</StyledHeader>

      <StyledTemplates>
        {templates.map((template) => (
          <TemplateButton
            template={template}
            key={template.templateId}
            onClick={() => onClick(template)}
            loading={isLoading && loadingTemplate === template.templateId}
          />
        ))}
      </StyledTemplates>
    </StyledNewDocument>
  );
};

interface TemplateIconProps {
  type: string;
}

const TemplateIcon = ({ type }: TemplateIconProps) => {
  switch (type) {
    case 'empty':
      return <GenereltBrevIcon />;
    case 'medhold':
      return <MedholdBrevIcon />;
    case 'avslag':
      return <AvslagBrevIcon />;
    default:
      return <GenereltBrevIcon />;
  }
};

interface TemplateButtonProps {
  template: ISmartEditorTemplate;
  loading: boolean;
  onClick: () => void;
}

const TemplateButton = ({ template, loading, onClick }: TemplateButtonProps) => (
  <StyledTemplateButton onClick={onClick} disabled={loading}>
    <LoadingOverlay loading={loading} />

    <StyledTemplateButtonIcon>
      <TemplateIcon type={template.templateId} />
    </StyledTemplateButtonIcon>
    {template.tittel}
  </StyledTemplateButton>
);

const LoadingOverlay = ({ loading }: { loading: boolean }) =>
  loading ? (
    <StyledLoadingOverlay>
      <Loader size="xlarge" />
    </StyledLoadingOverlay>
  ) : null;
