import { useSendDebugInfo } from '@app/components/header/user-menu/send-debug-hook';
import { ENVIRONMENT } from '@app/environment';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorActiveDocument } from '@app/hooks/settings/use-setting';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { useUtfall, useYtelserAll } from '@app/simple-api-state/use-kodeverk';
import { user } from '@app/static-data/static-data';
import type { INavEmployee } from '@app/types/bruker';
import { BugIcon, CheckmarkCircleIcon } from '@navikt/aksel-icons';
import { ActionMenu, Loader, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

export const SendDebugInfoButton = () => {
  const { oppgaveId } = useParams();

  return oppgaveId === undefined ? <GeneralDebugInfo /> : <BehandlingDebugInfo />;
};

const GeneralDebugInfo = () => {
  const { sendDebugInfo, loading, success } = useSendDebugInfoState(useGetGeneralDebugInfo());

  return <UserMenuItem sendDebugInfo={sendDebugInfo} loading={loading} success={success} />;
};

const BehandlingDebugInfo = () => {
  const { sendDebugInfo, loading, success } = useSendDebugInfoState(useGetBehandlingDebugInfo());

  return <UserMenuItem sendDebugInfo={sendDebugInfo} loading={loading} success={success} />;
};

interface MenuItemProps {
  sendDebugInfo: () => Promise<void>;
  loading: boolean;
  success: boolean;
}

const UserMenuItem = ({ sendDebugInfo, loading, success }: MenuItemProps) => (
  <Tooltip content="Sender teknisk informasjon direkte til Team Klage" placement="left">
    <ActionMenu.Item
      icon={<DebugIcon loading={loading} success={success} />}
      onSelect={sendDebugInfo}
      disabled={loading}
      className="cursor-pointer"
    >
      Send teknisk informasjon
    </ActionMenu.Item>
  </Tooltip>
);

interface DebugIconProps {
  loading: boolean;
  success: boolean;
}

const DebugIcon = ({ loading, success }: DebugIconProps) => {
  if (loading) {
    return <Loader aria-hidden size="small" />;
  }

  if (success) {
    return <CheckmarkCircleIcon aria-hidden />;
  }

  return <BugIcon aria-hidden />;
};

export const useSendDebugInfoState = (getDebugInfo: () => Promise<string | null>) => {
  const { sendDebugInfo, success, loading } = useSendDebugInfo();

  return {
    sendDebugInfo: async () => {
      const data = await getDebugInfo();

      if (data === null) {
        console.error('No debug data available');
        return;
      }

      sendDebugInfo(data);
    },
    success,
    loading,
  };
};

const useGetGeneralDebugInfo = () => {
  const reporter = useReporter();

  return useCallback(
    async (): Promise<string> =>
      JSON.stringify(
        {
          reporter: await reporter,
          url: window.location.href,
          version: ENVIRONMENT.version,
        },
        null,
        2,
      ),
    [reporter],
  );
};

const useGetBehandlingDebugInfo = () => {
  const reporter = useReporter();
  const { data: oppgave } = useOppgave();
  const { data: documents } = useGetDocumentsQuery(oppgave?.id ?? skipToken);
  const { value: selectedTab = null } = useSmartEditorActiveDocument();
  const { data: utfallList = [] } = useUtfall();

  return useCallback(async () => {
    if (oppgave === undefined) {
      console.error('No behandling loaded');
      return null;
    }

    const medunderskriver = oppgave.medunderskriver.employee;
    const { rol } = oppgave;

    return JSON.stringify(
      {
        reporter: await reporter,
        url: window.location.href,
        version: ENVIRONMENT.version,
        data: {
          type: 'behandling',
          behandlingId: oppgave.id,
          utfall: utfallList.find((u) => u.id === oppgave.resultat.utfallId)?.navn ?? oppgave.resultat.utfallId,
          ekstraUtfall: oppgave.resultat.extraUtfallIdSet.map((id) => utfallList.find((u) => u.id === id)?.navn ?? id),
          medunderskriver: employeeToUser(medunderskriver),
          muFlowState: oppgave.medunderskriver.flowState,
          rol: employeeToUser(rol?.employee),
          rolFlowState: rol?.flowState ?? null,
          selectedTab,
          documents: documents
            ?.filter((d) => !d.isSmartDokument)
            .map(({ id, tittel, type, templateId }) => ({ id, title: tittel, type, templateId })),
          smartDocuments: documents
            ?.filter((d) => d.isSmartDokument)
            .map(({ id, tittel, type, templateId }) => ({ id, title: tittel, type, templateId })),
        },
      },
      null,
      2,
    );
  }, [oppgave, documents, selectedTab, reporter, utfallList]);
};

const useReporter = async () => {
  const { data: ytelser } = useYtelserAll();

  if (ytelser === undefined) {
    return user;
  }

  const { tildelteYtelser, ...rest } = await user;

  return {
    ...rest,
    tildelteYtelser: tildelteYtelser.map((id) => {
      const ytelse = ytelser.find((y) => y.id === id);

      if (ytelse === undefined) {
        return `Unknown ytelse (\`${id}\`)`;
      }

      return `${ytelse.navn} (${ytelse.id})`;
    }),
  };
};

const employeeToUser = (employee: INavEmployee | null = null) =>
  employee === null ? null : { name: employee.navn, navIdent: employee.navIdent };
