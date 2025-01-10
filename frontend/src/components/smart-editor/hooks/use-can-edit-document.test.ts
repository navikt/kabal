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
    saksbehandler: { navIdent: 'creator' },
    typeId: SaksTypeEnum.KLAGE,
    rol: { flowState: rolFlowState, employee: { navIdent: 'rol' } },
    medunderskriver: { flowState: muFlowState, employee: { navIdent: 'mu' } },
    avsluttetAvSaksbehandlerDate,
  }) as IOppgavebehandling;

type Cases = [FlowState, FlowState, string, string | null, boolean][];

const CANT_EDIT: Cases = [
  [FlowState.NOT_SENT, FlowState.NOT_SENT, 'creator', null, false],
  [FlowState.NOT_SENT, FlowState.SENT, 'creator', null, false],
  [FlowState.NOT_SENT, FlowState.RETURNED, 'creator', null, false],
  [FlowState.NOT_SENT, FlowState.NOT_SENT, 'not creator', null, false],
  [FlowState.NOT_SENT, FlowState.SENT, 'not creator', null, false],
  [FlowState.NOT_SENT, FlowState.RETURNED, 'not creator', null, false],
  [FlowState.SENT, FlowState.NOT_SENT, 'creator', null, false],
  [FlowState.SENT, FlowState.SENT, 'creator', null, false],
  [FlowState.SENT, FlowState.RETURNED, 'creator', null, false],
  [FlowState.SENT, FlowState.NOT_SENT, 'not creator', null, false],
  [FlowState.SENT, FlowState.SENT, 'not creator', null, false],
  [FlowState.SENT, FlowState.RETURNED, 'not creator', null, false],
  [FlowState.RETURNED, FlowState.NOT_SENT, 'creator', null, false],
  [FlowState.RETURNED, FlowState.SENT, 'creator', null, false],
  [FlowState.RETURNED, FlowState.RETURNED, 'creator', null, false],
  [FlowState.RETURNED, FlowState.NOT_SENT, 'not creator', null, false],
  [FlowState.RETURNED, FlowState.SENT, 'not creator', null, false],
  [FlowState.RETURNED, FlowState.RETURNED, 'not creator', null, false],
  [FlowState.NOT_SENT, FlowState.NOT_SENT, 'creator', '03.14.1969', false],
  [FlowState.NOT_SENT, FlowState.SENT, 'creator', '03.14.1969', false],
  [FlowState.NOT_SENT, FlowState.RETURNED, 'creator', '03.14.1969', false],
  [FlowState.NOT_SENT, FlowState.NOT_SENT, 'not creator', '03.14.1969', false],
  [FlowState.NOT_SENT, FlowState.SENT, 'not creator', '03.14.1969', false],
  [FlowState.NOT_SENT, FlowState.RETURNED, 'not creator', '03.14.1969', false],
  [FlowState.SENT, FlowState.NOT_SENT, 'creator', '03.14.1969', false],
  [FlowState.SENT, FlowState.SENT, 'creator', '03.14.1969', false],
  [FlowState.SENT, FlowState.RETURNED, 'creator', '03.14.1969', false],
  [FlowState.SENT, FlowState.NOT_SENT, 'not creator', '03.14.1969', false],
  [FlowState.SENT, FlowState.SENT, 'not creator', '03.14.1969', false],
  [FlowState.SENT, FlowState.RETURNED, 'not creator', '03.14.1969', false],
  [FlowState.RETURNED, FlowState.NOT_SENT, 'creator', '03.14.1969', false],
  [FlowState.RETURNED, FlowState.SENT, 'creator', '03.14.1969', false],
  [FlowState.RETURNED, FlowState.RETURNED, 'creator', '03.14.1969', false],
  [FlowState.RETURNED, FlowState.NOT_SENT, 'not creator', '03.14.1969', false],
  [FlowState.RETURNED, FlowState.SENT, 'not creator', '03.14.1969', false],
  [FlowState.RETURNED, FlowState.RETURNED, 'not creator', '03.14.1969', false],
];

