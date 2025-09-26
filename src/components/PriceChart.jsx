import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function PriceChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="fetched_at" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="price_usd" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
