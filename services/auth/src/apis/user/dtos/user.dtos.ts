import { User } from "../schemas/user.schema";

export type UserCreateDTO = Omit<User, "_id"|"password"> & {password: string}

export type UserUpdateDTO = User;