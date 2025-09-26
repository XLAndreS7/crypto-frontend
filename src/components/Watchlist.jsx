import React from "react";

export default function Watchlist({ coins, onRemove }) {
  return (
    <div>
      <h2>Lista de Cryptos</h2>
      {coins.map((coin) => (
        <div key={coin.symbol} className="crypto-card">
          <div className="crypto-info">
            <div className="crypto-name">
              {coin.name} ({coin.symbol})
            </div>
            <div className="crypto-stats">
              <span>💲 Precio: ${coin.price_usd?.toLocaleString()}</span>
              <span className={coin.percent_change_24h >= 0 ? "price-up" : "price-down"}>
                📊 24h: {coin.percent_change_24h?.toFixed(2)}%
              </span>
              <span>🏦 Market Cap: ${coin.market_cap?.toLocaleString()}</span>
            </div>
          </div>
          <div className="crypto-actions">
            <button onClick={() => onRemove(coin.symbol)}>❌ Quitar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
