import { Channel, Connection, Message } from 'amqplib';
import { Subjects, Listener, ArticlePublishedEvent } from '../index';
import {
  ArticleBySlugDocument, ArticleBySlugQuery, CreateArticleDocument, CreateArticleMutation
} from '../../generated/graphql-local';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core';

export class ArticlePublishedListener extends Listener<ArticlePublishedEvent> {
  readonly subject = Subjects.ArticlePublished;
  protected apolloClient: ApolloClient<NormalizedCacheObject>;

  public constructor(client: Connection, apolloClient: ApolloClient<NormalizedCacheObject>) {
    super(client);
    this.apolloClient = apolloClient;
  }

  async onMessage(channel: Channel, data: ArticlePublishedEvent['data'], msg: Message) {
    const { slug } = data;
    await this.apolloClient.query<ArticleBySlugQuery>({
      query: ArticleBySlugDocument,
      variables: { slug },
      fetchPolicy: 'no-cache',
    }).then(async (article) => {
      if (article.data.articleBySlug === null) {
        await this.apolloClient.mutate<CreateArticleMutation>(
          {
            mutation: CreateArticleDocument,
            variables: { slug }
          }
        )
        console.log(`Article published consumed: ${slug}`);
      }
    });
    console.log(`Article published consumed ack'd: ${slug}`);
    channel.ack(msg);
  };

}