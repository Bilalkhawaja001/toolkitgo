import React, { useMemo, useState } from 'react';
import ErrorMessage from '../../components/ErrorMessage';

const privacy = 'Your data stays in your browser. Nothing is uploaded.';
const money = (value) => Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0';

function EmiCalculator() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);
  const [months, setMonths] = useState(0);
  const result = useMemo(() => {
    const principal = Number(amount);
    const annualRate = Number(rate);
    const totalMonths = Number(years) * 12 + Number(months);
    if (principal <= 0 || annualRate < 0 || totalMonths <= 0) return { error: 'Loan amount positive, rate zero ya positive, aur tenure positive hona chahiye.' };
    const monthlyRate = annualRate / 12 / 100;
    const emi = monthlyRate === 0 ? principal / totalMonths : principal * monthlyRate * ((1 + monthlyRate) ** totalMonths) / (((1 + monthlyRate) ** totalMonths) - 1);
    const totalPayment = emi * totalMonths;
    return { emi, totalPayment, totalInterest: totalPayment - principal, totalMonths };
  }, [amount, rate, years, months]);

  return <div className="tool-card simple-tool"><div className="tool-status-line"><span className="status-ready">Working client-side</span><span>{privacy}</span></div><h2>EMI Calculator</h2><div className="simple-form-grid"><label>Loan amount<input className="form-input" type="number" value={amount} onChange={e=>setAmount(e.target.value)} /></label><label>Annual interest rate %<input className="form-input" type="number" step="0.01" value={rate} onChange={e=>setRate(e.target.value)} /></label><label>Tenure years<input className="form-input" type="number" value={years} onChange={e=>setYears(e.target.value)} /></label><label>Extra months<input className="form-input" type="number" value={months} onChange={e=>setMonths(e.target.value)} /></label></div><ErrorMessage message={result.error} />{!result.error && <div className="result-card-grid"><div><span>Monthly EMI</span><strong>{money(result.emi)}</strong></div><div><span>Total payment</span><strong>{money(result.totalPayment)}</strong></div><div><span>Total interest</span><strong>{money(result.totalInterest)}</strong></div><div><span>Tenure</span><strong>{result.totalMonths} months</strong></div></div>}</div>;
}
export default EmiCalculator;
