import React, { useState, useEffect } from 'react';
import { 
  Activity, Network, Database, Terminal, Settings, 
  Hexagon, Link2, WifiOff, Zap, Bot, Wifi, Target 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [metrics, setMetrics] = useState({
    coherence: 0.87,
    activeAgents: 118,
    signalStrength: 0.92,
  });
  const [trades, setTrades] = useState<any[]>([]);
  const [strategies, setStrategies] = useState<any[]>([
    { id: '1', name: 'Alpha Swarm', signals: 142, performance: '+12.4%' },
    { id: '2', name: 'Gamma Protocol', signals: 89, performance: '+8.2%' },
    { id: '3', name: 'Omega Reversal', signals: 45, performance: '-2.1%' }
  ]);
  const [systemHealth, setSystemHealth] = useState<'ACTIVE' | 'CONNECTING' | 'ERROR'>('CONNECTING');
  const [botMode, setBotMode] = useState<'PAPER' | 'LIVE' | 'STANDBY'>('PAPER');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [alert, setAlert] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'Dashboard' | 'Strategies' | 'Artifacts' | 'Logs' | 'Admin'>('Dashboard');

  // Bridge Engine Data
  const [bridgeRunning, setBridgeRunning] = useState(false);
  const [bridgeResult, setBridgeResult] = useState<any>(null);
  const [marketInput, setMarketInput] = useState("Bitcoin shows sudden surge in volume as institutional buyers step in. Retail sentiment remains cautious but whales are accumulating.");

  useEffect(() => {
    // Apply theme class to document element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Fetch metrics & trades
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/metrics');
        if (res.ok) {
          const data = await res.json();
          setSystemHealth('ACTIVE');
          setMetrics({
            coherence: data.coherence,
            activeAgents: data.activeAgents,
            signalStrength: data.signalStrength,
          });
          if (data.trades) {
            setTrades(data.trades);
          }
        }
      } catch (err) {
        setSystemHealth('ERROR');
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerTestSignal = () => {
    setAlert("Simulated signal injected from Auris Node.");
    setTimeout(() => setAlert(null), 3000);
  };

  const runBridgeAnalysis = async () => {
    setBridgeRunning(true);
    setTimeout(() => {
      setBridgeResult({
        sentimentScore: 0.84,
        rawSignals: [
          { id: 'A1', weight: 0.9, value: 0.8 },
          { id: 'A2', weight: 0.7, value: 0.4 },
          { id: 'A3', weight: 0.8, value: -0.2 },
        ],
        decision: {
          passed: true,
          action: 'BUY',
          coherence: 87,
          positiveVotes: 6
        }
      });
      setBridgeRunning(false);
    }, 2000);
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#0b0e11] text-slate-700 dark:text-slate-300 font-sans selection:bg-[#FCD535]/30 flex overflow-hidden transition-colors duration-150`}>
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#181a20]/90 backdrop-blur-xl hidden md:flex flex-col z-10 shrink-0 shadow-[4px_0_24px_rgba(252,213,53,0.03)] transition-colors duration-150">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center gap-3 transition-colors duration-300">
          <Hexagon className="text-[#FCD535] w-8 h-8 drop-shadow-[0_0_12px_rgba(252,213,53,0.4)] dark:drop-shadow-[0_0_12px_rgba(252,213,53,0.6)]" />
          <div>
            <h1 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-sm">AUREON</h1>
            <p className="text-[10px] text-slate-500 dark:text-[#FCD535]/80 font-mono tracking-wider">HYBRID.QUANTUM</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 relative">
          <NavButton icon={<Activity size={18} />} label="Dashboard" active={currentView === 'Dashboard'} onClick={() => setCurrentView('Dashboard')} />
          <NavButton icon={<Network size={18} />} label="Strategies" active={currentView === 'Strategies'} onClick={() => setCurrentView('Strategies')} />
          <NavButton icon={<Database size={18} />} label="Artifacts" active={currentView === 'Artifacts'} onClick={() => setCurrentView('Artifacts')} />
          <NavButton icon={<Terminal size={18} />} label="Logs" active={currentView === 'Logs'} onClick={() => setCurrentView('Logs')} />
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
          <NavButton icon={<Settings size={18} />} label="Admin" active={currentView === 'Admin'} onClick={() => setCurrentView('Admin')} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_rgba(252,213,53,0.08),_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,_rgba(252,213,53,0.03),_transparent_50%)] pb-[70px] md:pb-0 transition-colors duration-300">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 sm:px-6 bg-white/80 dark:bg-[#181a20]/90 backdrop-blur-xl z-20 transition-colors duration-300">
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Hexagon className="text-[#FCD535] w-6 h-6 md:hidden drop-shadow-[0_0_8px_rgba(252,213,53,0.4)]" />
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 hidden sm:block">{currentView}</h2>
            <div className="h-4 w-px bg-slate-300 dark:bg-white/10 hidden sm:block transition-colors duration-300"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 uppercase hidden sm:inline">CloddsBot Link</span>
              {systemHealth === 'ACTIVE' ? (
                <div className="flex items-center gap-1.5 bg-green-500/10 dark:bg-green-500/20 px-2 py-1 rounded-md border border-green-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)] animate-pulse"></div>
                  <span className="text-[10px] font-mono text-green-700 dark:text-green-400 uppercase font-bold py-0.5">Active</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-1 rounded-md">
                  <WifiOff size={14} className="text-red-500" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-6">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <div className="flex items-center bg-slate-100 dark:bg-black/30 rounded-lg p-1 border border-slate-200 dark:border-white/5">
               <button onClick={() => setBotMode('PAPER')} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${botMode === 'PAPER' ? 'bg-white dark:bg-[#181a20] text-[#FCD535] shadow-sm' : 'text-slate-500'}`}>PAPER</button>
               <button onClick={() => setBotMode('LIVE')} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${botMode === 'LIVE' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-500'}`}>LIVE</button>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">Alex.Q</p>
                <p className="text-[10px] text-slate-500 dark:text-[#FCD535]/80 font-mono">Quant Engineer</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-orange-300 dark:border-[#FCD535]/30 bg-orange-100 dark:bg-[#FCD535]/10 flex items-center justify-center text-[#0b0e11] dark:text-[#FCD535] shadow-[0_0_10px_rgba(252,213,53,0.1)]">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          
          {currentView === 'Dashboard' && (
            <div className="animate-in fade-in duration-150">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-2xl font-light text-slate-900 dark:text-slate-100">Swarm Intelligence Overview</h3>
                  <p className="text-slate-500 text-sm mt-1">Real-time metrics from Aureon Nodes and CloddsBot signals.</p>
                </div>
                <button 
                  onClick={triggerTestSignal}
                  title="Simulate Signal (Auris)"
                  className="w-11 h-11 flex items-center justify-center bg-white dark:bg-[#181a20] hover:bg-[#FCD535] dark:hover:bg-[#FCD535] text-slate-500 dark:text-slate-400 hover:text-[#0b0e11] dark:hover:text-[#0b0e11] rounded-2xl border border-slate-200 dark:border-white/10 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(252,213,53,0.3)] group relative shrink-0"
                >
                  <div className="absolute inset-0 rounded-2xl bg-[#FCD535]/30 opacity-0 group-hover:opacity-100 animate-ping group-hover:animate-none group-active:animate-ping transition-opacity duration-300"></div>
                  <Zap size={20} className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                </button>
              </div>

              {alert && (
                <div className="mb-6 p-4 border border-[#FCD535]/50 bg-[#FCD535]/10 backdrop-blur-md rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
                  <Zap className="text-[#FCD535]" size={20} />
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{alert}</span>
                </div>
              )}

              {/* Quantum Sentiment Bridge Visualizer */}
              <div className="mb-8 bg-white dark:bg-[#181a20] border border-slate-200 dark:border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-xl dark:shadow-black/50 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FCD535]/30 via-[#FCD535] to-[#FCD535]/30"></div>
                <div className="p-4 md:p-6 border-b border-slate-100 dark:border-white/5">
                   <div className="flex flex-col xl:flex-row justify-between items-start md:items-center mb-6 gap-4">
                     <div>
                       <h3 className="text-xl font-medium tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                         <Hexagon className="text-[#FCD535] w-5 h-5 fill-[#FCD535]/10" /> 
                         AUREON Live Synthesizer
                       </h3>
                       <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                         Auris Node (NLP) ↔ Master Equation (Quantum 9-Dim)
                       </p>
                     </div>
                     <div className="flex items-center gap-2 flex-wrap pb-1">
                       <span className="text-[10px] uppercase font-mono text-slate-500 font-bold hidden sm:inline-block whitespace-nowrap">Presets:</span>
                       <button onClick={() => setMarketInput("Bitcoin shows sudden surge in volume as institutional buyers step in. Retail sentiment remains cautious but whales are accumulating.")} className="px-2.5 py-1.5 text-[10px] font-mono rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10 whitespace-nowrap">Whale Activity</button>
                       <button onClick={() => setMarketInput("Global macroeconomic data shows higher inflation than expected. Tech stocks are tanking, dragging crypto markets down.")} className="px-2.5 py-1.5 text-[10px] font-mono rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10 whitespace-nowrap">Macro Shock</button>
                       <button onClick={() => setMarketInput("Altcoin rally is accelerating. High social volume on Twitter regarding new Layer-1 protocols. Extreme greed index detected.")} className="px-2.5 py-1.5 text-[10px] font-mono rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10 whitespace-nowrap">Alts Greed</button>
                     </div>
                   </div>
                   
                   <div className="flex flex-col gap-4">
                     <div className="flex flex-col md:flex-row gap-3">
                       <input 
                         type="text" 
                         value={marketInput}
                         onChange={(e) => setMarketInput(e.target.value)}
                         placeholder="Enter live market text stream..."
                         className="flex-1 bg-slate-50 dark:bg-[#0b0e11] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-700 dark:text-slate-200 font-mono focus:outline-none focus:border-[#FCD535]/50 transition-colors shadow-inner w-full"
                       />
                       <button 
                         onClick={runBridgeAnalysis}
                         disabled={bridgeRunning || !marketInput.trim()}
                         className="px-6 py-3 md:py-0 w-full md:w-auto h-12 bg-[#FCD535] hover:bg-[#eebb22] text-[#0b0e11] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(252,213,53,0.2)] hover:shadow-[0_0_20px_rgba(252,213,53,0.4)] transition-all flex items-center justify-center gap-2 md:min-w-[160px] whitespace-nowrap shrink-0"
                       >
                         {bridgeRunning ? (
                           <>
                             <span className="w-4 h-4 border-2 border-[#0b0e11]/30 border-t-[#0b0e11] rounded-full animate-spin"></span>
                             Synthesizing
                           </>
                         ) : (
                           <>
                             <Bot size={16} /> Ignite Bridge
                           </>
                         )}
                       </button>
                        <button onClick={async () => { try { const res = await fetch('/api/analyze-performance'); const data = await res.json(); setAlert(data.analysis || 'Analiz alınamadı'); } catch (e) { setAlert('Analiz hatası'); } }} className="px-6 py-3 w-full md:w-auto h-12 bg-slate-800 hover:bg-slate-700 dark:bg-white/10 dark:hover:bg-white/20 text-white disabled:opacity-50 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 md:min-w-[120px] whitespace-nowrap shrink-0" title="Strateji Performansını Analiz Et"> 📊 Analiz </button>
                     </div>
                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3 gap-3 md:gap-0 mt-1">
                       <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                         <span className="text-[10px] font-mono text-slate-500">Node Sensitivity:</span>
                         <input type="range" min="1" max="10" defaultValue="7" className="w-24 h-1 bg-slate-200 dark:bg-[#0b0e11] rounded-lg appearance-none cursor-pointer accent-[#FCD535]" />
                       </div>
                       <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                         <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500"><Wifi size={12} className="text-[#FCD535]" /> 14ms latency</span>
                         <div className="h-3 w-px bg-slate-300 dark:bg-slate-700"></div>
                         <span className="text-[10px] font-mono text-slate-500">Model: Gemini 3-Flash</span>
                       </div>
                     </div>
                   </div>
                </div>
                
                <div className="p-4 md:p-6 bg-slate-50 dark:bg-[#0b0e11] flex items-center justify-center relative overflow-hidden transition-all duration-300 min-h-[360px] sm:min-h-[260px]">
                  {!bridgeResult && !bridgeRunning && (
                     <div className="text-slate-400 dark:text-slate-600 font-mono text-sm flex flex-col items-center gap-3 animate-pulse">
                       <Network size={32} className="opacity-50 text-[#FCD535]" />
                       Awaiting Input Stream...
                     </div>
                  )}

                  {bridgeRunning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50/70 dark:bg-[#0b0e11]/80 backdrop-blur-sm z-20 transition-all duration-300">
                      <div className="relative w-48 h-48 flex items-center justify-center">
                         <div className="absolute inset-0 border border-[#FCD535]/20 rounded-full animate-[ping_2s_ease-out_infinite]"></div>
                         <div className="absolute inset-4 border border-[#FCD535]/10 rounded-full animate-[ping_2s_ease-out_infinite_0.5s]"></div>
                         <Hexagon size={48} className="text-[#FCD535] animate-[spin_3s_linear_infinite]" />
                         <div className="absolute -bottom-8 text-[10px] font-mono text-[#FCD535] font-bold uppercase tracking-widest animate-pulse">Resolving Vectors...</div>
                      </div>
                    </div>
                  )}

                  {bridgeResult && (
                    <div className={`w-full flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 relative transition-opacity duration-300 ${bridgeRunning ? 'opacity-0 pointer-events-none absolute' : 'opacity-100 animate-in fade-in zoom-in-95 duration-500'}`}>
                      {/* Left: Auris Node Sentiment */}
                      <div className="flex-1 flex flex-col items-center gap-3 w-full">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl transform transition-transform ${
                           bridgeResult.sentimentScore > 0 ? 'bg-gradient-to-br from-green-100 to-green-50 text-green-600 shadow-green-500/20 border border-green-200' : 
                           bridgeResult.sentimentScore < 0 ? 'bg-gradient-to-br from-red-100 to-red-50 text-red-600 shadow-red-500/20 border border-red-200' : 
                           'bg-gradient-to-br from-slate-200 to-slate-100 text-slate-600 shadow-slate-500/20 border border-slate-300'
                        } dark:from-[#181a20] dark:to-[#181a20] dark:border-white/10 dark:shadow-none`}>
                          <Bot size={36} className="drop-shadow-sm" />
                        </div>
                        <div className="text-center">
                          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-1">Auris Node Output</span>
                          <span className={`text-3xl font-mono font-black ${
                             bridgeResult.sentimentScore > 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                          }`}>
                            {bridgeResult.sentimentScore > 0 ? '+' : ''}{bridgeResult.sentimentScore.toFixed(3)}
                          </span>
                        </div>
                      </div>

                      {/* Center: The 9 Dimensions (Agents) */}
                      <div className="flex-1 flex justify-center relative w-full md:w-auto my-4 md:my-0">
                        <div className="absolute hidden md:block left-[calc(50%-100px)] lg:left-[-50%] top-1/2 w-[100px] lg:w-1/2 h-0.5 bg-gradient-to-r from-[#FCD535]/0 to-[#FCD535]/50"></div>
                        <div className="absolute hidden md:block right-[calc(50%-100px)] lg:right-[-50%] top-1/2 w-[100px] lg:w-1/2 h-0.5 bg-gradient-to-l from-[#FCD535]/0 to-[#FCD535]/50"></div>
                        <div className="absolute md:hidden top-[-60px] left-1/2 w-0.5 h-[60px] bg-gradient-to-b from-[#FCD535]/0 to-[#FCD535]/50 -translate-x-1/2"></div>
                        <div className="absolute md:hidden bottom-[-60px] left-1/2 w-0.5 h-[60px] bg-gradient-to-t from-[#FCD535]/0 to-[#FCD535]/50 -translate-x-1/2"></div>

                        <div className="grid grid-cols-3 gap-3 md:gap-3 relative z-10 w-fit p-4 md:p-0 bg-white/50 dark:bg-[#181a20]/50 md:bg-transparent md:dark:bg-transparent rounded-2xl backdrop-blur-sm md:backdrop-blur-none border md:border-none border-slate-200/50 dark:border-white/5">
                           {bridgeResult.rawSignals.map((sig: any, idx: number) => (
                             <motion.div 
                               initial={{ scale: 0, opacity: 0 }}
                               animate={{ scale: 1, opacity: 1 }}
                               transition={{ delay: idx * 0.05 + 0.1, type: "spring" }}
                               key={sig.id} 
                               className={`w-12 h-12 rounded-full flex items-center justify-center text-[10px] font-bold shadow-[0_2px_10px_rgba(0,0,0,0.1)] ${
                                 sig.value > 0 ? 'bg-gradient-to-br from-green-400 to-green-500 dark:from-green-500/20 dark:to-green-600/20 text-white dark:text-green-400 border border-green-500/30' : 
                                 sig.value < 0 ? 'bg-gradient-to-br from-red-400 to-red-500 dark:from-red-500/20 dark:to-red-600/20 text-white dark:text-red-400 border border-red-500/30' : 
                                 'bg-slate-300 dark:bg-[#0b0e11] text-slate-600 dark:text-slate-400 border border-slate-400/50 dark:border-white/10'
                               }`}
                               title={`Agent: ${sig.id}\nWeight: ${sig.weight}\nValue: ${sig.value.toFixed(2)}`}
                             >
                               {sig.id}
                             </motion.div>
                           ))}
                        </div>
                      </div>

                      {/* Right: Lighthouse Consensus */}
                      <div className="flex-1 flex flex-col items-center gap-3 w-full">
                        <motion.div 
                           initial={{ rotateY: 90 }}
                           animate={{ rotateY: 0 }}
                           transition={{ delay: 0.6, type: "spring", damping: 12 }}
                           className={`p-1.5 rounded-3xl ${
                             bridgeResult.decision.passed ? 
                               (bridgeResult.decision.action === 'BUY' ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-[0_0_20px_rgba(74,222,128,0.2)]' : 'bg-gradient-to-br from-red-400 to-red-600 shadow-[0_0_20px_rgba(248,113,113,0.2)]') : 
                               'bg-slate-300 dark:bg-slate-800'
                           }`}
                        >
                          <div className="w-28 h-28 bg-white dark:bg-[#181a20] rounded-2xl flex flex-col items-center justify-center gap-1.5 relative overflow-hidden">
                             {bridgeResult.decision.passed && (
                               <div className="absolute inset-0 bg-white/10 dark:bg-white/5 opacity-50 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.05)_10px,rgba(0,0,0,0.05)_20px)] dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)] pointer-events-none"></div>
                             )}
                             <Target size={28} className={bridgeResult.decision.action === 'BUY' ? 'text-green-500' : bridgeResult.decision.action === 'SELL' ? 'text-red-500' : 'text-[#FCD535]'} />
                             <span className={`text-2xl font-black tracking-tighter ${bridgeResult.decision.action === 'BUY' ? 'text-green-500' : bridgeResult.decision.action === 'SELL' ? 'text-red-500' : 'text-[#FCD535]'}`}>
                               {bridgeResult.decision.action}
                             </span>
                          </div>
                        </motion.div>
                        <div className="text-center">
                          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-1">Lighthouse Output</span>
                          <div className="flex gap-3 justify-center">
                            <span className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#181a20] px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">Γ: {bridgeResult.decision.coherence}%</span>
                            <span className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#181a20] px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">Vote: {bridgeResult.decision.positiveVotes}/9</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white dark:bg-[#181a20] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-xl dark:shadow-black/50 transition-colors duration-300">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2 mb-5">
                    <Activity size={16} className="text-[#FCD535]" />
                    Node Analytics & Swarm Vitals
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 items-center justify-items-center">
                    {[
                      { title: "Win Rate", value: "78%", stroke: "stroke-green-500", offset: 40 },
                      { title: "Entropy Load", value: "92%", stroke: "stroke-[#FCD535]", offset: 15 },
                      { title: "Execution", value: "12ms", stroke: "stroke-blue-500", offset: 60 },
                      { title: "Data Sync", value: "88%", stroke: "stroke-purple-500", offset: 20 },
                      { title: "Lighthouse", value: "6/9", stroke: "stroke-orange-500", offset: 5 },
                      { title: "Risk Index", value: "31%", stroke: "stroke-rose-500", offset: 120 }
                    ].map((gauge, i) => (
                      <div key={i} className={`flex flex-col items-center justify-center p-3 w-full bg-slate-50 dark:bg-[#0b0e11] rounded-xl border border-slate-100 dark:border-white/5 transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20`}>
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="28" className="stroke-slate-200 dark:stroke-white/5 fill-none" strokeWidth="4" />
                            <circle cx="32" cy="32" r="28" className={`${gauge.stroke} fill-none`} strokeWidth="4" strokeDasharray="175" strokeDashoffset={gauge.offset} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-sm font-bold text-slate-800 dark:text-white">{gauge.value}</span>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-500 text-center">{gauge.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="col-span-1 bg-white dark:bg-[#181a20] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none backdrop-blur-md transition-colors duration-300">
                    <div className="px-5 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
                        <Network size={16} className="text-slate-400" />
                        Top Strategies
                      </h3>
                    </div>
                    <div className="p-5 space-y-3">
                      {strategies.slice(0, 3).map(s => (
                        <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#0b0e11] border border-slate-100 dark:border-white/5 shadow-sm transition-colors duration-300">
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{s.name}</p>
                            <p className="text-[10px] font-mono text-slate-500">{s.signals} signals</p>
                          </div>
                          <div className={`text-sm font-mono font-bold ${s.performance.startsWith('+') ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                            {s.performance}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#181a20] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-xl dark:shadow-black/50 backdrop-blur-md transition-colors duration-300">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20 transition-colors duration-300 flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
                        <Terminal size={16} className="text-slate-400" />
                        Executed Trades
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-1 bg-[#FCD535]/10 text-[#FCD535] rounded">Live Log</span>
                    </div>
                    
                    <div className="w-full">
                      {trades.length === 0 ? (
                        <div className="px-6 py-12 text-center text-slate-500 font-mono text-xs">
                          Awaiting convergence of swarm nodes... No executions yet.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                          {trades.map((trade: any, idx: number) => (
                            <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${trade.side === 'BUY' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-500' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-500'}`}>
                                  {trade.side}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{trade.symbol}</span>
                                    <span className="text-[10px] bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 font-mono">{trade.amount} sz</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-slate-500">${trade.price?.toLocaleString()}</span>
                                    <span className="text-[10px] text-slate-400 font-mono opacity-50 truncate w-24">{trade.hash?.substring(0,10)}...</span>
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs text-slate-400 font-mono">{new Date(trade.timestamp).toLocaleTimeString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'Strategies' && (
            <div className="animate-in fade-in duration-150">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-2xl font-light text-slate-900 dark:text-slate-100">Quantum Strategies</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage, deploy, and monitor algorithmic trading variants.</p>
                </div>
                <button className="px-4 py-2 bg-[#FCD535] hover:bg-[#eebb22] text-[#0b0e11] text-sm font-bold rounded-lg shadow-sm">
                  + New Strategy
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...strategies, { id: '4', name: 'AR09 VWAP Confirm', signals: 12, performance: '+1.4%' }].map(s => (
                  <div key={s.id} className="bg-white dark:bg-[#181a20] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-xl dark:shadow-black/50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">{s.name}</h4>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Clodds Core</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 flex items-center justify-center">
                        <Network size={14} className="text-[#FCD535]" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Generated Signals</span>
                        <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{s.signals}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-mono text-slate-500 uppercase mb-1">P&L (24h)</span>
                        <span className={`text-lg font-bold ${s.performance.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{s.performance}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10">Configure</button>
                       <button className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FCD535]/10 text-[#FCD535] hover:bg-[#FCD535]/20 border border-[#FCD535]/20">Activate</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView !== 'Dashboard' && currentView !== 'Strategies' && (
            <div className="flex flex-col items-center justify-center p-20 text-center animate-in fade-in zoom-in-95">
              <Hexagon size={64} className="text-slate-200 dark:text-white/10 mb-6" />
              <h2 className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">{currentView} Module Loading</h2>
              <p className="text-sm text-slate-500 max-w-sm">Requires connection to Aureon remote nodes for synchronized data retrieval.</p>
            </div>
          )}

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full border-t border-slate-200 dark:border-white/5 bg-white/95 dark:bg-[#181a20]/90 backdrop-blur-xl z-30 pb-safe transition-colors duration-300">
        <div className="flex items-center justify-around p-2">
          <MobileNavButton icon={<Activity size={20} />} label="Dash" active={currentView === 'Dashboard'} onClick={() => setCurrentView('Dashboard')} />
          <MobileNavButton icon={<Network size={20} />} label="Strats" active={currentView === 'Strategies'} onClick={() => setCurrentView('Strategies')} />
          <MobileNavButton icon={<Database size={20} />} label="Artifacts" active={currentView === 'Artifacts'} onClick={() => setCurrentView('Artifacts')} />
          <MobileNavButton icon={<Terminal size={20} />} label="Logs" active={currentView === 'Logs'} onClick={() => setCurrentView('Logs')} />
          <MobileNavButton icon={<Settings size={20} />} label="Admin" active={currentView === 'Admin'} onClick={() => setCurrentView('Admin')} />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all focus:outline-none ${
      active 
        ? 'bg-slate-100 dark:bg-[#FCD535]/10 text-slate-900 dark:text-[#FCD535] font-medium border border-slate-200 dark:border-[#FCD535]/30' 
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'
    }`}>
      {icon}
      {label}
    </button>
  );
}

function MobileNavButton({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 focus:outline-none transition-colors ${
      active ? 'text-slate-900 dark:text-[#FCD535]' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
    }`}>
      <div className={`${active ? 'drop-shadow-[0_2px_4px_rgba(252,213,53,0.2)] dark:drop-shadow-[0_0_8px_rgba(252,213,53,0.4)]' : ''}`}>{icon}</div>
      <span className="text-[10px] font-medium">{label}</span>
      {active && <div className="absolute top-0 w-8 h-0.5 bg-slate-900 dark:bg-[#FCD535] rounded-b-full drop-shadow-[0_1px_2px_rgba(252,213,53,0.4)] dark:drop-shadow-[0_1px_4px_rgba(252,213,53,0.8)]" />}
    </button>
  );
}
