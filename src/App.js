import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
} from "lucide-react";

const CryptoPortfolioTracker = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [cryptoData, setCryptoData] = useState({});
  const [newHolding, setNewHolding] = useState({
    symbol: "",
    amount: "",
    purchasePrice: "",
  });
  const [loading, setLoading] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);

  // Mock crypto data - in real app, this would come from CoinGecko API
  const mockCryptoData = {
    BTC: { name: "Bitcoin", price: 43250, change24h: 2.5, icon: "₿" },
    ETH: { name: "Ethereum", price: 2580, change24h: -1.2, icon: "Ξ" },
    ADA: { name: "Cardano", price: 0.48, change24h: 3.1, icon: "₳" },
    DOT: { name: "Polkadot", price: 7.25, change24h: -0.8, icon: "●" },
    LINK: { name: "Chainlink", price: 15.8, change24h: 4.2, icon: "⬡" },
  };

  // Generate mock price history
  const generatePriceHistory = (basePrice, days = 7) => {
    const history = [];
    let currentPrice = basePrice;
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      currentPrice = currentPrice * (1 + variation);
      history.push({
        date: date.toLocaleDateString(),
        price: currentPrice,
      });
    }
    return history;
  };

  useEffect(() => {
    setCryptoData(mockCryptoData);
    // Generate sample price history for portfolio chart
    const sampleHistory = generatePriceHistory(50000, 30).map(
      (item, index) => ({
        ...item,
        portfolioValue: item.price * 0.5 + Math.random() * 10000, // Mock portfolio value
      })
    );
    setPriceHistory(sampleHistory);
  }, []);

  const addHolding = () => {
    if (!newHolding.symbol || !newHolding.amount || !newHolding.purchasePrice)
      return;

    const holding = {
      id: Date.now(),
      symbol: newHolding.symbol.toUpperCase(),
      amount: parseFloat(newHolding.amount),
      purchasePrice: parseFloat(newHolding.purchasePrice),
      dateAdded: new Date().toLocaleDateString(),
    };

    setPortfolio([...portfolio, holding]);
    setNewHolding({ symbol: "", amount: "", purchasePrice: "" });
  };

  const removeHolding = (id) => {
    setPortfolio(portfolio.filter((h) => h.id !== id));
  };

  const calculatePortfolioStats = () => {
    let totalValue = 0;
    let totalInvested = 0;

    portfolio.forEach((holding) => {
      const currentPrice = cryptoData[holding.symbol]?.price || 0;
      const currentValue = holding.amount * currentPrice;
      const invested = holding.amount * holding.purchasePrice;

      totalValue += currentValue;
      totalInvested += invested;
    });

    const totalPnL = totalValue - totalInvested;
    const totalPnLPercentage =
      totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    return { totalValue, totalInvested, totalPnL, totalPnLPercentage };
  };

  const { totalValue, totalInvested, totalPnL, totalPnLPercentage } =
    calculatePortfolioStats();

  const portfolioDistribution = portfolio.map((holding) => {
    const currentPrice = cryptoData[holding.symbol]?.price || 0;
    const currentValue = holding.amount * currentPrice;
    return {
      name: holding.symbol,
      value: currentValue,
      percentage: totalValue > 0 ? (currentValue / totalValue) * 100 : 0,
    };
  });

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Crypto Portfolio Tracker
        </h1>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
              </div>
              <Wallet className="text-blue-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Invested</p>
                <p className="text-2xl font-bold">
                  ${totalInvested.toFixed(2)}
                </p>
              </div>
              <DollarSign className="text-green-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total P&L</p>
                <p
                  className={`text-2xl font-bold ${
                    totalPnL >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ${totalPnL.toFixed(2)}
                </p>
              </div>
              {totalPnL >= 0 ? (
                <TrendingUp className="text-green-400" size={24} />
              ) : (
                <TrendingDown className="text-red-400" size={24} />
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total P&L %</p>
                <p
                  className={`text-2xl font-bold ${
                    totalPnLPercentage >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {totalPnLPercentage.toFixed(2)}%
                </p>
              </div>
              {totalPnLPercentage >= 0 ? (
                <TrendingUp className="text-green-400" size={24} />
              ) : (
                <TrendingDown className="text-red-400" size={24} />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Value Chart */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">
              Portfolio Value (30 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                  }}
                  labelStyle={{ color: "#F3F4F6" }}
                />
                <Line
                  type="monotone"
                  dataKey="portfolioValue"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Portfolio Distribution */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">
              Portfolio Distribution
            </h3>
            {portfolio.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={portfolioDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) =>
                      `${name} ${percentage.toFixed(1)}%`
                    }
                  >
                    {portfolioDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                    }}
                    formatter={(value) => [`$${value.toFixed(2)}`, "Value"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-72 text-gray-500">
                Add some holdings to see distribution
              </div>
            )}
          </div>
        </div>

        {/* Add New Holding */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h3 className="text-xl font-semibold mb-4">Add New Holding</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={newHolding.symbol}
              onChange={(e) =>
                setNewHolding({ ...newHolding, symbol: e.target.value })
              }
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Crypto</option>
              {Object.entries(cryptoData).map(([symbol, data]) => (
                <option key={symbol} value={symbol}>
                  {symbol} - {data.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={newHolding.amount}
              onChange={(e) =>
                setNewHolding({ ...newHolding, amount: e.target.value })
              }
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Purchase Price"
              value={newHolding.purchasePrice}
              onChange={(e) =>
                setNewHolding({ ...newHolding, purchasePrice: e.target.value })
              }
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={addHolding}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Add Holding
            </button>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Your Holdings</h3>
          {portfolio.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No holdings yet. Add your first crypto holding above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Asset</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Purchase Price</th>
                    <th className="text-left py-3 px-4">Current Price</th>
                    <th className="text-left py-3 px-4">Current Value</th>
                    <th className="text-left py-3 px-4">P&L</th>
                    <th className="text-left py-3 px-4">P&L %</th>
                    <th className="text-left py-3 px-4">24h Change</th>
                    <th className="text-left py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((holding) => {
                    const crypto = cryptoData[holding.symbol];
                    if (!crypto) return null;

                    const currentValue = holding.amount * crypto.price;
                    const investedValue =
                      holding.amount * holding.purchasePrice;
                    const pnl = currentValue - investedValue;
                    const pnlPercentage = (pnl / investedValue) * 100;

                    return (
                      <tr
                        key={holding.id}
                        className="border-b border-gray-700 hover:bg-gray-750"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{crypto.icon}</span>
                            <div>
                              <div className="font-semibold">
                                {holding.symbol}
                              </div>
                              <div className="text-sm text-gray-400">
                                {crypto.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {holding.amount.toFixed(6)}
                        </td>
                        <td className="py-3 px-4">
                          ${holding.purchasePrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          ${crypto.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          ${currentValue.toFixed(2)}
                        </td>
                        <td
                          className={`py-3 px-4 font-semibold ${
                            pnl >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          ${pnl.toFixed(2)}
                        </td>
                        <td
                          className={`py-3 px-4 font-semibold ${
                            pnlPercentage >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {pnlPercentage.toFixed(2)}%
                        </td>
                        <td
                          className={`py-3 px-4 ${
                            crypto.change24h >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          
                          {crypto.change24h >= 0 ? "+" : ""}
                          {crypto.change24h.toFixed(2)}%
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => removeHolding(holding.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoPortfolioTracker;
