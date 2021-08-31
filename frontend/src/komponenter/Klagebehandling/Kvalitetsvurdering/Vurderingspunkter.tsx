import {
  IKvalitetsvurdering,
  lagreKvalitetsvurdering,
} from "../../../tilstand/moduler/kvalitetsvurdering";
import React, { RefObject, useCallback } from "react";
import { IKodeverkVerdi } from "../../../tilstand/moduler/kodeverk";
import {
  Div,
  DokumentCheckbox,
  Header,
  SubHeader,
  VurderingBeholder,
} from "../../../styled-components/Kvalitetsvurdering-styled";
import { FlexRow, Section } from "../../../styled-components/Row-styled";
import { Radio, RadioGruppe } from "nav-frontend-skjema";
import { Tekstfelt } from "./Tekstfelt";
import { useAppDispatch } from "../../../tilstand/konfigurerTilstand";

export function Vurderingspunkter({
  tittel,
  undertittel,
  kvalitetsvurdering,
  felt,
  tekstfelt,
  refHandler,
  avviksNavn,
  avviksTittel,
  kodeverkFelter,
  lagre,
  klagebehandling,
}: {
  tittel: string;
  undertittel: string;
  kvalitetsvurdering: IKvalitetsvurdering;
  felt: any;
  tekstfelt: string;
  refHandler: RefObject<any>;
  avviksNavn: string;
  avviksTittel: string;
  kodeverkFelter: Array<IKodeverkVerdi>;
  lagre: (felt: string, verdi: string | boolean) => void;
  klagebehandling: any;
}) {
  let verdi = kvalitetsvurdering[felt];
  let tekstfeltverdi = kvalitetsvurdering[tekstfelt] ?? "";
  const dispatch = useAppDispatch();

  const toggleKodeverk = useCallback(
    ({ kodeverkFelt, liste, id }: { kodeverkFelt: Array<string>; liste: string; id: string }) => {
      let funnet = kodeverkFelt.filter((felt_id: string) => felt_id === id);
      let nyListe: string[] = [];
      if (!funnet.length) {
        nyListe = nyListe.concat(kodeverkFelt);
        nyListe.push(id);
      } else {
        nyListe = kodeverkFelt.filter((felt_id: string) => felt_id !== id);
      }
      dispatch(
        lagreKvalitetsvurdering({
          klagebehandlingId: klagebehandling.id,
          [liste]: nyListe,
        })
      );
    },
    []
  );

  const handleTekstChange = useCallback((tekst: string) => {
    lagre(tekstfelt, tekst);
  }, []);

  return (
    <Div ref={refHandler}>
      <Header>{tittel}</Header>
      <FlexRow>
        <RadioGruppe>
          <Radio
            label={"Bra / Godt nok"}
            name={felt}
            defaultChecked={verdi === true}
            onChange={() => lagre(felt, true)}
          />
        </RadioGruppe>
        <Radio
          label={"Mangelfullt"}
          name={felt}
          defaultChecked={verdi === false}
          onChange={() => {
            lagre(felt, false);
          }}
        />
      </FlexRow>

      <Div>
        <VurderingBeholder theme={{ vises: verdi == false }}>
          <SubHeader>{avviksTittel}</SubHeader>
          <Section>
            {(() => {
              return kodeverkFelter.map((kodeverkVerdi) => {
                let funnet = kvalitetsvurdering[avviksNavn].find(
                  (element: string) => element === kodeverkVerdi.id
                );
                return (
                  <DokumentCheckbox
                    key={`${kodeverkVerdi.id}${kodeverkVerdi.navn}`}
                    label={kodeverkVerdi.beskrivelse}
                    onChange={() =>
                      toggleKodeverk({
                        kodeverkFelt: kvalitetsvurdering[avviksNavn],
                        liste: avviksNavn,
                        id: kodeverkVerdi.id,
                      })
                    }
                    defaultChecked={funnet}
                  />
                );
              });
            })()}
          </Section>

          <Section>
            <Tekstfelt
              label="Kommentar:"
              placeholder={"NB: Ingen personopplysninger"}
              defaultValue={tekstfeltverdi ?? ""}
              handleChange={handleTekstChange}
            />
          </Section>
        </VurderingBeholder>
      </Div>
    </Div>
  );
}
