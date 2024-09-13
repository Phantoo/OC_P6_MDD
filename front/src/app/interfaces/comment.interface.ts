import { Author } from "./author.interface";

export interface Comment 
{
    id: number;
    content: string;
    author: Author;
    createdAt: Date;
}
