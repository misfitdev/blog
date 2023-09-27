---
layout: default
title: Retirement Calculator
---

<div class="container">
  <h1>Retirement Calculator</h1>
  <input type="number" id="withdrawal" placeholder="Annual Withdrawal Amount" required>
  <input type="number" id="monthly_contribution" placeholder="Monthly Contribution Amount" required>
  <input type="number" id="return_rate" placeholder="Annual Return Rate (e.g., 0.07 for 7%)" step="0.01" required>
  <input type="number" id="start_age" placeholder="Start Age" required>
  <input type="number" id="end_age" placeholder="End Age" required>
  <input type="number" id="contribution_end_age" placeholder="Contribution End Age" required>
  <input type="number" id="shares" placeholder="Number of Shares" required>
  <input type="number" id="sell_price" placeholder="Sell Price" step="0.01" required>
  <input type="number" id="strike_price" placeholder="Strike Price" value="1.14" step="0.01" required>
  <button onclick="calculateRetirement()">Calculate</button>
  <div class="result" id="result"></div>
</div>

<script src="/assets/js/calculator.js"></script>
