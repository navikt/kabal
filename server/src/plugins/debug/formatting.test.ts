import { describe, expect, it } from 'bun:test';
import { formatMessage, formatUser } from '@app/plugins/debug/formatting';
import { DataType } from '@app/plugins/debug/types';

describe('debug formatting', () => {
  it('should format user', () => {
    expect.assertions(1);
    const actual = formatUser({ navIdent: 'Z997766', name: 'Ola Nordmann' });
    const expected = 'Ola Nordmann `Z997766`';
    expect(actual).toBe(expected);
  });

  it('should format message', () => {
    expect.assertions(1);
    const actual = formatMessage(
      'https://kabal.intern.nav.no/ankebehandling/9f454262-f83a-44c2-ab2d-5b175e3654c6',
      'test-version',
      {
        navIdent: 'Z997766',
        navn: 'Ola Nordmann',
        roller: ['ROLE1', 'ROLE2'],
        ansattEnhet: { id: 'enhet1', navn: 'Enhet 1', lovligeYtelser: ['ytelse1', 'ytelse2'] },
        enheter: [
          { id: 'enhet1', navn: 'Enhet 1', lovligeYtelser: ['ytelse1', 'ytelse2'] },
          { id: 'enhet2', navn: 'Enhet 2', lovligeYtelser: ['ytelse1', 'ytelse2'] },
        ],
        tildelteYtelser: ['ytelse1', 'ytelse2'],
      },
      {
        type: DataType.BEHANDLING,
        behandlingId: '9f454262-f83a-44c2-ab2d-5b175e3654c6',
        medunderskriver: { navIdent: 'Z123456', name: 'Kari Nordmann' },
        rol: { navIdent: 'Z654321', name: 'Per Nordmann' },
        selectedTab: '9f454262-f83a-44c2-ab2d-5b175e3654c6',
        smartDocuments: [
          { id: '9f454262-f83a-44c2-ab2d-5b175e3654c6', title: 'Ankevedtak', type: 'SMART', templateId: 'ankevedtak' },
        ],
        documents: [
          { id: '9f454262-f83a-44c2-ab2d-5b175e3654c6', title: 'Ankevedtak', type: 'SMART', templateId: 'ankevedtak' },
        ],
        utfall: 'MEDHOLD',
        ekstraUtfall: ['utfall1', 'utfall2'],
        muFlowState: 'NOT_SENT',
        rolFlowState: 'SENT',
      },
    );
    const expected = `\n*Debug-data fra Ola Nordmann* \`Z997766\` for \`https://kabal.intern.nav.no/ankebehandling/9f454262-f83a-44c2-ab2d-5b175e3654c6\`
Klientversjon: \`test-version\`

*Bruker*
*Roller*: \`ROLE1\`, \`ROLE2\`
*Ansatt i enhet*: Enhet 1 (enhet1)
*Enheter*: Enhet 1 (enhet1), Enhet 2 (enhet2)
*Tildelte ytelser*: \`ytelse1\`, \`ytelse2\`

*Behandling*
*ID*: \`9f454262-f83a-44c2-ab2d-5b175e3654c6\`
*Aktivt smartdokument*: \`9f454262-f83a-44c2-ab2d-5b175e3654c6\`
*Smartdokumenter (1)*:
- \`9f454262-f83a-44c2-ab2d-5b175e3654c6\` - type: \`SMART\` - templateId: \`ankevedtak\` - tittel: \`Ankevedtak\`
*Ikke-smartdokumenter (1)*:
- \`9f454262-f83a-44c2-ab2d-5b175e3654c6\` - type: \`SMART\` - templateId: \`ankevedtak\` - tittel: \`Ankevedtak\`

*Utfall*: \`MEDHOLD\`
*Medunderskriver*: Kari Nordmann \`Z123456\` \`NOT_SENT\`
*ROL*: Per Nordmann \`Z654321\` \`SENT\``;

    expect(actual).toBe(expected);
  });
});
