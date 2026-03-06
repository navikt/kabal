import { Tag, Tooltip } from '@navikt/ds-react';
import { LoadingCellContent } from '@/components/common-table-components/loading-cell-content';
import { useIsTruncated } from '@/hooks/use-is-truncated';
import { useFullYtelseNameFromId } from '@/hooks/use-kodeverk-ids';

interface Props {
  ytelseId: string;
}

export const Ytelse = ({ ytelseId }: Props) => {
  const [isTruncated, truncatedRef] = useIsTruncated();
  const ytelseName = useFullYtelseNameFromId(ytelseId);

  if (ytelseName === undefined) {
    return <LoadingCellContent />;
  }

  const name = ytelseName ?? 'Ukjent';

  const tag = (
    <Tag data-color="info" variant="outline" size="small">
      <span ref={truncatedRef} className="max-w-75 truncate">
        {name}
      </span>
    </Tag>
  );

  if (!isTruncated) {
    return tag;
  }

  return (
    <Tooltip content={name} delay={500}>
      {tag}
    </Tooltip>
  );
};
