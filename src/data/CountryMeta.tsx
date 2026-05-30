import React from 'react'
import type { TFunction } from 'i18next'

const CodeBadge = ({ code }: { code: string }) => (
  <span className="text-[10px] font-bold bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded tracking-wider border border-neutral-700">
    {code}
  </span>
)

type CountryMeta = {
  label: string
  icon: React.ComponentType
}

export function getCountryMeta(t: TFunction): Record<string, CountryMeta> {
  return {
    FWC: { label: t('countries.FWC'), icon: () => <CodeBadge code="FWC" /> },
    CC:  { label: t('countries.CC'),  icon: () => <CodeBadge code="CC" />  },
    JPN: { label: t('countries.JPN'), icon: () => <CodeBadge code="JPN" /> },
    KOR: { label: t('countries.KOR'), icon: () => <CodeBadge code="KOR" /> },
    CZE: { label: t('countries.CZE'), icon: () => <CodeBadge code="CZE" /> },
    IRN: { label: t('countries.IRN'), icon: () => <CodeBadge code="IRN" /> },
    AUS: { label: t('countries.AUS'), icon: () => <CodeBadge code="AUS" /> },
    KSA: { label: t('countries.KSA'), icon: () => <CodeBadge code="KSA" /> },
    QAT: { label: t('countries.QAT'), icon: () => <CodeBadge code="QAT" /> },
    UAE: { label: t('countries.UAE'), icon: () => <CodeBadge code="UAE" /> },
    IRQ: { label: t('countries.IRQ'), icon: () => <CodeBadge code="IRQ" /> },
    MAR: { label: t('countries.MAR'), icon: () => <CodeBadge code="MAR" /> },
    SEN: { label: t('countries.SEN'), icon: () => <CodeBadge code="SEN" /> },
    TUN: { label: t('countries.TUN'), icon: () => <CodeBadge code="TUN" /> },
    ALG: { label: t('countries.ALG'), icon: () => <CodeBadge code="ALG" /> },
    EGY: { label: t('countries.EGY'), icon: () => <CodeBadge code="EGY" /> },
    NGA: { label: t('countries.NGA'), icon: () => <CodeBadge code="NGA" /> },
    CIV: { label: t('countries.CIV'), icon: () => <CodeBadge code="CIV" /> },
    CMR: { label: t('countries.CMR'), icon: () => <CodeBadge code="CMR" /> },
    RSA: { label: t('countries.RSA'), icon: () => <CodeBadge code="RSA" /> },
    MEX: { label: t('countries.MEX'), icon: () => <CodeBadge code="MEX" /> },
    USA: { label: t('countries.USA'), icon: () => <CodeBadge code="USA" /> },
    CAN: { label: t('countries.CAN'), icon: () => <CodeBadge code="CAN" /> },
    CRC: { label: t('countries.CRC'), icon: () => <CodeBadge code="CRC" /> },
    PAN: { label: t('countries.PAN'), icon: () => <CodeBadge code="PAN" /> },
    JAM: { label: t('countries.JAM'), icon: () => <CodeBadge code="JAM" /> },
    HON: { label: t('countries.HON'), icon: () => <CodeBadge code="HON" /> },
    ARG: { label: t('countries.ARG'), icon: () => <CodeBadge code="ARG" /> },
    BRA: { label: t('countries.BRA'), icon: () => <CodeBadge code="BRA" /> },
    URU: { label: t('countries.URU'), icon: () => <CodeBadge code="URU" /> },
    COL: { label: t('countries.COL'), icon: () => <CodeBadge code="COL" /> },
    ECU: { label: t('countries.ECU'), icon: () => <CodeBadge code="ECU" /> },
    CHI: { label: t('countries.CHI'), icon: () => <CodeBadge code="CHI" /> },
    PAR: { label: t('countries.PAR'), icon: () => <CodeBadge code="PAR" /> },
    PER: { label: t('countries.PER'), icon: () => <CodeBadge code="PER" /> },
    FRA: { label: t('countries.FRA'), icon: () => <CodeBadge code="FRA" /> },
    ESP: { label: t('countries.ESP'), icon: () => <CodeBadge code="ESP" /> },
    POR: { label: t('countries.POR'), icon: () => <CodeBadge code="POR" /> },
    ENG: { label: t('countries.ENG'), icon: () => <CodeBadge code="ENG" /> },
    GER: { label: t('countries.GER'), icon: () => <CodeBadge code="GER" /> },
    ITA: { label: t('countries.ITA'), icon: () => <CodeBadge code="ITA" /> },
    NED: { label: t('countries.NED'), icon: () => <CodeBadge code="NED" /> },
    BEL: { label: t('countries.BEL'), icon: () => <CodeBadge code="BEL" /> },
    CRO: { label: t('countries.CRO'), icon: () => <CodeBadge code="CRO" /> },
    DEN: { label: t('countries.DEN'), icon: () => <CodeBadge code="DEN" /> },
    SUI: { label: t('countries.SUI'), icon: () => <CodeBadge code="SUI" /> },
    POL: { label: t('countries.POL'), icon: () => <CodeBadge code="POL" /> },
    SRB: { label: t('countries.SRB'), icon: () => <CodeBadge code="SRB" /> },
    SWE: { label: t('countries.SWE'), icon: () => <CodeBadge code="SWE" /> },
    NOR: { label: t('countries.NOR'), icon: () => <CodeBadge code="NOR" /> },
    UKR: { label: t('countries.UKR'), icon: () => <CodeBadge code="UKR" /> },
    TUR: { label: t('countries.TUR'), icon: () => <CodeBadge code="TUR" /> },
    AUT: { label: t('countries.AUT'), icon: () => <CodeBadge code="AUT" /> },
    BIH: { label: t('countries.BIH'), icon: () => <CodeBadge code="BIH" /> },
    HAI: { label: t('countries.HAI'), icon: () => <CodeBadge code="HAI" /> },
    SCO: { label: t('countries.SCO'), icon: () => <CodeBadge code="SCO" /> },
    CUW: { label: t('countries.CUW'), icon: () => <CodeBadge code="CUW" /> },
    NZL: { label: t('countries.NZL'), icon: () => <CodeBadge code="NZL" /> },
    CPV: { label: t('countries.CPV'), icon: () => <CodeBadge code="CPV" /> },
    JOR: { label: t('countries.JOR'), icon: () => <CodeBadge code="JOR" /> },
    COD: { label: t('countries.COD'), icon: () => <CodeBadge code="COD" /> },
    UZB: { label: t('countries.UZB'), icon: () => <CodeBadge code="UZB" /> },
    GHA: { label: t('countries.GHA'), icon: () => <CodeBadge code="GHA" /> },
  }
}