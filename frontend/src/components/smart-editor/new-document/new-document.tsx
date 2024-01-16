import { Loader } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { UserContext } from '@app/components/app/user';
import { GeneratedIcon } from '@app/components/smart-editor/new-document/generated-icon';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { GENERELT_BREV_TEMPLATE, NOTAT_TEMPLATE } from '@app/plate/templates/simple-templates';
import { ANKE_I_TRYGDERETTEN_TEMPLATES, ANKE_TEMPLATES, KLAGE_TEMPLATES } from '@app/plate/templates/templates';
import { useCreateSmartDocumentMutation } from '@app/redux-api/oppgaver/mutations/smart-document';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { ISmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { getDocumentCount } from './get-document-count';
import {
  StyledHeader,
  StyledLoadingOverlay,
  StyledNewDocument,
  StyledTemplateButton,
  StyledTemplates,
} from './styled-components';

interface Props {
  onCreate: (id: string) => void;
}

export const NewDocument = ({ onCreate }: Props) => {
  const user = useContext(UserContext);
  const isRol = useIsRol();
  const hasDocumentsAccess = useHasDocumentsAccess();
  const isFeilregistrert = useIsFeilregistrert();
  const oppgaveId = useOppgaveId();
  const [createSmartDocument, { isLoading }] = useCreateSmartDocumentMutation();
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);
  const { data: oppgave } = useOppgave();
  const { data: documents = [] } = useGetDocumentsQuery(oppgaveId);

  if (isFeilregistrert || oppgave === undefined) {
    return null;
  }

  if (!isRol && !hasDocumentsAccess) {
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
        {getTemplates(oppgave.typeId, oppgave.isAvsluttetAvSaksbehandler).map((template) => (
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

const getTemplates = (type: SaksTypeEnum, isAvsluttet: boolean) => {
  if (isAvsluttet) {
    return [GENERELT_BREV_TEMPLATE, NOTAT_TEMPLATE];
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

    <GeneratedIcon template={template} />

    {template.tittel}
  </StyledTemplateButton>
);

const LoadingOverlay = ({ loading }: { loading: boolean }) =>
  loading ? (
    <StyledLoadingOverlay>
      <Loader size="xlarge" />
    </StyledLoadingOverlay>
  ) : null;
