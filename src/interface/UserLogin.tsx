import User from "./User";

interface UserLoginContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

export default UserLoginContextType