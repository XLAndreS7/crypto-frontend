import { useEffect, useState } from "react";
import API from "./api";
import SearchBar from "./components/SearchBar";
import Watchlist from "./components/Watchlist";
import PriceChart from "./components/PriceChart";
import "./styles.css";

export default function App() {
  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState("");

  // 1) Trae la watchlist desde BD y la devuelve
  const fetchWatchlist = async () => {
    try {
      const { data } = await API.get("/watchlist");
      setWatchlist(data);
      return data; // <- devolver para encadenar
    } catch (e) {
      console.error("Error al cargar watchlist:", e);
      setLastError("No fue posible cargar la watchlist.");
      return [];
    }
  };

  // 2) Trae precios. Si le pasas una lista, usa esa; si no, usa el estado.
  const fetchQuotes = async (listOptional) => {
    const base = Array.isArray(listOptional) ? listOptional : watchlist;
    if (!base || base.length === 0) return;

    const symbols = base
      .map(w => (w.symbol || "").toString().trim().toUpperCase())
      .filter(Boolean)
      .join(",");

    if (!symbols) return;

    try {
      setLoading(true);
      setLastError("");
      const res = await API.get(`/quotes?symbols=${symbols}`);

      // res.data viene como objeto: { BTC: {...}, ETH: {...} }
      const coins = Object.values(res.data || {}).map(c => ({
        symbol: c.symbol,
        name: c.name,
        price_usd: c?.quote?.USD?.price ?? 0,
        percent_change_24h: c?.quote?.USD?.percent_change_24h ?? 0,
        market_cap: c?.quote?.USD?.market_cap ?? 0,
      }));

      if (coins.length > 0) setWatchlist(coins);
      else setLastError("No llegó información de precios para esos símbolos.");
    } catch (e) {
      console.error("Error al traer quotes:", e);
      setLastError("Error consultando precios (revisa backend/API key).");
    } finally {
      setLoading(false);
    }
  };

  // 3) Historial para el gráfico (opcional)
  const fetchHistory = async (symbol) => {
    try {
      const res = await API.get(`/history/${symbol}?limit=20`);
      setHistory(res.data);
    } catch (e) {
      console.error("Error al traer historial:", e);
    }
  };

  // 4) Agregar / Quitar y refrescar al instante
  const addToWatchlist = async (symbol, name) => {
    try {
      await API.post("/watchlist", { symbol, name });
      const fresh = await fetchWatchlist();   // trae símbolos desde BD
      await fetchQuotes(fresh);               // trae precios de inmediato
    } catch (e) {
      console.error("Error al agregar:", e);
    }
  };

  const removeFromWatchlist = async (symbol) => {
    try {
      await API.delete(`/watchlist/${symbol}`);
      const fresh = await fetchWatchlist();
      await fetchQuotes(fresh);
    } catch (e) {
      console.error("Error al quitar:", e);
    }
  };

  // 5) Carga inicial: símbolos -> precios (con retry corto)
  useEffect(() => {
    (async () => {
      const fresh = await fetchWatchlist();
      await fetchQuotes(fresh);
      setTimeout(() => fetchQuotes(), 1200); // retry defensivo (rate limit)
    })();

    const interval = setInterval(() => fetchQuotes(), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>CRYPTO IGNIWEB SAS</h1>

      <SearchBar onAdd={addToWatchlist} />

      {lastError && <p style={{ color: "crimson" }}>{lastError}</p>}
      {loading && <p>Cargando precios…</p>}

      <Watchlist coins={watchlist} onRemove={removeFromWatchlist} />
      {history.length > 0 && <PriceChart data={history} />}
    </div>
  );
}
