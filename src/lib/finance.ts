export interface FinancingInputs {
  assetValue: number;
  downPayment: number;
  monthlyInterestRate: number; // e.g., 1.4
  months: number;
  fees?: number; // Extra fees/insurance
  extraAmortizations?: Record<number, number>; // month -> amount
  amortizationStrategy?: "prazo" | "parcela";
}

export interface AmortizationRow {
  month: number;
  installment: number;
  interest: number;
  amortization: number;
  extraAmortization: number;
  balance: number;
  isCustomInstallment?: boolean;
}

export function calculatePriceAmortization(inputs: FinancingInputs): AmortizationRow[] {
  const { assetValue, downPayment, monthlyInterestRate, months, fees = 0, extraAmortizations = {} } = inputs;
  const financedAmount = assetValue - downPayment + fees;
  
  if (financedAmount <= 0) return [];
  
  const i = monthlyInterestRate / 100;
  
  // Basic Price Installment (PMT)
  const initialPmt = i > 0 
    ? financedAmount * (i * Math.pow(1 + i, months)) / (Math.pow(1 + i, months) - 1)
    : financedAmount / months;
  
  let currentBalance = financedAmount;
  const rows: AmortizationRow[] = [];
  const strategy = inputs.amortizationStrategy || "prazo";
  
  for (let m = 1; m <= months; m++) {
    const interest = currentBalance * i;
    
    // If strategy is "parcela", recalculate PMT for the remaining balance and months
    let currentPmt = initialPmt;
    if (strategy === "parcela" && i > 0) {
      const remainingMonths = months - m + 1;
      currentPmt = currentBalance * (i * Math.pow(1 + i, remainingMonths)) / (Math.pow(1 + i, remainingMonths) - 1);
    } else if (strategy === "parcela" && i === 0) {
      currentPmt = currentBalance / (months - m + 1);
    }
    
    let amortization = currentPmt - interest;
    const extra = extraAmortizations[m] || 0;
    
    // Safety check for last payment
    if (amortization + extra > currentBalance) {
      amortization = currentBalance - extra;
      if (amortization < 0) amortization = 0;
    }
    
    currentBalance = currentBalance - amortization - extra;
    if (currentBalance < 0) currentBalance = 0;
    
    rows.push({
      month: m,
      installment: amortization + interest,
      interest,
      amortization,
      extraAmortization: extra,
      balance: currentBalance,
    });

    if (currentBalance <= 0) break;
  }
  
  return rows;
}

export function summarizeFinancing(rows: AmortizationRow[]) {
  const totalPaid = rows.reduce((acc, row) => acc + row.installment + row.extraAmortization, 0);
  const totalInterest = rows.reduce((acc, row) => acc + row.interest, 0);
  const totalExtra = rows.reduce((acc, row) => acc + row.extraAmortization, 0);
  const durationInMonths = rows.length;
  
  return {
    totalPaid,
    totalInterest,
    totalExtra,
    durationInMonths
  };
}
