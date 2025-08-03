let chart;

function calculateMortgagePayment(principal, annualRate, years) {
  const monthlyRate = annualRate / 100 / 12;
  const n = years * 12;
  return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -n));
}

function simulate() {
  const income = parseFloat(document.getElementById('income').value);
  const expenses = parseFloat(document.getElementById('expenses').value);
  const rent = parseFloat(document.getElementById('rent').value);
  const housePrice = parseFloat(document.getElementById('housePrice').value);
  const downPaymentPercent = parseFloat(document.getElementById('downPayment').value) / 100;
  const mortgageRate = parseFloat(document.getElementById('mortgageRate').value);
  const appreciation = parseFloat(document.getElementById('appreciation').value) / 100;
  const years = parseInt(document.getElementById('years').value);

  const months = years * 12;
  const labels = Array.from({ length: months }, (_, i) => i + 1);

  const downPayment = housePrice * downPaymentPercent;
  const principal = housePrice - downPayment;
  const monthlyRate = mortgageRate / 100 / 12;
  const mortgagePayment = calculateMortgagePayment(principal, mortgageRate, years);

  let noHouseSavings = 0;
  let savingsWithHouse = -downPayment;
  let mortgageBalance = principal;
  let houseValue = housePrice;

  const withoutHouse = [];
  const withHouse = [];

  for (let m = 1; m <= months; m++) {
    noHouseSavings += income - expenses - rent;
    withoutHouse.push(noHouseSavings);

    const interest = mortgageBalance * monthlyRate;
    const principalPaid = mortgagePayment - interest;
    mortgageBalance = Math.max(0, mortgageBalance - principalPaid);

    savingsWithHouse += income - expenses - mortgagePayment;
    houseValue *= (1 + appreciation / 12);

    withHouse.push(savingsWithHouse + houseValue - mortgageBalance);
  }

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Without House',
          data: withoutHouse,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.3)',
          fill: false
        },
        {
          label: 'With House',
          data: withHouse,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.3)',
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      },
      scales: {
        x: {
          title: { display: true, text: 'Month' }
        },
        y: {
          title: { display: true, text: 'Net Worth ($)' }
        }
      }
    }
  });
}

document.getElementById('plotBtn').addEventListener('click', simulate);
simulate();
