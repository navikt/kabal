import type { DraftTextReadOnlyMetadata, PublishedTextReadOnlyMetadata } from '@/types/common-text-types';
import type {
  INewGodFormuleringParams,
  INewRegelverkParams,
  INewRichTextParams,
  ListGodFormulering,
  ListRegelverk,
  ListRichText,
} from '@/types/texts/common';

export type IDraftRichText = INewRichTextParams & DraftTextReadOnlyMetadata;
type IDraftRegelverk = INewRegelverkParams & DraftTextReadOnlyMetadata;
type IDraftGodFormulering = INewGodFormuleringParams & DraftTextReadOnlyMetadata;

export type IDraft = IDraftRichText | IDraftRegelverk | IDraftGodFormulering;

export interface IPublishedRichText extends PublishedTextReadOnlyMetadata, INewRichTextParams {}
export interface IPublishedRegelverk extends PublishedTextReadOnlyMetadata, INewRegelverkParams {}
export interface IPublishedGodFormulering extends PublishedTextReadOnlyMetadata, INewGodFormuleringParams {}

export type IPublishedText = IPublishedRichText | IPublishedRegelverk | IPublishedGodFormulering;

export type IRichText = IDraftRichText | IPublishedRichText;
export type IRegelverk = IDraftRegelverk | IPublishedRegelverk;
export type IGodFormulering = IDraftGodFormulering | IPublishedGodFormulering;

export type IText = IDraft | IPublishedText;

export type ListText = ListRichText | ListRegelverk | ListGodFormulering;
