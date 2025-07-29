import { CurrentDatePlugin } from '@app/plate/plugins/current-date';
import {
  ELEMENT_EMPTY_VOID,
  ELEMENT_FOOTER,
  ELEMENT_HEADER,
  ELEMENT_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_PAGE_BREAK,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_SIGNATURE,
} from '@app/plate/plugins/element-types';
import { LabelContentPlugin } from '@app/plate/plugins/label-content';
import type { ISmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { BoxNew } from '@navikt/ds-react';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { BaseBulletedListPlugin, BaseNumberedListPlugin } from '@platejs/list-classic';
import { BaseTablePlugin } from '@platejs/table';
import { BaseParagraphPlugin } from 'platejs';

interface GeneratedIconProps {
  template: ISmartEditorTemplate;
}

const HEIGHT = 297;
const WIDTH = 210;
const MARGIN = 20;
const SPACING = 2;

export const GeneratedIcon = ({ template }: GeneratedIconProps) => {
  const rects: React.ReactNode[] = [];
  let y = MARGIN;
  let bottomOffset = 39 + MARGIN;
  const { length } = template.richText;

  for (let i = 0; i < length; i++) {
    const content = template.richText[i];

    if (content === undefined) {
      continue;
    }

    const { type } = content;

    switch (type) {
      case CurrentDatePlugin.key: {
        rects.push(r({ type, key: i, width: 30, y, fill: 'text-neutral-decoration', align: 'right' }));
        y += 10;
        break;
      }
      case LabelContentPlugin.key: {
        rects.push(r({ type, key: i, y, fill: 'text-neutral-decoration' }));
        y += 5 + SPACING;
        break;
      }
      case BaseParagraphPlugin.key: {
        rects.push(r({ type, key: i, width: 120, y }));
        y += 5 + SPACING;
        break;
      }
      case BaseH1Plugin.key: {
        y += SPACING;
        rects.push(h1({ type, key: i, y }));
        y += 10 + SPACING;
        break;
      }
      case BaseH2Plugin.key: {
        y += 2;
        rects.push(h2({ type, key: i, y }));
        y += 7 + SPACING;
        break;
      }
      case BaseH3Plugin.key: {
        y += 1;
        rects.push(h3({ type, key: i, y }));
        y += 5 + SPACING;
        break;
      }
      case BaseBulletedListPlugin.key:
      case BaseNumberedListPlugin.key: {
        const height = 20;
        rects.push(r({ type, key: i, height, y }));
        y += height + SPACING;
        break;
      }
      case BaseTablePlugin.key: {
        const height = 25;
        rects.push(r({ type, key: i, width: 170, height, y }));
        y += height + SPACING;
        break;
      }
      case ELEMENT_MALTEKSTSEKSJON: {
        y += SPACING;
        rects.push(h1({ type, key: `${i}-title`, y }));
        y += 10 + SPACING;
        rects.push(r({ type, key: `${i}-p1`, y, width: 120 }));
        y += 5 + SPACING;
        rects.push(r({ type, key: `${i}-p2`, y, width: 100 }));
        y += 5 + SPACING;
        rects.push(r({ type, key: `${i}-p3`, y, width: 110 }));
        y += 5 + SPACING;
        break;
      }
      case ELEMENT_REGELVERK: {
        y += SPACING * 5;
        rects.push(r({ type, key: i, width: WIDTH, height: 2, y, offset: 0, fill: 'text-neutral', radius: 0 }));
        y += 5 + SPACING * 5;
        rects.push(h1({ type, key: `${i}-title`, y }));
        y += 10 + SPACING;
        rects.push(r({ type, key: `${i}-p1`, y, width: 120 }));
        y += 5 + SPACING;
        rects.push(r({ type, key: `${i}-p2`, y, width: 100 }));
        y += 5 + SPACING;
        rects.push(r({ type, key: `${i}-p3`, y, width: 110 }));
        y += 5 + SPACING + SPACING;
        rects.push(h2({ type, key: `${i}-h2-1`, y }));
        y += 7 + SPACING;
        rects.push(r({ type, key: `${i}-p4`, y, width: 120 }));
        y += 5 + SPACING;
        rects.push(r({ type, key: `${i}-p5`, y, width: 100 }));
        y += 5 + SPACING;
        rects.push(r({ type, key: `${i}-p6`, y, width: 110 }));
        y += 5 + SPACING + SPACING;
        rects.push(h2({ type, key: `${i}-h2-2`, y }));
        y += 7 + SPACING;
        rects.push(r({ type, key: `${i}-p7`, y, width: 120 }));
        y += 5 + SPACING;
        rects.push(r({ type, key: `${i}-p8`, y, width: 100 }));
        y += 5 + SPACING;
        rects.push(r({ type, key: `${i}-p9`, y, width: 110 }));
        y += 5 + SPACING;
        break;
      }
      case ELEMENT_EMPTY_VOID:
      case ELEMENT_MALTEKST:
      case ELEMENT_REDIGERBAR_MALTEKST:
        break;
      case ELEMENT_PAGE_BREAK: {
        y += SPACING * 5;
        const height = 2;
        rects.push(r({ type, key: i, width: WIDTH, height, y, offset: 0, fill: 'text-neutral-subtle', radius: 0 }));
        y += height + SPACING * 5;
        break;
      }
      case ELEMENT_HEADER: {
        rects.push(r({ type, key: `${i}-header-line-1`, width: 30, y, fill: 'text-neutral-decoration' }));
        y += 5 + SPACING;
        rects.push(r({ type, key: `${i}-header-line-2`, width: 70, y, fill: 'text-neutral-decoration' }));
        y += 5 + SPACING + SPACING;
        break;
      }
      case ELEMENT_FOOTER: {
        rects.push(
          r({ type, key: `${i}-footer-line-1`, width: 150, y: HEIGHT - MARGIN - 14, fill: 'text-neutral-decoration' }),
        );
        rects.push(
          r({ type, key: `${i}-footer-line-2`, width: 50, y: HEIGHT - MARGIN - 7, fill: 'text-neutral-decoration' }),
        );
        rects.push(
          r({ type, key: `${i}-footer-line-3`, width: 20, y: HEIGHT - MARGIN, fill: 'text-neutral-decoration' }),
        );
        bottomOffset += 21 + SPACING;
        break;
      }
      case ELEMENT_SIGNATURE: {
        y += SPACING;
        rects.push(r({ type, key: `${i}-signature-name-1`, width: 60, y, fill: 'text-neutral-decoration' }));
        rects.push(
          r({ type, key: `${i}-signature-name-2`, width: 60, y, align: 'right', fill: 'text-neutral-decoration' }),
        );
        y += 5 + SPACING;
        rects.push(r({ type, key: `${i}-signature-title-1`, width: 30, y, fill: 'text-neutral-decoration' }));
        rects.push(
          r({ type, key: `${i}-signature-title-2`, width: 30, y, align: 'right', fill: 'text-neutral-decoration' }),
        );
        y += 5 + SPACING;
        break;
      }
    }

    if (y > HEIGHT - bottomOffset) {
      break;
    }
  }

  return (
    <BoxNew
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      shadow="dialog"
      borderWidth="1"
      borderColor="neutral"
      borderRadius="medium"
      marginBlock="0 2"
      width="100%"
      background="input"
    >
      {rects}
    </BoxNew>
  );
};

interface RectProps {
  key: string | number;
  type: string;
  width?: number;
  height?: number;
  y: number;
  offset?: number;
  align?: 'left' | 'right';
  fill?: string;
  radius?: number;
}

const r = ({
  key,
  type,
  height = 5,
  width = 90,
  align,
  offset = MARGIN,
  y,
  fill = 'bg-neutral-moderate-pressed',
  radius = 4,
}: RectProps) => {
  const x = align === 'right' ? WIDTH - offset - width : offset;

  return (
    <rect data-type={type} key={key} width={width} height={height} y={y} x={x} fill={`var(--ax-${fill})`} rx={radius} />
  );
};

interface HeadingProps {
  key: string | number;
  type: string;
  y: number;
}

const h1 = (props: HeadingProps) => r({ ...props, height: 9, width: 160, fill: 'text-neutral-decoration' });
const h2 = (props: HeadingProps) => r({ ...props, height: 7, width: 150, fill: 'text-neutral-decoration' });
const h3 = (props: HeadingProps) => r({ ...props, width: 140, fill: 'text-neutral-decoration' });
