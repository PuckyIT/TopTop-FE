import { createContext, useContext, ReactNode } from "react";
import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
import { createContextualCan } from "@casl/react";

// Định nghĩa lại các loại Actions và Subjects của bạn
type Actions = "read" | "update";
type Subjects = "ShortVideo" | "Profile" | "Analytics";  // Thêm Analytics vào Subjects

export type AppAbility = Ability<[Actions, Subjects]>;

export const AbilityContext = createContext<AppAbility | null>(null);

export const useAbility = () => {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error("useAbility must be used within AbilityProvider");
  }
  return context;
};

// Định nghĩa abilities cho các vai trò
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

// Sửa lại Can để sử dụng đúng kiểu AppAbility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Can = createContextualCan(AbilityContext.Consumer as any);  // Sửa kiểu truyền vào
