import { Subjects } from './subjects';

export interface ArticlePublishedEvent {
  subject: Subjects.ArticlePublished;
  data: {
    id: string;
    publishedAt: string;
    title: string;
    slug: string;
  };
}


