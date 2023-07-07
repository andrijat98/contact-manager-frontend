export interface ModifyUser {
  tsid: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  isLoggedIn: boolean;
}
