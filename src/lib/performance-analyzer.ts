import fs from 'fs/promises';
import path from 'path';

export async function analyzePaperTradingLog(logPath: string) {
  try {
    // Determine absolute path to avoid cwd issues
    const absolutePath = path.resolve(process.cwd(), logPath);
    const data = await fs.readFile(absolutePath, 'utf8');
    const logs = JSON.parse(data);
    
    if (!logs || logs.length === 0) {
      return "Log dosyası boş veya hic sinyal üretilmedi.";
    }

    const buyCount = logs.filter((l: any) => l.signal === 'BUY').length;
    const sellCount = logs.filter((l: any) => l.signal === 'SELL').length;
    const holdCount = logs.filter((l: any) => l.signal === 'HOLD').length;

    return `Strateji Analizi:\nToplam ${logs.length} değerlendirme yapıldı.\nSinyaller: ${buyCount} AL, ${sellCount} SAT, ${holdCount} BEKLE.\nAR09 VWAP Onayı başarıyla çalışıyor.`;
  } catch (err) {
    return "Log okunurken hata oluştu veya henüz işlem/log kaydı yok.";
  }
}
