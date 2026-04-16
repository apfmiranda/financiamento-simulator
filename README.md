# 🏦 Simulador de Financiamento

> Compare cenários de amortização — **Redução de Prazo** vs **Redução de Parcela** — e descubra a melhor estratégia para o seu bolso.

Um aplicativo web rápido e visual desenvolvido com **Next.js**, focado em simulações interativas da Tabela PRICE. Descubra exatamente quanto de juros você economiza ao fazer amortizações extras.

## 🚀 Funcionalidades

- **Simulação da Tabela PRICE**: Inserção de valor do bem, entrada, taxa de juros, prazo e taxas extras.
- **Amortizações Extras**: Capacidade de adicionar amortizações pontuais (mês a mês).
- **Redução de Prazo**: Cenário onde a amortização extra quita parcelas futuras (de trás pra frente), reduzindo a duração do financiamento e economizando o máximo de juros.
- **Redução de Parcela**: Cenário onde o prazo é fixo, mas a amortização extra recalcula a dívida para baixar o valor da prestação mensal.
- **Gráficos Interativos**: Comparativo visual (via Recharts) do saldo devedor ao longo do tempo.
- **Visão Comparativa**: Dashboards completos comparando lado a lado as duas estratégias de amortização.

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Engine UI**: [React 19](https://react.dev/)
- **Gráficos**: [Recharts 3](https://recharts.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)

## 💻 Instalação e Uso Local

### 1. Clonando o Repositório

```bash
git clone https://github.com/SEU_USUARIO/financiamento-simulator.git
cd financiamento-simulator
```

### 2. Instalação de Dependências

O projeto utiliza `npm`. Para instalar:
```bash
npm install
```

### 3. Rodando em Desenvolvimento

Inicie o servidor local na porta 3000:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador, e a tela principal do simulador já estará ativa.

## 📦 Scripts Disponíveis

Dentro do diretório do projeto, você pode rodar os seguintes comandos:

- `npm run dev` - Roda o servidor web com hot reload.
- `npm run build` - Compila a aplicação para produção, resolvendo tipagens e bundles.
- `npm start` - Roda a versão de produção gerada pelo `build`.
- `npm run lint` - Checa padrões de código usando o ESLint do Next.js.

## 📖 Explore as Documentações Técnicas

Para entender as entranhas matemáticas e arquiteturais do projeto, leia nossas documentações internas:
- 🏗 [Arquitetura do Frontend e UI](./docs/ARCHITECTURE.md)
- 🧮 [Lógica de Negócios e Matemática](./docs/BUSINESS_LOGIC.md)

---
*Feito para simplificar a matemática financeira.*
