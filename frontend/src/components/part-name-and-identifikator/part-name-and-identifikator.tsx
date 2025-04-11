import { formatIdNumber } from '@app/functions/format-id';

interface Props {
  identifikator: string | null;
  name: string | null;
}

export const PartNameAndIdentifikator = ({ identifikator, name = 'Navn mangler' }: Props) => (
  <>
    {name}
    {identifikator === null ? null : ` (${formatIdNumber(identifikator)})`}
  </>
);
