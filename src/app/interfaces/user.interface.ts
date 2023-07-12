import {UserRole} from "./userRole.interface";

export interface User {
  tsid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles: UserRole[];
  isLoggedIn: boolean;
}
