import { describe, expect, test } from 'bun:test';
import {
  hasForsterketRett,
  hasLovhenvisning,
  hasPaaanketVedtaksdato,
} from '@/components/documents/new-documents/has-tr-fields';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

interface TestCase {
  templateId: TemplateIdEnum | undefined;
  paaanketVedtaksdato: boolean;
  lovhenvisning: boolean;
  forsterketRett: boolean;
}

const CASES: TestCase[] = [
  {
    templateId: TemplateIdEnum.EKSPEDISJONSBREV_TIL_TRYGDERETTEN,
    paaanketVedtaksdato: true,
    lovhenvisning: true,
    forsterketRett: true,
  },
  {
    templateId: TemplateIdEnum.GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR,
    paaanketVedtaksdato: false,
    lovhenvisning: true,
    forsterketRett: true,
  },
  {
    templateId: TemplateIdEnum.ETTERSENDING_TIL_TRYGDERETTEN,
    paaanketVedtaksdato: false,
    lovhenvisning: false,
    forsterketRett: true,
  },
  {
    templateId: TemplateIdEnum.GJENOPPTAKSBEGJÆRING_ETTERSENDING_TIL_TR,
    paaanketVedtaksdato: false,
    lovhenvisning: false,
    forsterketRett: true,
  },
  {
    templateId: TemplateIdEnum.GENERELT_BREV,
    paaanketVedtaksdato: false,
    lovhenvisning: false,
    forsterketRett: false,
  },
  {
    templateId: undefined,
    paaanketVedtaksdato: false,
    lovhenvisning: false,
    forsterketRett: false,
  },
];

describe('TR field predicates', () => {
  test.each(CASES)('$templateId', ({ templateId, paaanketVedtaksdato, lovhenvisning, forsterketRett }) => {
    expect.assertions(3);

    expect(hasPaaanketVedtaksdato(templateId)).toBe(paaanketVedtaksdato);
    expect(hasLovhenvisning(templateId)).toBe(lovhenvisning);
    expect(hasForsterketRett(templateId)).toBe(forsterketRett);
  });
});
