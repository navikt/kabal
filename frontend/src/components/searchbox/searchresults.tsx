import React from 'react';

export const SearchResults = (personsoek: PersonSoekApiResponse) => (
  <div>
    <p>`Antall treff totalt: ${personsoek.antallTreffTotalt}`</p>
  </div>
);
