import { useSendDebugInfo } from '@app/components/header/user-menu/send-debug-hook';
import { ENVIRONMENT } from '@app/environment';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorActiveDocument } from '@app/hooks/settings/use-setting';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { useUtfall, useYtelserAll } from '@app/simple-api-state/use-kodeverk';
import { user } from '@app/static-data/static-data';
import type { INavEmployee } from '@app/types/bruker';
import { BugIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, Dropdown, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

export const DebugButton = () => {
  const { oppgaveId } = useParams();

  return oppgaveId !== undefined ? <BehandlingDebug /> : <SimpleDebug />;
};

export const SimpleDebug = () => {
  const reporter = useReporter();

  const getData = useCallback(
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

  return (
    <Dropdown.Menu.List.Item as={SendButton} getData={getData}>
      Send teknisk informasjon
    </Dropdown.Menu.List.Item>
  );
};

export const BehandlingDebug = () => {
  const reporter = useReporter();
  const { data: oppgave } = useOppgave();
  const { data: documents } = useGetDocumentsQuery(oppgave?.id ?? skipToken);
  const { value: selectedTab = null } = useSmartEditorActiveDocument();
  const { data: utfallList = [] } = useUtfall();

  const getData = useCallback(async () => {
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

  return (
    <Dropdown.Menu.List.Item as={SendButton} getData={getData}>
      Send teknisk informasjon
    </Dropdown.Menu.List.Item>
  );
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

interface SendButtonProps {
  getData: () => Promise<string | null>;
  children?: React.ReactNode;
}

const SendButton = ({ getData, children }: SendButtonProps) => {
  const { sendDebugInfo, success, loading } = useSendDebugInfo();

  const onClick = async () => {
    const data = await getData();

    if (data === null) {
      return;
    }

    sendDebugInfo(data);
  };

  return (
    <Tooltip content="Sender teknisk informasjon direkte til Team Klage.">
      <Button
        variant="tertiary"
        size="small"
        onClick={onClick}
        loading={loading}
        icon={success ? <CheckmarkIcon aria-hidden /> : <BugIcon aria-hidden />}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

const employeeToUser = (employee: INavEmployee | null = null) =>
  employee === null ? null : { name: employee.navn, navIdent: employee.navIdent };
