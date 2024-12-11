import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
import { MongoQuery } from "@casl/ability"; // Import MongoQuery if needed
import { createContextualCan } from "@casl/react";
import { createContext, useContext, ReactNode } from "react";

// Define your custom Actions and Subjects types
type Actions = "read" | "update";
type Subjects = "ShortVideo" | "Profile" | "Analytics";

// Use MongoQuery here if you need MongoDB-related queries
export type AppAbility = Ability<[Actions, Subjects], MongoQuery>;

export const AbilityContext = createContext<AppAbility | null>(null);

export const useAbility = () => {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error("useAbility must be used within AbilityProvider");
  }
  return context;
};

// Define abilities with MongoQuery if needed
const defineAbilitiesFor = (role: string): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(Ability as AbilityClass<AppAbility>);
  if (role === "user") {
    can("read", "ShortVideo");
    can("update", "Profile");
  } else if (role === "guest") {
    can("read", "ShortVideo");
  }
  return build();
};

export const AbilityProvider: React.FC<{ role: string; children: ReactNode }> = ({ role, children }) => {
  const ability = defineAbilitiesFor(role);

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
};

// Export Can component for easier usage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Can = createContextualCan(AbilityContext.Consumer as any);
