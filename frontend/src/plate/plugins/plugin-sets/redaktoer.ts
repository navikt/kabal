import { HeadingOne, HeadingThree, HeadingTwo } from '@app/plate/components/headings';
import { ListItem, OrderedList, UnorderedList } from '@app/plate/components/lists';
import { PageBreak } from '@app/plate/components/page-break';
import { Paragraph } from '@app/plate/components/paragraph';
import { RedaktørPlaceholder } from '@app/plate/components/placeholder/placeholder';
import { TableCellElement } from '@app/plate/components/plate-ui/table-cell-element';
import { TableElement } from '@app/plate/components/plate-ui/table-element';
import { TableRowElement } from '@app/plate/components/plate-ui/table-row-element';
import { ELEMENT_PAGE_BREAK, ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { createRedaktoerPlaceholderPlugin } from '@app/plate/plugins/placeholder/redaktoer';
import { defaultPlugins } from '@app/plate/plugins/plugin-sets/default';
import { createPlugins } from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from '@udecode/plate-heading';
import { ELEMENT_LI, ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TR } from '@udecode/plate-table';

export const redaktoerPlugins = createPlugins([...defaultPlugins, createRedaktoerPlaceholderPlugin()], {
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
    [ELEMENT_PLACEHOLDER]: RedaktørPlaceholder,
  },
});
