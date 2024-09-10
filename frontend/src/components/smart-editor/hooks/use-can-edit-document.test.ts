import { describe, expect, it } from 'bun:test';
import { canEditDocument } from '@app/components/smart-editor/hooks/use-can-edit-document';
import type { IUserData } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

const createOppgave = (muFlowState: FlowState, rolFlowState: FlowState): IOppgavebehandling =>
  ({
    typeId: SaksTypeEnum.KLAGE,
    saksbehandler: { navIdent: 'saksbehandler' },
    rol: { flowState: rolFlowState, employee: { navIdent: 'rol' } },
    medunderskriver: { flowState: muFlowState, employee: { navIdent: 'mu' } },
  }) as IOppgavebehandling;

const CASES_WITHOUT_EXPECT = [
  [FlowState.NOT_SENT, FlowState.NOT_SENT],
  [FlowState.NOT_SENT, FlowState.SENT],
  [FlowState.NOT_SENT, FlowState.RETURNED],
  [FlowState.SENT, FlowState.NOT_SENT],
  [FlowState.SENT, FlowState.SENT],
  [FlowState.SENT, FlowState.RETURNED],
  [FlowState.RETURNED, FlowState.NOT_SENT],
  [FlowState.RETURNED, FlowState.SENT],
  [FlowState.RETURNED, FlowState.RETURNED],
];

describe('canEditDocument', () => {
  describe('Saksbehandler', () => {
    const user = { navIdent: 'saksbehandler' } as IUserData;

    describe('ROL answers', () => {
      it.each(CASES_WITHOUT_EXPECT)('%#. should never allow editing', (mu, rol) => {
        expect(canEditDocument(TemplateIdEnum.ROL_ANSWERS, createOppgave(mu, rol), user)).toBe(false);
      });
    });

    describe('ROL questions', () => {
      const cases = [
        { mu: FlowState.NOT_SENT, rol: FlowState.NOT_SENT, expected: true },
        { mu: FlowState.NOT_SENT, rol: FlowState.SENT, expected: false },
        { mu: FlowState.NOT_SENT, rol: FlowState.RETURNED, expected: true },
        { mu: FlowState.SENT, rol: FlowState.NOT_SENT, expected: true },
        { mu: FlowState.SENT, rol: FlowState.SENT, expected: false },
        { mu: FlowState.SENT, rol: FlowState.RETURNED, expected: true },
        { mu: FlowState.RETURNED, rol: FlowState.NOT_SENT, expected: true },
        { mu: FlowState.RETURNED, rol: FlowState.SENT, expected: false },
        { mu: FlowState.RETURNED, rol: FlowState.RETURNED, expected: true },
      ];

      it.each(cases)('%#. should not allow editing if ROL flow state is sent', ({ mu, rol, expected }) => {
        expect(canEditDocument(TemplateIdEnum.ROL_QUESTIONS, createOppgave(mu, rol), user)).toBe(expected);
      });
    });

    describe('Other templates', () => {
      const cases = [
        { mu: FlowState.NOT_SENT, rol: FlowState.NOT_SENT, expected: true },
        { mu: FlowState.NOT_SENT, rol: FlowState.SENT, expected: true },
        { mu: FlowState.NOT_SENT, rol: FlowState.RETURNED, expected: true },
        { mu: FlowState.SENT, rol: FlowState.NOT_SENT, expected: false },
        { mu: FlowState.SENT, rol: FlowState.SENT, expected: false },
        { mu: FlowState.SENT, rol: FlowState.RETURNED, expected: false },
        { mu: FlowState.RETURNED, rol: FlowState.NOT_SENT, expected: true },
        { mu: FlowState.RETURNED, rol: FlowState.SENT, expected: true },
        { mu: FlowState.RETURNED, rol: FlowState.RETURNED, expected: true },
      ];

      it.each(cases)('%#. should not allow editing if MU flow state is sent', ({ mu, rol, expected }) => {
        expect(canEditDocument(TemplateIdEnum.KLAGEVEDTAK_V2, createOppgave(mu, rol), user)).toBe(expected);
      });
    });
  });

  describe('Medunderskriver', () => {
    const user = { navIdent: 'mu' } as IUserData;

    describe('ROL answers', () => {
      it.each(CASES_WITHOUT_EXPECT)('%#. should never allow editing', (mu, rol) => {
        expect(canEditDocument(TemplateIdEnum.ROL_ANSWERS, createOppgave(mu, rol), user)).toBe(false);
      });
    });

    describe('Other templates', () => {
      const cases = [
        { mu: FlowState.NOT_SENT, rol: FlowState.NOT_SENT, expected: false },
        { mu: FlowState.NOT_SENT, rol: FlowState.SENT, expected: false },
        { mu: FlowState.NOT_SENT, rol: FlowState.RETURNED, expected: false },
        { mu: FlowState.SENT, rol: FlowState.NOT_SENT, expected: true },
        { mu: FlowState.SENT, rol: FlowState.SENT, expected: true },
        { mu: FlowState.SENT, rol: FlowState.RETURNED, expected: true },
        { mu: FlowState.RETURNED, rol: FlowState.NOT_SENT, expected: false },
        { mu: FlowState.RETURNED, rol: FlowState.SENT, expected: false },
        { mu: FlowState.RETURNED, rol: FlowState.RETURNED, expected: false },
      ];

      it.each(cases)('%#. should allow editing if MU flow state is sent', ({ mu, rol, expected }) => {
        expect(canEditDocument(TemplateIdEnum.KLAGEVEDTAK_V2, createOppgave(mu, rol), user)).toBe(expected);
      });
    });
  });

  describe('ROL', () => {
    const user = { navIdent: 'rol' } as IUserData;

    describe('ROL answers', () => {
      const cases = [
        { mu: FlowState.NOT_SENT, rol: FlowState.NOT_SENT, expected: false },
        { mu: FlowState.NOT_SENT, rol: FlowState.SENT, expected: true },
        { mu: FlowState.NOT_SENT, rol: FlowState.RETURNED, expected: false },
        { mu: FlowState.SENT, rol: FlowState.NOT_SENT, expected: false },
        { mu: FlowState.SENT, rol: FlowState.SENT, expected: true },
        { mu: FlowState.SENT, rol: FlowState.RETURNED, expected: false },
        { mu: FlowState.RETURNED, rol: FlowState.NOT_SENT, expected: false },
        { mu: FlowState.RETURNED, rol: FlowState.SENT, expected: true },
        { mu: FlowState.RETURNED, rol: FlowState.RETURNED, expected: false },
      ];

      it.each(cases)('%#. should allow editing if ROL flow state is sent', ({ mu, rol, expected }) => {
        expect(canEditDocument(TemplateIdEnum.ROL_ANSWERS, createOppgave(mu, rol), user)).toBe(expected);
      });
    });

    describe('Other templates', () => {
      it.each(CASES_WITHOUT_EXPECT)('%#. should never allow editing', (mu, rol) => {
        expect(canEditDocument(TemplateIdEnum.KLAGEVEDTAK_V2, createOppgave(mu, rol), user)).toBe(false);
      });
    });
  });
});
