import { Box, HStack, Tag, type TagProps } from '@navikt/ds-react';
import { LoadingCellContent } from '@/components/common-table-components/loading-cell-content';
import { useIsTruncated } from '@/hooks/use-is-truncated';
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

  const first = hjemmelList.at(0);

  if (first === undefined) {
    return (
      <Tag data-color="neutral" variant="outline" size={size}>
        Ingen hjemler
      </Tag>
    );
  }

  return <TruncatedHemmelList hjemmelList={hjemmelList} size={size} first={first} />;
};

interface TruncatedHjemmelListProps {
  hjemmelList: HjemmelNameAndId[];
  size?: TagProps['size'];
  first: HjemmelNameAndId;
}

const TruncatedHemmelList = ({ hjemmelList, size, first }: TruncatedHjemmelListProps) => {
  const count = hjemmelList.length;
  const hasMultiple = count > 1;

  const [isTruncated, truncatedRef] = useIsTruncated(hasMultiple);

  const showTooltip = hasMultiple || isTruncated;

  return (
    <div className="group/hjemmel relative flex w-fit flex-row items-center gap-1">
      <Tag data-color="meta-purple" variant="outline" size={size}>
        <span ref={truncatedRef} className="max-w-50 truncate">
          {first.name}
        </span>
      </Tag>

      {count > 1 ? (
        <Tag data-color="meta-purple" variant="outline" size={size}>
          +{count - 1}
        </Tag>
      ) : null}

      {showTooltip ? (
        <Box
          position="absolute"
          borderRadius="8"
          background="raised"
          left="space-0"
          padding="space-8"
          shadow="dialog"
          width="fit-content"
          className="invisible top-full z-10 mt-1 opacity-0 transition-[opacity,visibility] duration-200 group-hover/hjemmel:visible group-hover/hjemmel:opacity-100 group-hover/hjemmel:delay-500"
        >
          <HStack gap="space-8" maxWidth="500px" wrap>
            {hjemmelList.map(({ id, name }) => (
              <Tag data-color="meta-purple" variant="outline" size={size} key={id}>
                <span className="truncate">{name}</span>
              </Tag>
            ))}
          </HStack>
        </Box>
      ) : null}
    </div>
  );
};
