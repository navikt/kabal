import { RichText_V1 } from '@app/types/rich-text/v1';
import { RichText_Content_V2, RichText_V2 } from '@app/types/rich-text/v2';
import { IRichText, TemplateSections } from '@app/types/texts/texts';
import { UndeletableContentEnum } from '../types/editor-enums';
import { MaltekstElementType } from '../types/editor-types';

interface MaltekstV1 {
  type: UndeletableContentEnum.MALTEKST;
  section: TemplateSections;
  content: IRichText[];
}

export const migrateFromV1ToV2 = (response: RichText_V1): RichText_V2 => ({
  ...response,
  version: 2,
  content: response.content.map((node) => {
    if (isOldMaltekst(node)) {
      const children = node.content.flatMap((c) => c.content);

      const maltekst: MaltekstElementType = {
        ...node,
        children: children.length !== 0 ? children : [{ text: '' }],
      };

      return maltekst;
    }

    return node;
  }),
});

const isOldMaltekst = (node: RichText_Content_V2 | MaltekstV1): node is MaltekstV1 =>
  node.type === UndeletableContentEnum.MALTEKST && Object.hasOwn(node, 'content');
