import List "mo:core/List";
import Map "mo:core/Map";
import Types "../types/game";
import GameLib "../lib/game";

mixin (
  players : List.List<Types.GamePlayer>,
  scores : List.List<Types.GameScore>,
  achievementStore : Map.Map<Text, Types.PlayerAchievement>,
  skinStore : Map.Map<Text, Types.PlayerSkin>
) {

  // --- Public player registration and login ---

  public func registerGamePlayer(
    username : Text,
    password : Text
  ) : async Types.RegisterResult {
    GameLib.registerPlayer(players, username, password);
  };

  public func loginGamePlayer(
    username : Text,
    password : Text
  ) : async Types.LoginResult {
    GameLib.loginPlayer(players, username, password);
  };

  // --- Public score submission and leaderboard ---

  public func submitGameScore(
    playerId : Text,
    gameId : Text,
    score : Nat,
    kills : Nat,
    waves : Nat
  ) : async Types.SubmitScoreResult {
    GameLib.submitScore(scores, players, playerId, gameId, score, kills, waves);
  };

  public query func getTopScores(
    gameId : Text,
    limit : Nat
  ) : async [Types.GameScore] {
    GameLib.getTopScores(scores, players, gameId, limit);
  };

  public query func getPlayerRank(
    gameId : Text,
    playerId : Text
  ) : async ?Types.PlayerRank {
    GameLib.getPlayerRank(scores, players, gameId, playerId);
  };

  public query func getGrandLeaderboard(
    limit : Nat
  ) : async [Types.PlayerRank] {
    GameLib.getGrandLeaderboard(scores, players, limit);
  };

  // --- Admin-only endpoints ---

  public query func getGamePlayers() : async [Types.GamePlayer] {
    GameLib.listPlayers(players);
  };

  public func deleteGamePlayer(playerId : Text) : async Bool {
    GameLib.deletePlayer(players, scores, playerId);
  };

  public func deleteGameScore(scoreId : Text) : async Bool {
    GameLib.deleteScore(scores, scoreId);
  };

  public query func getAllGameScores() : async [Types.GameScore] {
    GameLib.listAllScores(scores);
  };

  // --- Achievement endpoints ---

  public func unlockAchievement(
    playerId : Text,
    achievementId : Text
  ) : async Types.AchievementResult {
    GameLib.unlockAchievement(achievementStore, playerId, achievementId);
  };

  public query func getPlayerAchievements(
    playerId : Text
  ) : async [Types.PlayerAchievement] {
    GameLib.getPlayerAchievements(achievementStore, playerId);
  };

  // --- Skin endpoints ---

  public func unlockSkin(
    playerId : Text,
    skinId : Text
  ) : async Types.SkinResult {
    GameLib.unlockSkin(skinStore, playerId, skinId);
  };

  public query func getPlayerSkins(
    playerId : Text
  ) : async [Types.PlayerSkin] {
    GameLib.getPlayerSkins(skinStore, playerId);
  };

  public func equipSkin(
    playerId : Text,
    skinId : Text
  ) : async Types.SkinResult {
    GameLib.equipSkin(skinStore, playerId, skinId);
  };

  public query func getEquippedSkin(
    playerId : Text
  ) : async ?Types.PlayerSkin {
    GameLib.getEquippedSkin(skinStore, playerId);
  };
};
