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
      <input type="number" id="withdrawal" placeholder="Annual Withdrawal Amount" required>
      <input type="number" id="monthly_contribution" placeholder="Monthly Contribution Amount" required>
      <input type="number" id="return_rate" placeholder="Annual Return Rate (e.g., 0.07 for 7%)" step="0.01" required>
      <input type="number" id="start_age" placeholder="Start Age" required>
      <input type="number" id="end_age" placeholder="End Age" required>
      <input type="number" id="contribution_end_age" placeholder="Contribution End Age" required>
    </div>
    
    <div class="form-section">
      <h3>Stock Options</h3>
      <input type="number" id="shares" placeholder="Number of Shares" required>
      <input type="number" id="sell_price" placeholder="Sell Price" step="0.01" required>
      <input type="number" id="strike_price" placeholder="Strike Price" value="1.14" step="0.01" required>
      <input type="number" id="option_sell_age" placeholder="Age When Selling Options" required>
    </div>
    
    <button onclick="calculateRetirement()" class="calculate-btn">Calculate</button>
    <div class="result" id="result"></div>
  </div>
</article>

<script src="/assets/js/calculator.js"></script>
