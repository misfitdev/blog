---
layout: default
title: Retirement Calculator
---

<article>
  <header class="article-header">
    <h1 class="article-title">Retirement Calculator</h1>
  </header>

  <div class="calculator-form">
    <div class="form-section">
      <h3>Retirement Planning</h3>
      <label for="withdrawal">Annual Withdrawal Amount ($)</label>
      <input type="number" id="withdrawal" placeholder="e.g. 80000" min="0" required>

      <label for="monthly_contribution">Monthly Contribution ($)</label>
      <input type="number" id="monthly_contribution" placeholder="e.g. 2000" min="0" required>

      <label for="return_rate">Annual Return Rate (decimal)</label>
      <input type="number" id="return_rate" placeholder="e.g. 0.07 for 7%" step="0.001" min="0" max="1" required aria-describedby="return_rate_hint">
      <small id="return_rate_hint">Enter as a decimal: 0.07 = 7%</small>

      <label for="start_age">Start Age</label>
      <input type="number" id="start_age" placeholder="e.g. 30" min="18" max="100" required>

      <label for="end_age">End Age</label>
      <input type="number" id="end_age" placeholder="e.g. 85" min="18" max="120" required>

      <label for="contribution_end_age">Age to Stop Contributing (Retirement Age)</label>
      <input type="number" id="contribution_end_age" placeholder="e.g. 65" min="18" max="100" required>
    </div>

    <div class="form-section">
      <h3>Stock Options</h3>
      <label for="shares">Number of Shares</label>
      <input type="number" id="shares" placeholder="e.g. 10000" min="0" required>

      <label for="sell_price">Sell Price per Share ($)</label>
      <input type="number" id="sell_price" placeholder="e.g. 25.00" step="0.01" min="0" required>

      <label for="strike_price">Strike Price per Share ($)</label>
      <input type="number" id="strike_price" placeholder="e.g. 1.14" value="1.14" step="0.01" min="0" required>

      <label for="option_sell_age">Age When Selling Options</label>
      <input type="number" id="option_sell_age" placeholder="e.g. 40" min="18" max="100" required>
    </div>

    <button onclick="calculateRetirement()" class="calculate-btn" id="calc-btn">Calculate</button>
    <div class="result" id="result" aria-live="polite"></div>
  </div>
</article>

<script src="/assets/js/calculator.js"></script>
