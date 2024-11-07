export interface Filterable {
  published: boolean;
  publishedDateTime: string | null;
}

export const isDepublished = ({ published, publishedDateTime }: Filterable) => !published && publishedDateTime !== null;
export const isDraft = ({ published, publishedDateTime }: Filterable) => !published && publishedDateTime === null;
export const isPublished = ({ published, publishedDateTime }: Filterable) => published && publishedDateTime !== null;
