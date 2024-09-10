import type { IMaltekstseksjon } from '../maltekstseksjoner/responses';

export interface IDeleteDraftOrUnpublishTextResponse {
  maltekstseksjonVersions: {
    maltekstseksjonId: string;
    maltekstseksjonVersions: IMaltekstseksjon[];
  }[];
}
