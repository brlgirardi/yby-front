---
name: Design system — sem emojis, sem cards coloridos
description: Regras visuais do Yby Front para painéis e seções — fundo branco, Icon component, sem emojis
type: feedback
---

Nunca usar emojis em código (📥, 💰, ⚠️, etc). Usar sempre `<Icon name="..." />` para marcadores visuais.

**Why:** Emojis fogem completamente do design system do projeto. Quando adicionados a seções de painel, quebram a consistência visual e parecem um dashboard de startup, não uma ferramenta financeira profissional. Bruno corrigiu explicitamente ao ver o resultado.

**How to apply:**
- Seções de painel: label `fontSize:11 fontWeight:700 uppercase` + `<Icon>` à esquerda (mesma cor semântica do label)
- Cor semântica SOMENTE nos valores monetários, nunca no container ou background de seção
- Separadores: `borderBottom: '1px solid #f0f0f0'` — sem `rgba` colorido
- Fundo de seções: sempre `#fff` — sem `#f6ffed`, `#e6f7ff`, etc em containers de painel lateral
- Ícones disponíveis: `trendingUp`, `barChart`, `landmark`, `creditCard`, `users`, `receipt`, `calendar`, `info`, etc (ver `src/components/shared/Icon.tsx`)
