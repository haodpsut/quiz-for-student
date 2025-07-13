
import React from 'react';

const mockData = [
  { rank: 1, name: 'Alex Turing', score: 980 },
  { rank: 2, name: 'Brendan Eich', score: 950 },
  { rank: 3, name: 'Grace Hopper', score: 920 },
  { rank: 4, name: 'You', score: 890 },
  { rank: 5, name: 'Linus Torvalds', score: 850 },
];

const Leaderboard: React.FC = () => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Leaderboard (Demo)</h2>
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-lg mx-auto">
        <div className="space-y-4">
          {mockData.map((player) => (
            <div key={player.rank} className={`flex items-center justify-between p-3 rounded-lg ${player.name === 'You' ? 'bg-cyan-900/50' : 'bg-slate-700/50'}`}>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-slate-400 w-6 text-center">{player.rank}</span>
                <span className="font-semibold text-slate-200">{player.name}</span>
              </div>
              <span className="font-bold text-cyan-400">{player.score} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
