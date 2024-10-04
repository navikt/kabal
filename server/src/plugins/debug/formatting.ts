import { BehandlingData, DataType, Document, MineOppgaverData, User } from '@app/plugins/debug/types';

export const formatUser = ({ navIdent, name, roles }: User) => `${navIdent} ${name} - ${roles.join(', ')}`;

export const formatMessage = (url: string, { name, navIdent }: User, data: BehandlingData | MineOppgaverData) =>
  appendMessage(`*Debugging data from ${name} \`${navIdent}\` for \`${url}\`*`, formatData(data));

const appendMessage = (base: string, append: string) => `${base}\n\n\`\`\`${append}\`\`\``;

const formatData = (data: BehandlingData | MineOppgaverData) => {
  switch (data.type) {
    case DataType.BEHANDLING:
      return formatBehandling(data);
    case DataType.MINE_OPPGAVER:
      return formatMineOppgaver(data);
  }
};

const formatBehandling = (data: BehandlingData) => {
  const {
    behandlingId,
    selectedTab,
    smartDocuments,
    documents,
    medunderskriver,
    rol,
    muFlowState,
    rolFlowState,
    utfall,
  } = data;

  return `Behandling ID: ${behandlingId}
Selected tab: ${selectedTab === undefined ? 'Nytt dokument' : formatDocument(selectedTab)}
Smart documents (${smartDocuments.length}):${smartDocuments.map((doc) => `\n- ${formatDocument(doc)}`).join('')}
Non-smart documents (${documents.length}):${documents.map((doc) => `\n- ${formatDocument(doc)}`).join('')}

Utfall: ${utfall ?? 'Ingen'}
Medunderskriver: ${medunderskriver === undefined ? 'Ingen' : formatUser(medunderskriver)} (${muFlowState})
ROL: ${rol === undefined ? 'Ingen' : formatUser(rol)} (${rolFlowState})`;
};

const formatMineOppgaver = (data: MineOppgaverData) => {
  const { unfinished, finished, waiting } = data;

  return `Mine oppgaver (${unfinished.length + finished.length + waiting.length}):
Uferdige (${unfinished.length}): ${unfinished.join(', ')}
På vent (${waiting.length}): ${waiting.join(', ')}
Fullførte (${finished.length}): ${finished.join(', ')}`;
};

const formatDocument = ({ title, id, type, templateId }: Document) =>
  `${id} - type: ${type} - templateId: ${templateId} - title: "${title}"`;
