import CryptoCard from "./CryptoCard";

export default function Watchlist({ coins, onRemove }) {
  return (
    <div>
      <h2>Mi Watchlist</h2>
      {coins.map((coin) => (
        <CryptoCard key={coin.symbol} coin={coin} onRemove={onRemove} />
      ))}
    </div>
  );
}
