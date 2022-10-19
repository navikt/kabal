import { Descendant } from 'slate';
import { RichText_V1 } from '../../../types/rich-text/v1';
import { RichText_V2 } from '../../../types/rich-text/v2';
import { IText, TemplateSections } from '../../../types/texts/texts';
import { UndeletableContentEnum } from '../types/editor-enums';
import { MaltekstElementType } from '../types/editor-types';

interface MaltekstV1 {
  type: UndeletableContentEnum.MALTEKST;
  section: TemplateSections;
  content: IText[];
}

export const migrateFromV1ToV2 = (response: RichText_V1): RichText_V2 => ({
  ...response,
  version: 2,
  content: response.content.map((node) => {
    if (isOldMaltekst(node)) {
      const maltekst: MaltekstElementType = {
        ...node,
        children: node.content.flatMap((c) => c.content),
      };

      return maltekst;
    }

    return node;
  }),
});

const isOldMaltekst = (node: Descendant | MaltekstV1): node is MaltekstV1 =>
  node.type === UndeletableContentEnum.MALTEKST && 'content' in node;
