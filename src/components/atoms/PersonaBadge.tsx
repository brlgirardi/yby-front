'use client'
// Badge compacto para exibir o override dev da persona ativa.

import Tag from '@/components/atoms/Tag'
import { getManifest } from '@/features/manifests'
import { usePersonaStore } from '@/stores/personaStore'

interface PersonaBadgeProps {
  label?: string
}

export default function PersonaBadge({ label }: PersonaBadgeProps) {
  const persona = usePersonaStore((state) => state.persona)
  const version = usePersonaStore((state) => state.version)
  const isDevOverride = usePersonaStore((state) => state.isDevOverride)

  if (!isDevOverride) {
    return null
  }

  const manifest = getManifest(persona, version)
  const badgeLabel = label ?? manifest?.badges?.dev

  if (!badgeLabel) {
    return null
  }

  return <Tag status="Info" label={badgeLabel} showIcon={false} />
}
