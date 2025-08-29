import { accessListDocumentCountGauge, accessListUserCountSummary } from '@app/document-access/metrics';
import { getLogger } from '@app/logger';

const log = getLogger('document-write-access-map');

export class SmartDocumentAccessMap {
  /**
   * Map of document IDs to their access lists.
   * An access list is a list of Nav-ident strings.
   */
  #accessMap: Map<string, string[]> = new Map();

  public set(documentId: string, navIdents: string[]): void {
    this.#accessMap.set(documentId, navIdents);

    log.debug({ msg: 'Access map entry set', data: { document_id: documentId, nav_idents: navIdents } });
    log.debug({
      msg: 'Current access map',
      data: {
        access_map: Object.fromEntries(this.#accessMap.entries()),
      },
    });

    for (const [key, value] of this.#accessMap.entries()) {
      accessListDocumentCountGauge.set({ document_id: key }, value.length);
    }

    accessListUserCountSummary.observe(navIdents.length);
  }

  public get = (documentId: string): string[] | undefined => this.#accessMap.get(documentId);

  public has = (documentId: string): boolean => this.#accessMap.has(documentId);

  public delete = (documentId: string): void => {
    this.#accessMap.delete(documentId);

    log.debug({ msg: 'Access map entry deleted', data: { document_id: documentId } });

    accessListDocumentCountGauge.remove({ document_id: documentId });
  };

  public clear = (): void => {
    this.#accessMap.clear();

    log.debug({ msg: 'Access map cleared' });

    accessListDocumentCountGauge.reset();
  };
}
