
import { Connection, Channel, Message, ConsumeMessage } from 'amqplib';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject']; // rabbit queue
  abstract onMessage(Channel: Channel, data: T['data'], msg: Message): void;
  protected client: Connection;
  protected channel: Channel|null;

  public constructor(client: Connection) {
    this.client = client;
    this.channel = null;
  }

  async listen() {
    const ch = await this.client.createChannel();
    const assertQueue = await ch.assertQueue(this.subject, {});
    console.log('established channel connection');

    await ch.consume(this.subject, (msg) => {
      if (msg) {
        const parsedData = this.parseMessage(msg);
        this.onMessage(ch, parsedData, msg);
      }
    });
  }

  async close() {
    console.log('Closing listener channel');
    this.channel && await this.channel.close();
  }
  parseMessage(msg: ConsumeMessage) {
    const data = msg.content;
    try {
      return typeof data === 'string'
      ? data
      : JSON.parse(data.toString('utf8'));

    } catch (err) {
      return err;
    }
  }
}
