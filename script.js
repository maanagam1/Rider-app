const trips = JSON.parse(localStorage.getItem('trips') || '[]');
const form = document.getElementById('tripForm');
const summaryDate = document.getElementById('summaryDate');
const tripList = document.getElementById('tripList');
const grossEl = document.getElementById('gross');
const netEl = document.getElementById('net');
const totalCngEl = document.getElementById('totalCng');
const totalTaxEl = document.getElementById('totalTax');
const cancelBtn = document.getElementById('cancelBtn');
const shareBtn = document.getElementById('shareBtn');
const pdfBtn = document.getElementById('pdfBtn');
const today = new Date().toISOString().slice(0,10);

document.getElementById('date').value = today;
summaryDate.value = today;

function money(n){return Number(n||0).toLocaleString('en-IN');}
function save(){localStorage.setItem('trips', JSON.stringify(trips));}

function render(){
  const d = summaryDate.value;
  const filtered = trips.filter(t=>t.date===d);
  if(!filtered.length){
    tripList.textContent='Aaj ki koi trip nahi hai';
  } else {
    tripList.innerHTML = filtered.map(t=>`<div class="trip"><strong>${t.platform}</strong><div>Fare: ₹${money(t.fare)} | CNG: ₹${money(t.cng)} | Tax: ₹${money(t.tax)}</div><small>Date: ${t.date}</small></div>`).join('');
  }
  const gross = filtered.reduce((s,t)=>s+Number(t.fare)+Number(t.tax),0);
  const cng = filtered.reduce((s,t)=>s+Number(t.cng),0);
  const tax = filtered.reduce((s,t)=>s+Number(t.tax),0);
  grossEl.textContent = money(gross);
  totalCngEl.textContent = money(cng);
  totalTaxEl.textContent = money(tax);
  netEl.textContent = money(gross - cng);
}

form.addEventListener('submit', e=>{
  e.preventDefault();
  trips.push({
    date: date.value,
    platform: platform.value,
    fare: Number(fare.value),
    cng: Number(cng.value),
    tax: Number(tax.value)
  });
  save();
  render();
  form.reset();
  document.getElementById('date').value = summaryDate.value;
});

summaryDate.addEventListener('change', render);
cancelBtn.addEventListener('click', ()=>form.reset());

shareBtn.addEventListener('click', async ()=>{
  const text = `Ride Profit Tracker
Date: ${summaryDate.value}
Gross: ₹${grossEl.textContent}
Net: ₹${netEl.textContent}`;
  if(navigator.share){
    await navigator.share({text});
  } else {
    await navigator.clipboard.writeText(text);
    alert('Summary copied');
  }
});

pdfBtn.addEventListener('click', ()=>window.print());
render();
