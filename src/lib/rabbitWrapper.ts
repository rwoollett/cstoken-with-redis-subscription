import amqp, { Connection } from 'amqplib';

class RabbitWrapper {
  private _client?: Connection;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access RabbitMQ connections');
    }
    return this._client;
  }

  async connect(user: string, pass: string, host: string, heartbeat=30) {
    this._client = await amqp.connect(`amqp://${user}:${pass}@${host}?heartbeat=${heartbeat}`);
    console.log(`Connected to RabbitMQ: @${host}?heartbeat=${heartbeat}`);
  }

  async disconnect() {
    const wait = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));
    await wait(500);
    await this.client.close();
    console.log('Closed RabbitMQ connection');
  }
}

const rabbitWrapper = new RabbitWrapper();

export { rabbitWrapper, RabbitWrapper };
