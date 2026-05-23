import Types "../types/application";
import AppLib "../lib/application";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (applications : List.List<Types.Application>) {
  var nextId : Nat = 0;

  public func submitApplication(
    name : Text,
    email : Text,
    phone : Text,
    yearOfStudy : Text,
    department : Text,
    reasonForJoining : Text,
    priorExperience : Text,
  ) : async Types.SubmitResult {
    let app : Types.Application = {
      id = nextId;
      name;
      email;
      phone;
      yearOfStudy;
      department;
      reasonForJoining;
      priorExperience;
      submittedAt = Time.now();
      status = #pending;
    };
    applications.add(app);
    nextId += 1;
    #ok(app.id);
  };

  public query func getApplications() : async [Types.Application] {
    AppLib.getAll(applications);
  };

  public func deleteApplication(id : Nat) : async Bool {
    AppLib.delete(applications, id);
  };

  public func approveApplication(id : Nat) : async Bool {
    AppLib.approve(applications, id);
  };
};
