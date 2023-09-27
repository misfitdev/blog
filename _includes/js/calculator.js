function initialDepositValue(shares, sellPrice, strikePrice) {
  return shares * (sellPrice - strikePrice);
}

function futureValueOfSavings(savings, returnRate, years) {
  return savings * Math.pow((1 + returnRate), years);
}

function futureValueOfContributions(monthlyContribution, returnRate, contributionYears) {
  return monthlyContribution * 12 * (Math.pow((1 + returnRate), contributionYears) - 1) / returnRate;
}

function futureValueOfWithdrawals(withdrawal, returnRate, years) {
  return withdrawal * (1 - Math.pow((1 + returnRate), -years)) / returnRate;
}

function calculateRetirement() {
  const withdrawal = parseFloat(document.getElementById('withdrawal').value);
  const monthlyContribution = parseFloat(document.getElementById('monthly_contribution').value);
  const returnRate = parseFloat(document.getElementById('return_rate').value);
  const startAge = parseInt(document.getElementById('start_age').value);
  const endAge = parseInt(document.getElementById('end_age').value);
  const contributionEndAge = parseInt(document.getElementById('contribution_end_age').value);
  const shares = parseInt(document.getElementById('shares').value);
  const sellPrice = parseFloat(document.getElementById('sell_price').value);
  const strikePrice = parseFloat(document.getElementById('strike_price').value);

  const years = endAge - startAge;
  const contributionYears = contributionEndAge - startAge;
  const savings = initialDepositValue(shares, sellPrice, strikePrice);
  const amountAtEnd = (
    futureValueOfSavings(savings, returnRate, years) +
    futureValueOfContributions(monthlyContribution, returnRate, contributionYears) -
    futureValueOfWithdrawals(withdrawal, returnRate, years)
  );

  document.getElementById('result').innerText = `
    Initial Deposit Value: $${savings.toFixed(2)}
    Amount at End: $${amountAtEnd.toFixed(2)}
  `;
}
