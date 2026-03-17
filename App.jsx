import { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { Info, TrendingUp, Users, ArrowRight, Wallet } from 'lucide-react';

const App = () => {
  // Helper untuk format mata uang Rupiah
  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // State untuk Kelompok Kaya (Muzakki) - dalam Ribuan Rupiah untuk kemudahan slider
  const [richIncome, setRichIncome] = useState(15000000); // 15 Juta
  const [richMPC, setRichMPC] = useState(0.4);
  
  // State untuk Kelompok Miskin (Mustahik)
  const [poorIncome, setPoorIncome] = useState(2000000); // 2 Juta
  const [poorMPC, setPoorMPC] = useState(0.9);
  
  // Persentase Zakat (Default 2.5%)
  const [zakatRate, setZakatRate] = useState(2.5);

  // Perhitungan
  const zakatAmount = (richIncome * (zakatRate / 100));
  
  // Sebelum Zakat
  const richConsBefore = richIncome * richMPC;
  const poorConsBefore = poorIncome * poorMPC;
  const totalConsBefore = richConsBefore + poorConsBefore;
  
  // Sesudah Zakat
  const richIncomeAfter = richIncome - zakatAmount;
  const poorIncomeAfter = poorIncome + zakatAmount;
  
  const richConsAfter = richIncomeAfter * richMPC;
  const poorConsAfter = poorIncomeAfter * poorMPC;
  const totalConsAfter = richConsAfter + poorConsAfter;
  
  const efficiencyGain = totalConsAfter - totalConsBefore;

  // Data untuk Grafik Batang Konsumsi
  const consumptionData = [
    { name: 'Sebelum Zakat', Konsumsi: totalConsBefore, type: 'before' },
    { name: 'Sesudah Zakat', Konsumsi: totalConsAfter, type: 'after' }
  ];

  // Data untuk Grafik Distribusi
  const distributionData = [
    { group: 'Muzakki (Kaya)', sebelum: richConsBefore, sesudah: richConsAfter },
    { group: 'Mustahik (Miskin)', sebelum: poorConsBefore, sesudah: poorConsAfter }
  ];

  return (
    <div className="min-h-screen bg-white p-2 md:p-6 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto border border-slate-100 rounded-3xl shadow-sm overflow-hidden bg-slate-50/50">
        {/* Header */}
        <header className="bg-white p-6 md:p-8 border-b border-slate-100 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-2">Interactive Lab: Efisiensi Zakat pada Konsumsi</h1>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
            Visualisasi bagaimana redistribusi zakat meningkatkan Permintaan Agregat melalui perbedaan Marginal Propensity to Consume (MPC).
          </p>
        </header>

        <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Panel Kontrol */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6 text-emerald-600 border-b border-slate-50 pb-3">
                <Users size={20} />
                <h2 className="font-semibold text-lg">Input Parameter</h2>
              </div>
              
              {/* Kelompok Kaya */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendapatan Muzakki</label>
                  <span className="text-sm font-bold text-emerald-600">{formatIDR(richIncome)}</span>
                </div>
                <input 
                  type="range" min="5000000" max="50000000" step="500000" 
                  value={richIncome} onChange={(e) => setRichIncome(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between items-end mt-4 mb-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">MPC Muzakki</label>
                  <span className="text-sm font-bold text-slate-700">{richMPC}</span>
                </div>
                <input 
                  type="range" min="0.1" max="0.6" step="0.05" 
                  value={richMPC} onChange={(e) => setRichMPC(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="my-6 border-t border-dashed border-slate-200" />

              {/* Kelompok Miskin */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendapatan Mustahik</label>
                  <span className="text-sm font-bold text-blue-600">{formatIDR(poorIncome)}</span>
                </div>
                <input 
                  type="range" min="500000" max="5000000" step="100000" 
                  value={poorIncome} onChange={(e) => setPoorIncome(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between items-end mt-4 mb-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">MPC Mustahik</label>
                  <span className="text-sm font-bold text-slate-700">{poorMPC}</span>
                </div>
                <input 
                  type="range" min="0.7" max="0.95" step="0.01" 
                  value={poorMPC} onChange={(e) => setPoorMPC(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="my-6 border-t border-dashed border-slate-200" />

              {/* Tarif Zakat */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tarif Zakat</label>
                  <span className="text-sm font-bold text-amber-600">{zakatRate}%</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="0.5" 
                  value={zakatRate} onChange={(e) => setZakatRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            <div className="bg-emerald-600 p-5 rounded-2xl text-white shadow-md shadow-emerald-100">
              <div className="flex items-start gap-3">
                <Info size={18} className="mt-1 flex-shrink-0 opacity-80" />
                <div>
                  <h3 className="font-semibold mb-1 text-sm">Logika Ekonomi</h3>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    Zakat memindahkan Rp dari Muzakki (MPC rendah) ke Mustahik (MPC tinggi). Karena Mustahik menghabiskan hampir seluruh dananya untuk konsumsi, total konsumsi agregat masyarakat akan meningkat signifikan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Visualisasi */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Total Zakat</p>
                <p className="text-lg font-bold text-emerald-600">{formatIDR(zakatAmount)}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Kenaikan Agregat</p>
                <p className="text-lg font-bold text-blue-600">+{formatIDR(efficiencyGain)}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Konsumsi Akhir</p>
                <p className="text-lg font-bold text-slate-800">{formatIDR(totalConsAfter)}</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">Efek Pengganda Konsumsi</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={consumptionData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                      <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                        formatter={(value) => [formatIDR(value), 'Konsumsi']}
                      />
                      <Bar dataKey="Konsumsi" radius={[6, 6, 0, 0]} barSize={50}>
                        {consumptionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.type === 'before' ? '#cbd5e1' : '#10b981'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">Distribusi per Kelompok</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f8fafc" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="group" type="category" fontSize={10} tickLine={false} axisLine={false} width={80} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                        formatter={(value) => formatIDR(value)}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                      <Bar dataKey="sebelum" name="Sebelum" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="sesudah" name="Sesudah" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Analysis Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <TrendingUp size={80} />
              </div>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" />
                Analisis Lab
              </h3>
              <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-600">
                <p>
                  Ketika Muzakki membayar zakat sebesar <span className="font-bold text-slate-800">{formatIDR(zakatAmount)}</span>, konsumsi mereka hanya berkurang <span className="font-bold text-red-500">{formatIDR(zakatAmount * richMPC)}</span>. Sisanya diambil dari tabungan yang bersifat pasif.
                </p>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <ArrowRight size={16} className="text-emerald-500" />
                  <p>
                    Dana tersebut kemudian diterima Mustahik dan karena kebutuhan mendesak, mereka membelanjakan <span className="font-bold text-emerald-600">{formatIDR(zakatAmount * poorMPC)}</span> kembali ke pasar.
                  </p>
                </div>
                <p className="pt-2 font-medium text-slate-800">
                  Hasil akhirnya, ekonomi mendapatkan suntikan konsumsi bersih (Net Gain) sebesar <span className="text-blue-600 underline decoration-2 underline-offset-4">{formatIDR(efficiencyGain)}</span> hanya dari satu putaran distribusi zakat.
                </p>
              </div>
            </div>

          </div>
        </div>
        
        {/* Footer info */}
        <footer className="p-6 text-center border-t border-slate-100 text-slate-400 text-[10px] md:text-xs">
          <p>Lab Efisiensi Zakat v2.0 • Dioptimalkan untuk Google Sites & Konteks Ekonomi Indonesia</p>
        </footer>
      </div>
    </div>
  );
};

export default App;