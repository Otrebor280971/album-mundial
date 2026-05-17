import React from 'react'

const CodeBadge = ({ code }: { code: string }) => (
  <span className="text-[10px] font-bold bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded tracking-wider border border-neutral-700">
    {code}
  </span>
)

type CountryMeta = {
  label: string
  icon: React.ComponentType
}

export const COUNTRY_META: Record<string, CountryMeta> = {
  // Especiales
  FWC: { label: 'Mundial', icon: () => <CodeBadge code="FWC" /> },
  CC: { label: 'Coca-Cola', icon: () => <CodeBadge code="CC" /> },
  // Paises
  JPN: { label: 'Japón', icon: () => <CodeBadge code="JPN" /> },
  KOR: { label: 'Corea del Sur', icon: () => <CodeBadge code="KOR" /> },
  CZE: { label:  'República checa', icon: () => <CodeBadge code="CZE" /> },
  IRN: { label: 'Irán', icon: () => <CodeBadge code="IRN" /> },
  AUS: { label: 'Australia', icon: () => <CodeBadge code="AUS" /> },
  KSA: { label: 'Arabia Saudita', icon: () => <CodeBadge code="KSA" /> },
  QAT: { label: 'Qatar', icon: () => <CodeBadge code="QAT" /> },
  UAE: { label: 'Emiratos Árabes', icon: () => <CodeBadge code="UAE" /> },
  IRQ: { label: 'Irak', icon: () => <CodeBadge code="IRQ" /> },
  MAR: { label: 'Marruecos', icon: () => <CodeBadge code="MAR" /> },
  SEN: { label: 'Senegal', icon: () => <CodeBadge code="SEN" /> },
  TUN: { label: 'Túnez', icon: () => <CodeBadge code="TUN" /> },
  ALG: { label: 'Argelia', icon: () => <CodeBadge code="ALG" /> },
  EGY: { label: 'Egipto', icon: () => <CodeBadge code="EGY" /> },
  NGA: { label: 'Nigeria', icon: () => <CodeBadge code="NGA" /> },
  CIV: { label: 'Costa de Marfil', icon: () => <CodeBadge code="CIV" /> },
  CMR: { label: 'Camerún', icon: () => <CodeBadge code="CMR" /> },
  RSA: { label: 'Sudáfrica', icon: () => <CodeBadge code="RSA" /> },
  MEX: { label: 'México', icon: () => <CodeBadge code="MEX" /> },
  USA: { label: 'EE.UU.', icon: () => <CodeBadge code="USA" /> },
  CAN: { label: 'Canadá', icon: () => <CodeBadge code="CAN" /> },
  CRC: { label: 'Costa Rica', icon: () => <CodeBadge code="CRC" /> },
  PAN: { label: 'Panamá', icon: () => <CodeBadge code="PAN" /> },
  JAM: { label: 'Jamaica', icon: () => <CodeBadge code="JAM" /> },
  HON: { label: 'Honduras', icon: () => <CodeBadge code="HON" /> },
  ARG: { label: 'Argentina', icon: () => <CodeBadge code="ARG" /> },
  BRA: { label: 'Brasil', icon: () => <CodeBadge code="BRA" /> },
  URU: { label: 'Uruguay', icon: () => <CodeBadge code="URU" /> },
  COL: { label: 'Colombia', icon: () => <CodeBadge code="COL" /> },
  ECU: { label: 'Ecuador', icon: () => <CodeBadge code="ECU" /> },
  CHI: { label: 'Chile', icon: () => <CodeBadge code="CHI" /> },
  PAR: { label: 'Paraguay', icon: () => <CodeBadge code="PAR" /> },
  PER: { label: 'Perú', icon: () => <CodeBadge code="PER" /> },
  FRA: { label: 'Francia', icon: () => <CodeBadge code="FRA" /> },
  ESP: { label: 'España', icon: () => <CodeBadge code="ESP" /> },
  POR: { label: 'Portugal', icon: () => <CodeBadge code="POR" /> },
  ENG: { label: 'Inglaterra', icon: () => <CodeBadge code="ENG" /> },
  GER: { label: 'Alemania', icon: () => <CodeBadge code="GER" /> },
  ITA: { label: 'Italia', icon: () => <CodeBadge code="ITA" /> },
  NED: { label: 'Países Bajos', icon: () => <CodeBadge code="NED" /> },
  BEL: { label: 'Bélgica', icon: () => <CodeBadge code="BEL" /> },
  CRO: { label: 'Croacia', icon: () => <CodeBadge code="CRO" /> },
  DEN: { label: 'Dinamarca', icon: () => <CodeBadge code="DEN" /> },
  SUI: { label: 'Suiza', icon: () => <CodeBadge code="SUI" /> },
  POL: { label: 'Polonia', icon: () => <CodeBadge code="POL" /> },
  SRB: { label: 'Serbia', icon: () => <CodeBadge code="SRB" /> },
  SWE: { label: 'Suecia', icon: () => <CodeBadge code="SWE" /> },
  NOR: { label: 'Noruega', icon: () => <CodeBadge code="NOR" /> },
  UKR: { label: 'Ucrania', icon: () => <CodeBadge code="UKR" /> },
  TUR: { label: 'Turquía', icon: () => <CodeBadge code="TUR" /> },
  AUT: { label: 'Austria', icon: () => <CodeBadge code="AUT" /> },
  BIH: { label: 'Bosnia y Herzegovina', icon: () => <CodeBadge code="BIH" /> },
  HAI: { label: 'Haití', icon: () => <CodeBadge code="HAI" /> },
  SCO: { label: 'Escocia', icon: () => <CodeBadge code="SCO" /> },
  CUW: { label: 'Curazao', icon: () => <CodeBadge code="CUW" /> },
  NZL: { label: 'Nueva Zelanda', icon: () => <CodeBadge code="NZL" /> },
  CPV: { label: 'Cabo Verde', icon: () => <CodeBadge code="CPV" /> },
  JOR: { label: 'Jordania', icon: () => <CodeBadge code="JOR" /> },
  COD: { label: 'RD Congo', icon: () => <CodeBadge code="COD" /> },
  UZB: { label: 'Uzbekistán', icon: () => <CodeBadge code="UZB" /> },
  GHA: { label: 'Ghana', icon: () => <CodeBadge code="GHA" /> },
}