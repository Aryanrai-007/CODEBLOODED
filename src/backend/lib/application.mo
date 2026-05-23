import Types "../types/application";
import List "mo:core/List";

module {
  public func getAll(applications : List.List<Types.Application>) : [Types.Application] {
    applications.toArray();
  };

  public func delete(applications : List.List<Types.Application>, id : Nat) : Bool {
    let sizeBefore = applications.size();
    applications.retain(func(app) { app.id != id });
    applications.size() < sizeBefore;
  };

  public func approve(applications : List.List<Types.Application>, id : Nat) : Bool {
    var found = false;
    applications.mapInPlace(
      func(app) {
        if (app.id == id) {
          found := true;
          { app with status = #approved };
        } else {
          app;
        };
      }
    );
    found;
  };
};
