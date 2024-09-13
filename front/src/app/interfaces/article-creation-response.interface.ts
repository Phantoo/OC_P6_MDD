import { Article } from "./article.interface";

export interface ArticleCreationResponse
{
    message: string;
    article: Article;
}
