# Få opp lokalt
Finn en testbruker som du kan logge inn i Kabal med
Husk å skru på naisdevice.

Gå til dev-miljøet kabal.dev.nav.no
Logg inn i KABAL.

Når du har logget inn i dev-miljøet kan du gå inn i `/frontend`-mappa og kjøre:

`$ npm install`

`$ npm run local`

Jobb lokalt i `localhost:8061` som vil bruke samme backend som dev.

Husk at `localhost:8061` ikke vil redirecte deg til Azure login automatisk.
Requestene vil bare feile og redirected vil bli Blocked.
Løsningen er da bare å refreshe kabal.dev.nav.no og logge inn på nytt.

For å jobbe bedre med ESLint er det best å jobbe i frontend-mappa i stedet for root-mappa.


# Webpack eksempel prosjekt

Satt opp for å støtte lasting av `.less`, samt `png|jpeg|gif|svg`.

Development med hot-reloading og linting:

```
npm install
npm run lint
npm start
```

Bygging for produksjon:

```
npm install
npm run build
```

Bruker `copyfiles` for å kopiere `index.html` til `/dist`
https://www.npmjs.com/package/copyfiles

```
npm install -g copyfiles
```

For å kjøre build lokalt kan `serve` brukes:
https://www.npmjs.com/package/serve

```
npm install -g serve
serve dist
```
