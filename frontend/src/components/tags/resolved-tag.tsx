import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import { Tag, type TagProps } from '@navikt/ds-react';

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
  <Tag variant={TAG_VARIANT[variant]} size="small" title={children}>
    {children}
  </Tag>
);

const TAG_VARIANT: Record<keyof IGetMaltekstseksjonParams, TagProps['variant']> = {
  templateSectionIdList: 'error',
  ytelseHjemmelIdList: 'info',
  utfallIdList: 'alt2',
  enhetIdList: 'alt1',
};
