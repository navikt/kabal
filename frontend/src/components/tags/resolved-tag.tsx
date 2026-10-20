import { Tag, type TagProps } from '@navikt/ds-react';
import type { IGetMaltekstseksjonParams } from '@/types/common-text-types';

interface BaseProps {
  useName: (id: string) => string;
  variant: keyof IGetMaltekstseksjonParams;
}

interface Props extends BaseProps {
  id: string;
}

const ResolvedTag = ({ id, variant, useName }: Props) => <CustomTag variant={variant}>{useName(id)}</CustomTag>;

interface ListProps extends BaseProps {
  ids: string[];
}

export const ResolvedTags = ({ ids, ...props }: ListProps) => (
  <>
    {ids.map((id) => (
      <ResolvedTag key={id} id={id} {...props} />
    ))}
  </>
);

interface CustomTagProps {
  children: string;
  variant: keyof IGetMaltekstseksjonParams;
}

export const CustomTag = ({ children, variant }: CustomTagProps) => (
  <Tag data-color={TAG_COLOR[variant]} size="small" title={children}>
    {children}
  </Tag>
);

const TAG_COLOR: Record<keyof IGetMaltekstseksjonParams, TagProps['data-color']> = {
  templateSectionIdList: 'danger',
  ytelseHjemmelIdList: 'info',
  utfallIdList: 'meta-purple',
  enhetIdList: 'meta-lime',
};
