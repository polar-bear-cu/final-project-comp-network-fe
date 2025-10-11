import { createContext, useContext, useState, type ReactNode } from "react";
import type { UserInterface } from "@/interface/user";

interface UserContextProps {
  user: UserInterface | null;
  setUser: (
    user:
      | UserInterface
      | null
      | ((prev: UserInterface | null) => UserInterface | null)
  ) => void;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserInterface | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
