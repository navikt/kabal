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
import { BaseParagraphPlugin } from '@udecode/plate';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { BaseBulletedListPlugin, BaseNumberedListPlugin } from '@udecode/plate-list';
import { BaseTablePlugin } from '@udecode/plate-table';
import { styled } from 'styled-components';

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
        rects.push(r({ type, key: i, width: 30, y, fill: 'gray-400', align: 'right' }));
        y += 10;
        break;
      }
      case LabelContentPlugin.key: {
        rects.push(r({ type, key: i, y, fill: 'gray-400' }));
        y += 5 + SPACING;
        break;
      }
      case BaseParagraphPlugin.key: {
        rects.push(r({ type, key: i, width: 120, y }));
        y += 5 + SPACING;
        break;
      }
      case HEADING_KEYS.h1: {
        y += SPACING;
        rects.push(h1({ type, key: i, y }));
        y += 10 + SPACING;
        break;
      }
      case HEADING_KEYS.h2: {
        y += 2;
        rects.push(h2({ type, key: i, y }));
        y += 7 + SPACING;
        break;
      }
      case HEADING_KEYS.h3: {
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
        rects.push(r({ type, key: i, width: WIDTH, height: 2, y, offset: 0, fill: 'surface-inverted', radius: 0 }));
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
        rects.push(r({ type, key: i, width: WIDTH, height, y, offset: 0, fill: 'surface-inverted', radius: 0 }));
        y += height + SPACING * 5;
        break;
      }
      case ELEMENT_HEADER: {
        rects.push(r({ type, key: `${i}-header-line-1`, width: 30, y, fill: 'gray-400' }));
        y += 5 + SPACING;
        rects.push(r({ type, key: `${i}-header-line-2`, width: 70, y, fill: 'gray-400' }));
        y += 5 + SPACING + SPACING;
        break;
      }
      case ELEMENT_FOOTER: {
        rects.push(r({ type, key: `${i}-footer-line-1`, width: 150, y: HEIGHT - MARGIN - 14, fill: 'gray-400' }));
        rects.push(r({ type, key: `${i}-footer-line-2`, width: 50, y: HEIGHT - MARGIN - 7, fill: 'gray-400' }));
        rects.push(r({ type, key: `${i}-footer-line-3`, width: 20, y: HEIGHT - MARGIN, fill: 'gray-400' }));
        bottomOffset += 21 + SPACING;
        break;
      }
      case ELEMENT_SIGNATURE: {
        y += SPACING;
        rects.push(r({ type, key: `${i}-signature-name-1`, width: 60, y, fill: 'gray-400' }));
        rects.push(r({ type, key: `${i}-signature-name-2`, width: 60, y, align: 'right', fill: 'gray-400' }));
        y += 5 + SPACING;
        rects.push(r({ type, key: `${i}-signature-title-1`, width: 30, y, fill: 'gray-400' }));
        rects.push(r({ type, key: `${i}-signature-title-2`, width: 30, y, align: 'right', fill: 'gray-400' }));
        y += 5 + SPACING;
        break;
      }
    }

    if (y > HEIGHT - bottomOffset) {
      break;
    }
  }

  return (
    <StyledSvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
      {rects}
    </StyledSvg>
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
  fill = 'gray-300',
  radius = 4,
}: RectProps) => {
  const x = align === 'right' ? WIDTH - offset - width : offset;

  return (
    <rect data-type={type} key={key} width={width} height={height} y={y} x={x} fill={`var(--a-${fill})`} rx={radius} />
  );
};

interface HeadingProps {
  key: string | number;
  type: string;
  y: number;
}

const h1 = (props: HeadingProps) => r({ ...props, height: 9, width: 160, fill: 'gray-400' });
const h2 = (props: HeadingProps) => r({ ...props, height: 7, width: 150, fill: 'gray-400' });
const h3 = (props: HeadingProps) => r({ ...props, width: 140, fill: 'gray-400' });

const StyledSvg = styled.svg`
  box-shadow: var(--a-shadow-medium);
  border: 1px solid var(--a-border-default);
  border-radius: var(--a-border-radius-medium);
  margin-bottom: var(--a-spacing-2);
  width: 100%;
`;
