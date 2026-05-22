import Types "../types/application";
import List "mo:core/List";

module {
  public func getAll(applications : List.List<Types.Application>) : [Types.Application] {
    applications.toArray();
  };
};
