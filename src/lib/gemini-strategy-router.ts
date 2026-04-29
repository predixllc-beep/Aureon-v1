// /lib/gemini-strategy-router.ts
const TRADING_KEYWORDS = [
  'strateji', 'sinyal', 'trade', 'işlem', 'al', 'sat', 
  'VWAP', 'EMA', 'RSI', 'MACD', 'fiyat', 'BTC', 'ETH',
  'long', 'short', 'piyasa', 'analiz'
];

export function isTradingQuery(message: string): boolean {
  const lowerMsg = message.toLowerCase();
  return TRADING_KEYWORDS.some(keyword => lowerMsg.includes(keyword.toLowerCase()));
}

export function extractMarketContext(message: string): object {
  // Basit bir extraction - ileride Gemini ile geliştireceğiz
  return {
    raw_message: message,
    timestamp: Date.now(),
    detected_symbols: ['BTC/USDT'], // placeholder
    sentiment: 'neutral'
  };
}
