import { Loader } from '@navikt/ds-react';
import React, { useState } from 'react';
import { ANKE_TEMPLATES, KLAGE_TEMPLATES } from '@app/components/plate-editor/templates/templates';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useCreateSmartDocumentMutation } from '@app/redux-api/oppgaver/mutations/smart-editor';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { ISmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
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

  const templates = oppgave.type === SaksTypeEnum.KLAGE ? KLAGE_TEMPLATES : ANKE_TEMPLATES;

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
