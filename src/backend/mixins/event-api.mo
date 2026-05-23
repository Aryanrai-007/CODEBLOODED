import Types "../types/event";
import EventLib "../lib/event";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (events : List.List<Types.CalendarEvent>, eventState : { var nextEventId : Nat }) {
  public func createEvent(input : Types.CreateEventInput) : async Nat {
    EventLib.create(events, eventState, input, Time.now());
  };

  public query func getEvents() : async [Types.CalendarEvent] {
    EventLib.getAll(events);
  };

  public func updateEvent(id : Nat, input : Types.CreateEventInput) : async Bool {
    EventLib.update(events, id, input);
  };

  public func deleteEvent(id : Nat) : async Bool {
    EventLib.delete(events, id);
  };
};
