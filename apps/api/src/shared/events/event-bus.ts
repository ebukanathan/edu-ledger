import { EventEmitter } from 'node:events';

// In-process bus for cross-module communication without tight coupling.
// e.g. payments emits 'payment.recorded' -> reconciliation reacts.
// Swap for a real broker (SQS/Kafka) when extracting a module to a service.
export const eventBus = new EventEmitter();

export type DomainEvent<T = unknown> = {
  name: string;
  payload: T;
  occurredAt: Date;
};
