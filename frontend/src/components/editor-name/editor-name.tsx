import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetSignatureQuery } from '@app/redux-api/bruker';

interface EditorProps {
  editorId: string;
}

export const EditorName = ({ editorId }: EditorProps) => {
  const query = editorId === 'LOADING' ? skipToken : editorId;
  const { data, isLoading } = useGetSignatureQuery(query);

  return isLoading || data === undefined ? (
    <Loader size="xsmall" title="Laster..." />
  ) : (
    (data.customLongName ?? data.longName)
  );
};
