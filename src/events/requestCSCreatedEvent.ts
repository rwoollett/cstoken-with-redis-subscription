import { Subjects } from './subjects';

export interface RequestCSCreatedEvent {
  subject: Subjects.RequestCSCreated;
  data: {
    requestedAt: string;
    relayed: boolean;
    sourceIp: string;
    originalIp: string;
    parentIp: string;
  };
}


