export enum DocumentAccessEnum {
  ALLOWED = 0,
  /** Only the assigned saksbehandler has access to this operation. */
  NOT_ASSIGNED = 1,
  /** Only the assigned saksbehandler or tilsendt medunderskriver has access to this operation. */
  NOT_ASSIGNED_OR_MEDUNDERSKRIVER = 2,
  /** Only the assigned ROL user has access to this operation. */
  NOT_ASSIGNED_ROL = 3,
  /** Only the assigned saksbehandler or ROL user has access to this operation. */
  NOT_ASSIGNED_OR_ROL = 4,
  /** This operation is not allowed because the document is marked as finished. */
  DOCUMENT_FINISHED = 5,
  /** This operation is not allowed because the case is not returned by ROL. */
  ROL_REQUIRED = 6,
  /** This operation is not allowed because the case is sent to medunderskriver. */
  SENT_TO_MU = 7,
  /** This operation is not allowed because the case is sent to ROL */
  SENT_TO_ROL = 8,
  /** This operation is not allowed because the user is ROL. */
  ROL_USER = 9,
  /** This operation is not allowed because the document is a ROL-questions document. */
  ROL_QUESTIONS = 10,
  /** This operation is not allowed because the document has attachments added by ROL. */
  HAS_ROL_ATTACHMENTS = 11,
  /** This operation is not allowed because the case is feilregistrert. */
  CASE_FEILREGISTRERT = 12,
  /** This operation is not supported for this document. */
  NOT_SUPPORTED = 13,
}
