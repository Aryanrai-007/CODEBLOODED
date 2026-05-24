import AppTypes "types/application";
import EventTypes "types/event";
import ApplicationMixin "mixins/application-api";
import EventMixin "mixins/event-api";
import List "mo:core/List";
import GameTypes "types/game";
import GameMixin "mixins/game-api";
import Map "mo:core/Map";

actor {
  let applications = List.empty<AppTypes.Application>();
  let events = List.empty<EventTypes.CalendarEvent>();
  let eventState = { var nextEventId : Nat = 0 };

  let gamePlayers = List.empty<GameTypes.GamePlayer>();
  let gameScores = List.empty<GameTypes.GameScore>();
  let gameAchievements = Map.empty<Text, GameTypes.PlayerAchievement>();
  let gameSkins = Map.empty<Text, GameTypes.PlayerSkin>();

  include ApplicationMixin(applications);
  include EventMixin(events, eventState);
  include GameMixin(gamePlayers, gameScores, gameAchievements, gameSkins);
};
