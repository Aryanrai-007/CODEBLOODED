import {
  useChessLeaderboard,
  useDeleteChessScore,
} from "../hooks/useChessScores";
import type { ChessScore } from "../types/chess";

export default function ChessLeaderboardTab() {
  const { data: scores, isLoading } = useChessLeaderboard();
  const deleteScore = useDeleteChessScore();

  const handleDelete = (scoreItem: ChessScore) => {
    if (window.confirm("Delete this score?")) {
      deleteScore.mutate({
        _playerId: scoreItem.playerId,
        _createdAt: scoreItem.createdAt,
      });
    }
  };

  const formatDate = (ts: bigint | number | string | undefined) => {
    if (!ts) return "—";
    const n = typeof ts === "bigint" ? Number(ts) : Number(ts);
    return new Date(n).toLocaleDateString();
  };

  const topScores = scores ? scores.slice(0, 10) : [];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4">
      <h2 className="text-xl font-semibold text-white mb-4">
        Chess Leaderboard
      </h2>

      {isLoading && <p className="text-white/70">Loading...</p>}

      {!isLoading && topScores.length === 0 && (
        <p className="text-white/70">No scores yet</p>
      )}

      {!isLoading && topScores.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-white">
            <thead>
              <tr className="bg-black/20 text-white/80 font-semibold">
                <th className="px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">Player</th>
                <th className="px-3 py-2 text-left">Bot</th>
                <th className="px-3 py-2 text-left">Score</th>
                <th className="px-3 py-2 text-left">Result</th>
                <th className="px-3 py-2 text-left">Moves</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left" />
              </tr>
            </thead>
            <tbody>
              {topScores.map((s, i) => (
                <tr
                  key={`${s.playerId}-${s.botName}-${i}`}
                  className="hover:bg-white/5 transition border-b border-white/10"
                >
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2">{s.playerId}</td>
                  <td className="px-3 py-2">{s.botName}</td>
                  <td className="px-3 py-2">{s.score}</td>
                  <td className="px-3 py-2">{s.result}</td>
                  <td className="px-3 py-2">{s.movesCount}</td>
                  <td className="px-3 py-2">{formatDate(s.createdAt)}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(s)}
                      className="text-red-400 hover:text-red-300 transition"
                      data-ocid="chess_leaderboard.delete_button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
