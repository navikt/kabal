import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';

export interface IDeleteDraftOrUnpublishTextResponse {
  maltekstseksjonVersions: {
    maltekstseksjonId: string;
    maltekstseksjonVersions: IMaltekstseksjon[];
  }[];
}
