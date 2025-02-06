import { StaticDataContext } from '@app/components/app/static-data-context';
import { GeneratedIcon } from '@app/components/smart-editor/new-document/generated-icon';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import {
  ANKE_I_TRYGDERETTEN_TEMPLATES,
  ANKE_TEMPLATES,
  BEHANDLING_ETTER_TR_OPPHEVET_TEMPLATES,
  KLAGE_TEMPLATES,
  OMGJØRINGSKRAVVEDTAK_TEMPLATES,
  getFinishedBehandlingTemplates,
} from '@app/plate/templates/templates';
import { useCreateSmartDocumentMutation } from '@app/redux-api/collaboration';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import type { ISmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { Language } from '@app/types/texts/language';
import { Box, HStack, Loader } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { getDocumentCount } from './get-document-count';
import { StyledHeader, StyledNewDocument, StyledTemplateButton } from './styled-components';

interface Props {
  onCreate: (id: string) => void;
}

export const NewDocument = ({ onCreate }: Props) => {
  const { user } = useContext(StaticDataContext);
  const isRol = useIsRol();
  const hasDocumentsAccess = useHasDocumentsAccess();
  const isFeilregistrert = useIsFeilregistrert();
  const oppgaveId = useOppgaveId();
  const [createSmartDocument, { isLoading }] = useCreateSmartDocumentMutation();
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);
  const { data: oppgave } = useOppgave();
  const { data: documents = [] } = useGetDocumentsQuery(oppgaveId);
  const templates = useTemplates(oppgave);

  if (isFeilregistrert || oppgave === undefined) {
    return null;
  }

  if (!(isRol || hasDocumentsAccess)) {
    return null;
  }

  const onClick = async (template: ISmartEditorTemplate) => {
    setLoadingTemplate(template.templateId);

    const count = getDocumentCount(documents, template);

    const creatorRole = isRol ? Role.KABAL_ROL : Role.KABAL_SAKSBEHANDLING;
    const tittel = count === 0 ? template.tittel : `${template.tittel} (${count})`;

    try {
      const { id } = await createSmartDocument({
        templateId: template.templateId,
        dokumentTypeId: template.dokumentTypeId,
        content: template.richText,
        tittel,
        oppgaveId: oppgave.id,
        creatorIdent: user.navIdent,
        creatorRole,
        parentId: null,
        language: Language.NB,
      }).unwrap();

      return onCreate(id);
    } finally {
      setLoadingTemplate(null);
    }
  };

  return (
    <StyledNewDocument>
      <StyledHeader>Opprett nytt dokument</StyledHeader>

      <HStack as="section" wrap>
        {templates.map((template) => (
          <TemplateButton
            template={template}
            key={template.templateId}
            onClick={() => onClick(template)}
            loading={isLoading && loadingTemplate === template.templateId}
          />
        ))}
      </HStack>
    </StyledNewDocument>
  );
};

const useTemplates = (oppgave: IOppgavebehandling | undefined) => {
  const isSaksbehandler = useIsSaksbehandler();
  const isRol = useIsRol();
  const { user } = useContext(StaticDataContext);

  if (oppgave === undefined) {
    return [];
  }

  const { isAvsluttetAvSaksbehandler, typeId } = oppgave;

  if (isAvsluttetAvSaksbehandler) {
    return getFinishedBehandlingTemplates(user.navIdent);
  }

  if (isSaksbehandler || isRol) {
    switch (typeId) {
      case SaksTypeEnum.KLAGE:
        return KLAGE_TEMPLATES;
      case SaksTypeEnum.ANKE:
        return ANKE_TEMPLATES;
      case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
        return ANKE_I_TRYGDERETTEN_TEMPLATES;
      case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
        return BEHANDLING_ETTER_TR_OPPHEVET_TEMPLATES;
      case SaksTypeEnum.OMGJØRINGSKRAV:
        return OMGJØRINGSKRAVVEDTAK_TEMPLATES;
    }
  }

  return [];
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
    <HStack asChild align="center" justify="center" position="absolute" top="0">
      <Box background="surface-backdrop" height="100%" width="100%">
        <Loader size="xlarge" />
      </Box>
    </HStack>
  ) : null;
