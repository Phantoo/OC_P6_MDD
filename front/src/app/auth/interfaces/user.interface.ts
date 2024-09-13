import { Subject } from "../../interfaces/subject.interface";

export interface User
{
    id: number;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    subjects: Subject[];
}