export interface UserListModel {
  id: number;
  username: string;
  email: string;
  lastName: string;
  firstName: string;
  isActive: boolean;
  creation: string;
  lastLogin: string;
  roles: string[];
}
