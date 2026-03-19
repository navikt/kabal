import { HStack, Tag, type TagProps } from '@navikt/ds-react';
import { LoadingCellContent } from '@/components/common-table-components/loading-cell-content';
import {
  type HjemmelNameAndId,
  useInnsendingshjemlerFromIds,
  useRegistreringshjemlerFromIds,
} from '@/hooks/use-kodeverk-ids';

interface Props {
  hjemmelIdList: string[];
  size?: TagProps['size'];
}

export const InnsendingshjemlerList = ({ hjemmelIdList, ...rest }: Props) => {
  const hjemmelList = useInnsendingshjemlerFromIds(hjemmelIdList);

  return <HjemmelList hjemmelList={hjemmelList} {...rest} />;
};

export const Registreringshjemler = ({ hjemmelIdList, ...rest }: Props) => {
  const hjemmelList = useRegistreringshjemlerFromIds(hjemmelIdList ?? []);

  return <HjemmelList hjemmelList={hjemmelList} {...rest} />;
};

interface HjemmelNamesProps {
  hjemmelList: HjemmelNameAndId[] | undefined;
  size?: TagProps['size'];
}

const HjemmelList = ({ hjemmelList, size }: HjemmelNamesProps) => {
  const hasHjemler = hjemmelList !== undefined && hjemmelList.length > 0;

  if (!hasHjemler) {
    return <LoadingCellContent />;
  }

  return (
    <HStack gap="space-8" maxWidth="500px" wrap>
      {hjemmelList.length === 0 ? (
        <Tag data-color="neutral" variant="outline" size={size}>
          Ingen hjemler
        </Tag>
      ) : (
        hjemmelList.map(({ id, name }) => (
          <Tag data-color="meta-purple" variant="outline" size={size} key={id}>
            {name}
          </Tag>
        ))
      )}
    </HStack>
  );
};
