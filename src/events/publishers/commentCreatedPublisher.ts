import { Subjects, Publisher, CommentCreatedEvent } from '../index';

export class CommentCreatedPublisher extends Publisher<CommentCreatedEvent> {
  readonly subject = Subjects.CommentCreated;

}