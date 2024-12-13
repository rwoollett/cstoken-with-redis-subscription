import { Subjects } from './subjects';

export interface ClientCSConnectedEvent {
  subject: Subjects.ClientCSConnected;
  data: {
    sourceIp: string;
    connectedAt: string;
    processId: string;
  };
}


