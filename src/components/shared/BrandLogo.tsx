type BrandLogoProps = {
  brand: string
  size?: number
  showLabel?: boolean
}

/**
 * Logo library — todas as logos do produto (bandeiras, adquirentes, registradoras, marca Tupi).
 * Renderiza inline em SVG com viewBox 36×24, fundo branco com borda sutil.
 * Padronizadas para uso em tabelas, listas e referências de marca.
 */

// ─── Bandeiras (Card brands) ──────────────────────────────────────
const CARD_BRANDS: Record<string, React.ReactNode> = {
  Visa: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34.8 0H1.2C.537 0 0 .537 0 1.2V22.8C0 23.463.537 24 1.2 24H34.8C35.463 24 36 23.463 36 22.8V1.2C36 .537 35.463 0 34.8 0Z" fill="white"/>
      <svg x="5.713" y="8.148" width="9.144" height="7.704" viewBox="0 0 9.14286 7.7025">
        <path fillRule="evenodd" clipRule="evenodd" d="M6.97911 0L5.06223 5.29764L4.83561 4.1568L4.83582 4.15722L4.15914.69372C4.15914.69372 4.07754 0 3.20544 0H.0369902L0 .13023C0 .13023.96918.33132 2.10282 1.01103L3.84951 7.7025H5.94423L9.14286 0H6.97911Z" fill="#182E66"/>
      </svg>
      <svg x="14.285" y="8.148" width="3.431" height="7.704" viewBox="0 0 3.42858 7.7025">
        <path fillRule="evenodd" clipRule="evenodd" d="M2.10978 7.7025H0L1.31859 0H3.42858L2.10978 7.7025Z" fill="#182E66"/>
      </svg>
      <svg x="17.716" y="8.148" width="5.713" height="7.704" viewBox="0 0 5.71428 7.7025">
        <path fillRule="evenodd" clipRule="evenodd" d="M5.4417 1.92258L5.71428.32445C5.71428.32445 4.8726 0 3.99516 0C3.04665 0 .79437.420389.79437 2.46339C.79437 4.386 3.43785 4.40988 3.43785 5.41923C3.43785 6.42861 1.06674 6.24828.28437 5.61153L0 7.28211C0 7.28211.85329 7.7025 2.15763 7.7025C3.46179 7.7025 5.42973 7.01757 5.42973 5.1549C5.42973 3.22017 2.76228 3.04005 2.76228 2.19888C2.76228 1.35771 4.62378 1.46577 5.4417 1.92258Z" fill="#182E66"/>
      </svg>
      <svg x="22.856" y="8.148" width="7.431" height="7.704" viewBox="0 0 7.42848 7.7025">
        <path fillRule="evenodd" clipRule="evenodd" d="M3.14286 5.3325L4.24002 2.37L4.85715 5.3325H3.14286ZM7.42848 7.7025L5.88546 0H3.76437C3.04863 0 2.87457.57402 2.87457.57402L0 7.7025H2.00892L2.41095 6.55857H4.86129L5.08728 7.7025H7.42848Z" fill="#182E66"/>
      </svg>
      <svg x="5.713" y="8.148" width="4.572" height="4.147" viewBox="0 0 4.57143 4.1475">
        <path fillRule="evenodd" clipRule="evenodd" d="M4.57143 4.1475L3.93174.6921C3.93174.6921 3.85461 0 3.03018 0H.0349503L0 .1299C0 .1299 1.43973.44421 2.82084 1.62081C4.14087 2.7456 4.57143 4.1475 4.57143 4.1475Z" fill="#182E66"/>
      </svg>
    </svg>
  ),

  Mastercard: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34.8 0H1.2C.537 0 0 .537 0 1.2V22.8C0 23.463.537 24 1.2 24H34.8C35.463 24 36 23.463 36 22.8V1.2C36 .537 35.463 0 34.8 0Z" fill="white"/>
      <svg x="6.52" y="4.906" width="11.48" height="14.191" viewBox="0 0 11.4802 14.1912">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.77008 7.09569C8.77008 4.83216 9.82992 2.81622 11.4802 1.51692C10.2734.56688 8.75037 0 7.09512 0C3.17652 0 0 3.1767 0 7.09569C0 11.0145 3.17652 14.1912 7.09512 14.1912C8.75037 14.1912 10.2734 13.6243 11.4802 12.6743C9.82992 11.375 8.77008 9.35904 8.77008 7.09569Z" fill="#EB001B"/>
      </svg>
      <svg x="18" y="4.906" width="11.48" height="14.191" viewBox="0 0 11.4802 14.1912">
        <path fillRule="evenodd" clipRule="evenodd" d="M11.4802 7.09569C11.4802 11.0145 8.30373 14.1912 4.38513 14.1912C2.72988 14.1912 1.20687 13.6243 0 12.6743C1.65033 11.375 2.71017 9.35904 2.71017 7.09569C2.71017 4.83216 1.65033 2.81622 0 1.51692C1.20687.56688 2.72988 0 4.38513 0C8.30373 0 11.4802 3.1767 11.4802 7.09569Z" fill="#F79E1B"/>
      </svg>
      <svg x="14.897" y="6.422" width="6.209" height="11.157" viewBox="0 0 6.20874 11.1572">
        <path fillRule="evenodd" clipRule="evenodd" d="M0 11.1572H6.20874V0H0V11.1572Z" fill="#FF5F00"/>
      </svg>
    </svg>
  ),

  Master: null, // alias

  Elo: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34.8 0H1.2C.537 0 0 .537 0 1.2V22.8C0 23.463.537 24 1.2 24H34.8C35.463 24 36 23.463 36 22.8V1.2C36 .537 35.463 0 34.8 0Z" fill="black"/>
      <svg x="7.654" y="6.893" width="6.553" height="4.507" viewBox="0 0 6.55341 4.506">
        <path fillRule="evenodd" clipRule="evenodd" d="M.65919 2.25612C.95529 2.15613 1.27203 2.10183 1.60164 2.10183C3.04002 2.10183 4.23984 3.13434 4.51509 4.506L6.55341 4.086C6.08571 1.75479 4.04667 0 1.60164 0C1.04184 0 .50301.0921595 0 .26193L.65919 2.25612Z" fill="#FFF200"/>
      </svg>
      <svg x="4.201" y="8.177" width="3.085" height="7.649" viewBox="0 0 3.08334 7.64832">
        <path fillRule="evenodd" clipRule="evenodd" d="M1.70523 7.64832L3.08334 6.0738C2.46819 5.52324 2.07993 4.71948 2.07993 3.82353C2.07993 2.92827 2.46783 2.12448 3.0828 1.57434L1.70397 0C.65871.9354 0 2.30172 0 3.82353C0 5.34612.65967 6.71295 1.70523 7.64832Z" fill="#00A4E0"/>
      </svg>
      <svg x="7.650" y="12.602" width="6.554" height="4.505" viewBox="0 0 6.55422 4.50315">
        <path fillRule="evenodd" clipRule="evenodd" d="M4.51629 0C4.24008 1.37055 3.04086 2.40114 1.60356 2.40114C1.27377 2.40114.95637 2.34672.66021 2.24646L0 4.24044C.50385 4.41093 1.04292 4.50315 1.60356 4.50315C4.04667 4.50315 6.0846 2.75064 6.55422.42183L4.51629 0Z" fill="#EF4123"/>
      </svg>
      <svg x="16.639" y="8.182" width="15.16" height="7.637" viewBox="0 0 15.1576 7.63655">
        <path fillRule="evenodd" clipRule="evenodd" d="M4.35086 5.83008C4.01426 6.16095 3.55784 6.36255 3.05387 6.35532C2.70845 6.34947 2.38838 6.24495 2.11625 6.0708L1.44161 7.15719C1.90364 7.45236 2.44844 7.62699 3.03575 7.6362C3.89069 7.64904 4.66991 7.30962 5.23649 6.74919L4.35086 5.83008ZM1.2782 4.713C1.27055 4.64082 1.26515 4.56681 1.26719 4.49211C1.28321 3.47838 2.10863 2.66949 3.11093 2.68629C3.65651 2.69367 4.14095 2.94615 4.46843 3.33693L1.2782 4.713ZM3.12932 1.40409C1.42808 1.37772.0260615 2.75118.000381507 4.4718C-.00954849 5.11665.174831 5.71962.499221 6.2208L6.08384 3.80856C5.76962 2.44908 4.57325 1.42698 3.12932 1.40409ZM7.83569 0V6.01671L8.8688 6.44949L8.38007 7.6362L7.35842 7.20702C7.12871 7.10634 6.97325 6.95295 6.85511 6.7797C6.74171 6.60246 6.65762 6.36018 6.65762 6.03327V0H7.83569ZM11.56 2.78043C11.7407 2.71914 11.9341 2.68626 12.1353 2.68626C13.0133 2.68626 13.7455 3.31632 13.9132 4.15377L15.1576 3.89739C14.8723 2.47443 13.6276 1.40325 12.1353 1.40325C11.7934 1.40325 11.4648 1.4595 11.158 1.56303L11.56 2.78043ZM10.0922 6.85428L10.933 5.89332C10.5575 5.55732 10.321 5.06658 10.321 4.51962C10.321 3.9732 10.5575 3.4827 10.9327 3.14694L10.0912 2.18601C9.45332 2.75697 9.05141 3.59124 9.05141 4.51962C9.05141 5.44917 9.45362 6.28314 10.0922 6.85428ZM13.9132 4.8879C13.7446 5.72412 13.0125 6.35364 12.1353 6.35364C11.9339 6.35364 11.7404 6.32022 11.5594 6.25911L11.1565 7.47606C11.4641 7.5801 11.7931 7.63653 12.1353 7.63653C13.6261 7.63653 14.8705 6.56679 15.1573 5.14536L13.9132 4.8879Z" fill="white"/>
      </svg>
    </svg>
  ),

  Hipercard: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34.8 0H1.2C.537 0 0 .537 0 1.2V22.8C0 23.463.537 24 1.2 24H34.8C35.463 24 36 23.463 36 22.8V1.2C36 .537 35.463 0 34.8 0Z" fill="#B3131B"/>
      <text x="18" y="14.5" textAnchor="middle" fontSize="6" fontWeight="700" fontFamily="Arial, sans-serif" fill="white" letterSpacing="0.2">HIPER</text>
    </svg>
  ),

  Amex: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34.8 0H1.2C.537 0 0 .537 0 1.2V22.8C0 23.463.537 24 1.2 24H34.8C35.463 24 36 23.463 36 22.8V1.2C36 .537 35.463 0 34.8 0Z" fill="#0690FF"/>
      <text x="18" y="14.5" textAnchor="middle" fontSize="5" fontWeight="700" fontFamily="Arial, sans-serif" fill="white" letterSpacing="0.3">AMEX</text>
    </svg>
  ),
}

