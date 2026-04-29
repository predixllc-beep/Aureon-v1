from contextlib import asynccontextmanager
from fastapi import FastAPI
import json
import os
import sys

# To allow relative imports if run from root
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from strategies.ar09_vwap_confirm import ar09_vwap_signal

app = FastAPI()

@app.post("/clodds/signal")
async def generate_signal(market_data: dict):
    signal = ar09_vwap_signal(market_data)
    # Test log'una yaz
    log_file = "paper_trading_log.json"
    log_entry = {
        "timestamp": market_data.get("timestamp"),
        "symbol": market_data.get("symbol", "unknown"),
        "strategy": "AR09_VWAP",
        **signal
    }
    # Append to log
    if os.path.exists(log_file):
        with open(log_file, 'r+') as f:
            try:
                logs = json.load(f)
            except:
                logs = []
            logs.append(log_entry)
            f.seek(0)
            json.dump(logs, f, indent=2)
    else:
        with open(log_file, 'w') as f:
            json.dump([log_entry], f, indent=2)

    return signal
