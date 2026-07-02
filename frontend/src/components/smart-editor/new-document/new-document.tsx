import { Box, Heading, HStack, Loader, Tooltip, VStack } from '@navikt/ds-react';
import { type Ref, useContext, useMemo, useState } from 'react';
import { Alert } from '@/components/alert/alert';
import { StaticDataContext } from '@/components/app/static-data-context';
import { GeneratedIcon } from '@/components/smart-editor/new-document/generated-icon';
import { getTitle } from '@/components/smart-editor/new-document/get-title';
import { DuaActionEnum } from '@/hooks/dua-access/access';
import { useCreatorRole } from '@/hooks/dua-access/use-creator-role';
import { useDuaAccess } from '@/hooks/dua-access/use-dua-access';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import type { CreateTemplateParams } from '@/plate/templates/helpers';
import {
  getAnkeITrygderettenTemplates,
  getAnkeTemplates,
  getBegjæringOmGjenopptakITrTemplates,
  getBegjæringOmGjenopptakTemplates,
  getBehandlingEtterTrOpphevetTemplates,
  getFinishedBehandlingTemplates,
  getKlageTemplates,
  getOmgjøringskravvedtakTemplates,
} from '@/plate/templates/templates';
import { useCreateSmartDocumentMutation } from '@/redux-api/collaboration';
import { useGetDocumentsQuery } from '@/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum } from '@/types/documents/documents';
import { SaksTypeEnum } from '@/types/kodeverk';
import type { ISmartEditorTemplate } from '@/types/smart-editor/smart-editor';
import { Language } from '@/types/texts/language';

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

export const useNewSmartDocumentTemplates = (): ISmartEditorTemplate[] => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return useMemo(() => {
    if (!isSuccess) {
      // ROL and KROL can never create new main documents.
      // ROL can only create answers to ROL questions.
      return [];
    }

    const { isAvsluttetAvSaksbehandler, typeId, fagsystemId } = oppgave;

    if (isAvsluttetAvSaksbehandler) {
      return getFinishedBehandlingTemplates({ sakstype: typeId, fagsystemId, navIdent: user.navIdent });
    }

    return TEMPLATE_GETTERS[typeId]({ sakstype: typeId, fagsystemId });
  }, [isSuccess, oppgave, user.navIdent]);
};

const TEMPLATE_GETTERS: Record<SaksTypeEnum, (params: CreateTemplateParams) => ISmartEditorTemplate[]> = {
  [SaksTypeEnum.KLAGE]: getKlageTemplates,
  [SaksTypeEnum.ANKE]: getAnkeTemplates,
  [SaksTypeEnum.ANKE_I_TRYGDERETTEN]: getAnkeITrygderettenTemplates,
  [SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET]: getBehandlingEtterTrOpphevetTemplates,
  [SaksTypeEnum.OMGJØRINGSKRAV]: getOmgjøringskravvedtakTemplates,
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK]: getBegjæringOmGjenopptakTemplates,
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR]: getBegjæringOmGjenopptakITrTemplates,
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
