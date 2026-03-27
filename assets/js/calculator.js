function calculateRetirement() {
  const btn = document.getElementById('calc-btn');
  btn.disabled = true;
  btn.textContent = 'Calculating…';

  // Get input values
  const withdrawal = parseFloat(document.getElementById('withdrawal').value);
  const monthlyContribution = parseFloat(document.getElementById('monthly_contribution').value);
  const returnRate = parseFloat(document.getElementById('return_rate').value);
  const startAge = parseInt(document.getElementById('start_age').value);
  const endAge = parseInt(document.getElementById('end_age').value);
  const contributionEndAge = parseInt(document.getElementById('contribution_end_age').value);
  const shares = parseInt(document.getElementById('shares').value);
  const sellPrice = parseFloat(document.getElementById('sell_price').value);
  const strikePrice = parseFloat(document.getElementById('strike_price').value);
  const optionSellAge = parseInt(document.getElementById('option_sell_age').value);

  // Validate inputs
  if (isNaN(withdrawal) || isNaN(monthlyContribution) || isNaN(returnRate) ||
      isNaN(startAge) || isNaN(endAge) || isNaN(contributionEndAge) ||
      isNaN(shares) || isNaN(sellPrice) || isNaN(strikePrice) || isNaN(optionSellAge)) {
    document.getElementById('result').innerHTML = '<p class="calc-error">Please fill in all fields with valid numbers.</p>';
    btn.disabled = false;
    btn.textContent = 'Calculate';
    return;
  }

  // Calculate stock option value
  const optionValue = Math.max(0, (sellPrice - strikePrice) * shares);

  // Calculate retirement savings needed
  const withdrawalYears = endAge - contributionEndAge;
  const contributionYears = contributionEndAge - startAge;
  const annualContribution = monthlyContribution * 12;

  // Future value of regular contributions at retirement
  const futureValueContributions = annualContribution *
    (((1 + returnRate) ** contributionYears - 1) / returnRate);

  // Future value of stock options at retirement (if sold during contribution period)
  let futureValueOptions = 0;
  if (optionSellAge <= contributionEndAge) {
    const yearsToGrow = contributionEndAge - optionSellAge;
    futureValueOptions = optionValue * ((1 + returnRate) ** yearsToGrow);
  }

  // Total amount available at retirement
  const totalAtRetirement = futureValueContributions + futureValueOptions +
    (optionSellAge > contributionEndAge ? optionValue : 0);

  // Amount needed to fund withdrawals (using annuity present value formula)
  const amountNeededAtRetirement = withdrawal *
    ((1 - (1 + returnRate) ** -withdrawalYears) / returnRate);

  // Shortfall or surplus
  const difference = totalAtRetirement - amountNeededAtRetirement;

  // Generate year-by-year data for charts
  const chartData = generateChartData({
    startAge, contributionEndAge, endAge, optionSellAge,
    annualContribution, returnRate, withdrawal, optionValue
  });

  // Format results
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const outcomeClass = difference >= 0 ? 'calc-surplus' : 'calc-shortfall';
  const outcomeLabel = difference >= 0
    ? `Surplus: ${formatter.format(difference)}`
    : `Shortfall: ${formatter.format(-difference)}`;
  const outcomeNote = difference >= 0
    ? 'Retirement is fully funded.'
    : `Additional ${formatter.format(-difference)} needed for full retirement funding.`;

  const resultHTML = `
    <h3>Results</h3>
    <div class="calc-result-block">
      <h4>Stock Options</h4>
      <p><strong>Option Value:</strong> ${formatter.format(optionValue)}</p>
      <p><small>${shares} shares × (${formatter.format(sellPrice)} − ${formatter.format(strikePrice)}) = ${formatter.format(optionValue)}</small></p>
      <p><strong>Selling at age:</strong> ${optionSellAge}</p>

      <h4>Retirement Summary</h4>
      <p><strong>Contribution Period:</strong> ${contributionYears} years (age ${startAge} to ${contributionEndAge})</p>
      <p><strong>Withdrawal Period:</strong> ${withdrawalYears} years (age ${contributionEndAge} to ${endAge})</p>
      <p><strong>Annual Contribution:</strong> ${formatter.format(annualContribution)}</p>
      <p><strong>Expected Return Rate:</strong> ${(returnRate * 100).toFixed(1)}%</p>

      <hr>

      <p><strong>Value of Regular Contributions at Retirement:</strong> ${formatter.format(futureValueContributions)}</p>
      <p><strong>Value of Stock Options at Retirement:</strong> ${formatter.format(futureValueOptions + (optionSellAge > contributionEndAge ? optionValue : 0))}</p>
      <p><strong>Total Available at Retirement:</strong> ${formatter.format(totalAtRetirement)}</p>
      <p><strong>Amount Needed for Withdrawals:</strong> ${formatter.format(amountNeededAtRetirement)}</p>

      <p class="${outcomeClass}"><strong>${outcomeLabel}</strong></p>
      <p class="${outcomeClass}">${outcomeNote}</p>
    </div>

    <div id="charts" class="calc-charts">
      <canvas id="balanceChart" width="400" height="200" role="img" aria-label="Account balance over time"></canvas>
      <canvas id="contributionsChart" width="400" height="200" role="img" aria-label="Contributions vs withdrawals by age"></canvas>
    </div>
  `;

  document.getElementById('result').innerHTML = resultHTML;

  requestAnimationFrame(() => {
    drawBalanceChart(chartData);
    drawContributionsChart(chartData);
    btn.disabled = false;
    btn.textContent = 'Calculate';
  });
}

