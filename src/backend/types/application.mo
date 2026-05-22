import Common "common";

module {
  public type Timestamp = Common.Timestamp;

  public type Application = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    yearOfStudy : Text;
    department : Text;
    reasonForJoining : Text;
    priorExperience : Text;
    submittedAt : Timestamp;
  };

  public type SubmitResult = {
    #ok : Nat;
    #err : Text;
  };
};
