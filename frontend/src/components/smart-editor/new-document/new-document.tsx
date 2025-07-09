import { StaticDataContext } from '@app/components/app/static-data-context';
import { GeneratedIcon } from '@app/components/smart-editor/new-document/generated-icon';
import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { useCreatorRole } from '@app/hooks/dua-access/use-creator-role';
import { useLazyDocumentAccess } from '@app/hooks/dua-access/use-document-access';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsAssignedRolAndSent } from '@app/hooks/use-is-rol';
import {
  ANKE_I_TRYGDERETTEN_TEMPLATES,
  ANKE_TEMPLATES,
  BEHANDLING_ETTER_TR_OPPHEVET_TEMPLATES,
  getFinishedBehandlingTemplates,
  KLAGE_TEMPLATES,
  OMGJØRINGSKRAVVEDTAK_TEMPLATES,
} from '@app/plate/templates/templates';
import { useCreateSmartDocumentMutation } from '@app/redux-api/collaboration';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { IMutableSmartEditorTemplate, ISmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { Language } from '@app/types/texts/language';
import type { Immutable } from '@app/types/types';
import { Box, BoxNew, Button, Heading, HGrid, HStack, Loader } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { getTitle } from './get-title';

interface Props {
  onCreate: (id: string) => void;
}

export const NewDocument = ({ onCreate }: Props) => {
  const isRol = useIsAssignedRolAndSent();
  const hasDocumentsAccess = useHasDocumentsAccess();
  const isFeilregistrert = useIsFeilregistrert();
  const oppgaveId = useOppgaveId();
  const [createSmartDocument, { isLoading }] = useCreateSmartDocumentMutation();
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);
  const { data: oppgave } = useOppgave();
  const { data: documents = [] } = useGetDocumentsQuery(oppgaveId);
  const { available, unavailable } = useTemplates();
  const [showMissing, setShowMissing] = useState(false);

  if (isFeilregistrert || oppgave === undefined) {
    return null;
  }

  if (!(isRol || hasDocumentsAccess)) {
    return null;
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
    <BoxNew
      width="825.7px"
      height="100%"
      padding="4"
      background="default"
      overflowY="auto"
      className="flex flex-col gap-y-4"
    >
      <section>
        <Heading level="2" size="small" spacing>
          Opprett nytt dokument
        </Heading>

        <HGrid as="section" columns={4}>
          {available.map((template) => (
            <TemplateButton
              template={template}
              key={template.templateId}
              onClick={() => onClick(template)}
              loading={isLoading && loadingTemplate === template.templateId}
            />
          ))}
        </HGrid>
      </section>

      {unavailable.length === 0 ? null : (
        <Button variant="tertiary-neutral" size="small" onClick={() => setShowMissing((s) => !s)}>
          {showMissing ? 'Skjul' : 'Vis'} utilgjengelige maler ({unavailable.length})
        </Button>
      )}

      {showMissing ? (
        <section>
          <Heading level="3" size="small" spacing>
            Utilgjengelige maler ({unavailable.length})
          </Heading>

          <HGrid as="section" columns={4}>
            {unavailable.map(({ template, access }) => (
              <BoxNew
                key={template.templateId}
                background="default"
                borderRadius="medium"
                position="relative"
                padding="4"
                className="text-base flex flex-col items-center hover:bg-bg-subtle group"
              >
                <div className="relative w-full mb-2">
                  <GeneratedIcon template={template} className="shadow-medium border-border-default rounded-medium" />

                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    padding="2"
                    borderRadius="small"
                    className="backdrop-blur-xs opacity-0 group-hover:opacity-100"
                  >
                    {access}
                  </Box>
                </div>

                <span className="font-semibold">{template.tittel}</span>
              </BoxNew>
            ))}
          </HGrid>
        </section>
      ) : null}
    </BoxNew>
  );
};

const useTemplates = () => {
  const creatorRole = useCreatorRole();
  const getDocumentAccess = useLazyDocumentAccess();
  const allTemplates = useNewSmartDocumentTemplates();

  const available: Immutable<IMutableSmartEditorTemplate>[] = [];
  const unavailable: { template: Immutable<IMutableSmartEditorTemplate>; access: string }[] = [];

  for (const template of allTemplates) {
    const access = getDocumentAccess(
      {
        creatorRole,
        isMarkertAvsluttet: false,
        isSmartDokument: true,
        templateId: template.templateId,
        type: DocumentTypeEnum.SMART,
      },
      DuaActionEnum.CREATE,
    );

    if (access === null) {
      available.push(template);
    } else {
      unavailable.push({ template, access });
    }
  }

  return { available, unavailable };
};

export const useNewSmartDocumentTemplates = () => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  if (!isSuccess) {
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
};

interface TemplateButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  template: ISmartEditorTemplate;
  loading: boolean;
  unavailable?: boolean;
}

const TemplateButton = ({ template, loading, unavailable = false, onClick, ...rest }: TemplateButtonProps) => (
  <BoxNew
    as="button"
    type="button"
    background="default"
    borderRadius="medium"
    position="relative"
    padding="4"
    className="text-base font-semibold cursor-pointer flex flex-col items-center hover:bg-bg-subtle"
    disabled={loading}
    onClick={unavailable ? undefined : onClick}
    {...rest}
  >
    {loading ? <LoadingOverlay /> : null}

    <GeneratedIcon template={template} className="shadow-medium border-border-default rounded-medium w-full mb-2" />

    <span>{template.tittel}</span>
  </BoxNew>
);

const LoadingOverlay = () => (
  <HStack asChild align="center" justify="center" position="absolute" top="0">
    <Box background="surface-backdrop" height="100%" width="100%">
      <Loader size="xlarge" />
    </Box>
  </HStack>
);
