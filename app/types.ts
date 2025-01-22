// Type for Queue properties
export interface QueueProperties {
  LockDuration: string; // ISO 8601 duration
  RequiresDuplicateDetection: boolean;
  RequiresSession: boolean;
  DefaultMessageTimeToLive: string; // ISO 8601 duration
  DeadLetteringOnMessageExpiration: boolean;
  DuplicateDetectionHistoryTimeWindow: string; // ISO 8601 duration
  MaxDeliveryCount: number;
  ForwardTo: string;
  ForwardDeadLetteredMessagesTo: string;
}

// Type for a single Queue
export interface Queue {
  Name: string;
  Properties: QueueProperties;
}

// Type for Subscription properties
export interface SubscriptionProperties {
  LockDuration: string; // ISO 8601 duration
  RequiresSession: boolean;
  DefaultMessageTimeToLive: string; // ISO 8601 duration
  DeadLetteringOnMessageExpiration: boolean;
  MaxDeliveryCount: number;
  ForwardTo: string;
  ForwardDeadLetteredMessagesTo: string;
}

// Type for a single Subscription
export interface Subscription {
  Name: string;
  Properties: SubscriptionProperties;
  Rules: SubscriptionRule[]; // Extend if rules are enabled
}

// Type for Topic properties
export interface TopicProperties {
  DefaultMessageTimeToLive: string; // ISO 8601 duration
  DuplicateDetectionHistoryTimeWindow: string; // ISO 8601 duration
  AutoDeleteOnIdle: string; // ISO 8601 duration
  MaxSizeInMegabytes: number;
  RequiresDuplicateDetection: boolean;
  EnableBatchedOperations: boolean;
  SupportOrdering: boolean;
  EnableFilteringMessagesBeforePublishing: boolean;
  IsAnonymousAccessible: boolean;
  Status: string;
  UserMetadata: string;
  EnablePartitioning: boolean;
  EnableExpress: boolean;
  IsReadOnly: boolean;
}

// Type for a single Topic
export interface Topic {
  Name: string;
  Properties: TopicProperties;
  Subscriptions: Subscription[];
}

// Type for Subscription Rules (if applicable)
export interface SubscriptionRule {
  Name: string;
  Properties: {
    IsReadOnly: boolean;
    Filter: boolean;
    Action: boolean;
    CorrelationFilter: {
      Properties: Record<string, string>; // Arbitrary properties
    };
  };
}

// Type for the entire configuration
export interface UserConfig {
  Namespaces: Namespace[];
  Logging: {
    Type: string; // e.g., "File"
  };
}

// Type for a single Namespace
export interface Namespace {
  Name: string; // e.g., "sbemulatorns"
  Queues: Queue[];
  Topics: Topic[];
}
