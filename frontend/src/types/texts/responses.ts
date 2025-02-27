import type { DraftTextReadOnlyMetadata, PublishedTextReadOnlyMetadata } from '../common-text-types';
import type {
  INewGodFormuleringParams,
  INewPlainTextParams,
  INewRegelverkParams,
  INewRichTextParams,
  ListGodFormulering,
  ListPlainText,
  ListRegelverk,
  ListRichText,
} from './common';

export type IDraftRichText = INewRichTextParams & DraftTextReadOnlyMetadata;
type IDraftRegelverk = INewRegelverkParams & DraftTextReadOnlyMetadata;
type IDraftPlainText = INewPlainTextParams & DraftTextReadOnlyMetadata;
type IDraftGodFormulering = INewGodFormuleringParams & DraftTextReadOnlyMetadata;

export type IDraft = IDraftPlainText | IDraftRichText | IDraftRegelverk | IDraftGodFormulering;

export interface IPublishedRichText extends PublishedTextReadOnlyMetadata, INewRichTextParams {}
export interface IPublishedPlainText extends PublishedTextReadOnlyMetadata, INewPlainTextParams {}
export interface IPublishedRegelverk extends PublishedTextReadOnlyMetadata, INewRegelverkParams {}
export interface IPublishedGodFormulering extends PublishedTextReadOnlyMetadata, INewGodFormuleringParams {}

export type IPublishedText = IPublishedRichText | IPublishedPlainText | IPublishedRegelverk | IPublishedGodFormulering;

export type IRichText = IDraftRichText | IPublishedRichText;
export type IRegelverk = IDraftRegelverk | IPublishedRegelverk;
export type IGodFormulering = IDraftGodFormulering | IPublishedGodFormulering;
export type IPlainText = IDraftPlainText | IPublishedPlainText;

export type IText = IDraft | IPublishedText;

export type ListText = ListRichText | ListPlainText | ListRegelverk | ListGodFormulering;
