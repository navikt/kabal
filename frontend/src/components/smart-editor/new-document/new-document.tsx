import { StaticDataContext } from '@app/components/app/static-data-context';
import { GeneratedIcon } from '@app/components/smart-editor/new-document/generated-icon';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsSentToMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useIsAssignedRolAndSent, useIsRolOrKrolUser, useIsSentToRol } from '@app/hooks/use-is-rol';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
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
import type { IMutableSmartEditorTemplate, ISmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Language } from '@app/types/texts/language';
import type { Immutable } from '@app/types/types';
import { Box, HStack, Loader } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { getTitle } from './get-title';
import { StyledHeader, StyledNewDocument, StyledTemplateButton } from './styled-components';

interface Props {
  onCreate: (id: string) => void;
}

export const NewDocument = ({ onCreate }: Props) => {
  const { user } = useContext(StaticDataContext);
  const isRol = useIsAssignedRolAndSent();
  const hasDocumentsAccess = useHasDocumentsAccess();
  const isFeilregistrert = useIsFeilregistrert();
  const oppgaveId = useOppgaveId();
  const [createSmartDocument, { isLoading }] = useCreateSmartDocumentMutation();
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);
  const { data: oppgave } = useOppgave();
  const { data: documents = [] } = useGetDocumentsQuery(oppgaveId);
  const templates = useNewSmartDocumentTemplates();

  if (isFeilregistrert || oppgave === undefined) {
    return null;
  }

  if (!(isRol || hasDocumentsAccess)) {
    return null;
  }

  const onClick = async (template: ISmartEditorTemplate) => {
    setLoadingTemplate(template.templateId);

    const creatorRole = isRol ? Role.KABAL_ROL : Role.KABAL_SAKSBEHANDLING;

    try {
      const { id } = await createSmartDocument({
        templateId: template.templateId,
        dokumentTypeId: template.dokumentTypeId,
        content: template.richText,
        tittel: getTitle(documents, template),
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

export const useNewSmartDocumentTemplates = () => {
  const { data: oppgave, isSuccess } = useOppgave();
  const isSaksbehandler = useIsTildeltSaksbehandler();
  const { user } = useContext(StaticDataContext);
  const isRolOrKrolUser = useIsRolOrKrolUser();
  const isSentToMedunderskriver = useIsSentToMedunderskriver();
  const isSentToRol = useIsSentToRol();

  if (!isSuccess || isRolOrKrolUser) {
    // ROL and KROL can never create new main documents.
    // ROL can only create answers to ROL questions.
    return [];
  }

  if (isSentToMedunderskriver) {
    // If case is sent to medunderskriver, new documents cannot be created.
    return [];
  }

  const { isAvsluttetAvSaksbehandler, typeId } = oppgave;

  if (isAvsluttetAvSaksbehandler) {
    return getFinishedBehandlingTemplates(user.navIdent);
  }

  if (isSaksbehandler) {
    const saksbehandlerTemplates = SAKSBEHANDLER_TEMPLATES[typeId];

    if (isSentToRol) {
      return saksbehandlerTemplates.filter(({ templateId }) => templateId !== TemplateIdEnum.ROL_QUESTIONS);
    }

    return saksbehandlerTemplates;
  }

  return [];
};

const SAKSBEHANDLER_TEMPLATES: Record<SaksTypeEnum, Immutable<IMutableSmartEditorTemplate>[]> = {
  [SaksTypeEnum.KLAGE]: KLAGE_TEMPLATES,
  [SaksTypeEnum.ANKE]: ANKE_TEMPLATES,
  [SaksTypeEnum.ANKE_I_TRYGDERETTEN]: ANKE_I_TRYGDERETTEN_TEMPLATES,
  [SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET]: BEHANDLING_ETTER_TR_OPPHEVET_TEMPLATES,
  [SaksTypeEnum.OMGJØRINGSKRAV]: OMGJØRINGSKRAVVEDTAK_TEMPLATES,
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
