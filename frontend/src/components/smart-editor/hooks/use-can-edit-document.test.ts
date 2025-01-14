import { describe, expect, it } from 'bun:test';
import { canEditDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import { type IUserData, Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

const createOppgave = (
  muFlowState: FlowState,
  rolFlowState: FlowState,
  avsluttetAvSaksbehandlerDate: string | null,
): IOppgavebehandling =>
  ({
    saksbehandler: { navIdent: 'assigned saksbehandler' },
    typeId: SaksTypeEnum.KLAGE,
    rol: { flowState: rolFlowState, employee: { navIdent: 'rol' } },
    medunderskriver: { flowState: muFlowState, employee: { navIdent: 'mu' } },
    avsluttetAvSaksbehandlerDate,
  }) as IOppgavebehandling;

type Cases = [FlowState, FlowState, string | null, boolean][];

const CANT_EDIT: Cases = [
  [FlowState.NOT_SENT, FlowState.NOT_SENT, '03.14.1969', false],
  [FlowState.NOT_SENT, FlowState.NOT_SENT, null, false],
  [FlowState.NOT_SENT, FlowState.RETURNED, '03.14.1969', false],
  [FlowState.NOT_SENT, FlowState.RETURNED, null, false],
  [FlowState.NOT_SENT, FlowState.SENT, '03.14.1969', false],
  [FlowState.NOT_SENT, FlowState.SENT, null, false],
  [FlowState.RETURNED, FlowState.NOT_SENT, '03.14.1969', false],
  [FlowState.RETURNED, FlowState.NOT_SENT, null, false],
  [FlowState.RETURNED, FlowState.RETURNED, '03.14.1969', false],
  [FlowState.RETURNED, FlowState.RETURNED, null, false],
  [FlowState.RETURNED, FlowState.SENT, '03.14.1969', false],
  [FlowState.RETURNED, FlowState.SENT, null, false],
  [FlowState.SENT, FlowState.NOT_SENT, '03.14.1969', false],
  [FlowState.SENT, FlowState.NOT_SENT, null, false],
  [FlowState.SENT, FlowState.RETURNED, '03.14.1969', false],
  [FlowState.SENT, FlowState.RETURNED, null, false],
  [FlowState.SENT, FlowState.SENT, '03.14.1969', false],
  [FlowState.SENT, FlowState.SENT, null, false],
];

describe('canEditDocument', () => {
  describe('Assigned saksbehandler', () => {
    const user = { navIdent: 'assigned saksbehandler', roller: [Role.KABAL_SAKSBEHANDLING] } as IUserData;

    describe('ROL answers', () => {
      it.each(CANT_EDIT)('%#. should never allow editing', (mu, rol, finished, expected) => {
        expect(canEditDocument(TemplateIdEnum.ROL_ANSWERS, createOppgave(mu, rol, finished), user)).toBe(expected);
      });
    });

    describe('ROL questions', () => {
      const cases: Cases = [
        // Only assigned saksbehandler can edit in not-finished behandling when flow states are NOT_SENT/RETURNED
        [FlowState.NOT_SENT, FlowState.RETURNED, null, true],
        [FlowState.RETURNED, FlowState.RETURNED, null, true],
        [FlowState.NOT_SENT, FlowState.NOT_SENT, null, true],
        [FlowState.RETURNED, FlowState.NOT_SENT, null, true],

        // All saksbehandlere can edit in finished behandling
        [FlowState.NOT_SENT, FlowState.NOT_SENT, '03.14.1969', true],
        [FlowState.NOT_SENT, FlowState.RETURNED, '03.14.1969', true],
        [FlowState.NOT_SENT, FlowState.SENT, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.NOT_SENT, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.RETURNED, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.SENT, '03.14.1969', true],
        [FlowState.SENT, FlowState.NOT_SENT, '03.14.1969', true],
        [FlowState.SENT, FlowState.RETURNED, '03.14.1969', true],
        [FlowState.SENT, FlowState.SENT, '03.14.1969', true],

        // MU flow state is sent - can't edit
        [FlowState.SENT, FlowState.RETURNED, null, false],
        [FlowState.SENT, FlowState.NOT_SENT, null, false],

        // ROL state is sent - only ROL can edit
        [FlowState.NOT_SENT, FlowState.SENT, null, false],
        [FlowState.SENT, FlowState.SENT, null, false],
        [FlowState.RETURNED, FlowState.SENT, null, false],
      ];

      it.each(cases)('%#. should not allow editing if flow state is sent', (mu, rol, finished, expected) => {
        expect(canEditDocument(TemplateIdEnum.ROL_QUESTIONS, createOppgave(mu, rol, finished), user)).toBe(expected);
      });
    });

    describe('Other templates', () => {
      const cases: Cases = [
        // Assigned saksbehandler can edit in not-finished behandling when MU flow state is NOT_SENT/RETURNED
        [FlowState.NOT_SENT, FlowState.NOT_SENT, null, true],
        [FlowState.NOT_SENT, FlowState.RETURNED, null, true],
        [FlowState.NOT_SENT, FlowState.SENT, null, true],
        [FlowState.RETURNED, FlowState.NOT_SENT, null, true],
        [FlowState.RETURNED, FlowState.RETURNED, null, true],
        [FlowState.RETURNED, FlowState.SENT, null, true],

        // All saksbehandlere can edit in finished behandling when MU flow state is NOT_SENT/RETURNED
        [FlowState.NOT_SENT, FlowState.NOT_SENT, '03.14.1969', true],
        [FlowState.NOT_SENT, FlowState.NOT_SENT, '03.14.1969', true],
        [FlowState.NOT_SENT, FlowState.RETURNED, '03.14.1969', true],
        [FlowState.NOT_SENT, FlowState.RETURNED, '03.14.1969', true],
        [FlowState.NOT_SENT, FlowState.SENT, '03.14.1969', true],
        [FlowState.NOT_SENT, FlowState.SENT, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.NOT_SENT, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.NOT_SENT, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.RETURNED, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.RETURNED, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.SENT, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.SENT, '03.14.1969', true],
        [FlowState.SENT, FlowState.NOT_SENT, '03.14.1969', true],
        [FlowState.SENT, FlowState.RETURNED, '03.14.1969', true],
        [FlowState.SENT, FlowState.SENT, '03.14.1969', true],

        // Flow state is sent - only MU can edit
        [FlowState.SENT, FlowState.NOT_SENT, null, false],
        [FlowState.SENT, FlowState.RETURNED, null, false],
        [FlowState.SENT, FlowState.SENT, null, false],
      ];

      it.each(cases)('%#. should not allow editing if MU flow state is sent', (mu, rol, finished, expected) => {
        expect(canEditDocument(TemplateIdEnum.KLAGEVEDTAK_V2, createOppgave(mu, rol, finished), user)).toBe(expected);
      });
    });
  });

  describe('Medunderskriver', () => {
    const user = { navIdent: 'mu', roller: [Role.KABAL_SAKSBEHANDLING] } as IUserData;

    describe('ROL answers', () => {
      it.each(CANT_EDIT)('%#. should never allow editing', (mu, rol, finished, expected) => {
        expect(canEditDocument(TemplateIdEnum.ROL_ANSWERS, createOppgave(mu, rol, finished), user)).toBe(expected);
      });
    });

    describe('ROL questions', () => {
      const cases: Cases = [
        // User is MU and MU flow state is sent - can edit
        [FlowState.SENT, FlowState.NOT_SENT, null, true],
        [FlowState.SENT, FlowState.RETURNED, null, true],

        // Behandling is finished, and MU has saksbehandler role - can edit
        [FlowState.NOT_SENT, FlowState.NOT_SENT, '03.14.1969', true],
        [FlowState.NOT_SENT, FlowState.RETURNED, '03.14.1969', true],
        [FlowState.NOT_SENT, FlowState.SENT, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.NOT_SENT, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.RETURNED, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.SENT, '03.14.1969', true],
        [FlowState.SENT, FlowState.NOT_SENT, '03.14.1969', true],
        [FlowState.SENT, FlowState.RETURNED, '03.14.1969', true],
        [FlowState.SENT, FlowState.SENT, '03.14.1969', true],

        // ROL flow state is sent - can't edit
        [FlowState.SENT, FlowState.SENT, null, false],

        // MU Flow state is not sent - MU can't edit
        [FlowState.NOT_SENT, FlowState.NOT_SENT, null, false],
        [FlowState.NOT_SENT, FlowState.SENT, null, false],
        [FlowState.NOT_SENT, FlowState.RETURNED, null, false],
        [FlowState.RETURNED, FlowState.NOT_SENT, null, false],
        [FlowState.RETURNED, FlowState.SENT, null, false],
        [FlowState.RETURNED, FlowState.RETURNED, null, false],
      ];

      it.each(cases)(
        '%#. should allow editing if MU flow state is sent and ROL flow state is not sent',
        (mu, rol, finished, expected) => {
          expect(canEditDocument(TemplateIdEnum.ROL_QUESTIONS, createOppgave(mu, rol, finished), user)).toBe(expected);
        },
      );
    });

    describe('Other templates', () => {
      const cases: Cases = [
        // User is MU and MU flow state is sent - can edit
        [FlowState.SENT, FlowState.NOT_SENT, null, true],
        [FlowState.SENT, FlowState.RETURNED, null, true],
        [FlowState.SENT, FlowState.SENT, null, true],

        // Behandling is finished, and MU has saksbehandler role - can edit
        [FlowState.NOT_SENT, FlowState.NOT_SENT, '03.14.1969', true],
        [FlowState.NOT_SENT, FlowState.RETURNED, '03.14.1969', true],
        [FlowState.NOT_SENT, FlowState.SENT, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.NOT_SENT, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.RETURNED, '03.14.1969', true],
        [FlowState.RETURNED, FlowState.SENT, '03.14.1969', true],
        [FlowState.SENT, FlowState.NOT_SENT, '03.14.1969', true],
        [FlowState.SENT, FlowState.RETURNED, '03.14.1969', true],
        [FlowState.SENT, FlowState.SENT, '03.14.1969', true],

        // MU Flow state is not sent - MU can't edit
        [FlowState.NOT_SENT, FlowState.NOT_SENT, null, false],
        [FlowState.NOT_SENT, FlowState.SENT, null, false],
        [FlowState.NOT_SENT, FlowState.RETURNED, null, false],
        [FlowState.RETURNED, FlowState.NOT_SENT, null, false],
        [FlowState.RETURNED, FlowState.SENT, null, false],
        [FlowState.RETURNED, FlowState.RETURNED, null, false],
      ];

      it.each(cases)(
        '%#. should allow editing if MU flow state is sent or if behandling is finished (and MU has saksbehandler role)',
        (mu, rol, finished, expected) => {
          expect(canEditDocument(TemplateIdEnum.KLAGEVEDTAK_V2, createOppgave(mu, rol, finished), user)).toBe(expected);
        },
      );
    });
  });

  describe('ROL', () => {
    const user = { navIdent: 'rol', roller: [Role.KABAL_ROL] } as IUserData;

    describe('ROL answers', () => {
      const cases: Cases = [
        // ROL can edit if ROL flow state is sent
        [FlowState.NOT_SENT, FlowState.SENT, null, true],
        [FlowState.SENT, FlowState.SENT, null, true],
        [FlowState.RETURNED, FlowState.SENT, null, true],

        // ROL can't edit if behandling is finished
        [FlowState.NOT_SENT, FlowState.SENT, '03.14.1969', false],
        [FlowState.SENT, FlowState.SENT, '03.14.1969', false],
        [FlowState.RETURNED, FlowState.SENT, '03.14.1969', false],

        // ROL can't edit if ROL flow state is not SENT
        [FlowState.NOT_SENT, FlowState.NOT_SENT, null, false],
        [FlowState.NOT_SENT, FlowState.RETURNED, null, false],
        [FlowState.SENT, FlowState.NOT_SENT, null, false],
        [FlowState.SENT, FlowState.RETURNED, null, false],
        [FlowState.RETURNED, FlowState.NOT_SENT, null, false],
        [FlowState.RETURNED, FlowState.RETURNED, null, false],

        // Non-saksbehandler can't edit in finished behandling
        [FlowState.NOT_SENT, FlowState.NOT_SENT, '03.14.1969', false],
        [FlowState.NOT_SENT, FlowState.RETURNED, '03.14.1969', false],
        [FlowState.SENT, FlowState.NOT_SENT, '03.14.1969', false],
        [FlowState.SENT, FlowState.RETURNED, '03.14.1969', false],
        [FlowState.RETURNED, FlowState.NOT_SENT, '03.14.1969', false],
        [FlowState.RETURNED, FlowState.RETURNED, '03.14.1969', false],
      ];

      it.each(cases)(
        '%#. should allow editing in non-finished behandling if ROL flow state is sent',
        (mu, rol, finished, expected) => {
          expect(canEditDocument(TemplateIdEnum.ROL_ANSWERS, createOppgave(mu, rol, finished), user)).toBe(expected);
        },
      );
    });

    describe('Other templates', () => {
      it.each(CANT_EDIT)('%#. should never allow editing', (mu, rol, finished, expected) => {
        expect(canEditDocument(TemplateIdEnum.KLAGEVEDTAK_V2, createOppgave(mu, rol, finished), user)).toBe(expected);
      });
    });
  });

  describe('Others', () => {
    const user = { navIdent: 'other saksbehandler', roller: [Role.KABAL_SAKSBEHANDLING] } as IUserData;

    describe('ROL answers', () => {
      it.each(CANT_EDIT)('%#. should never allow editing', (mu, rol, finished, expected) => {
        expect(canEditDocument(TemplateIdEnum.ROL_ANSWERS, createOppgave(mu, rol, finished), user)).toBe(expected);
      });
    });

    const cases: Cases = [
      // All saksbehandlere can edit in finished behandling
      [FlowState.NOT_SENT, FlowState.NOT_SENT, '03.14.1969', true],
      [FlowState.NOT_SENT, FlowState.RETURNED, '03.14.1969', true],
      [FlowState.NOT_SENT, FlowState.SENT, '03.14.1969', true],
      [FlowState.RETURNED, FlowState.NOT_SENT, '03.14.1969', true],
      [FlowState.RETURNED, FlowState.RETURNED, '03.14.1969', true],
      [FlowState.RETURNED, FlowState.SENT, '03.14.1969', true],
      [FlowState.SENT, FlowState.NOT_SENT, '03.14.1969', true],
      [FlowState.SENT, FlowState.RETURNED, '03.14.1969', true],
      [FlowState.SENT, FlowState.SENT, '03.14.1969', true],

      // Not assigned saksbehandler can't edit not-finished behandling
      [FlowState.NOT_SENT, FlowState.NOT_SENT, null, false],
      [FlowState.NOT_SENT, FlowState.RETURNED, null, false],
      [FlowState.NOT_SENT, FlowState.SENT, null, false],
      [FlowState.RETURNED, FlowState.NOT_SENT, null, false],
      [FlowState.RETURNED, FlowState.RETURNED, null, false],
      [FlowState.RETURNED, FlowState.SENT, null, false],
      [FlowState.SENT, FlowState.NOT_SENT, null, false],
      [FlowState.SENT, FlowState.RETURNED, null, false],
      [FlowState.SENT, FlowState.SENT, null, false],
    ];

    describe('ROL questions', () => {
      it.each(cases)('%#. should allow editing in finished behandling', (mu, rol, finished, expected) => {
        expect(canEditDocument(TemplateIdEnum.ROL_QUESTIONS, createOppgave(mu, rol, finished), user)).toBe(expected);
      });
    });

    describe('Other templates', () => {
      it.each(cases)('%#. should allow editing in finished behandling', (mu, rol, finished, expected) => {
        expect(canEditDocument(TemplateIdEnum.KLAGEVEDTAK_V2, createOppgave(mu, rol, finished), user)).toBe(expected);
      });
    });
  });
});
