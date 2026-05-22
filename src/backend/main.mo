import Types "types/application";
import ApplicationMixin "mixins/application-api";
import List "mo:core/List";

actor {
  let applications = List.empty<Types.Application>();

  include ApplicationMixin(applications);
};
