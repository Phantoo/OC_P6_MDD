import { Comment } from "./comment.interface";

export interface CommentCreationResponse
{
    message: string;
    comment: Comment;
}
