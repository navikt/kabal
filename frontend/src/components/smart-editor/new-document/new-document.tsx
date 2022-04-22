import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useState } from 'react';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useCreateSmartDocumentMutation } from '../../../redux-api/smart-editor-api';
import { ISmartEditorTemplate } from '../../../types/smart-editor';
import { EMPTY_TEMPLATE } from '../templates/empty-template';
import { UTFALL_SIMPLE_TEMPLATE } from '../templates/utfall-simple-template';
import { AvslagBrevIcon } from './avslag-brev-icon';
import { GenereltBrevIcon } from './generelt-brev-icon';
import { MedholdBrevIcon } from './medhold-brev-icon';
import {
  StyledHeader,
  StyledLoadingOverlay,
  StyledNewDocument,
  StyledTemplateButton,
  StyledTemplateButtonIcon,
  StyledTemplates,
} from './styled-components';

const TEMPLATES = [EMPTY_TEMPLATE, UTFALL_SIMPLE_TEMPLATE];

interface Props {
  oppgaveId: string;
  onCreate: (id: string) => void;
}

export const NewDocument = ({ oppgaveId, onCreate }: Props) => {
  const [createSmartDocument, { isLoading }] = useCreateSmartDocumentMutation();
  const canEdit = useCanEdit();
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);
  const { data: oppgave } = useOppgave();

  if (!canEdit || typeof oppgave === 'undefined') {
    return null;
  }

  const onClick = (template: ISmartEditorTemplate) => {
    setLoadingTemplate(template.templateId);

    return createSmartDocument({ ...template, oppgaveId })
      .unwrap()
      .then(({ id }) => onCreate(id))
      .finally(() => setLoadingTemplate(null));
  };

  return (
    <StyledNewDocument>
      <StyledHeader>Opprett nytt dokument</StyledHeader>

      <StyledTemplates>
        {TEMPLATES.map((template) => (
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
      <NavFrontendSpinner type="L" />
    </StyledLoadingOverlay>
  ) : null;
