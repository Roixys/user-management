export type User = {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
};

export type NewUser = Omit<User, "id">;
