import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/chess";
import Array "mo:core/Array";
import Int "mo:core/Int";

module {
  public type ChessPlayer = Types.ChessPlayer;
  public type ChessScore = Types.ChessScore;

  public func createPlayer(
    players : List.List<ChessPlayer>,
    username : Text
  ) : Types.CreateResult {
    let trimmed = username;
    if (trimmed == "") {
      return #err("Username cannot be empty");
    };
    let exists = players.find(func(p) { p.username == trimmed });
    switch (exists) {
      case (?_) { #err("Username already taken") };
      case null {
        let playerId = trimmed # "-" # Time.now().toText();
        let player : ChessPlayer = {
          playerId;
          username = trimmed;
          createdAt = Time.now();
        };
        players.add(player);
        #ok(playerId);
      };
    };
  };

  public func listPlayers(
    players : List.List<ChessPlayer>
  ) : [ChessPlayer] {
    players.toArray()
  };

  public func deletePlayer(
    players : List.List<ChessPlayer>,
    playerId : Text
  ) : Bool {
    let beforeSize = players.size();
    players.retain(func(p) { p.playerId != playerId });
    players.size() < beforeSize
  };

  public func submitScore(
    scores : List.List<ChessScore>,
    playerId : Text,
    botName : Text,
    score : Nat,
    result : Text,
    movesCount : Nat
  ) : Types.ChessScoreResult {
    let record : ChessScore = {
      playerId;
      botName;
      score;
      result;
      movesCount;
      createdAt = Time.now();
    };
    scores.add(record);
    #ok;
  };

  public func listScores(
    scores : List.List<ChessScore>
  ) : [ChessScore] {
    scores.toArray()
  };

  public func getLeaderboard(
    scores : List.List<ChessScore>
  ) : [ChessScore] {
    let all = scores.toArray();
    let sorted = all.sort(
      func(a, b) {
        let scoreCmp = Nat.compare(b.score, a.score);
        switch (scoreCmp) {
          case (#equal) { Int.compare(b.createdAt, a.createdAt) };
          case other { other };
        };
      }
    );
    let limit = if (sorted.size() > 10) 10 else sorted.size();
    Array.tabulate<ChessScore>(limit, func(i) { sorted[i] })
  };
};
