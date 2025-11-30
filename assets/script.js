
// Core data
const coreData = {
  functions: [
    { keyword: '買賣時作為中間人', func: '交易媒介', example: '買參考書付 300 元', trap: '與「價值衡量」不同，重點在交換行為本身。' },
    { keyword: '標示商品價格', func: '價值衡量', example: '一本書定價 300 元', trap: '著重在計價單位，用來比較商品貴或便宜。' },
    { keyword: '保存財富，延後消費', func: '價值儲藏', example: '將薪水存入銀行', trap: '儲存購買力，黃金、不動產亦是範例。' },
    { keyword: '償還債務或繳稅', func: '債務清償', example: '繳交信用卡費', trap: '未來支付承諾的履行。' }
  ]
};

let exchangeChartInstance = null;
let inflationChartInstance = null;

function initFunctionMatrix(){
  const body = document.getElementById('function-matrix-body');
  let html = '';
  coreData.functions.forEach((item, index) => {
    html += `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
        <td class="px-4 py-3 font-medium text-blue-700">${item.func}</td>
        <td class="px-4 py-3 text-slate-600">${item.keyword} / <span class="font-mono">${item.example}</span></td>
        <td class="px-4 py-3">
          <button class="text-amber-600 hover:text-amber-800 font-bold text-xs bg-amber-100 px-3 py-1 rounded-full" onclick="toggleTrap(${index})">點我看陷阱 💡</button>
          <div id="trap-content-${index}" class="hidden mt-2 p-2 bg-amber-50 rounded-lg text-amber-800 text-sm">${item.trap}</div>
        </td>
      </tr>`;
  });
  body.innerHTML = html;
}

function toggleTrap(index){
  const el = document.getElementById(`trap-content-${index}`);
  if(!el) return;
  el.classList.toggle('hidden');
}

function switchTab(type){
  const tabs = ['credit','stored','mobile'];
  tabs.forEach(key => {
    const content = document.getElementById(`content-${key}`);
    const btn = document.getElementById(`btn-${key}`);
    if(content) content.classList.toggle('hidden', key !== type);
    if(btn) btn.className = key === type ? 'flex-1 py-4 text-center text-blue-600 border-b-2 border-blue-500' : 'flex-1 py-4 text-center text-slate-500';
  });
}

// Exchange simulator
function updateSimulation(val){
  const rate = parseInt(val, 10);
  const rateDisplay = document.getElementById('rate-display');
  const statusBox = document.getElementById('status-box');
  const statusText = document.getElementById('status-text');
  const statusSlogan = document.getElementById('status-slogan');
  const impactBody = document.getElementById('impact-body');
  rateDisplay.innerText = rate;
  let ntStatus, ntColor, rows = [];

  if(rate < 30){
    statusText.innerText = '臺幣升值 (Appreciation) ⬆️';
    statusSlogan.innerText = '匯率數字 ↓ → 臺幣強';
    statusBox.className = 'mt-4 p-3 rounded text-center bg-blue-100 border';
    ntStatus = '升值 ⬆️'; ntColor = 'bg-blue-500 text-white';
    rows = [
      ['進口商 (買外國貨)', '進口成本降低', '臺幣變強，買美金變便宜。', true],
      ['出口商 (賣外國貨)', '換回臺幣變少', '賺的美金換回來的臺幣縮水。', false],
      ['出國旅遊的人', '旅遊划算', '臺幣變強，換外幣比較划算。', true]
    ];
  } else if(rate > 30){
    statusText.innerText = '臺幣貶值 (Depreciation) ⬇️';
    statusSlogan.innerText = '匯率數字 ↑ → 臺幣弱';
    statusBox.className = 'mt-4 p-3 rounded text-center bg-rose-100 border';
    ntStatus = '貶值 ⬇️'; ntColor = 'bg-rose-500 text-white';
    rows = [
      ['出口商 (賣外國貨)', '換回臺幣變多', '賺的美金換回更多臺幣，利潤增加。', true],
      ['進口商 (買外國貨)', '進口成本提高', '臺幣變弱，買美金要花更多錢。', false],
      ['出國旅遊的人', '旅費變貴', '臺幣變弱，換外幣較不划算。', false]
    ];
  } else {
    statusText.innerText = '基準點 (Base) ↔️';
    statusSlogan.innerText = '匯率穩定中。';
    statusBox.className = 'mt-4 p-3 rounded text-center bg-slate-100 border';
    ntStatus = '穩定 ↔️'; ntColor = 'bg-slate-500 text-white';
    rows = [];
  }

  // build impact rows
  let html = '';
  if(rows.length === 0){
    html = `<tr><td colspan="4" class="px-6 py-8 text-center text-slate-500 font-medium">匯率穩定在 30。請拖動上方滑桿來模擬變動。</td></tr>`;
  } else {
    rows.forEach(r => {
      const bg = r[3] ? 'bg-green-50' : 'bg-rose-50';
      const text = r[3] ? 'text-green-700 font-bold' : 'text-rose-700 font-bold';
      const icon = r[3] ? '😊 利！' : '😭 弊！';
      html += `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
          <td class="px-6 py-3 font-medium text-slate-900">${r[0]}</td>
          <td class="px-6 py-3 text-center"><span class="px-3 py-1 rounded text-xs font-bold ${ntColor}">${ntStatus}</span></td>
          <td class="px-6 py-3 ${bg} ${text}">${icon}</td>
          <td class="px-6 py-3 text-slate-600 text-xs">${r[2]}</td>
        </tr>`;
    });
  }
  impactBody.innerHTML = html;
  updateExchangeChartData(rate);
}

