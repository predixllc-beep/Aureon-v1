# AR09 VWAP Confirm Stratejisi
# Alım Koşulu: Fiyat > VWAP && EMA9 > EMA26 (yukarı kesiş)
# Satım Koşulu: Fiyat < VWAP && EMA9 < EMA26 (aşağı kesiş)

def calculate_vwap(candles):
    """VWAP hesapla - (Fiyat * Hacim) / Hacim"""
    total_volume = sum(c['volume'] for c in candles)
    if total_volume == 0:
        return 0
    vwap = sum(c['close'] * c['volume'] for c in candles) / total_volume
    return vwap

def calculate_ema(prices, period):
    """EMA hesapla"""
    if len(prices) < period:
        return None
    multiplier = 2 / (period + 1)
    ema = sum(prices[:period]) / period
    for price in prices[period:]:
        ema = (price - ema) * multiplier + ema
    return ema

def ar09_vwap_signal(market_data):
    """
    market_data: {'symbol': 'BTC/USDT', 'candles': [...], 'current_price': float}
    Returns: {'signal': 'BUY'|'SELL'|'HOLD', 'confidence': 0-100}
    """
    candles = market_data.get('candles', [])
    if len(candles) < 30:
        return {'signal': 'HOLD', 'confidence': 0, 'reason': 'Yetersiz veri'}

    closes = [c['close'] for c in candles]
    current_price = market_data.get('current_price', closes[-1])

    vwap = calculate_vwap(candles[-24:])  # Gün içi VWAP
    ema9 = calculate_ema(closes, 9)
    ema26 = calculate_ema(closes, 26)

    if ema9 is None or ema26 is None:
        return {'signal': 'HOLD', 'confidence': 0, 'reason': 'EMA hesaplanamadı'}

    # Önceki mum için EMA değerleri (kesişim kontrolü)
    prev_closes = closes[:-1]
    prev_ema9 = calculate_ema(prev_closes, 9)
    prev_ema26 = calculate_ema(prev_closes, 26)

    # Altın Haç (Golden Cross) kontrolü
    golden_cross = prev_ema9 <= prev_ema26 and ema9 > ema26
    # Ölüm Haçı (Death Cross) kontrolü
    death_cross = prev_ema9 >= prev_ema26 and ema9 < ema26

    if current_price > vwap and golden_cross:
        return {'signal': 'BUY', 'confidence': 75, 'reason': 'Fiyat VWAP üstü + Altın Haç'}
    elif current_price < vwap and death_cross:
        return {'signal': 'SELL', 'confidence': 75, 'reason': 'Fiyat VWAP altı + Ölüm Haçı'}
    else:
        return {'signal': 'HOLD', 'confidence': 0, 'reason': 'Sinyal yok'}