describe('canEditDocument', () => {
  describe('Saksbehandler', () => {
    const user = { navIdent: 'creator', roller: [Role.KABAL_SAKSBEHANDLING] } as IUserData;

    describe('ROL answers', () => {
      it.each(CANT_EDIT)('%#. should never allow editing', (mu, rol, creator, finished, expected) => {
        expect(canEditDocument(TemplateIdEnum.ROL_ANSWERS, createOppgave(mu, rol, finished), user, creator)).toBe(
          expected,
        );
      });
    });

    describe('ROL questions', () => {
      const cases: Cases = [
        // Assigned saksbehandler can edit in not-finished behandling when ROL flow state is NOT_SENT/RETURNED
        [FlowState.NOT_SENT, FlowState.NOT_SENT, 'creator', null, true],
        [FlowState.SENT, FlowState.NOT_SENT, 'creator', null, true],
        [FlowState.RETURNED, FlowState.NOT_SENT, 'creator', null, true],
        [FlowState.NOT_SENT, FlowState.RETURNED, 'creator', null, true],
        [FlowState.SENT, FlowState.RETURNED, 'creator', null, true],
        [FlowState.RETURNED, FlowState.RETURNED, 'creator', null, true],

        // User is assigned saksbehandler in open behandling, so it doesn't matter if there was another creator
        [FlowState.NOT_SENT, FlowState.NOT_SENT, 'not creator', null, true],
        [FlowState.NOT_SENT, FlowState.RETURNED, 'not creator', null, true],
        [FlowState.SENT, FlowState.NOT_SENT, 'not creator', null, true],
        [FlowState.SENT, FlowState.RETURNED, 'not creator', null, true],
        [FlowState.RETURNED, FlowState.NOT_SENT, 'not creator', null, true],
        [FlowState.RETURNED, FlowState.RETURNED, 'not creator', null, true],

        // Creator can edit in finished behandling when ROL flow state is NOT_SENT/RETURNED
        // Flow state in finished behandling doesn't really make sense. These cases are just for completeness' sake
        [FlowState.NOT_SENT, FlowState.NOT_SENT, 'creator', '03.14.1969', true],
        [FlowState.SENT, FlowState.NOT_SENT, 'creator', '03.14.1969', true],
        [FlowState.RETURNED, FlowState.NOT_SENT, 'creator', '03.14.1969', true],
        [FlowState.NOT_SENT, FlowState.RETURNED, 'creator', '03.14.1969', true],
        [FlowState.SENT, FlowState.RETURNED, 'creator', '03.14.1969', true],
        [FlowState.RETURNED, FlowState.RETURNED, 'creator', '03.14.1969', true],

        // Only creator can edit in finished behandling
        // Flow state in finished behandling doesn't really make sense. These cases are just for completeness' sake
        [FlowState.NOT_SENT, FlowState.NOT_SENT, 'not creator', '03.14.1969', false],
        [FlowState.SENT, FlowState.NOT_SENT, 'not creator', '03.14.1969', false],
        [FlowState.RETURNED, FlowState.NOT_SENT, 'not creator', '03.14.1969', false],
        [FlowState.NOT_SENT, FlowState.RETURNED, 'not creator', '03.14.1969', false],
        [FlowState.SENT, FlowState.RETURNED, 'not creator', '03.14.1969', false],
        [FlowState.RETURNED, FlowState.RETURNED, 'not creator', '03.14.1969', false],

        // Flow state is sent - only ROL can edit
        [FlowState.NOT_SENT, FlowState.SENT, 'creator', null, false],
        [FlowState.SENT, FlowState.SENT, 'creator', null, false],
        [FlowState.SENT, FlowState.SENT, 'not creator', null, false],
        [FlowState.NOT_SENT, FlowState.SENT, 'not creator', null, false],
        [FlowState.RETURNED, FlowState.SENT, 'creator', null, false],
        [FlowState.NOT_SENT, FlowState.SENT, 'creator', '03.14.1969', false],
        [FlowState.RETURNED, FlowState.SENT, 'not creator', null, false],
        [FlowState.NOT_SENT, FlowState.SENT, 'not creator', '03.14.1969', false],
        [FlowState.SENT, FlowState.SENT, 'creator', '03.14.1969', false],
        [FlowState.SENT, FlowState.SENT, 'not creator', '03.14.1969', false],
        [FlowState.RETURNED, FlowState.SENT, 'not creator', '03.14.1969', false],
        [FlowState.RETURNED, FlowState.SENT, 'creator', '03.14.1969', false],
      ];

      it.each(cases)(
        '%#. should not allow editing if ROL flow state is sent or if user is not the creator of the document',
        (mu, rol, creator, finished, expected) => {
          expect(canEditDocument(TemplateIdEnum.ROL_QUESTIONS, createOppgave(mu, rol, finished), user, creator)).toBe(
            expected,
          );
        },
      );
    });

    describe('Other templates', () => {
      const cases: Cases = [
        // Assigned saksbehandler can edit in not-finished behandling when MU flow state is NOT_SENT/RETURNED
        [FlowState.NOT_SENT, FlowState.NOT_SENT, 'creator', null, true],
        [FlowState.NOT_SENT, FlowState.SENT, 'creator', null, true],
        [FlowState.NOT_SENT, FlowState.RETURNED, 'creator', null, true],
        [FlowState.RETURNED, FlowState.NOT_SENT, 'creator', null, true],
        [FlowState.RETURNED, FlowState.SENT, 'creator', null, true],
        [FlowState.RETURNED, FlowState.RETURNED, 'creator', null, true],

        // Creator can edit in finished behandling when MU flow state is NOT_SENT/RETURNED
        // Flow state in finished behandling doesn't really make sense. These cases are just for completeness' sake
        [FlowState.NOT_SENT, FlowState.NOT_SENT, 'creator', '03.14.1969', true],
        [FlowState.NOT_SENT, FlowState.SENT, 'creator', '03.14.1969', true],
        [FlowState.NOT_SENT, FlowState.RETURNED, 'creator', '03.14.1969', true],
        [FlowState.RETURNED, FlowState.NOT_SENT, 'creator', '03.14.1969', true],
        [FlowState.RETURNED, FlowState.SENT, 'creator', '03.14.1969', true],
        [FlowState.RETURNED, FlowState.RETURNED, 'creator', '03.14.1969', true],

        // User is assigned saksbehandler in open behandling, so it doesn't matter if there was another creator
        [FlowState.RETURNED, FlowState.NOT_SENT, 'not creator', null, true],
        [FlowState.RETURNED, FlowState.SENT, 'not creator', null, true],
        [FlowState.RETURNED, FlowState.RETURNED, 'not creator', null, true],
        [FlowState.NOT_SENT, FlowState.NOT_SENT, 'not creator', null, true],
        [FlowState.NOT_SENT, FlowState.SENT, 'not creator', null, true],
        [FlowState.NOT_SENT, FlowState.RETURNED, 'not creator', null, true],

        // Only creator can edit in finished behandling
        // Flow state in finished behandling doesn't really make sense. These cases are just for completeness' sake
        [FlowState.NOT_SENT, FlowState.NOT_SENT, 'not creator', '03.14.1969', false],
        [FlowState.NOT_SENT, FlowState.SENT, 'not creator', '03.14.1969', false],
        [FlowState.NOT_SENT, FlowState.RETURNED, 'not creator', '03.14.1969', false],
        [FlowState.RETURNED, FlowState.NOT_SENT, 'not creator', '03.14.1969', false],
        [FlowState.RETURNED, FlowState.SENT, 'not creator', '03.14.1969', false],
        [FlowState.RETURNED, FlowState.RETURNED, 'not creator', '03.14.1969', false],

        // Flow state is sent - only MU can edit
        [FlowState.SENT, FlowState.NOT_SENT, 'creator', null, false],
        [FlowState.SENT, FlowState.SENT, 'creator', null, false],
        [FlowState.SENT, FlowState.RETURNED, 'creator', null, false],
        [FlowState.SENT, FlowState.NOT_SENT, 'not creator', null, false],
        [FlowState.SENT, FlowState.SENT, 'not creator', null, false],
        [FlowState.SENT, FlowState.RETURNED, 'not creator', null, false],
        [FlowState.SENT, FlowState.NOT_SENT, 'creator', '03.14.1969', false],
        [FlowState.SENT, FlowState.SENT, 'creator', '03.14.1969', false],
        [FlowState.SENT, FlowState.RETURNED, 'creator', '03.14.1969', false],
        [FlowState.SENT, FlowState.NOT_SENT, 'not creator', '03.14.1969', false],
        [FlowState.SENT, FlowState.SENT, 'not creator', '03.14.1969', false],
        [FlowState.SENT, FlowState.RETURNED, 'not creator', '03.14.1969', false],
      ];

      it.each(cases)(
        '%#. should not allow editing if MU flow state is sent, or if user is not the creator of the document',
        (mu, rol, creator, finished, expected) => {
          expect(canEditDocument(TemplateIdEnum.KLAGEVEDTAK_V2, createOppgave(mu, rol, finished), user, creator)).toBe(
            expected,
          );
        },
      );
    });
  });

  describe('Medunderskriver', () => {
    const user = { navIdent: 'mu', roller: [Role.KABAL_SAKSBEHANDLING] } as IUserData;

    describe('ROL answers', () => {
      it.each(CANT_EDIT)('%#. should never allow editing', (mu, rol, creator, finished, expected) => {
        expect(canEditDocument(TemplateIdEnum.ROL_ANSWERS, createOppgave(mu, rol, finished), user, creator)).toBe(
          expected,
        );
      });
    });

    describe('Other templates', () => {
      const cases: Cases = [
        // User is MU and MU flow state is sent - can edit
        [FlowState.SENT, FlowState.NOT_SENT, 'creator', null, true],
        [FlowState.SENT, FlowState.SENT, 'creator', null, true],
        [FlowState.SENT, FlowState.RETURNED, 'creator', null, true],
        [FlowState.SENT, FlowState.NOT_SENT, 'creator', '03.14.1969', true],
        [FlowState.SENT, FlowState.SENT, 'creator', '03.14.1969', true],
        [FlowState.SENT, FlowState.RETURNED, 'creator', '03.14.1969', true],

        // Behandling is finished, and MU is not creator - can't edit
        [FlowState.NOT_SENT, FlowState.NOT_SENT, 'creator', '03.14.1969', false],
        [FlowState.NOT_SENT, FlowState.SENT, 'creator', '03.14.1969', false],
        [FlowState.NOT_SENT, FlowState.RETURNED, 'creator', '03.14.1969', false],
        [FlowState.RETURNED, FlowState.NOT_SENT, 'creator', '03.14.1969', false],
        [FlowState.RETURNED, FlowState.SENT, 'creator', '03.14.1969', false],
        [FlowState.RETURNED, FlowState.RETURNED, 'creator', '03.14.1969', false],

        // MU Flow state is not sent - MU can't edit
        [FlowState.NOT_SENT, FlowState.NOT_SENT, 'creator', null, false],
        [FlowState.NOT_SENT, FlowState.SENT, 'creator', null, false],
        [FlowState.NOT_SENT, FlowState.RETURNED, 'creator', null, false],
        [FlowState.RETURNED, FlowState.NOT_SENT, 'creator', null, false],
        [FlowState.RETURNED, FlowState.SENT, 'creator', null, false],
        [FlowState.RETURNED, FlowState.RETURNED, 'creator', null, false],
      ];

      it.each(cases)('%#. should allow editing if MU flow state is sent', (mu, rol, creator, finished, expected) => {
        expect(canEditDocument(TemplateIdEnum.KLAGEVEDTAK_V2, createOppgave(mu, rol, finished), user, creator)).toBe(
          expected,
        );
      });
    });
  });

  describe('ROL', () => {
    const user = { navIdent: 'rol' } as IUserData;

    describe('ROL answers', () => {
      const cases: Cases = [
        // ROL can edit if ROL flow state is sent
        [FlowState.NOT_SENT, FlowState.SENT, 'rol', null, true],
        [FlowState.SENT, FlowState.SENT, 'rol', null, true],
        [FlowState.RETURNED, FlowState.SENT, 'rol', null, true],

        // Flow state in finished behandling doesn't really make sense. These cases are just for completeness' sake
        [FlowState.NOT_SENT, FlowState.SENT, 'rol', '03.14.1969', true],
        [FlowState.SENT, FlowState.SENT, 'rol', '03.14.1969', true],
        [FlowState.RETURNED, FlowState.SENT, 'rol', '03.14.1969', true],

        // ROL can't edit if ROL flow state is not SENT
        [FlowState.NOT_SENT, FlowState.NOT_SENT, 'rol', null, false],
        [FlowState.NOT_SENT, FlowState.RETURNED, 'rol', null, false],
        [FlowState.SENT, FlowState.NOT_SENT, 'rol', null, false],
        [FlowState.SENT, FlowState.RETURNED, 'rol', null, false],
        [FlowState.RETURNED, FlowState.NOT_SENT, 'rol', null, false],
        [FlowState.RETURNED, FlowState.RETURNED, 'rol', null, false],

        // Flow state in finished behandling doesn't really make sense. These cases are just for completeness' sake
        [FlowState.NOT_SENT, FlowState.NOT_SENT, 'rol', '03.14.1969', false],
        [FlowState.NOT_SENT, FlowState.RETURNED, 'rol', '03.14.1969', false],
        [FlowState.SENT, FlowState.NOT_SENT, 'rol', '03.14.1969', false],
        [FlowState.SENT, FlowState.RETURNED, 'rol', '03.14.1969', false],
        [FlowState.RETURNED, FlowState.NOT_SENT, 'rol', '03.14.1969', false],
        [FlowState.RETURNED, FlowState.RETURNED, 'rol', '03.14.1969', false],
      ];

      it.each(cases)('%#. should allow editing if ROL flow state is sent', (mu, rol, creator, finished, expected) => {
        expect(canEditDocument(TemplateIdEnum.ROL_ANSWERS, createOppgave(mu, rol, finished), user, creator)).toBe(
          expected,
        );
      });
    });

    describe('Other templates', () => {
      it.each(CANT_EDIT)('%#. should never allow editing', (mu, rol, creator, finished, expected) => {
        expect(canEditDocument(TemplateIdEnum.KLAGEVEDTAK_V2, createOppgave(mu, rol, finished), user, creator)).toBe(
          expected,
        );
      });
    });
  });

  describe('Others', () => {
    const user = { navIdent: 'other saksbehandler', roller: [Role.KABAL_SAKSBEHANDLING] } as IUserData;

    describe('ROL answers', () => {
      it.each(CANT_EDIT)('%#. should never allow editing', (mu, rol, creator, finished, expected) => {
        expect(canEditDocument(TemplateIdEnum.ROL_ANSWERS, createOppgave(mu, rol, finished), user, creator)).toBe(
          expected,
        );
      });
    });

    describe('ROL questions', () => {
      it.each(CANT_EDIT)(
        '%#. should not allow editing if ROL flow state is sent or if user is not the creator of the document',
        (mu, rol, creator, finished, expected) => {
          expect(canEditDocument(TemplateIdEnum.ROL_QUESTIONS, createOppgave(mu, rol, finished), user, creator)).toBe(
            expected,
          );
        },
      );
    });

    describe('Other templates', () => {
      it.each(CANT_EDIT)(
        '%#. should not allow editing if MU flow state is sent, or if user is not the creator of the document',
        (mu, rol, creator, finished, expected) => {
          expect(canEditDocument(TemplateIdEnum.KLAGEVEDTAK_V2, createOppgave(mu, rol, finished), user, creator)).toBe(
            expected,
          );
        },
      );
    });
  });
});
