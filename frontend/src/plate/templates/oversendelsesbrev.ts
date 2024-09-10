import { deepFreeze } from '@app/functions/deep-freeze';
import { Source } from '@app/plate/components/label-content';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createLabelContent,
  createMaltekstseksjon,
  createPageBreak,
  createRegelverk,
  createSignature,
} from '@app/plate/templates/helpers';
import { TextAlign } from '@app/plate/types';
import { DistribusjonsType } from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { TemplateSections } from '../template-sections';

export const OVERSENDELSESBREV_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.OVERSENDELSESBREV,
  type: SaksTypeEnum.ANKE,
  tittel: 'Tilsvarsbrev med oversendelsesbrev',
  richText: [
    createCurrentDate(),
    createHeader(),

    createMaltekstseksjon(TemplateSections.TILSVARSBREV_TITLE),

    {
      type: ELEMENT_PARAGRAPH,
      align: TextAlign.LEFT,
      children: [
        createLabelContent(Source.KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME, 'Den ankende part'),
        createLabelContent(Source.SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME, 'Saken gjelder'),
        createLabelContent(Source.SAKEN_GJELDER_FNR, 'Fødselsnummer'),
        createLabelContent(Source.KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME, 'Den ankende part'),
        createLabelContent(Source.SAKSNUMMER, 'Saksnummer'),
      ],
    },

    createMaltekstseksjon(TemplateSections.TILSVARSRETT),
    createMaltekstseksjon(TemplateSections.GENERELL_INFO),

    createSignature(),

    createPageBreak(),

    createCurrentDate(),

    createMaltekstseksjon(TemplateSections.TITLE),

    {
      type: ELEMENT_PARAGRAPH,
      align: TextAlign.LEFT,
      children: [
        createLabelContent(Source.SAKEN_GJELDER_NAME, 'Den ankende part'),
        createLabelContent(Source.SAKEN_GJELDER_FNR, 'Fødselsnummer'),
        createLabelContent(Source.SAKSNUMMER, 'Saksnummer'),
      ],
    },

    createMaltekstseksjon(TemplateSections.INTRODUCTION),
    createMaltekstseksjon(TemplateSections.ANFOERSLER),
    createMaltekstseksjon(TemplateSections.OPPLYSNINGER),
    createMaltekstseksjon(TemplateSections.VURDERINGEN),

    createSignature(),
    createFooter(),
    createRegelverk(),
  ],
  dokumentTypeId: DistribusjonsType.BREV,
});
