import { Author } from "./author.interface";
import { Subject } from "./subject.interface";
import { Comment } from "./comment.interface"

export interface Article 
{
    id: number;
    title: string;
    content: string;
    author: Author;
    subject: Subject;
    createdAt: Date;
    comments: Comment[];
}
