import { User } from "./user.interface";

export interface SessionInformation 
{
    user: User;
    token: string;
}
