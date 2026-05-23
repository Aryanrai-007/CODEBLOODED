import Types "../types/event";
import List "mo:core/List";

module {
  public func getAll(events : List.List<Types.CalendarEvent>) : [Types.CalendarEvent] {
    events.toArray();
  };

  public func create(
    events : List.List<Types.CalendarEvent>,
    state : { var nextEventId : Nat },
    input : Types.CreateEventInput,
    now : Int,
  ) : Nat {
    let id = state.nextEventId;
    let event : Types.CalendarEvent = {
      id;
      subject = input.subject;
      description = input.description;
      date = input.date;
      time = input.time;
      category = input.category;
      createdAt = now;
    };
    events.add(event);
    state.nextEventId += 1;
    id;
  };

  public func update(
    events : List.List<Types.CalendarEvent>,
    id : Nat,
    input : Types.CreateEventInput,
  ) : Bool {
    var found = false;
    events.mapInPlace(
      func(event) {
        if (event.id == id) {
          found := true;
          { event with
            subject = input.subject;
            description = input.description;
            date = input.date;
            time = input.time;
            category = input.category;
          };
        } else {
          event;
        };
      }
    );
    found;
  };

  public func delete(events : List.List<Types.CalendarEvent>, id : Nat) : Bool {
    let sizeBefore = events.size();
    events.retain(func(event) { event.id != id });
    events.size() < sizeBefore;
  };
};
