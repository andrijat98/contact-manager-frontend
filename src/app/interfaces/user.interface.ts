export interface User {
  tsid: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  isLoggedIn: boolean;
}