// Chart initialization
function initCharts(){
  // inflation chart
  const ctxInflation = document.getElementById('inflationChart').getContext('2d');
  inflationChartInstance = new Chart(ctxInflation, {
    type: 'bar',
    data: {
      labels: ['通膨前', '通膨後'],
      datasets: [{ label: '100元購買力', data: [10,5], backgroundColor: ['#3b82f6','#ef4444'], borderRadius:5 }]
    },
    options: { indexAxis:'y', responsive:true, maintainAspectRatio:false, scales:{ x:{min:0,max:12,title:{display:true,text:'可購買的麵包數量'} }, y:{grid:{display:false}} }, plugins:{legend:{display:false}} }
  });

  // exchange chart
  const ctxExchange = document.getElementById('exchangeChart').getContext('2d');
  exchangeChartInstance = new Chart(ctxExchange, {
    type: 'line',
    data: {
      labels: ['過去 4 個月','上個月','本月','模擬值'],
      datasets: [{ label:'匯率走勢', data:[30,30,30,30], borderColor:'#1d4ed8', backgroundColor:'rgba(29,78,216,0.1)', borderWidth:3, tension:0.3, fill:true, pointRadius:4 }]
    },
    options: { responsive:true, maintainAspectRatio:false, scales:{ y:{min:24,max:36,grid:{color:'#f1f5f9'}, title:{display:true,text:'NTD'} }, x:{grid:{display:false}} }, plugins:{legend:{display:false}} }
  });
}

function updateExchangeChartData(currentRate){
  const base = 30;
  const diff = currentRate - base;
  const newData = [ base, base + diff*0.2, base + diff*0.5, currentRate ];
  if(exchangeChartInstance){
    exchangeChartInstance.data.datasets[0].data = newData;
    if(currentRate < 30){ exchangeChartInstance.data.datasets[0].borderColor = '#3b82f6'; exchangeChartInstance.data.datasets[0].backgroundColor = 'rgba(59,130,246,0.1)'; }
    else if(currentRate > 30){ exchangeChartInstance.data.datasets[0].borderColor = '#f43f5e'; exchangeChartInstance.data.datasets[0].backgroundColor = 'rgba(244,63,94,0.1)'; }
    else { exchangeChartInstance.data.datasets[0].borderColor = '#1d4ed8'; exchangeChartInstance.data.datasets[0].backgroundColor = 'rgba(29,78,216,0.1)'; }
    exchangeChartInstance.update();
  }
}

// Dark mode toggle
function setupDarkMode(){
  const btn = document.getElementById('toggle-dark');
  btn.addEventListener('click', ()=>{
    const el = document.documentElement;
    if(el.hasAttribute('data-theme')){ el.removeAttribute('data-theme'); localStorage.removeItem('theme'); }
    else{ el.setAttribute('data-theme','dark'); localStorage.setItem('theme','dark'); }
  });
  // restore
  if(localStorage.getItem('theme') === 'dark') document.documentElement.setAttribute('data-theme','dark');
}

// Init
document.addEventListener('DOMContentLoaded', ()=>{
  initFunctionMatrix();
  initCharts();
  updateSimulation(30);
  switchTab('credit');
  setupDarkMode();
  // slider
  const slider = document.getElementById('rate-slider');
  slider.addEventListener('input', (e)=> updateSimulation(e.target.value));
});
