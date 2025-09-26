import { useState } from "react";
import API from "../api";

export default function SearchBar({ onAdd }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      // Tu backend devuelve un ARRAY (como el que pegaste)
      const res = await API.get(`/quotes/search?q=${encodeURIComponent(value)}`);
      // res.data === [ { id, name, symbol, ... }, ... ]
      setResults(Array.isArray(res.data) ? res.data : []);
      
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setResults([]);
    }
  };

  const handleAdd = async (coin) => {
    await onAdd((coin.symbol || "").toUpperCase(), coin.name);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar criptomoneda..."
        value={query}
        onChange={handleSearch}      
        className="search-input"
      />

      {/* Lista tipo : viñetas + botón pequeño al lado */}
      {query.trim().length >= 2 && (
        <ul className="results-list">
          {results.length === 0 ? (
            <li className="muted">Sin resultados…</li>
          ) : (
            results.map((coin) => (
              <li key={`${coin.id}-${coin.symbol}`}>
                {coin.name} ({coin.symbol})
                <button className="add-btn-min" onClick={() => handleAdd(coin)}>
                  + Agregar
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
