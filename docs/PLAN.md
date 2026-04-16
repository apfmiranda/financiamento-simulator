# Projeto: Documentação do Financiamento Simulator

## 📌 Objetivo
Criar uma documentação abrangente, técnica e de arquitetura para o projeto `financiamento-simulator`. O projeto é um simulador de financiamento desenvolvido em Next.js (App Router), React, Recharts e TailwindCSS, permitindo simulações avançadas de amortização (Redução de Prazo vs Redução de Parcela).

## 🚀 Agentes Envolvidos na Próxima Fase
1. **`documentation-writer`**: Responsável por criar o README.md amigável, focado em desenvolvedores e usuários, detalhando instalação e deploy.
2. **`frontend-specialist`**: Responsável por documentar a arquitetura dos componentes (ex: `FinancingSimulator`, `GlassCard`, gráficos Recharts).
3. **`backend-specialist`** (Regra de Negócios): Responsável por documentar a engine matemática em `src/lib/finance.ts` e descrever a arquitetura de amortização (SAC/PRICE).
4. **`test-engineer`**: Responsável por configurar e executar scripts de validação de Markdown e Lint (padrões de documentação).

## 🗂️ Estrutura da Documentação a ser Criada

### 1. `README.md` (Principal)
- O que é o projeto.
- Funcionalidades principais (Simulação Base, Redução de Prazo, Redução de Parcela).
- Preview Visual / Screenshots.
- Stack Tecnológico (React 19, Next.js 15, Recharts, Tailwind V4).
- Instruções de Instalação e Execução local.

### 2. `docs/ARCHITECTURE.md`
- Árvore de Arquivos.
- Explicação do App Router (`src/app/page.tsx`).
- Componentização (`src/components/*`).
- Estilização (Glassmorphism + Tailwind).

### 3. `docs/BUSINESS_LOGIC.md`
- Como funciona a matemática financeira implementada (`src/lib/finance.ts`).
- Fórmulas utilizadas para recalcular parcelas ou prazos com amortizações extras.
- Regras de injeção de "Taxas Extras e Seguros".

## 🛠 Critério de Aceitação
- [ ] O arquivo `README.md` atual do Next.js será substituído pela versão final documentada do projeto.
- [ ] A pasta `docs/` conterá os arquivos técnicos.
- [ ] A tipagem, inputs (props) dos componentes principais e funções estarão limpas e documentadas em seus arquivos.
