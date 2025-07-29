import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import { BoxNew, type BoxNewProps, Tag } from '@navikt/ds-react';

interface BaseProps {
  useName: (id: string) => string;
  variant: keyof typeof BACKGROUND;
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
  variant: keyof typeof BACKGROUND;
}

export const CustomTag = ({ children, variant }: CustomTagProps) => (
  <BoxNew asChild height="fit-content" borderWidth="1" background={BACKGROUND[variant]} borderColor={BORDER[variant]}>
    <Tag variant="info" size="small" title={children}>
      {children}
    </Tag>
  </BoxNew>
);

const BACKGROUND: Record<keyof IGetMaltekstseksjonParams, BoxNewProps['background']> = {
  templateSectionIdList: 'danger-moderate',
  ytelseHjemmelIdList: 'accent-moderate',
  utfallIdList: 'meta-lime-moderate',
  enhetIdList: 'meta-purple-moderate',
};

const BORDER: Record<keyof IGetMaltekstseksjonParams, BoxNewProps['borderColor']> = {
  templateSectionIdList: 'accent',
  ytelseHjemmelIdList: 'accent',
  utfallIdList: 'meta-lime',
  enhetIdList: 'meta-purple',
};
