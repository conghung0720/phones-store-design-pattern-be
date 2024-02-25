//collection
export const USERS_MODEL = 'users';

export const HEADER = {
  CLIENT_ID: 'CLIENT_ID',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-rtoken-id',
};

export enum Status{
  COMPLETED = 1,
  DELIVERING = 2,
  PACKAGING = 3,
  GETTING_ITEM = 4,
  IN_PROGRESS = 5,
  CANCELED = 6,
}

export enum Roles{
  Admin = "Admin",
  User = "User"
}