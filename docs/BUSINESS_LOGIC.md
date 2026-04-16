# 🧮 Lógica de Negócios (Tabela PRICE)

A lógica central da aplicação matemática encontra-se em `src/lib/finance.ts`. Trata-se de um módulo **100% puro**, funcional e determinístico, o que facilita enormemente os testes unitários.

## 🏦 A Teoria Matemática Implementada
Este simulador adota o sistema de amortização **PRICE** (parcelas constantes) ou assemelhado onde não houver juros.

1. **Juros Simples por prestação:** 
   No mês `M`, os juros cobrados são baseados no saldo devedor do mês `M-1` `(Saldo * Taxa Juros)`.
2. **Parcela:** 
   Fórmula Universal Francesa (PRICE) `PMT = Saldo * [ (i * (1+i)^n) / ( (1+i)^n - 1) ]`.
3. **Amortização:** 
   O restante da parcela que não foi consumido por juros `PMT - Juros`.

## ⚙️ Diferença de Estratégias

Quando o usuário adiciona amortizações em um determinado mês, o Saldo Devedor é instantaneamente encurtado em valor equivalente. Isso gera dois cenários, controlados pela variável `amortizationStrategy`.

### 1. Cenário: Redução de Prazo (`"prazo"`)
A prestação mensal (PMT) do sistema **não** é atualizada. O cliente continua pagando o mesmo valor de parcela fixado no contrato inicial.

**Consequência:** Como o PMT continua alto, mas o saldo devedor despencou (devido à amortização extra), a divisão da prestação muda de equilíbrio. Nos meses seguintes, quase toda a prestação se torna amortização, fulminando o restante da dívida muito mais rapidamente.

*No Loop (TypeScript)*:
```typescript
let currentPmt = initialPmt; // Mantém-se o valor inicial fixo do contrato
```

### 2. Cenário: Redução de Parcela (`"parcela"`)
O usuário diz ao banco "Minha dívida caiu, então quero abater esse bolo em novas prestações, espalhadas pelo restante de meses originais que faltam".

**Consequência:** O prazo da dívida permanece o mesmo, mas a prestação mensal (PMT) cai drasticamente gerando alívio no bolso mensal imediato. Há pouca melhoria de economia de juros a longo prazo comparado ao método anterior.

*No Loop (TypeScript)*:
```typescript
const remainingMonths = months - m + 1;
currentPmt = currentBalance * (i * (1+i)^remainingMonths) / ((1+i)^remainingMonths - 1);
```

## 🛡️ Edge Cases Tratados
- **Juros Zero (`i = 0`)**: As funções matemáticas clássicas quebrarão por conta da divisão por zero. A engine prevê `i === 0` dividindo simplesmente o `Valor Financiado / Meses`.
- **Amortização > Saldo Devedor**: Se uma parcela comum, acoplada à uma amortização massiva extra, ultrapassar a dívida real (ex: falta 200 Reais, e a parcela foi gerada pra 400), a lógica corrige forçando a Amortização ser restrita ao Saldo Atual, zerando-o graciosamente.