CARD_BRANDS['Master'] = CARD_BRANDS['Mastercard']

// ─── Adquirentes ──────────────────────────────────────────────────
// SVGs estilizados nas cores oficiais (substituem os PNGs anteriores)
const ACQUIRER_BRANDS: Record<string, React.ReactNode> = {
  Adiq: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="2" fill="white"/>
      <text x="18" y="15.5" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Arial, sans-serif" fill="#E30613" letterSpacing="-0.3">adiq</text>
    </svg>
  ),
  Rede: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="2" fill="#E2231A"/>
      <text x="18" y="15.5" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif" fill="white" letterSpacing="0.2">rede</text>
    </svg>
  ),
  Cielo: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="2" fill="white"/>
      <circle cx="9" cy="12" r="4" fill="#FFC72C"/>
      <text x="22" y="15.5" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif" fill="#00A0E3" letterSpacing="-0.2">cielo</text>
    </svg>
  ),
  Getnet: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="2" fill="white"/>
      <text x="18" y="15.5" textAnchor="middle" fontSize="6.5" fontWeight="700" fontFamily="Arial, sans-serif" fill="#FF323C" letterSpacing="-0.2">getnet</text>
    </svg>
  ),
  Stone: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="2" fill="#00A868"/>
      <text x="18" y="15.5" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif" fill="white" letterSpacing="0.2">stone</text>
    </svg>
  ),
  PagSeguro: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="2" fill="#FFC600"/>
      <text x="18" y="15.5" textAnchor="middle" fontSize="5.5" fontWeight="700" fontFamily="Arial, sans-serif" fill="#1F1F1F" letterSpacing="0">PagSeguro</text>
    </svg>
  ),
}

