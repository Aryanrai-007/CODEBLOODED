import Common "common";

module {
  public type Timestamp = Common.Timestamp;

  public type ChessPlayer = {
    playerId : Text;
    username : Text;
    createdAt : Timestamp;
  };

  public type CreateResult = {
    #ok : Text; // returns playerId
    #err : Text;
  };

  public type ChessScore = {
    playerId : Text;
    botName : Text;
    score : Nat;
    result : Text;
    movesCount : Nat;
    createdAt : Timestamp;
  };

  public type ChessScoreResult = {
    #ok;
    #err : Text;
  };
};
