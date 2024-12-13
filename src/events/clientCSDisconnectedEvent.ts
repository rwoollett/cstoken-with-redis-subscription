import { Subjects } from './subjects';

export interface ClientCSDisconnectedEvent {
  subject: Subjects.ClientCSDisconnected;
  data: {
    sourceIp: string;
    disconnectedAt: string;
  };
}