// ─── Registradoras ────────────────────────────────────────────────
const REGISTRADORA_BRANDS: Record<string, React.ReactNode> = {
  Núclea: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="2" fill="white"/>
      <circle cx="8" cy="12" r="3.5" fill="none" stroke="#0064B6" strokeWidth="1.5"/>
      <text x="22" y="15" textAnchor="middle" fontSize="6" fontWeight="700" fontFamily="Arial, sans-serif" fill="#0064B6" letterSpacing="-0.2">Núclea</text>
    </svg>
  ),
  Nuclea: null, // alias
  CIP: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="2" fill="#0050A0"/>
      <text x="18" y="15.5" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Arial, sans-serif" fill="white" letterSpacing="0.5">CIP</text>
    </svg>
  ),
  CERC: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="2" fill="#1B3A6B"/>
      <text x="18" y="15.5" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif" fill="white" letterSpacing="0.4">CERC</text>
    </svg>
  ),
  TAG: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="2" fill="#FF6B35"/>
      <text x="18" y="15.5" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Arial, sans-serif" fill="white" letterSpacing="0.4">TAG</text>
    </svg>
  ),
}

REGISTRADORA_BRANDS['Nuclea'] = REGISTRADORA_BRANDS['Núclea']

// ─── Marca Tupi (produto) ─────────────────────────────────────────
const PRODUCT_BRANDS: Record<string, React.ReactNode> = {
  Tupi: (
    // Logo simplificada da Tupi/Yby — usa o SVG completo via /logo-tupi.svg
    <svg viewBox="0 0 65 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="32" y="14" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif" fill="#37CF84">tupi</text>
    </svg>
  ),
  Yby: (
    <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="2" fill="white"/>
      <text x="18" y="15.5" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Arial, sans-serif" fill="#37CF84" letterSpacing="0.2">Yby</text>
    </svg>
  ),
}

