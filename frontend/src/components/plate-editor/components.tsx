import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  ELEMENT_TD,
  ELEMENT_TH,
  ELEMENT_TR,
  ELEMENT_UL,
  PlatePluginComponent,
  PlateTableCellElement,
  PlateTableElement,
  StyledElement,
  createPlateUI,
  withProps,
} from '@udecode/plate';
import React from 'react';
import { CurrentDate } from '@app/components/plate-editor/custom-elements/current-date';
import { PageBreak } from '@app/components/plate-editor/custom-elements/page-break';
import { Regelverk } from '@app/components/plate-editor/custom-elements/regelverk';
import { Table } from '@app/components/plate-editor/custom-elements/table';
import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_MALTEKST,
  ELEMENT_PAGE_BREAK,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
} from '@app/components/plate-editor/plugins/element-types';
import { HeadingOne, HeadingThree, HeadingTwo } from './custom-elements/headings';
import { BulletListStyle, ListItemStyle, NumberedListStyle } from './custom-elements/lists';
import { Maltekst } from './custom-elements/maltekst';
import { Paragraph } from './custom-elements/paragraph';
import { Placeholder } from './custom-elements/placeholder';
import { RedigerbarMaltekst } from './custom-elements/redigerbar-maltekst';

// export const components: Record<string, PlatePluginComponent> = {
export const components = createPlateUI({
  [ELEMENT_PARAGRAPH]: ({ attributes, children, element }) => (
    <Paragraph {...attributes} {...element}>
      {children}
    </Paragraph>
  ),
  [ELEMENT_LIC]: ({ attributes, children }) => <div {...attributes}>{children}</div>,
  [ELEMENT_UL]: ({ attributes, children }) => <BulletListStyle {...attributes}>{children}</BulletListStyle>,
  [ELEMENT_OL]: ({ attributes, children }) => <NumberedListStyle {...attributes}>{children}</NumberedListStyle>,
  [ELEMENT_LI]: ({ attributes, children }) => <ListItemStyle {...attributes}>{children}</ListItemStyle>,
  // [ELEMENT_TABLE]: withProps(StyledElement),
  // [ELEMENT_TR]: ({ attributes, children }) => <tr {...attributes}>{children}</tr>,
  // [ELEMENT_TD]: withProps(PlateTableCellElement, {}),
  // [ELEMENT_TH]: ({ attributes, children }) => <th {...attributes}>{children}</th>,

  [ELEMENT_H1]: ({ attributes, children }) => <HeadingOne {...attributes}>{children}</HeadingOne>,
  [ELEMENT_H2]: ({ attributes, children }) => <HeadingTwo {...attributes}>{children}</HeadingTwo>,
  [ELEMENT_H3]: ({ attributes, children }) => <HeadingThree {...attributes}>{children}</HeadingThree>,
  [ELEMENT_MALTEKST]: Maltekst,
  [ELEMENT_REDIGERBAR_MALTEKST]: RedigerbarMaltekst,
  [ELEMENT_PLACEHOLDER]: Placeholder,
  [ELEMENT_PAGE_BREAK]: PageBreak,
  [ELEMENT_CURRENT_DATE]: CurrentDate,
  [ELEMENT_REGELVERK]: Regelverk,
});
