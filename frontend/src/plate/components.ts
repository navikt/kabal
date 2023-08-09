import { PlatePluginComponent } from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from '@udecode/plate-heading';
import { ELEMENT_LI, ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TR } from '@udecode/plate-table';
import { CurrentDate } from '@app/plate/components/current-date';
import { HeaderFooter } from '@app/plate/components/header-footer';
import { HeadingOne, HeadingThree, HeadingTwo } from '@app/plate/components/headings';
import { LabelContent } from '@app/plate/components/label-content';
import { ListItem, OrderedList, UnorderedList } from '@app/plate/components/lists';
import { Maltekst } from '@app/plate/components/maltekst/maltekst';
import { PageBreak } from '@app/plate/components/page-break';
import { Paragraph } from '@app/plate/components/paragraph';
import { Placeholder } from '@app/plate/components/placeholder';
import { TableCellElement } from '@app/plate/components/plate-ui/table-cell-element';
import { TableElement } from '@app/plate/components/plate-ui/table-element';
import { TableRowElement } from '@app/plate/components/plate-ui/table-row-element';
import { RedigerbarMaltekst } from '@app/plate/components/redigerbar-maltekst';
import { Regelverk, RegelverkContainer } from '@app/plate/components/regelverk';
import { Signature } from '@app/plate/components/signature/signature';
import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_FOOTER,
  ELEMENT_HEADER,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_MALTEKST,
  ELEMENT_PAGE_BREAK,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
  ELEMENT_SIGNATURE,
} from '@app/plate/plugins/element-types';

export const components: Record<string, PlatePluginComponent> = {
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
  [ELEMENT_REDIGERBAR_MALTEKST]: RedigerbarMaltekst,
  [ELEMENT_MALTEKST]: Maltekst,
  [ELEMENT_CURRENT_DATE]: CurrentDate,
  [ELEMENT_FOOTER]: HeaderFooter,
  [ELEMENT_HEADER]: HeaderFooter,
  [ELEMENT_LABEL_CONTENT]: LabelContent,
  [ELEMENT_PLACEHOLDER]: Placeholder,
  [ELEMENT_REGELVERK]: Regelverk,
  [ELEMENT_REGELVERK_CONTAINER]: RegelverkContainer,
  [ELEMENT_SIGNATURE]: Signature,
};
