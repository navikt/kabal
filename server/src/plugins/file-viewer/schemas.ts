import { type Static, Type } from '@fastify/type-provider-typebox';

// --- Archived document schemas ---

const FileTypeSchema = Type.Union([
  Type.Literal('PDF'),
  Type.Literal('JPEG'),
  Type.Literal('PNG'),
  Type.Literal('TIFF'),
  Type.Literal('XLSX'),
  Type.Literal('JSON'),
  Type.Literal('XML'),
  Type.Literal('AXML'),
  Type.Literal('DXML'),
  Type.Literal('RTF'),
]);

const VariantFormatSchema = Type.Union([Type.Literal('ARKIV'), Type.Literal('SLADDET'), Type.Literal('FULLVERSJON')]);
const SkjermingSchema = Type.Union([Type.Literal('POL'), Type.Literal('FEIL')]);

const VariantSchema = Type.Object({
  filtype: FileTypeSchema,
  hasAccess: Type.Boolean(),
  format: VariantFormatSchema,
  filstoerrelse: Type.Optional(Type.Number()),
  skjerming: Type.Union([SkjermingSchema, Type.Null()]),
});

const VariantTupleOneSchema = Type.Tuple([VariantSchema]);
const VariantTupleTwoSchema = Type.Tuple([VariantSchema, VariantSchema]);
const VariantTupleThreeSchema = Type.Tuple([VariantSchema, VariantSchema, VariantSchema]);

const VariantsSchema = Type.Union([
  FileTypeSchema,
  VariantSchema,
  VariantTupleOneSchema,
  VariantTupleTwoSchema,
  VariantTupleThreeSchema,
]);

/** Schema for validating the kabal-api response. */
export const ArchivedApiDocumentSchema = Type.Object({
  journalpostId: Type.String(),
  dokumentInfoId: Type.String(),
  title: Type.String(),
  varianter: VariantsSchema,
  harTilgangTilArkivvariant: Type.Boolean(),
  hasAccess: Type.Boolean(),
});

export type ArchivedApiDocument = Static<typeof ArchivedApiDocumentSchema>;
export type ArchivedApiVariants = ArchivedApiDocument['varianter'];

export const ARCHIVED_PARAMS = Type.Object({
  ids: Type.String({ description: 'Encoded archived document IDs' }),
});

export const BEHANDLING_ARCHIVED_PARAMS = Type.Object({
  behandlingId: Type.String({ format: 'uuid' }),
  ids: Type.String({ description: 'Encoded archived document IDs' }),
});

// --- DUA document schemas ---

const JournalfoertDokumentReferenceSchema = Type.Object({
  journalpostId: Type.String(),
  dokumentInfoId: Type.String(),
  varianter: VariantsSchema,
});

export const DuaApiDocumentSchema = Type.Object({
  id: Type.String(),
  tittel: Type.String(),
  parentId: Type.Union([Type.String(), Type.Null()]),
  /** Set for archived documents attached to the DUA. */
  journalfoertDokumentReference: Type.Union([JournalfoertDokumentReferenceSchema, Type.Null()]),
});

export type IDuaApiDocument = Static<typeof DuaApiDocumentSchema>;

export const DUA_PARAMS = Type.Object({
  behandlingId: Type.String({ format: 'uuid' }),
  id: Type.String({ format: 'uuid' }),
});

// --- Vedleggsoversikt schemas ---

export const VEDLEGGSOVERSIKT_PARAMS = Type.Object({
  behandlingId: Type.String({ format: 'uuid' }),
  id: Type.String({ format: 'uuid' }),
});
