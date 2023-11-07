import { IMaltekstseksjon } from '../maltekstseksjoner/responses';

export interface IDeleteDraftOrUnpublishTextResponse {
  maltekstseksjonVersions: {
    maltekstseksjonId: string;
    maltekstseksjonVersions: IMaltekstseksjon[];
  }[];
}