function generateChartData({ startAge, contributionEndAge, endAge, optionSellAge, annualContribution, returnRate, withdrawal, optionValue }) {
  const data = [];
  let balance = 0;

  for (let age = startAge; age <= endAge; age++) {
    let yearlyContribution = 0;
    let yearlyWithdrawal = 0;
    let optionProceeds = 0;

    if (age <= contributionEndAge) {
      yearlyContribution = annualContribution;
    }

    if (age === optionSellAge) {
      optionProceeds = optionValue;
    }

    if (age > contributionEndAge) {
      yearlyWithdrawal = withdrawal;
    }

    balance = balance * (1 + returnRate);
    balance += yearlyContribution + optionProceeds;
    balance -= yearlyWithdrawal;

    data.push({
      age,
      balance: Math.max(0, balance),
      contribution: yearlyContribution,
      withdrawal: yearlyWithdrawal,
      optionProceeds
    });
  }

  return data;
}

function drawBalanceChart(data) {
  const canvas = document.getElementById('balanceChart');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const maxBalance = Math.max(...data.map(d => d.balance));
  const minAge = Math.min(...data.map(d => d.age));
  const maxAge = Math.max(...data.map(d => d.age));

  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, height - 40);
  ctx.lineTo(width - 20, height - 40);
  ctx.moveTo(50, 20);
  ctx.lineTo(50, height - 40);
  ctx.stroke();

  // Accent teal matches --accent
  ctx.strokeStyle = '#2a9d8f';
  ctx.lineWidth = 2;
  ctx.beginPath();

  data.forEach((point, i) => {
    const x = 50 + (point.age - minAge) / (maxAge - minAge) * (width - 70);
    const y = height - 40 - (point.balance / maxBalance) * (height - 60);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  ctx.fillStyle = '#6b7280';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('Account Balance Over Time', 10, 15);
  ctx.fillText('Age', width / 2 - 10, height - 5);

  ctx.save();
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Balance ($)', -30, 0);
  ctx.restore();
}

function drawContributionsChart(data) {
  const canvas = document.getElementById('contributionsChart');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const maxValue = Math.max(
    ...data.map(d => Math.max(d.contribution, d.withdrawal, d.optionProceeds))
  );
  const minAge = Math.min(...data.map(d => d.age));
  const maxAge = Math.max(...data.map(d => d.age));

  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, height - 40);
  ctx.lineTo(width - 20, height - 40);
  ctx.moveTo(50, 20);
  ctx.lineTo(50, height - 40);
  ctx.stroke();

  const barWidth = (width - 70) / data.length * 0.8;

  data.forEach((point) => {
    const x = 50 + (point.age - minAge) / (maxAge - minAge) * (width - 70);

    if (point.contribution > 0) {
      const h = (point.contribution / maxValue) * (height - 60);
      ctx.fillStyle = '#2a9d8f';
      ctx.fillRect(x - barWidth / 2, height - 40 - h, barWidth, h);
    }

    if (point.withdrawal > 0) {
      const h = (point.withdrawal / maxValue) * (height - 60);
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(x - barWidth / 2, height - 40 - h, barWidth, h);
    }

    if (point.optionProceeds > 0) {
      const h = (point.optionProceeds / maxValue) * (height - 60);
      ctx.fillStyle = '#6f42c1';
      ctx.fillRect(x - barWidth / 2, height - 40 - h, barWidth, h);
    }
  });

  ctx.fillStyle = '#6b7280';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('Contributions vs Withdrawals', 10, 15);
  ctx.fillText('Age', width / 2 - 10, height - 5);

  ctx.fillStyle = '#2a9d8f';
  ctx.fillRect(width - 120, 20, 10, 10);
  ctx.fillStyle = '#6b7280';
  ctx.fillText('Contributions', width - 105, 29);

  ctx.fillStyle = '#c0392b';
  ctx.fillRect(width - 120, 35, 10, 10);
  ctx.fillStyle = '#6b7280';
  ctx.fillText('Withdrawals', width - 105, 44);

  ctx.fillStyle = '#6f42c1';
  ctx.fillRect(width - 120, 50, 10, 10);
  ctx.fillStyle = '#6b7280';
  ctx.fillText('Stock Options', width - 105, 59);
}

document.addEventListener('DOMContentLoaded', function() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        calculateRetirement();
      }
    });
  });
});