// ─── Resolver de logo ─────────────────────────────────────────────
const ALL_BRANDS: Record<string, React.ReactNode> = {
  ...CARD_BRANDS,
  ...ACQUIRER_BRANDS,
  ...REGISTRADORA_BRANDS,
  ...PRODUCT_BRANDS,
}

export const BRAND_CATEGORIES = {
  bandeiras: ['Visa', 'Mastercard', 'Elo', 'Hipercard', 'Amex'],
  adquirentes: ['Adiq', 'Rede', 'Cielo', 'Getnet', 'Stone', 'PagSeguro'],
  registradoras: ['Núclea', 'CIP', 'CERC', 'TAG'],
  produto: ['Tupi', 'Yby'],
}

export default function BrandLogo({ brand, size = 20, showLabel = false }: BrandLogoProps) {
  const h = size
  const w = Math.round(size * 1.6)

  const svg = ALL_BRANDS[brand]
  if (svg) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: w, height: h,
          background: '#fff',
          border: '1px solid #D9D9D9',
          borderRadius: 3, overflow: 'hidden', flexShrink: 0,
        }}>
          <span style={{ display: 'flex', width: '100%', height: '100%' }}>{svg}</span>
        </span>
        {showLabel && <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.85)', fontWeight: 500 }}>{brand}</span>}
      </span>
    )
  }

  return <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', fontWeight: 500 }}>{brand}</span>
}
