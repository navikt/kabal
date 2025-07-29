import {
  type HjemmelNameAndId,
  useInnsendingshjemlerFromIds,
  useRegistreringshjemlerFromIds,
} from '@app/hooks/use-kodeverk-ids';
import { HStack, Tag, type TagProps } from '@navikt/ds-react';

interface Props {
  hjemmelIdList: string[];
  /** Node to render while loading hjemmel names. */
  loading?: React.ReactNode;
  /** Node to render if list is empty. */
  fallback?: React.ReactNode;
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
  loading?: React.ReactNode;
  fallback?: React.ReactNode;
  size?: TagProps['size'];
}

const HjemmelList = ({ hjemmelList, size, loading, fallback }: HjemmelNamesProps) =>
  hjemmelList === undefined ? (
    loading
  ) : (
    <HStack wrap gap="2">
      {hjemmelList.length === 0
        ? fallback
        : hjemmelList.map(({ id, name }) => (
            <Tag variant="alt1" size={size} key={id} className="truncate">
              {name}
            </Tag>
          ))}
    </HStack>
  );
