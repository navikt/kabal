import { formatMessage, formatUser } from '@app/plugins/debug/formatting';
import { DataType } from '@app/plugins/debug/types';
import { describe, expect, it } from 'bun:test';

describe('debug formatting', () => {
  it('should format user', () => {
    expect.assertions(1);
    const actual = formatUser({ navIdent: 'Z997766', name: 'Ola Nordmann', roles: ['ROLE1', 'ROLE2'] });
    const expected = 'Z997766 Ola Nordmann - ROLE1, ROLE2';
    expect(actual).toBe(expected);
  });

  it('should format message', () => {
    expect.assertions(1);
    const actual = formatMessage(
      'https://kabal.intern.nav.no/ankebehandling/9f454262-f83a-44c2-ab2d-5b175e3654c6',
      { navIdent: 'Z997766', name: 'Ola Nordmann', roles: ['ROLE1', 'ROLE2'] },
      {
        type: DataType.BEHANDLING,
        behandlingId: '9f454262-f83a-44c2-ab2d-5b175e3654c6',
        medunderskriver: { navIdent: 'Z123456', name: 'Kari Nordmann', roles: ['ROLE3'] },
        rol: { navIdent: 'Z654321', name: 'Per Nordmann', roles: ['ROLE4'] },
        selectedTab: {
          id: '9f454262-f83a-44c2-ab2d-5b175e3654c6',
          title: 'Ankevedtak',
          type: 'SMART',
          templateId: 'ankevedtak',
        },
        smartDocuments: [
          { id: '9f454262-f83a-44c2-ab2d-5b175e3654c6', title: 'Ankevedtak', type: 'SMART', templateId: 'ankevedtak' },
        ],
        documents: [
          { id: '9f454262-f83a-44c2-ab2d-5b175e3654c6', title: 'Ankevedtak', type: 'SMART', templateId: 'ankevedtak' },
        ],
        utfall: 'MEDHOLD',
        muFlowState: 'NOT_SENT',
        rolFlowState: 'SENT',
      },
    );
    const expected = `*Debugging data from Ola Nordmann \`Z997766\` for \`https://kabal.intern.nav.no/ankebehandling/9f454262-f83a-44c2-ab2d-5b175e3654c6\`*

\`\`\`Behandling ID: 9f454262-f83a-44c2-ab2d-5b175e3654c6
Selected tab: 9f454262-f83a-44c2-ab2d-5b175e3654c6 - type: SMART - templateId: ankevedtak - title: "Ankevedtak"
Smart documents (1):
- 9f454262-f83a-44c2-ab2d-5b175e3654c6 - type: SMART - templateId: ankevedtak - title: "Ankevedtak"
Non-smart documents (1):
- 9f454262-f83a-44c2-ab2d-5b175e3654c6 - type: SMART - templateId: ankevedtak - title: "Ankevedtak"

Utfall: MEDHOLD
Medunderskriver: Z123456 Kari Nordmann - ROLE3 (NOT_SENT)
ROL: Z654321 Per Nordmann - ROLE4 (SENT)\`\`\``;

    expect(actual).toBe(expected);
  });
});
