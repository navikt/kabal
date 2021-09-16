import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, finalize } from 'rxjs/operators';

export const provIgjenStrategi =
  ({
    maksForsok = 3,
    ventetidMillisekunder = 2000,
    ekskluderteStatuskoder = [],
  }: {
    maksForsok?: number;
    ventetidMillisekunder?: number;
    ekskluderteStatuskoder?: number[];
  } = {}) =>
  (antallForsok: Observable<any>) =>
    antallForsok.pipe(
      mergeMap((error, i) => {
        const forsok = i + 1;

        if (forsok > maksForsok || ekskluderteStatuskoder.find((e) => e === error.status)) {
          return throwError(error);
        }
        return timer(forsok * ventetidMillisekunder);
      }),
      finalize(() => {
        // console.log("Ferdig")
      })
    );
