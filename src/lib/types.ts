// src/lib/types.ts
import { Timestamp } from 'firebase/firestore';

export interface DataEntry {
  id: string;
  content: string;
  createdAt: Timestamp;
}

export interface DataEntryWithDate extends DataEntry {
    createdAt: Date;
}
