/**
 * charts.js - Native SVG and DOM chart rendering for Spendly (Zero-dependency & fully offline)
 */

const Charts = {
  /**
   * Render Category Spending Breakdown Donut Chart
   */
  renderDonutChart(containerId, breakdown, totalAmount, currency) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!breakdown || breakdown.length === 0 || totalAmount === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 30px;">
          <p style="font-size: 0.9rem;">No expenses recorded for this period yet.</p>
        </div>
      `;
      return;
    }

    const radius = 64;
    const strokeWidth = 26;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercent = 0;

    let svgCircles = '';
    breakdown.forEach(cat => {
      const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
      accumulatedPercent += cat.percentage;

      svgCircles += `
        <circle
          cx="90"
          cy="90"
          r="${radius}"
          fill="transparent"
          stroke="${cat.color}"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${strokeDasharray}"
          stroke-dashoffset="${strokeDashoffset}"
          style="transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;"
        >
          <title>${cat.name}: ${currency}${cat.amount.toFixed(2)} (${cat.percentage.toFixed(1)}%)</title>
        </circle>
      `;
    });

    const legendItems = breakdown.map(cat => `
      <div class="legend-item" title="${cat.name}">
        <div class="legend-label-group">
          <span class="legend-color-dot" style="background: ${cat.color};"></span>
          <span>${cat.icon} ${cat.name}</span>
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <span class="legend-amount">${currency}${cat.amount.toFixed(2)}</span>
          <span style="color: var(--text-muted); font-size: 0.75rem;">(${cat.percentage.toFixed(0)}%)</span>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="donut-wrapper">
        <div class="donut-svg-box">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle
              cx="90"
              cy="90"
              r="${radius}"
              fill="transparent"
              stroke="var(--bg-input)"
              stroke-width="${strokeWidth}"
            />
            ${svgCircles}
          </svg>
          <div class="donut-center-text">
            <div class="center-sub">Total Spent</div>
            <div class="center-amount">${currency}${totalAmount.toFixed(2)}</div>
          </div>
        </div>
        <div class="chart-legend">
          ${legendItems}
        </div>
      </div>
    `;
  },

  /**
   * Render Recent 7-Day Spending Bar Chart
   */
  renderBarChart(containerId, dailyData, currency) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!dailyData || dailyData.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px;">No daily data</div>`;
      return;
    }

    const barsHtml = dailyData.map(day => {
      const height = Math.max(day.heightPercent, 2);
      const isToday = day.date === new Date().toISOString().slice(0, 10);
      const barColor = isToday ? 'var(--primary)' : 'rgba(99, 102, 241, 0.65)';

      return `
        <div class="bar-column">
          <div class="bar-value-tooltip">${currency}${day.amount.toFixed(2)}</div>
          <div class="bar-fill-wrap">
            <div class="bar-fill" style="height: ${height}%; background: ${barColor};"></div>
          </div>
          <span class="bar-label" style="${isToday ? 'font-weight: 700; color: var(--primary);' : ''}">${day.label}</span>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="bar-chart-container">
        ${barsHtml}
      </div>
    `;
  },

  /**
   * Render Payment Method Distribution Bar / Chips
   */
  renderPaymentMethodChart(containerId, methodsData, currency) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!methodsData || methodsData.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">No payment data recorded</div>`;
      return;
    }

    const html = methodsData.map(m => `
      <div class="payment-stat-row">
        <div class="payment-stat-header">
          <span style="font-weight: 600; font-size: 0.88rem;">${m.label}</span>
          <span style="font-size: 0.85rem; color: var(--text-secondary);">
            <strong>${currency}${m.amount.toFixed(2)}</strong> (${m.percentage.toFixed(0)}%)
          </span>
        </div>
        <div class="progress-bar-container" style="margin-top: 6px; height: 8px;">
          <div class="progress-bar" style="width: ${m.percentage}%; background-color: ${m.color};"></div>
        </div>
      </div>
    `).join('');

    container.innerHTML = `<div style="display: flex; flex-direction: column; gap: 14px; width: 100%;">${html}</div>`;
  }
};
