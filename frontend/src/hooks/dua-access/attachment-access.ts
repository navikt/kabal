export enum AttachmentAccessEnum {
  ALLOWED = 0,
  /** This document can only be edited by the assigned user. */
  NOT_ASSIGNED = 1,
  /** This document can only be edited by the assigned user or tilsendt medunderskriver. */
  NOT_ASSIGNED_OR_MEDUNDERSKRIVER = 2,
  /** The (parent) document is marked as finished. No changes are allowed. */
  FINISHED = 3,
  /** Only medunderskriver can edit the document. */
  SENT_TO_MEDUNDERSKRIVER = 4,
  /** Only ROL can edit the document. */
  SENT_TO_ROL = 5,
  /** Case is not sent to ROL. */
  NOT_SENT_TO_ROL = 6,
  /** Only the assigned saksbehandler can edit their own attachments. As long as the case is with the saksbehandler. */
  SAKSBEHANDLER_OWNED_ATTACHMENT = 7,
  /** Only ROL can edit their own attachments. As long as the case is sent to ROL. */
  ROL_OWNED_ATTACHMENT = 8,
  /** No one can edit documents on a feilregistrert case. */
  FEILREGISTRERT = 9,
  /** Unsupported */
  NOT_SUPPORTED = 10,
}
