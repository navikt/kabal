import { DocumentDate } from '@app/components/documents/journalfoerte-documents/document/document-date';
import { formatAvsenderMottaker } from '@app/components/documents/journalfoerte-documents/document/format-avsender-mottaker';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { useArchivedDocumentsColumns } from '@app/hooks/settings/use-archived-documents-setting';
import { useFullTemaNameFromIdOrLoading } from '@app/hooks/use-kodeverk-ids';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, Tag, Tooltip } from '@navikt/ds-react';
import { JournalposttypeTag } from './journalposttype';

interface Props {
  document: IArkivertDocument;
  showMetadata: boolean;
  toggleShowMetadata: () => void;
}

export const ExpandedColumns = ({ document, showMetadata, toggleShowMetadata }: Props) => {
  const { tema, avsenderMottaker, sak, journalposttype } = document;

  const temaName = useFullTemaNameFromIdOrLoading(tema);
  const { columns } = useArchivedDocumentsColumns();

  return (
    <>
      {columns.TEMA ? (
        <Tag
          variant="info"
          size="small"
          title={temaName}
          style={{ gridArea: Fields.Tema }}
          className="justify-start whitespace-nowrap"
        >
          <span className="select-text overflow-hidden text-ellipsis">{temaName}</span>
        </Tag>
      ) : null}

      {columns.DATO_OPPRETTET ? (
        <DocumentDate
          date={document.datoOpprettet}
          style={{ gridArea: Fields.DatoOpprettet }}
          className="select-text overflow-hidden text-ellipsis"
        />
      ) : null}

      {columns.DATO_REG_SENDT ? (
        <DocumentDate
          date={document.datoRegSendt}
          style={{ gridArea: Fields.DatoRegSendt }}
          className="select-text overflow-hidden text-ellipsis"
        />
      ) : null}

      {columns.AVSENDER_MOTTAKER ? (
        <span
          style={{ gridArea: Fields.AvsenderMottaker }}
          className="select-text overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {formatAvsenderMottaker(avsenderMottaker)}
        </span>
      ) : null}

      {columns.SAKSNUMMER ? <Saksnummer saksnummer={sak?.fagsakId} /> : null}

      {columns.TYPE ? <JournalposttypeTag type={journalposttype} /> : null}

      <Tooltip placement="left" content={showMetadata ? 'Skjul informasjon' : 'Vis informasjon'} keys={['I']}>
        <Button
          variant={showMetadata ? 'primary' : 'tertiary'}
          size="small"
          icon={<InformationSquareIcon aria-hidden />}
          onClick={(e) => {
            e.stopPropagation();
            toggleShowMetadata();
          }}
          style={{ gridArea: Fields.ToggleMetadata }}
          tabIndex={-1}
        />
      </Tooltip>
    </>
  );
};

interface SaksnummerProps {
  saksnummer: string | undefined | null;
}

const Saksnummer = ({ saksnummer }: SaksnummerProps) => {
  if (saksnummer === undefined || saksnummer === null || saksnummer.length === 0) {
    return null;
  }

  return (
    <Tag
      variant="neutral"
      size="small"
      style={{ gridArea: Fields.Saksnummer }}
      className="group relative select-text justify-start whitespace-nowrap pr-6"
    >
      <span className="overflow-hidden text-ellipsis">{saksnummer}</span>

      <CopyButton
        copyText={saksnummer}
        title="Kopier saksnummer"
        size="xsmall"
        className="absolute right-0 opacity-0 group-hover:opacity-100"
      />
    </Tag>
  );
};
