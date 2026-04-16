# 🏗️ Arquitetura do Frontend

O projeto `financiamento-simulator` foi construído visando performance, tipagem rigorosa estrita e uma interface estética (Glassmorphism) com micro-interações fluidas. Foi estruturado utilizando a mentalidade de *Component-Driven Development*.

## 📂 Visão Geral de Diretórios

```text
src/
 ├── app/
 │    └── page.tsx               # Entrypoint (Home) contendo layout global e background orbs
 ├── components/
 │    ├── FinancingSimulator.tsx # Mega-componente principal que orquestra estados e charts
 │    └── GlassCard.tsx          # Componente reutilizável UI com blur e bordas suaves
 └── lib/
      ├── finance.ts             # Funções puras que lidam com cálculos da tabela
      └── utils.ts               # Funções utilitárias (ex: formatação de moeda)
```

## 🧩 Arquitetura de Componentes

### 1. `app/page.tsx`
Configurado como um componente passivo. Ele gera a casca visual da página — os orbs animados brilhantes e a textura de ruído por cima do background escuro. Seu único trabalho interativo é renderizar o `<FinancingSimulator />`.

### 2. `FinancingSimulator.tsx`
Este é o cérebro visual e interativo da aplicação, marcado com `"use client"`.
Seus principais papéis são:
- Gerenciar o **estado** da entrada (`inputs`), que contém os valores simulados pelo usuário e o dicionário `extraAmortizations`.
- Utilizar os Hooks `useMemo` de forma proficiente para gerar as tabelas pesadas (*baseData*, *prazoData*, *parcelaData*) apenas quando os dados mudarem, impedindo o app de recalcular milhares de linhas em renders irrelevantes.
- Compor dinamicamente os gráficos usando o `<AreaChart>` e `<BarChart>` da biblioteca **Recharts**, desenhando as áreas sombreadas com degradês em SVG.

### 3. Componentes de Isolamento (`GlassCard`)
Todos os cartões e quadros utilizam o `GlassCard` wrapper, garantindo extrema consistência visual e um design coeso estilo *glassmorphism*. O design token dominante utiliza as cores `text-accent` (ciano) para *Redução de Prazo* e `text-amber-400` para *Redução de Parcela*.

## 🎨 Token Colors
As cores essenciais estão mapeadas no Tailwind (provavelmente injetadas globalmente):
- **Accent** (Principal): Ciano (`#00f2ff` / classe `accent`).
- **Accent Secondary**: Laranja/Dourado (`#f59e0b` / classe `amber-400`).
- **Base Layer**: Background escuro, texturas de ruído translúcidas e brancos desbotados (opacity 20-40) para não cansar os olhos na leitura de muitos dados. 

## 🔄 Fluxo de Estado
1. O usuário digita em `InputField` -> Modifica o state `inputs` associado.
2. O React detecta mudança nos `inputs` -> Dispara cálculos puramente via `useMemo`.
3. Os resultados são repassados ao componente de visualização ativo (Gráficos ou Tabelas) com base na aba `activeTab` gerenciada pelo layout visual.
