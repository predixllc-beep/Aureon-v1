import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import ccxt from 'ccxt';
import crypto from 'crypto';
import client from 'prom-client';
import fs from 'fs/promises';
import { isTradingQuery, extractMarketContext } from './src/lib/gemini-strategy-router.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Prometheus Metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'aureon_' });

const tradesCounter = new client.Counter({
  name: 'aureon_executed_trades_total',
  help: 'Total number of executed trades'
});

const pnlGauge = new client.Gauge({
  name: 'aureon_current_pnl',
  help: 'Current mocked P&L for paper trading'
});
pnlGauge.set(12.4); // Mock initial P&L

// Initialize SQLite Database (simulating quantum_trading_db PostgreSQL)
const db = new Database(':memory:');

// Create Schema
db.exec(`
  -- Aureon Schema mimicking
  CREATE TABLE if not exists field_states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coherence REAL,
    agents_active INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE if not exists trade_signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT,
    side TEXT,
    strength REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE if not exists executed_trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    internal_id TEXT,
    exchange_id TEXT,
    symbol TEXT,
    side TEXT,
    amount REAL,
    price REAL,
    hash TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Clodds Schema mimicking
  CREATE TABLE if not exists messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  INSERT INTO field_states (coherence, agents_active) VALUES (0.87, 118);
`);

async function startServer() {
  const PORT = process.env.PORT || 3000;

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', lighthouse: 'ACTIVE' });
  });

  app.get('/api/status', (req, res) => {
    res.json({ status: 'ONLINE', uptime: process.uptime(), latency: Math.floor(Math.random() * 20) + 5 });
  });

  app.get('/api/analyze-performance', async (req, res) => {
    try {
      const { analyzePaperTradingLog } = await import('./src/lib/performance-analyzer.ts');
      const logPath = 'paper_trading_log.json';
      const analysis = await analyzePaperTradingLog(logPath);
      res.json({ success: true, analysis });
    } catch (error) {
      res.json({ success: false, error: 'Analiz başarısız' });
    }
  });

  app.get('/api/metrics', (req, res) => {
    const state = db.prepare('SELECT * FROM field_states ORDER BY timestamp DESC LIMIT 1').get() as any;
    const recentTrades = db.prepare('SELECT * FROM executed_trades ORDER BY timestamp DESC LIMIT 5').all();
    res.json({
      coherence: state?.coherence || 0.87,
      activeAgents: state?.agents_active || 118,
      signalStrength: 0.92, // mock value for Lambda 5
      trades: recentTrades
    });
  });

  app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    let userMessage = message || '';

    let responseContext = null;

    if (isTradingQuery(userMessage)) {
      const context = extractMarketContext(userMessage);
      try {
        const cloddsResponse = await fetch('http://localhost:8500/clodds/signal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(context)
        });
        const tradingSignal = await cloddsResponse.json();
        
        responseContext = tradingSignal;
      } catch (e) {
        console.error('Failed to communicate with Clodds bridge, using local mock for AI Studio', e);
        responseContext = { signal: 'BUY', confidence: 75, reason: 'Fiyat VWAP üstü + Altın Haç (Mocked)' };
        
        // Log locally to paper_trading_log.json for parity with python code
        const logFile = 'paper_trading_log.json';
        const logEntry = {
          timestamp: Date.now(),
          symbol: "BTC/USDT",
          strategy: "AR09_VWAP_MOCK",
          ...responseContext
        };
        try {
          const existing = JSON.parse(await fs.readFile(logFile, 'utf-8'));
          existing.push(logEntry);
          await fs.writeFile(logFile, JSON.stringify(existing, null, 2));
        } catch {
          await fs.writeFile(logFile, JSON.stringify([logEntry], null, 2));
        }
      }
    }

    res.json({ reply: 'Processed message', strategyContext: responseContext });
  });

  app.get('/api/clodds-status', async (req, res) => {
    try {
      const response = await fetch('http://localhost:8500/clodds/status');
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.json({ status: 'offline', error: 'Clodds bridge not running' });
    }
  });

  app.get('/api/strategies', (req, res) => {
    res.json([
      { id: 1, name: 'AUREON Quantum Momentum', type: 'quantum', active: true, signals: 45, performance: '+12.4%', riskLevel: 'HIGH', agents: 42, confidence: 94, history: [10, 12, 11, 14, 13, 16, 18, 17, 20] },
      { id: 2, name: 'Clodds NLP Arbitrage', type: 'nlp', active: true, signals: 12, performance: '+5.1%', riskLevel: 'MEDIUM', agents: 18, confidence: 88, history: [4, 5, 4, 6, 5, 8, 7, 9, 8] },
      { id: 3, name: 'Swarm Mean Reversion', type: 'swarm', active: false, signals: 0, performance: '-1.2%', riskLevel: 'LOW', agents: 0, confidence: 45, history: [10, 9, 8, 9, 7, 6, 5, 4, 3] },
      { id: 4, name: 'Lighthouse Consensus', type: 'consensus', active: true, signals: 89, performance: '+24.8%', riskLevel: 'CRITICAL', agents: 118, confidence: 99, history: [15, 18, 20, 24, 22, 28, 30, 32, 35] }
    ]);
  });

  app.post('/api/bridge/signal', async (req, res) => {
    // CloddsBot to AUREON bridge endpoint (Mocking ZeroMQ/Python bridge)
    const { symbol, side, strength } = req.body;
    if (!symbol || !side || !strength) {
      return res.status(400).json({ error: 'Invalid signal payload' });
    }

    // Record signal
    db.prepare('INSERT INTO trade_signals (symbol, side, strength) VALUES (?, ?, ?)').run(symbol, side, strength);
    
    // Lighthouse Protocol: execute if strength > 0.8 (6/9 vote simulation)
    if (strength >= 0.8) {
      // Paper trading interaction using CCXT on Binance Testnet
      try {
        const exchange = new ccxt.binance({
          enableRateLimit: true,
        });
        exchange.setSandboxMode(true); // VERY IMPORTANT: PAPER TRADING TESTNET

        let price = 0;
        try {
          const ticker = await exchange.fetchTicker(symbol);
          price = ticker.last || 0;
        } catch (e) {
          price = 60000; // fallback if binance rate-limits
        }

        const amount = 0.01; // fixed test amount
        const orderMatchInternalId = crypto.randomUUID();
        const rawData = `${orderMatchInternalId}-${symbol}-${side}-${amount}-${Date.now()}`;
        const hash = crypto.createHash('sha256').update(rawData).digest('hex');

        // Save execution
        db.prepare('INSERT INTO executed_trades (internal_id, exchange_id, symbol, side, amount, price, hash) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .run(orderMatchInternalId, `paper_${Date.now()}`, symbol, side, amount, price, hash);
        
        tradesCounter.inc();

        return res.json({ status: 'EXECUTED', order: { symbol, side, amount, price, hash } });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'ERROR', error: 'Order execution failed' });
      }
    }

    res.json({ status: 'LOGGED_NO_EXECUTION', reason: 'Insufficient Lighthouse Consensus' });
  });

  app.get('/api/signals', (req, res) => {
    res.json(db.prepare('SELECT * FROM trade_signals ORDER BY timestamp DESC LIMIT 10').all());
  });

  // Prometheus Metrics Endpoint
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.send(await client.register.metrics());
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
