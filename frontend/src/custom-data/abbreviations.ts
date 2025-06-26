import type { CustomAbbrevation } from '@app/types/bruker';

const URL = '/api/kabal-innstillinger/me/abbreviations';

class Abbreviations {
  private abbreviations: CustomAbbrevation[] = [];
  private map: Map<string, string> = new Map();

  constructor() {
    if (process.env.NODE_ENV !== 'test') {
      this.load().catch((error) => {
        console.error('Failed to load abbreviations:', error);
      });
    }
  }

  private async load() {
    const response = await fetch(URL);
    const parsed: unknown = await response.json();

    if (isAbbreviations(parsed)) {
      this.abbreviations = parsed;
      this.map = new Map(parsed.map(({ short, long }) => [short, long]));
    }
  }

  public isDuplicateAbbreviation(short: string, id: string) {
    return this.abbreviations.some((item) => item.id !== id && item.short === short);
  }

  public hasAbbreviation(short: string) {
    return this.map.has(short);
  }

  public getAbbreviation(short: string) {
    return this.map.get(short);
  }

  public updateAbbreviation(update: CustomAbbrevation) {
    this.abbreviations = this.abbreviations.map((item) => (item.id === update.id ? update : item));
    this.map.set(update.short, update.long);
  }

  public addAbbreviation(add: CustomAbbrevation) {
    this.abbreviations.push(add);
    this.map.set(add.short, add.long);
  }

  public removeAbbreviation(id: string) {
    const existing = this.abbreviations.find((item) => item.id === id);

    if (existing !== undefined) {
      this.abbreviations = this.abbreviations.filter((item) => item.id !== id);
      this.map.delete(existing.short);
    }
  }

  public clear() {
    this.abbreviations = [];
    this.map.clear();
  }
}

const isAbbreviations = (data: unknown): data is CustomAbbrevation[] =>
  Array.isArray(data) &&
  data.every((item) => typeof item === 'object' && item !== null && 'id' in item && 'short' in item && 'long' in item);

export const ABBREVIATIONS = new Abbreviations();
