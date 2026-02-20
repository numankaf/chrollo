import type { Request } from '@/types/collection';
import type { SocketMessage } from '@/types/socket';

export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  CANCELED: 'CANCELED',
} as const;

export type RequestStatus = (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  timestamp: number;
}

export interface TrackedRequest {
  requestKey: string;
  requestId: string;
  connectionId: string;
  status: RequestStatus;
  request: Request;
  response?: SocketMessage;
  testResults?: TestResult[];
  responseTime?: number;
  startTime: number;
  endTime?: number;
}

export interface RequestPendingEvent {
  requestKey: string;
  requestId: string;
  connectionId: string;
  request: Request;
  timestamp: number;
}

export interface RequestResolvedEvent {
  requestKey: string;
  response: SocketMessage;
  testResults: TestResult[];
  responseTime: number;
  timestamp: number;
}
