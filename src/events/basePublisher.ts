
import { Connection } from 'amqplib';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  protected client: Connection;

  public constructor(client: Connection) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      return () => async () => {
        const ch = await this.client.createChannel();
        const assertQueue = await ch.assertQueue(this.subject, {});
        console.log(`established channel connection: consumer count = ${assertQueue.consumerCount}`);
        const result = ch.sendToQueue(this.subject, Buffer.from(JSON.stringify(data)));

        const wait = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));
        await wait(500);
        await this.client.close();
        console.log('closed connection');
        if (result) {
          console.log(" [x] Sent %s", JSON.stringify(data));
          console.log('Event published to subject', this.subject);
          resolve();
        } else {
          return reject("base publisher publish: send to queue error");
        }

      };
    });
  }
}