interface PageInfoProps {
  total: number;
  fromNumber: number;
  toNumber: number;
}

export const PageInfo = ({ total, fromNumber, toNumber }: PageInfoProps): React.JSX.Element | null => {
  if (total === 0) {
    return null;
  }

  return <span>{`Viser ${fromNumber} til ${toNumber} av ${total} oppgaver`}</span>;
};
