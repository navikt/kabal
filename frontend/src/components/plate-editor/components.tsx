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
} from '@udecode/plate';
import React from 'react';
import { CurrentDate } from '@app/components/plate-editor/custom-elements/current-date';
import { PageBreak } from '@app/components/plate-editor/custom-elements/page-break';
import { Regelverk } from '@app/components/plate-editor/custom-elements/regelverk';
import { ELEMENT_CURRENT_DATE } from '@app/components/plate-editor/plugins/current-date';
import { ELEMENT_PAGE_BREAK } from '@app/components/plate-editor/plugins/page-break';
import { ELEMENT_REGELVERK } from '@app/components/plate-editor/plugins/regelverk';
import { HeadingOne, HeadingThree, HeadingTwo } from './custom-elements/headings';
import { BulletListStyle, ListItemStyle, NumberedListStyle } from './custom-elements/lists';
import { Maltekst } from './custom-elements/maltekst';
import { Paragraph } from './custom-elements/paragraph';
import { Placeholder } from './custom-elements/placeholder';
import { RedigerbarMaltekst } from './custom-elements/redigerbar-maltekst';
import { ELEMENT_MALTEKST } from './plugins/maltekst';
import { ELEMENT_PLACEHOLDER } from './plugins/placeholder';
import { ELEMENT_REDIGERBAR_MALTEKST } from './plugins/redigerbar-maltekst';

export const components: Record<string, PlatePluginComponent> = {
  [ELEMENT_PARAGRAPH]: ({ attributes, children, element }) => (
    <Paragraph {...attributes} {...element}>
      {children}
    </Paragraph>
  ),
  [ELEMENT_LIC]: ({ attributes, children }) => <div {...attributes}>{children}</div>,
  [ELEMENT_UL]: ({ attributes, children }) => <BulletListStyle {...attributes}>{children}</BulletListStyle>,
  [ELEMENT_OL]: ({ attributes, children }) => <NumberedListStyle {...attributes}>{children}</NumberedListStyle>,
  [ELEMENT_LI]: ({ attributes, children }) => <ListItemStyle {...attributes}>{children}</ListItemStyle>,
  [ELEMENT_TABLE]: ({ attributes, children }) => (
    <table {...attributes}>
      <tbody>{children}</tbody>
    </table>
  ),
  [ELEMENT_TR]: ({ attributes, children }) => <tr {...attributes}>{children}</tr>,
  [ELEMENT_TD]: ({ attributes, children }) => <td {...attributes}>{children}</td>,
  [ELEMENT_TH]: ({ attributes, children }) => <th {...attributes}>{children}</th>,

  [ELEMENT_H1]: ({ attributes, children }) => <HeadingOne {...attributes}>{children}</HeadingOne>,
  [ELEMENT_H2]: ({ attributes, children }) => <HeadingTwo {...attributes}>{children}</HeadingTwo>,
  [ELEMENT_H3]: ({ attributes, children }) => <HeadingThree {...attributes}>{children}</HeadingThree>,
  [ELEMENT_MALTEKST]: Maltekst,
  [ELEMENT_REDIGERBAR_MALTEKST]: RedigerbarMaltekst,
  [ELEMENT_PLACEHOLDER]: Placeholder,
  [ELEMENT_PAGE_BREAK]: PageBreak,
  [ELEMENT_CURRENT_DATE]: CurrentDate,
  [ELEMENT_REGELVERK]: Regelverk,
};
