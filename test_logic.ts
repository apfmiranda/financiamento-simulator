import { calculatePriceAmortization } from "./src/lib/finance";

// Dados da Planilha Excel do Usuário
const excelInputs = {
  assetValue: 136800,
  downPayment: 43610,
  monthlyInterestRate: 1.4,
  months: 60,
  fees: 4554.58,
};

// Valores esperados extraídos da planilha (Linha 12 / Mês 1)
const expectedMonth1 = {
  installment: 2418.71,
  interest: 1368.42,
  amortization: 1050.28,
  balance: 96694.30
};

export function runTests() {
  console.log("🧪 Iniciando Testes de Validação PRICE...");
  
  const results = calculatePriceAmortization(excelInputs);
  const row1 = results[0];

  const tolerance = 0.5; // Tolerância para arredondamentos monetários

  const checks = [
    { name: "Parcela 1", actual: row1.installment, expected: expectedMonth1.installment },
    { name: "Juros 1", actual: row1.interest, expected: expectedMonth1.interest },
    { name: "Amortização 1", actual: row1.amortization, expected: expectedMonth1.amortization },
    { name: "Saldo Após 1", actual: row1.balance, expected: expectedMonth1.balance },
  ];

  let passed = true;
  checks.forEach(check => {
    const diff = Math.abs(check.actual - check.expected);
    if (diff > tolerance) {
      console.error(`❌ FALHA: ${check.name} | Esperado: ${check.expected} | Obtido: ${check.actual.toFixed(2)} (Diff: ${diff.toFixed(2)})`);
      passed = false;
    } else {
      console.log(`✅ SUCESSO: ${check.name} | Valor: ${check.actual.toFixed(2)}`);
    }
  });

  if (passed) {
    console.log("\n🚀 TODOS OS TESTES PASSARAM! Lógica sincronizada com Excel.");
  } else {
    console.error("\n⚠️ PROBLEMAS NA LOGICA. Verificar arredondamentos.");
  }
}

runTests();
