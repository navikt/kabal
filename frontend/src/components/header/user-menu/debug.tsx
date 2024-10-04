import { toast } from '@app/components/toast/store';
import { ENVIRONMENT } from '@app/environment';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorActiveDocument } from '@app/hooks/settings/use-setting';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { useUtfall, useYtelserAll } from '@app/simple-api-state/use-kodeverk';
import { user } from '@app/static-data/static-data';
import type { INavEmployee } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { BugIcon } from '@navikt/aksel-icons';
import { Button, Dropdown, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

export const DebugButton = () => {
  const { oppgaveId } = useParams();

  if (oppgaveId !== undefined) {
    return <BehandlingDebug />;
  }

  return <SimpleDebug />;
};

export const SimpleDebug = () => {
  const reporter = useReporter();

  const onClick: React.MouseEventHandler<HTMLElement> = useCallback(async () => {
    const body = JSON.stringify(
      {
        reporter: await reporter,
        url: window.location.href,
        version: ENVIRONMENT.version,
      },
      null,
      2,
    );

    sendDebugInfo(body);
  }, [reporter]);

  return (
    <Dropdown.Menu.List.Item as={SendButton} onClick={onClick}>
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

  const onClick: React.MouseEventHandler<HTMLElement> = useCallback(async () => {
    if (oppgave === undefined) {
      console.error('No behandling loaded');
      return;
    }

    const medunderskriver = oppgave.medunderskriver.employee;
    const rol = oppgave.typeId !== SaksTypeEnum.ANKE_I_TRYGDERETTEN ? oppgave.rol : null;

    const body = JSON.stringify(
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

    sendDebugInfo(body);
  }, [oppgave, documents, selectedTab, reporter, utfallList]);

  return (
    <Dropdown.Menu.List.Item as={SendButton} onClick={onClick}>
      Send teknisk informasjon
    </Dropdown.Menu.List.Item>
  );
};

const sendDebugInfo = async (body: string) => {
  try {
    const res = await fetch('/debug', { method: 'POST', body, headers: { 'Content-Type': 'application/json' } });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    toast.success('Teknisk informasjon er sendt til Team Klage');
  } catch (error) {
    console.error('Failed to send debug info to Team Klage', error instanceof Error ? error.message : error);
    toast.error(
      'Klarte ikke sende teknisk informasjon til Team Klage. Teknisk informasjon er kopiert til utklippstavlen din.',
    );
    navigator.clipboard.writeText(body);
  }
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
  onClick: () => void;
  children?: React.ReactNode;
}

const SendButton = ({ onClick, children }: SendButtonProps) => (
  <Tooltip content="Sender teknisk informasjon om saken direkte til Team Klage.">
    <Button variant="tertiary" size="small" onClick={onClick} icon={<BugIcon aria-hidden />}>
      {children}
    </Button>
  </Tooltip>
);

const employeeToUser = (employee: INavEmployee | null = null) =>
  employee === null ? null : { name: employee.navn, navIdent: employee.navIdent };
