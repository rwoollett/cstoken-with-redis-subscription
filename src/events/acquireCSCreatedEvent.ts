import { Subjects } from './subjects';

export interface AcquireCSCreatedEvent {
  subject: Subjects.AcquireCSCreated;
  data: {
    ip: string;
    sourceIp: string;
    acquiredAt: string;
  };
}


