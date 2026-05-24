import Common "common";

module {
  public type Timestamp = Common.Timestamp;

  public type GamePlayer = {
    playerId : Text;
    username : Text;
    passwordHash : Text;
    createdAt : Timestamp;
  };

  public type GameScore = {
    scoreId : Text;
    playerId : Text;
    gameId : Text;
    score : Nat;
    killedEnemies : Nat;
    wavesCleared : Nat;
    achievedAt : Timestamp;
  };

  public type RegisterResult = {
    #ok : Text; // returns playerId
    #err : Text;
  };

  public type LoginResult = {
    #ok : GamePlayer;
    #err : Text;
  };

  public type SubmitScoreResult = {
    #ok : Text; // returns scoreId
    #err : Text;
  };

  public type PlayerRank = {
    playerId : Text;
    username : Text;
    score : Nat;
    rank : Nat;
  };

  public type PlayerAchievement = {
    achievementId : Text;
    playerId : Text;
    unlockedAt : Int;
  };

  public type PlayerSkin = {
    skinId : Text;
    playerId : Text;
    unlockedAt : Int;
    equipped : Bool;
  };

  public type AchievementResult = {
    #ok : Bool;
    #err : Text;
  };

  public type SkinResult = {
    #ok : Bool;
    #err : Text;
  };
};
