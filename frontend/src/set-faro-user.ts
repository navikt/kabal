import { faro } from '@grafana/faro-web-sdk';
import { user } from '@/static-data/static-data';

user.then((userData) => {
  faro.api?.setUser({
    id: userData.navIdent,
    roles: userData.roller.join(','),
    attributes: {
      enhetNavn: userData.ansattEnhet.navn,
      tildelteYtelser: userData.tildelteYtelser.join(','),
    },
  });
});
