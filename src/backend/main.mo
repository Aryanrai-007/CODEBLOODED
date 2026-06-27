import AppTypes "types/application";
import EventTypes "types/event";
import ApplicationMixin "mixins/application-api";
import EventMixin "mixins/event-api";
import List "mo:core/List";

import ChessTypes "types/chess";
import ChessMixin "mixins/chess-api";



actor {
  let applications = List.empty<AppTypes.Application>();
  let events = List.empty<EventTypes.CalendarEvent>();
  let eventState = { var nextEventId : Nat = 0 };

  let chessPlayers = List.empty<ChessTypes.ChessPlayer>();
  let chessScores = List.empty<ChessTypes.ChessScore>();

  include ApplicationMixin(applications);
  include EventMixin(events, eventState);
  include ChessMixin(chessPlayers, chessScores);
};
