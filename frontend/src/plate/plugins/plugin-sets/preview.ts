import { createPlugins } from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from '@udecode/plate-heading';
import { ELEMENT_LI, ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TR } from '@udecode/plate-table';
import { EmptyVoid } from '@app/plate/components/empty-void';
import { HeadingOne, HeadingThree, HeadingTwo } from '@app/plate/components/headings';
import { LabelContent } from '@app/plate/components/label-content';
import { ListItem, OrderedList, UnorderedList } from '@app/plate/components/lists';
import { Maltekst } from '@app/plate/components/maltekst/maltekst';
import { PageBreak } from '@app/plate/components/page-break';
import { Paragraph } from '@app/plate/components/paragraph';
import { Placeholder } from '@app/plate/components/placeholder/placeholder';
import { TableCellElement } from '@app/plate/components/plate-ui/table-cell-element';
import { TableElement } from '@app/plate/components/plate-ui/table-element';
import { TableRowElement } from '@app/plate/components/plate-ui/table-row-element';
import { RedigerbarMaltekst } from '@app/plate/components/redigerbar-maltekst';
import {
  ELEMENT_EMPTY_VOID,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_MALTEKST,
  ELEMENT_PAGE_BREAK,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
} from '@app/plate/plugins/element-types';
import { createEmptyVoidPlugin } from '@app/plate/plugins/empty-void';
import { createLabelContentPlugin } from '@app/plate/plugins/label-content';
import { createMaltekstPlugin } from '@app/plate/plugins/maltekst';
import { createSaksbehandlerPlaceholderPlugin } from '@app/plate/plugins/placeholder/saksbehandler';
import { defaultPlugins } from '@app/plate/plugins/plugin-sets/default';
import { createRedigerbarMaltekstPlugin } from '@app/plate/plugins/redigerbar-maltekst';

export const previewPlugins = createPlugins(
  [
    ...defaultPlugins,
    createSaksbehandlerPlaceholderPlugin(),
    createMaltekstPlugin(),
    createRedigerbarMaltekstPlugin(),
    createLabelContentPlugin(),
    createEmptyVoidPlugin(),
  ],
  {
    components: {
      [ELEMENT_PARAGRAPH]: Paragraph,
      [ELEMENT_PAGE_BREAK]: PageBreak,

      // Headings
      [ELEMENT_H1]: HeadingOne,
      [ELEMENT_H2]: HeadingTwo,
      [ELEMENT_H3]: HeadingThree,

      // Lists
      [ELEMENT_UL]: UnorderedList,
      [ELEMENT_OL]: OrderedList,
      [ELEMENT_LI]: ListItem,

      // Table
      [ELEMENT_TABLE]: TableElement,
      [ELEMENT_TD]: TableCellElement,
      [ELEMENT_TR]: TableRowElement,

      // Smart blocks
      [ELEMENT_PLACEHOLDER]: Placeholder,
      [ELEMENT_MALTEKST]: Maltekst,
      [ELEMENT_REDIGERBAR_MALTEKST]: RedigerbarMaltekst,
      [ELEMENT_LABEL_CONTENT]: LabelContent,
      [ELEMENT_EMPTY_VOID]: EmptyVoid,
    },
  },
);
