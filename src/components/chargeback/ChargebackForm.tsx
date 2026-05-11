'use client'

import React, { useState } from 'react'
import Input from '@/components/atoms/Input'
import AppSelect from '@/components/ui/AppSelect'
import Button from '@/components/atoms/Button'
import Tag from '@/components/atoms/Tag'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SectionCard({ title, badge, children }: { title: string; badge?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: 'rgba(0,0,0,0.85)' }}>{title}</span>
        {badge}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  )
}

function InfoBadge({ count, label }: { count: number; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#E6F7FF', border: '1px solid #91D5FF', borderRadius: 99, padding: '1px 8px', fontSize: 12, color: '#003A8C' }}>
      <span style={{ fontWeight: 600 }}>{count}</span> {label}
    </span>
  )
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)', fontFamily: 'Roboto, sans-serif', display: 'block', marginBottom: 4 }}>
      {children}{required && <span style={{ color: '#FF4D4F', marginLeft: 2 }}>*</span>}
    </label>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)', fontFamily: 'Roboto, sans-serif', padding: '5px 0' }}>{value || '—'}</div>
    </div>
  )
}

function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
      {children}
    </div>
  )
}

function Grid3({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 24px' }}>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ borderBottom: '1px solid #f0f0f0', margin: '16px 0' }} />
}

// ─── Dispute Item ─────────────────────────────────────────────────────────────

interface DisputeData {
  id: string
  number: string
  status: 'Não associado' | 'Em Disputa' | 'Em processo'
  valorContestado: string
  dataInicio: string
  grupoRazao: string
  codigoRazao: string
  codigoDisputa: string
  reporteFraude: string
  parcelaDisputa: string
  faseCiclo: string
  mensagem: string
  arquivos: File[]
}

function DisputeItem({ dispute, index }: { dispute: DisputeData; index: number }) {
  const [expanded, setExpanded] = useState(true)

  const statusVariant = dispute.status === 'Em processo' ? 'Em análise' : dispute.status === 'Em Disputa' ? 'Chargeback' : 'Pendente'
  const statusLabel = dispute.status

  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', cursor: 'pointer', background: '#fafafa' }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, background: '#f0f0f0', borderRadius: 4, fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.65)' }}>
          {index + 1}
        </span>
        <Tag status={statusVariant} label={statusLabel} />
        <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', flex: 1 }}>
          Disputa {dispute.number} Chargeback
        </span>
        {dispute.status === 'Em processo' && (
          <Tag status="Em análise" label="Em processo" />
        )}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {expanded && (
        <div style={{ padding: 16 }}>
          <Grid2>
            <div>
              <FieldLabel required>Valor Contestado</FieldLabel>
              <div style={{ display: 'flex', gap: 8 }}>
                <AppSelect style={{ width: 70 }} defaultValue="BRL" options={[{ label: 'BRL', value: 'BRL' }, { label: 'USD', value: 'USD' }]} />
                <Input placeholder="Insira o valor aqui" style={{ flex: 1 }} />
              </div>
            </div>
            <div>
              <FieldLabel>Data de Início da Disputa</FieldLabel>
              <Input type="date" placeholder="DD/MM/AAAA" suffix="calendar" />
            </div>
          </Grid2>

          <Divider />

          <Grid2>
            <div>
              <FieldLabel required>Grupo de Código de Razão</FieldLabel>
              <AppSelect placeholder="Selecione uma opção" options={[]} style={{ width: '100%' }} />
            </div>
            <div>
              <FieldLabel required>Código de Razão</FieldLabel>
              <AppSelect placeholder="Selecione uma opção" options={[]} style={{ width: '100%' }} />
            </div>
          </Grid2>

          <Divider />

          <Grid2>
            <div>
              <FieldLabel>Código da Disputa</FieldLabel>
              <Input placeholder="Insira o valor aqui" />
            </div>
            <div>
              <FieldLabel>Reporte de fraude?</FieldLabel>
              <AppSelect defaultValue="nao" options={[{ label: 'Não', value: 'nao' }, { label: 'Sim', value: 'sim' }]} style={{ width: '100%' }} />
            </div>
          </Grid2>

          <Divider />

          <Grid2>
            <div>
              <FieldLabel required>Parcela em disputa</FieldLabel>
              <AppSelect placeholder="Associe uma parcela" options={[]} style={{ width: '100%' }} />
            </div>
            <div>
              <FieldLabel>Fase do ciclo</FieldLabel>
              <AppSelect defaultValue="1cb" options={[{ label: '1º - Chargeback', value: '1cb' }]} style={{ width: '100%' }} />
            </div>
          </Grid2>

          <Divider />

          <div style={{ marginBottom: 16 }}>
            <FieldLabel>Mensagem Recebida</FieldLabel>
            <textarea
              placeholder="Insira aqui uma mensagem sobre esta etapa"
              style={{ width: '100%', minHeight: 80, resize: 'vertical', border: '1px solid #D9D9D9', borderRadius: 2, padding: '8px 12px', fontSize: 14, fontFamily: 'Roboto, sans-serif', color: 'rgba(0,0,0,0.85)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <FieldLabel>Arquivos</FieldLabel>
            <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', marginBottom: 8 }}>Sem arquivos adicionados</div>
            <Button variant="secondary" size="sm">Anexar</Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Clearing Records Table ────────────────────────────────────────────────────

interface ClearingRecord {
  id: number
  arn: string
  valor: string
  data: string
  statusEmissor: string
}

function ClearingTable({ records }: { records: ClearingRecord[] }) {
  const headerStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.45)', padding: '8px 12px', borderBottom: '1px solid #f0f0f0', textAlign: 'left', whiteSpace: 'nowrap' }
  const cellStyle: React.CSSProperties = { fontSize: 13, color: 'rgba(0,0,0,0.85)', padding: '10px 12px', borderBottom: '1px solid #f0f0f0', fontFamily: 'Roboto, sans-serif' }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={headerStyle}>#</th>
            <th style={headerStyle}>Disputa</th>
            <th style={headerStyle}>ARN*</th>
            <th style={headerStyle}>Valor (R$)*</th>
            <th style={headerStyle}>Data*</th>
            <th style={headerStyle}>Status Emissor*</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={r.id}>
              <td style={cellStyle}>{i + 1}</td>
              <td style={{ ...cellStyle }}>
                <Tag status="Pendente" label="Não associado" />
              </td>
              <td style={cellStyle}>{r.arn}</td>
              <td style={cellStyle}>{r.valor}</td>
              <td style={cellStyle}>{r.data}</td>
              <td style={cellStyle}>
                <AppSelect defaultValue={r.statusEmissor} options={[{ label: r.statusEmissor, value: r.statusEmissor }]} style={{ width: 120 }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Payouts Table ────────────────────────────────────────────────────────────

interface PayoutRecord {
  id: number
  arn: string
  valor: string
  data: string
  statusVariejista: string
}

function PayoutsTable({ records }: { records: PayoutRecord[] }) {
  const headerStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.45)', padding: '8px 12px', borderBottom: '1px solid #f0f0f0', textAlign: 'left', whiteSpace: 'nowrap' }
  const cellStyle: React.CSSProperties = { fontSize: 13, color: 'rgba(0,0,0,0.85)', padding: '10px 12px', borderBottom: '1px solid #f0f0f0', fontFamily: 'Roboto, sans-serif' }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={headerStyle}>#</th>
            <th style={headerStyle}>ARN*</th>
            <th style={headerStyle}>Valor (R$)</th>
            <th style={headerStyle}>Data</th>
            <th style={headerStyle}>Status Varejista*</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={r.id}>
              <td style={cellStyle}>{i + 1}</td>
              <td style={cellStyle}>{r.arn}</td>
              <td style={cellStyle}>{r.valor}</td>
              <td style={cellStyle}>{r.data}</td>
              <td style={cellStyle}>
                <Tag status="Liquidado" label={r.statusVariejista} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ChargebackFormProps {
  onCancel?: () => void
  onReturnForAnalysis?: () => void
  onSendForExecution?: () => void
}

const MOCK_DISPUTES: DisputeData[] = [
  {
    id: '1',
    number: '12902102921',
    status: 'Não associado',
    valorContestado: '',
    dataInicio: '',
    grupoRazao: '',
    codigoRazao: '',
    codigoDisputa: '',
    reporteFraude: 'nao',
    parcelaDisputa: '',
    faseCiclo: '1cb',
    mensagem: '',
    arquivos: [],
  },
  {
    id: '2',
    number: '12902102921',
    status: 'Em processo',
    valorContestado: '',
    dataInicio: '',
    grupoRazao: '',
    codigoRazao: '',
    codigoDisputa: '',
    reporteFraude: 'nao',
    parcelaDisputa: '',
    faseCiclo: '1cb',
    mensagem: '',
    arquivos: [],
  },
]

const MOCK_CLEARING: ClearingRecord[] = [
  { id: 1, arn: '98432100678910987654321', valor: '93,00', data: '10/12/2024', statusEmissor: 'Liquidada' },
  { id: 2, arn: '98432100678910987654321', valor: '93,00', data: '10/12/2024', statusEmissor: 'Liquidada' },
]

const MOCK_PAYOUTS: PayoutRecord[] = [
  { id: 1, arn: '98432100678910987654321', valor: '93,00', data: '10/01/2025', statusVariejista: 'Liquidada' },
]

export default function ChargebackForm({ onCancel, onReturnForAnalysis, onSendForExecution }: ChargebackFormProps) {
  const [disputes, setDisputes] = useState<DisputeData[]>(MOCK_DISPUTES)

  function addDispute() {
    setDisputes(prev => [...prev, {
      id: String(Date.now()),
      number: String(Math.floor(Math.random() * 99999999999)),
      status: 'Não associado',
      valorContestado: '',
      dataInicio: '',
      grupoRazao: '',
      codigoRazao: '',
      codigoDisputa: '',
      reporteFraude: 'nao',
      parcelaDisputa: '',
      faseCiclo: '1cb',
      mensagem: '',
      arquivos: [],
    }])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Roboto, sans-serif' }}>

      {/* 1. Dados da Transação */}
      <SectionCard title="Dados da Transação">
        <Grid3>
          <div>
            <FieldLabel required>Arranjo (bandeira)</FieldLabel>
            <AppSelect placeholder="Selecione uma opção" options={[]} style={{ width: '100%' }} />
          </div>
          <div>
            <FieldLabel>Identificador da Transação</FieldLabel>
            <Input placeholder="Insira os dados aqui" />
          </div>
          <div>
            <FieldLabel required>Valor Original</FieldLabel>
            <div style={{ display: 'flex', gap: 8 }}>
              <AppSelect style={{ width: 70 }} defaultValue="BRL" options={[{ label: 'BRL', value: 'BRL' }]} />
              <Input placeholder="372,00" style={{ flex: 1 }} />
            </div>
          </div>
        </Grid3>

        <Divider />

        <Grid3>
          <div>
            <FieldLabel required>Data da Transação</FieldLabel>
            <Input type="date" placeholder="DD/MM/AAAA" suffix="calendar" />
          </div>
          <div>
            <FieldLabel required>Código de Autorização</FieldLabel>
            <Input placeholder="COD123" />
          </div>
          <div>
            <FieldLabel required>Número do Cartão</FieldLabel>
            <Input placeholder="123456 ******* 9564" />
          </div>
        </Grid3>

        <Divider />

        <Grid3>
          <div>
            <FieldLabel required>Número de Referência (ARN)</FieldLabel>
            <Input placeholder="984321006789109876543232" />
          </div>
          <div>
            <FieldLabel required>Número do Comprovante (NSU)</FieldLabel>
            <Input placeholder="10234567" />
          </div>
          <div>
            <FieldLabel>ID do Terminal</FieldLabel>
            <Input placeholder="TER123456" />
          </div>
        </Grid3>

        <Divider />

        <Grid3>
          <div>
            <FieldLabel required>Código da Autorização</FieldLabel>
            <Input placeholder="COD123" />
          </div>
          <div>
            <FieldLabel required>Método de Captura</FieldLabel>
            <AppSelect placeholder="Contactless - Chip" options={[{ label: 'Contactless - Chip', value: 'contactless-chip' }]} style={{ width: '100%' }} />
          </div>
          <div>
            <FieldLabel>Indicador de E-commerce</FieldLabel>
            <AppSelect placeholder="Selecione uma opção" options={[]} style={{ width: '100%' }} />
          </div>
        </Grid3>

        <Divider />

        <Grid2>
          <div>
            <FieldLabel>Tipo de Parcelamento</FieldLabel>
            <AppSelect defaultValue="via-adquirente" options={[{ label: 'Via adquirente', value: 'via-adquirente' }]} style={{ width: '100%' }} />
          </div>
          <div>
            <FieldLabel required>Plano de Pagamento</FieldLabel>
            <AppSelect defaultValue="4x" options={[{ label: '4x', value: '4x' }, { label: '12x', value: '12x' }]} style={{ width: '100%' }} />
          </div>
        </Grid2>
      </SectionCard>

      {/* 2. Novas disputas */}
      <SectionCard title="Novas disputas" badge={<InfoBadge count={disputes.length} label="novas disputas" />}>
        {disputes.map((d, i) => (
          <DisputeItem key={d.id} dispute={d} index={i} />
        ))}
        <Button variant="secondary" onClick={addDispute} style={{ width: '100%', marginTop: 4 }}>
          Adicionar disputa
        </Button>
      </SectionCard>

      {/* 3. Lista de cupons (Clearing records) */}
      <SectionCard title="Lista de cupons (Clearing records)" badge={<InfoBadge count={1} label="parcela não recebida" />}>
        <ClearingTable records={MOCK_CLEARING} />
      </SectionCard>

      {/* 4. Lista de Payouts */}
      <SectionCard title="Lista de Payouts">
        <PayoutsTable records={MOCK_PAYOUTS} />
      </SectionCard>

      {/* 5. Dados do Voucher */}
      <SectionCard title="Dados do Voucher">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '24px 0' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D9D9D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" />
            <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(0,0,0,0.65)' }}>Sem voucher associado.</span>
          <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>Esse chargeback não tem nenhum voucher associado à transação.</span>
          <Button variant="secondary" size="sm" style={{ marginTop: 4 }}>Registrar voucher</Button>
        </div>
      </SectionCard>

      {/* 6. Dados do Estabelecimento comercial */}
      <SectionCard title="Dados do Estabelecimento comercial">
        <Grid2>
          <div>
            <FieldLabel required>CPF/CNPJ</FieldLabel>
            <Input placeholder="83.377.141/0001-55" />
          </div>
          <div>
            <FieldLabel required>ID do Estabelecimento comercial</FieldLabel>
            <Input placeholder="MD1212" />
          </div>
        </Grid2>
        <Divider />
        <Grid2>
          <div>
            <FieldLabel required>Razão Social (Nome da Empresa)</FieldLabel>
            <Input placeholder="NZY Importação e Com. Eletrônico LTDA" />
          </div>
          <div>
            <FieldLabel required>Categoria MCC do Estabelecimento comercial</FieldLabel>
            <AppSelect placeholder="5611 - Lojas de roupas e acessórios" options={[{ label: '5611 - Lojas de roupas e acessórios', value: '5611' }]} style={{ width: '100%' }} />
          </div>
        </Grid2>
        <Divider />
        <Grid2>
          <div>
            <FieldLabel required>E-mail</FieldLabel>
            <Input placeholder="financeiro@nzyimport.com" type="email" />
          </div>
          <div>
            <FieldLabel>Telefone</FieldLabel>
            <Input placeholder="(11) 9 9165-5698" />
          </div>
        </Grid2>
        <Divider />
        <div style={{ maxWidth: 200 }}>
          <FieldLabel>País</FieldLabel>
          <AppSelect defaultValue="brasil" options={[{ label: 'Brasil', value: 'brasil' }]} style={{ width: '100%' }} />
        </div>
      </SectionCard>

      {/* 7. Dados do Parceiro (opcional) */}
      <SectionCard title="Dados do Parceiro (opcional)">
        <Grid2>
          <div>
            <FieldLabel>CPF/CNPJ</FieldLabel>
            <Input placeholder="91.382.852/0001-46" />
          </div>
          <div>
            <FieldLabel>Nome do Parceiro</FieldLabel>
            <Input placeholder="Hub Payments Ltda" />
          </div>
        </Grid2>
        <Divider />
        <Grid2>
          <div>
            <FieldLabel>E-mail</FieldLabel>
            <Input placeholder="info@hubpayments.com" type="email" />
          </div>
          <div>
            <FieldLabel>Telefone</FieldLabel>
            <Input placeholder="(21) 3205-5502" />
          </div>
        </Grid2>
        <Divider />
        <div style={{ maxWidth: 200 }}>
          <FieldLabel>ID do Parceiro</FieldLabel>
          <Input placeholder="PAR3654" />
        </div>
      </SectionCard>

      {/* 8. Detalhes do Emissor */}
      <SectionCard title="Detalhes do Emissor">
        <Grid2>
          <ReadOnlyField label="Código do Emissor" value="17050" />
          <ReadOnlyField label="Nome do Emissor" value="NU PAGAMENTOS SA" />
        </Grid2>
      </SectionCard>

      {/* 9. Detalhes do Adquirente */}
      <SectionCard title="Detalhes do Adquirente">
        <Grid2>
          <ReadOnlyField label="Código do Adquirente" value="32201" />
          <ReadOnlyField label="Nome do Adquirente" value="DOCK S/A" />
        </Grid2>
      </SectionCard>

      {/* 10. Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 0', borderTop: '1px solid #f0f0f0' }}>
        <Button variant="secondary" onClick={onCancel}>Sair</Button>
        <Button variant="secondary" onClick={onReturnForAnalysis}>Devolver para análise</Button>
        <Button variant="primary" onClick={onSendForExecution}>Enviar para Execução</Button>
      </div>

    </div>
  )
}
