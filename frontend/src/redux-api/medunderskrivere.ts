export interface IMedunderskrivereState {
  medunderskrivere: IMedunderskriver[];
  loading: boolean;
}

export interface IMedunderskriver {
  navn: string;
  ident: string;
}

export interface IMedunderskriverePayload {
  tema: string;
  medunderskrivere: IMedunderskriver[];
}

export interface IMedunderskrivereInput {
  id: string;
  tema: string;
}

export interface ISettMedunderskriverParams {
  klagebehandlingId: string;
  medunderskriverident: string;
  klagebehandlingVersjon: number;
}

export interface ISettMedunderskriverResponse {
  klagebehandlingVersjon: number;
  modified: string;
  datoSendtMedunderskriver: string;
}
