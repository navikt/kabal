import React from 'react';
import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { useInnsendingshjemmelFromId } from '@app/hooks/use-kodeverk-ids';
import { LabelMain } from '@app/styled-components/labels';

interface Props {
  hjemmel: string | null;
}

export const Hjemmel = ({ hjemmel }: Props) => {
  if (hjemmel === null) {
    return null;
  }

  return <ResolvedHjemmel hjemmel={hjemmel} />;
};

interface ResolvedProps {
  hjemmel: string;
}

const ResolvedHjemmel = ({ hjemmel }: ResolvedProps) => {
  const hjemmelName = useInnsendingshjemmelFromId(hjemmel);

  if (hjemmelName === undefined) {
    return <LoadingCellContent />;
  }

  return <LabelMain>{hjemmelName}</LabelMain>;
};
