import { IKvalitetsvurdering } from "../../../tilstand/moduler/kvalitetsvurdering";
import React, { RefObject, useCallback } from "react";
import { IKodeverkVerdi } from "../../../tilstand/moduler/kodeverk";
import {
  Div,
  DokumentCheckbox,
  Header,
  SubHeader,
  VurderingBeholder,
} from "../../../styled-components/Kvalitetsvurdering";
import { Row, FlexRow } from "../../../styled-components/Row";
import { Radio, RadioGruppe } from "nav-frontend-skjema";
import { Tekstfelt } from "./Tekstfelt";

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
  toggleKodeverk,
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
  toggleKodeverk: any;
}) {
  let verdi = kvalitetsvurdering[felt];
  let tekstfeltverdi = kvalitetsvurdering[tekstfelt] ?? "";

  const handleTekstChange = useCallback((tekst: string) => {
    lagre(tekstfelt, tekst);
  }, []);

  return (
    <Div ref={refHandler}>
      <Header>{tittel}</Header>
      <SubHeader>{undertittel}</SubHeader>
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
          <Row>
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
                        navn: kodeverkVerdi.navn,
                        verdi: kodeverkVerdi.id,
                      })
                    }
                    defaultChecked={funnet}
                  />
                );
              });
            })()}
          </Row>

          <Row>
            <Tekstfelt
              label="Kommentar:"
              defaultValue={tekstfeltverdi ?? ""}
              handleChange={handleTekstChange}
            />
          </Row>
        </VurderingBeholder>
      </Div>
    </Div>
  );
}
