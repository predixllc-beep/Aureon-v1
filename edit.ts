import fs from "fs";

let text = fs.readFileSync("src/App.tsx", "utf-8");

const lines = text.split('\n');
lines.splice(237, 0, `                        <button onClick={async () => { try { const res = await fetch('/api/analyze-performance'); const data = await res.json(); setAlert(data.analysis || 'Analiz alınamadı'); } catch (e) { setAlert('Analiz hatası'); } }} className="px-6 py-3 w-full md:w-auto h-12 bg-slate-800 hover:bg-slate-700 dark:bg-white/10 dark:hover:bg-white/20 text-white disabled:opacity-50 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 md:min-w-[120px] whitespace-nowrap shrink-0" title="Strateji Performansını Analiz Et"> 📊 Analiz </button>`)

fs.writeFileSync("src/App.tsx", lines.join('\n'));
console.log("Done splice");
