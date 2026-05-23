import Common "common";

module {
  public type Timestamp = Common.Timestamp;

  public type CalendarEvent = {
    id : Nat;
    subject : Text;
    description : Text;
    date : Text;
    time : Text;
    category : Text;
    createdAt : Timestamp;
  };

  public type CreateEventInput = {
    subject : Text;
    description : Text;
    date : Text;
    time : Text;
    category : Text;
  };
};
