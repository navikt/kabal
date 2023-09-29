import { Loader } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import {
  ANKE_I_TRYGDERETTEN_TEMPLATES,
  ANKE_TEMPLATES,
  FINISHED_TEMLATES,
  KLAGE_TEMPLATES,
} from '@app/plate/templates/templates';
import { useCreateSmartDocumentMutation } from '@app/redux-api/oppgaver/mutations/smart-editor';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { useUser } from '@app/simple-api-state/use-user';
import { Role } from '@app/types/bruker';
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
  const { data: user } = useUser();
  const isRol = useIsRol();
  const isSaksbehandler = useIsSaksbehandler();
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();
  const oppgaveId = useOppgaveId();
  const [createSmartDocument, { isLoading }] = useCreateSmartDocumentMutation();
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);
  const { data: oppgave } = useOppgave();
  const { data: documents = [] } = useGetDocumentsQuery(oppgaveId);

  if (isFeilregistrert || typeof oppgave === 'undefined' || user === undefined) {
    return null;
  }

  if (!isRol && !isSaksbehandler) {
    return null;
  }

  const onClick = (template: ISmartEditorTemplate) => {
    setLoadingTemplate(template.templateId);

    const count = getDocumentCount(documents, template);

    const creatorRole = isRol ? Role.KABAL_ROL : Role.KABAL_SAKSBEHANDLING;
    const tittel = count === 0 ? template.tittel : `${template.tittel} (${count})`;

    return createSmartDocument({
      ...template,
      tittel,
      oppgaveId: oppgave.id,
      creatorIdent: user.navIdent,
      creatorRole,
      parentId: null,
    })
      .unwrap()
      .then(({ id }) => onCreate(id))
      .finally(() => setLoadingTemplate(null));
  };

  return (
    <StyledNewDocument>
      <StyledHeader>Opprett nytt dokument</StyledHeader>

      <StyledTemplates>
        {getTemplates(oppgave.typeId, isFinished).map((template) => (
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

const getTemplates = (type: SaksTypeEnum, isFinished: boolean) => {
  if (isFinished) {
    return FINISHED_TEMLATES;
  }

  switch (type) {
    case SaksTypeEnum.KLAGE:
      return KLAGE_TEMPLATES;
    case SaksTypeEnum.ANKE:
      return ANKE_TEMPLATES;
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return ANKE_I_TRYGDERETTEN_TEMPLATES;
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
