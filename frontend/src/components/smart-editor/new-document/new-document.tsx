import { Box, Heading, HStack, Loader, Tooltip, VStack } from '@navikt/ds-react';
import { type Ref, useContext, useState } from 'react';
import { Alert } from '@/components/alert/alert';
import { StaticDataContext } from '@/components/app/static-data-context';
import { GeneratedIcon } from '@/components/smart-editor/new-document/generated-icon';
import { getTitle } from '@/components/smart-editor/new-document/get-title';
import { DuaActionEnum } from '@/hooks/dua-access/access';
import { useCreatorRole } from '@/hooks/dua-access/use-creator-role';
import { useDuaAccess } from '@/hooks/dua-access/use-dua-access';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import {
  ANKE_I_TRYGDERETTEN_TEMPLATES,
  ANKE_TEMPLATES,
  BEGJÆRING_OM_GJENOPPTAK_I_TR_TEMPLATES,
  BEGJÆRING_OM_GJENOPPTAK_TEMPLATES,
  BEHANDLING_ETTER_TR_OPPHEVET_TEMPLATES,
  getFinishedBehandlingTemplates,
  KLAGE_TEMPLATES,
  OMGJØRINGSKRAVVEDTAK_TEMPLATES,
} from '@/plate/templates/templates';
import { useCreateSmartDocumentMutation } from '@/redux-api/collaboration';
import { useGetDocumentsQuery } from '@/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum } from '@/types/documents/documents';
import { SaksTypeEnum } from '@/types/kodeverk';
import type { IMutableSmartEditorTemplate, ISmartEditorTemplate } from '@/types/smart-editor/smart-editor';
import { Language } from '@/types/texts/language';
import type { Immutable } from '@/types/types';

interface Props {
  onCreate: (id: string) => void;
  ref?: Ref<HTMLElement>;
}

export const NewDocument = ({ onCreate, ref }: Props) => {
  const oppgaveId = useOppgaveId();
  const [createSmartDocument, { isLoading }] = useCreateSmartDocumentMutation();
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);
  const { data: oppgave, isSuccess } = useOppgave();
  const { data: documents = [] } = useGetDocumentsQuery(oppgaveId);
  const templates = useNewSmartDocumentTemplates();

  if (!isSuccess) {
    return <Loader size="large" />;
  }

  const onClick = async (template: ISmartEditorTemplate) => {
    setLoadingTemplate(template.templateId);

    try {
      const { id } = await createSmartDocument({
        templateId: template.templateId,
        dokumentTypeId: template.dokumentTypeId,
        content: template.richText,
        tittel: getTitle(documents, template),
        oppgaveId: oppgave.id,
        parentId: null,
        language: Language.NB,
      }).unwrap();

      return onCreate(id);
    } finally {
      setLoadingTemplate(null);
    }
  };

  return (
    <Box
      ref={ref}
      as="section"
      width="826px"
      height="100%"
      paddingBlock="space-16"
      paddingInline="space-32"
      background="default"
      overflowY="auto"
    >
      <Heading level="1" size="xsmall" spacing>
        Opprett nytt dokument
      </Heading>
      <HStack as="section" wrap>
        {templates.map((template) => (
          <TemplateButton
            template={template}
            key={template.templateId}
            onClick={() => onClick(template)}
            loading={isLoading && loadingTemplate === template.templateId}
          />
        ))}
        {templates.length === 0 ? (
          <Alert variant="info" className="grow">
            Ingen maler tilgjengelig.
          </Alert>
        ) : null}
      </HStack>
    </Box>
  );
};

export const useNewSmartDocumentTemplates = () => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  if (!isSuccess) {
    // ROL and KROL can never create new main documents.
    // ROL can only create answers to ROL questions.
    return [];
  }

  const { isAvsluttetAvSaksbehandler, typeId } = oppgave;

  if (isAvsluttetAvSaksbehandler) {
    return getFinishedBehandlingTemplates(user.navIdent);
  }

  return TEMPLATES[typeId];
};

const TEMPLATES: Record<SaksTypeEnum, Immutable<IMutableSmartEditorTemplate>[]> = {
  [SaksTypeEnum.KLAGE]: KLAGE_TEMPLATES,
  [SaksTypeEnum.ANKE]: ANKE_TEMPLATES,
  [SaksTypeEnum.ANKE_I_TRYGDERETTEN]: ANKE_I_TRYGDERETTEN_TEMPLATES,
  [SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET]: BEHANDLING_ETTER_TR_OPPHEVET_TEMPLATES,
  [SaksTypeEnum.OMGJØRINGSKRAV]: OMGJØRINGSKRAVVEDTAK_TEMPLATES,
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK]: BEGJÆRING_OM_GJENOPPTAK_TEMPLATES,
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR]: BEGJÆRING_OM_GJENOPPTAK_I_TR_TEMPLATES,
};

interface TemplateButtonProps {
  template: ISmartEditorTemplate;
  loading: boolean;
  onClick: () => void;
}

const TemplateButton = ({ template, loading, onClick }: TemplateButtonProps) => {
  const creatorRole = useCreatorRole();
  const noAccessMessage = useDuaAccess(
    { creator: { creatorRole }, type: DocumentTypeEnum.SMART, templateId: template.templateId },
    DuaActionEnum.CREATE,
  );

  const hasAccess = noAccessMessage === null;

  return (
    <ErrorWrapper noAccessMessage={noAccessMessage}>
      <Box asChild padding="space-16" borderRadius="4" width="25%" minWidth="190px">
        <VStack
          as="button"
          type="button"
          onClick={hasAccess ? onClick : undefined}
          disabled={loading}
          align="center"
          position="relative"
          style={{ opacity: hasAccess ? 1 : 0.5, cursor: hasAccess ? 'pointer' : 'not-allowed' }}
          className="hover:bg-ax-bg-neutral-moderate-hover focus:rounded focus:outline-2 focus:outline-ax-border-focus focus:-outline-offset-2"
        >
          <LoadingOverlay loading={loading} />

          <GeneratedIcon template={template} />

          <span className="font-ax-bold text-ax-medium">{template.tittel}</span>
        </VStack>
      </Box>
    </ErrorWrapper>
  );
};

interface ErrorWrapperProps {
  noAccessMessage: string | null;
  children: React.ReactElement;
}

const ErrorWrapper = ({ children, noAccessMessage }: ErrorWrapperProps) => {
  if (noAccessMessage === null) {
    return children;
  }

  return (
    <Tooltip content={noAccessMessage} placement="bottom">
      {children}
    </Tooltip>
  );
};

const LoadingOverlay = ({ loading }: { loading: boolean }) =>
  loading ? (
    <HStack asChild align="center" justify="center" position="absolute" top="space-0">
      <Box background="neutral-soft" height="100%" width="100%">
        <Loader size="xlarge" />
      </Box>
    </HStack>
  ) : null;
