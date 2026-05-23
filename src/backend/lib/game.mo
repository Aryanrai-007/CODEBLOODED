import List "mo:core/List";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Types "../types/game";
import Time "mo:core/Time";

module {
  public type GamePlayer = Types.GamePlayer;
  public type GameScore = Types.GameScore;

  // ---------------------------------------------------------------------------
  // registerPlayer
  // ---------------------------------------------------------------------------
  public func registerPlayer(
    players : List.List<GamePlayer>,
    username : Text,
    passwordHash : Text
  ) : Types.RegisterResult {
    switch (players.find(func(p : GamePlayer) : Bool { p.username == username })) {
      case (?_) { #err "Username already taken" };
      case null {
        let playerId = Time.now().toText() # username;
        let player : GamePlayer = {
          playerId = playerId;
          username = username;
          passwordHash = passwordHash;
          createdAt = Time.now();
        };
        players.add(player);
        #ok playerId;
      };
    };
  };

  // ---------------------------------------------------------------------------
  // loginPlayer
  // ---------------------------------------------------------------------------
  public func loginPlayer(
    players : List.List<GamePlayer>,
    username : Text,
    passwordHash : Text
  ) : Types.LoginResult {
    switch (players.find(func(p : GamePlayer) : Bool { p.username == username })) {
      case null { #err "Username not found" };
      case (?player) {
        if (player.passwordHash == passwordHash) {
          #ok player;
        } else {
          #err "Incorrect password";
        };
      };
    };
  };

  // ---------------------------------------------------------------------------
  // listPlayers
  // ---------------------------------------------------------------------------
  public func listPlayers(
    players : List.List<GamePlayer>
  ) : [GamePlayer] {
    players.toArray();
  };

  // ---------------------------------------------------------------------------
  // deletePlayer  (cascade-deletes scores)
  // ---------------------------------------------------------------------------
  public func deletePlayer(
    players : List.List<GamePlayer>,
    scores : List.List<GameScore>,
    playerId : Text
  ) : Bool {
    let sizeBefore = players.size();
    players.retain(func(p : GamePlayer) : Bool { p.playerId != playerId });
    scores.retain(func(s : GameScore) : Bool { s.playerId != playerId });
    players.size() < sizeBefore;
  };

  // ---------------------------------------------------------------------------
  // submitScore  — UPSERT: one record per (playerId, gameId), keep highest
  // ---------------------------------------------------------------------------
  public func submitScore(
    scores : List.List<GameScore>,
    players : List.List<GamePlayer>,
    playerId : Text,
    gameId : Text,
    newScore : Nat,
    kills : Nat,
    waves : Nat
  ) : Types.SubmitScoreResult {
    switch (players.find(func(p : GamePlayer) : Bool { p.playerId == playerId })) {
      case null { #err "Player not found" };
      case (?_) {
        let existing = scores.find(
          func(s : GameScore) : Bool { s.playerId == playerId and s.gameId == gameId }
        );
        switch (existing) {
          case (?ex) {
            if (newScore > ex.score) {
              scores.mapInPlace(
                func(s : GameScore) : GameScore {
                  if (s.scoreId == ex.scoreId) {
                    {
                      scoreId = ex.scoreId;
                      playerId = ex.playerId;
                      gameId = ex.gameId;
                      score = newScore;
                      killedEnemies = kills;
                      wavesCleared = waves;
                      achievedAt = Time.now();
                    };
                  } else { s };
                }
              );
              #ok (ex.scoreId);
            } else {
              #ok (ex.scoreId);
            };
          };
          case null {
            let scoreId = Time.now().toText() # playerId # gameId;
            let newRec : GameScore = {
              scoreId = scoreId;
              playerId = playerId;
              gameId = gameId;
              score = newScore;
              killedEnemies = kills;
              wavesCleared = waves;
              achievedAt = Time.now();
            };
            scores.add(newRec);
            #ok scoreId;
          };
        };
      };
    };
  };

  // ---------------------------------------------------------------------------
  // getTopScores
  // One record per player (keep max), sorted descending, capped at `limit`.
  // ---------------------------------------------------------------------------
  public func getTopScores(
    scores : List.List<GameScore>,
    players : List.List<GamePlayer>,
    gameId : Text,
    limit : Nat
  ) : [GameScore] {
    ignore players;
    // Step 1: convert list to array
    let allArr = scores.toArray();
    // Step 2: filter by gameId
    let filtered = allArr.filter(func(s) { s.gameId == gameId });
    // Step 3: deduplicate by playerId keeping max score
    let deduped = List.empty<GameScore>();
    for (s in filtered.values()) {
      let idx = deduped.findIndex(func(d : GameScore) : Bool { d.playerId == s.playerId });
      switch (idx) {
        case (?i) {
          let prev = deduped.at(i);
          if (s.score > prev.score) {
            deduped.put(i, s);
          };
        };
        case null {
          deduped.add(s);
        };
      };
    };
    // Step 4: convert deduped list to array
    let dedupedArr = deduped.toArray();
    // Step 5: sort descending
    let sorted = dedupedArr.sort(
      func(a, b) {
        if (a.score > b.score) { #less }
        else if (a.score < b.score) { #greater }
        else { #equal };
      }
    );
    // Step 6: cap at limit
    if (sorted.size() <= limit) { sorted } else { sorted.sliceToArray(0, limit) };
  };

  // ---------------------------------------------------------------------------
  // getPlayerRank
  // ---------------------------------------------------------------------------
  public func getPlayerRank(
    scores : List.List<GameScore>,
    players : List.List<GamePlayer>,
    gameId : Text,
    playerId : Text
  ) : ?Types.PlayerRank {
    let topScores = getTopScores(scores, players, gameId, scores.size());
    var rank : Nat = 0;
    var playerScore : ?GameScore = null;
    var i : Nat = 0;
    for (s in topScores.values()) {
      i += 1;
      if (s.playerId == playerId) {
        rank := i;
        playerScore := ?s;
      };
    };
    switch (playerScore) {
      case null { null };
      case (?s) {
        switch (players.find(func(p : GamePlayer) : Bool { p.playerId == playerId })) {
          case null { null };
          case (?player) {
            ?{
              playerId = playerId;
              username = player.username;
              score = s.score;
              rank = rank;
            };
          };
        };
      };
    };
  };

  // ---------------------------------------------------------------------------
  // getGrandLeaderboard
  // For each player: sum best score per gameId. Sort descending. Top `limit`.
  // ---------------------------------------------------------------------------
  public func getGrandLeaderboard(
    scores : List.List<GameScore>,
    players : List.List<GamePlayer>,
    limit : Nat
  ) : [Types.PlayerRank] {
    // Step 1: materialise collections once
    let scoresArr = scores.toArray();
    let playersArr = players.toArray();
    // Step 2: per-player totals
    let totals = List.empty<{ playerId : Text; username : Text; total : Nat }>();
    for (player in playersArr.values()) {
      let playerScores = scoresArr.filter(func(s) { s.playerId == player.playerId });
      // Best score per gameId
      let gameMap = List.empty<{ gameId : Text; best : Nat }>();
      for (s in playerScores.values()) {
        let gi = gameMap.findIndex(
          func(g : { gameId : Text; best : Nat }) : Bool { g.gameId == s.gameId }
        );
        switch (gi) {
          case (?gidx) {
            let prev = gameMap.at(gidx);
            if (s.score > prev.best) {
              gameMap.put(gidx, { gameId = s.gameId; best = s.score });
            };
          };
          case null {
            gameMap.add({ gameId = s.gameId; best = s.score });
          };
        };
      };
      let gameTotalsArr = gameMap.toArray();
      var total : Nat = 0;
      for (g in gameTotalsArr.values()) {
        total += g.best;
      };
      totals.add({ playerId = player.playerId; username = player.username; total = total });
    };
    // Step 3: sort totals descending
    let totalsArr = totals.toArray();
    let sorted = totalsArr.sort(
      func(a, b) {
        if (a.total > b.total) { #less }
        else if (a.total < b.total) { #greater }
        else { #equal };
      }
    );
    // Step 4: take limit
    let limited : [{ playerId : Text; username : Text; total : Nat }] =
      if (sorted.size() <= limit) { sorted } else { sorted.sliceToArray(0, limit) };
    // Step 5: assign 1-based ranks via mapEntries
    limited.mapEntries<{ playerId : Text; username : Text; total : Nat }, Types.PlayerRank>(
      func(entry, i) : Types.PlayerRank {
        {
          playerId = entry.playerId;
          username = entry.username;
          score = entry.total;
          rank = i + 1;
        };
      }
    );
  };

  // ---------------------------------------------------------------------------
  // deleteScore
  // ---------------------------------------------------------------------------
  public func deleteScore(
    scores : List.List<GameScore>,
    scoreId : Text
  ) : Bool {
    let sizeBefore = scores.size();
    scores.retain(func(s : GameScore) : Bool { s.scoreId != scoreId });
    scores.size() < sizeBefore;
  };

  // ---------------------------------------------------------------------------
  // listAllScores
  // ---------------------------------------------------------------------------
  public func listAllScores(
    scores : List.List<GameScore>
  ) : [GameScore] {
    scores.toArray();
  };
};
