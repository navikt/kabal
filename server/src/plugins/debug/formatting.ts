import { type BehandlingData, DataType, type Document, type Reporter, type User } from '@app/plugins/debug/types';

export const formatMessage = (
  url: string,
  version: string,
  { navn, navIdent, roller, ansattEnhet, enheter, tildelteYtelser }: Reporter,
  data: BehandlingData | undefined | null,
) => {
  const header = `*Debug-data fra ${navn}* \`${navIdent}\` for \`${url}\`\nKlientversjon: \`${version}\``;
  const reporter = [
    '*Bruker*',
    `*Roller*: ${roller.map((r) => `\`${r}\``).join(', ')}`,
    `*Ansatt i enhet*: ${ansattEnhet.navn} (${ansattEnhet.id})`,
    `*Enheter*: ${enheter.map((enhet) => `${enhet.navn} (${enhet.id})`).join(', ')}`,
    `*Tildelte ytelser*: ${tildelteYtelser.map((y) => `\`${y}\``).join(', ')}`,
  ].join('\n');

  if (data === undefined || data === null) {
    return `\n${header}\n\n${reporter}`;
  }

  return `\n${header}\n\n${reporter}\n\n${formatData(data)}`;
};

const formatData = (data: BehandlingData) => {
  switch (data.type) {
    case DataType.BEHANDLING:
      return formatBehandling(data);
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

  return `*Behandling*
*ID*: \`${behandlingId}\`
*Aktivt smartdokument*: \`${selectedTab === undefined ? 'Nytt dokument' : selectedTab}\`
*Smartdokumenter (${smartDocuments.length})*:${smartDocuments.map((doc) => `\n- ${formatDocument(doc)}`).join('')}
*Ikke-smartdokumenter (${documents.length})*:${documents.map((doc) => `\n- ${formatDocument(doc)}`).join('')}

*Utfall*: \`${utfall ?? 'Ingen'}\`
*Medunderskriver*: ${medunderskriver === null ? 'Ingen' : formatUser(medunderskriver)} \`${muFlowState}\`
*ROL*: ${rol === null ? 'Ingen' : formatUser(rol)} \`${rolFlowState}\``;
};

const formatDocument = ({ title, id, type, templateId }: Document) => {
  if (templateId === null) {
    return `\`${id}\` - type: \`${type}\` - tittel: \`${title}\``;
  }

  return `\`${id}\` - type: \`${type}\` - templateId: \`${templateId}\` - tittel: \`${title}\``;
};

export const formatUser = ({ navIdent, name }: User) => `${name} \`${navIdent}\``;
