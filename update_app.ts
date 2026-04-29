import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Update fetchData to get strategies
content = content.replace(
  "if (res.ok) {",
  `const stratRes = await fetch('/api/strategies');
        if (stratRes.ok) {
          const stratData = await stratRes.json();
          setStrategies(stratData);
        }
        if (res.ok) {`
);

content = content.replace(/\{\[\.\.\.strategies, \{ id: '4', name: 'AR09 VWAP Confirm', signals: 12, performance: '\+1\.4%' \}\]\.map\(s => \(/g, "{(strategies.length > 0 ? strategies : [...strategies, { id: '4', name: 'AR09 VWAP Confirm', signals: 12, performance: '+1.4%' }]).map(s => (");

// 2. Add chart rendering inside strategy card
content = content.replace(
  `                    <div className="flex gap-2">\r\n                       <button className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10">Configure</button>\r\n                       <button className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FCD535]/10 text-[#FCD535] hover:bg-[#FCD535]/20 border border-[#FCD535]/20">Activate</button>\r\n                    </div>\r\n                  </div>`,
  `                    <div className="h-24 mb-4 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={(s.history || [10, 12, 11, 14, 13, 16, 18, 17, 20]).map((v: number, i: number) => ({ time: new Date(Date.now() - (10 - i) * 3600000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), value: v }))}>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#181a20', borderColor: '#333', borderRadius: '8px' }}
                            itemStyle={{ color: '#FCD535', fontWeight: 'bold' }}
                            labelStyle={{ color: '#aaa', fontSize: '10px', marginBottom: '4px' }}
                          />
                          <Line type="monotone" dataKey="value" stroke={s.performance?.startsWith('+') ? '#22c55e' : '#ef4444'} strokeWidth={2} dot={{ r: 3, fill: '#181a20', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#FCD535', stroke: '#181a20' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-2">
                       <button className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10">Configure</button>
                       <button className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FCD535]/10 text-[#FCD535] hover:bg-[#FCD535]/20 border border-[#FCD535]/20">Activate</button>
                    </div>
                  </div>`
);

content = content.replace(
  `                    <div className="flex gap-2">\n                       <button className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10">Configure</button>\n                       <button className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FCD535]/10 text-[#FCD535] hover:bg-[#FCD535]/20 border border-[#FCD535]/20">Activate</button>\n                    </div>\n                  </div>`,
  `                    <div className="h-24 mb-4 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={(s.history || [10, 12, 11, 14, 13, 16, 18, 17, 20]).map((v: number, i: number) => ({ time: new Date(Date.now() - (10 - i) * 3600000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), value: v }))}>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#181a20', borderColor: '#333', borderRadius: '8px' }}
                            itemStyle={{ color: '#FCD535', fontWeight: 'bold' }}
                            labelStyle={{ color: '#aaa', fontSize: '10px', marginBottom: '4px' }}
                          />
                          <Line type="monotone" dataKey="value" stroke={s.performance?.startsWith('+') ? '#22c55e' : '#ef4444'} strokeWidth={2} dot={{ r: 3, fill: '#181a20', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#FCD535', stroke: '#181a20' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-2">
                       <button className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10">Configure</button>
                       <button className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FCD535]/10 text-[#FCD535] hover:bg-[#FCD535]/20 border border-[#FCD535]/20">Activate</button>
                    </div>
                  </div>`
);


fs.writeFileSync('src/App.tsx', content);
