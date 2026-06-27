import List "mo:core/List";
import Types "../types/chess";
import ChessLib "../lib/chess";

mixin (
  players : List.List<Types.ChessPlayer>,
  scores : List.List<Types.ChessScore>
) {

  public func createChessPlayer(username : Text) : async Types.CreateResult {
    ChessLib.createPlayer(players, username);
  };

  public query func getChessPlayers() : async [Types.ChessPlayer] {
    ChessLib.listPlayers(players);
  };

  public func deleteChessPlayer(playerId : Text) : async Bool {
    ChessLib.deletePlayer(players, playerId);
  };

  public func submitChessScore(
    playerId : Text,
    botName : Text,
    score : Nat,
    result : Text,
    movesCount : Nat
  ) : async Types.ChessScoreResult {
    ChessLib.submitScore(scores, playerId, botName, score, result, movesCount);
  };

  public query func getChessScores() : async [Types.ChessScore] {
    ChessLib.listScores(scores);
  };

  public query func getChessLeaderboard() : async [Types.ChessScore] {
    ChessLib.getLeaderboard(scores);
  };
};
