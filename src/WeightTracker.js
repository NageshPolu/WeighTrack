import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function WeightTracker() {
  const [entries, setEntries] = useState([]);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('weightData');
    if (saved) setEntries(JSON.parse(saved));
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    localStorage.setItem('weightData', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!weight || !date) {
      setMessage('Please enter both weight and date.');
      return;
    }
    const entry = {
      id: Date.now(),
      weight: parseFloat(weight),
      date,
    };
    setEntries([...entries, entry].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setWeight('');
    setMessage('Entry added!');
    setTimeout(() => setMessage(''), 3000);
  };

  const chartData = entries.map(e => ({
    ...e,
    dateFormatted: new Date(e.date).toLocaleDateString(),
  }));

  const stats = entries.length
    ? {
        start: entries[0].weight,
        current: entries[entries.length - 1].weight,
        change: (entries[entries.length - 1].weight - entries[0].weight).toFixed(1),
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-6 border border-green-200">
        <h1 className="text-3xl font-bold text-center text-green-600">🏋️‍♂️ Fitness Weight Tracker</h1>
        <p className="text-center text-gray-500">Track your weekly progress and crush your goals 💪</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Weight</label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="e.g. 72.4"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-green-200"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={addEntry}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Add Entry
            </button>
          </div>
        </div>

        {message && (
          <div className="text-center text-sm text-green-600 font-medium">{message}</div>
        )}

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-white">
            <div className="bg-green-500 rounded-xl p-4 shadow">
              <p className="text-sm">Start</p>
              <p className="text-2xl font-bold">{stats.start} kg</p>
            </div>
            <div className="bg-blue-500 rounded-xl p-4 shadow">
              <p className="text-sm">Current</p>
              <p className="text-2xl font-bold">{stats.current} kg</p>
            </div>
            <div className={`rounded-xl p-4 shadow ${stats.change < 0 ? 'bg-green-600' : 'bg-red-500'}`}>
              <p className="text-sm">Change</p>
              <p className="text-2xl font-bold">{stats.change} kg</p>
            </div>
          </div>
        )}

        {entries.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2 text-blue-800">Weight Chart</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateFormatted" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
