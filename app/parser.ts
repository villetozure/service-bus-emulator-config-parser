import { durationToIso } from "./isoTime";
import {
  Queue,
  QueueProperties,
  Subscription,
  SubscriptionProperties,
  Topic,
  TopicProperties,
} from "./types";

export default class ServiceBusParser {
  parseXML(xmlString: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const root = xmlDoc.documentElement;
    const queues = this.parseQueues(root);
    const topics = this.parseTopics(root);

    return {
      UserConfig: {
        Namespaces: [
          {
            Name: "sbemulatorns",
            Queues: queues,
            Topics: topics,
          },
        ],
        Logging: {
          Type: "File",
        },
      },
    };
  }

  parseQueues(root: HTMLElement) {
    const queues: Queue[] = [];
    const queueElements = root.querySelectorAll("Queues > Queue");

    queueElements.forEach((queue) => {
      const queueData: Queue = {
        Name: this.getText(queue, "Path"),
        Properties: this.getQueueProperties(queue),
      };
      queues.push(queueData);
    });

    return queues;
  }

  parseTopics(root: HTMLElement) {
    const topics: Topic[] = [];
    const topicElements = root.querySelectorAll("Topics > Topic");

    topicElements.forEach((topic) => {
      const subscriptions: Subscription[] = [];
      const subscriptionElements = topic.querySelectorAll(
        "Subscriptions > Subscription"
      );

      subscriptionElements.forEach((sub) => {
        const subData: Subscription = {
          Name: this.getText(sub, "Name"),
          Properties: this.getSubscriptionProperties(sub),
          Rules: this.getSubscriptionRules(sub),
        };
        subscriptions.push(subData);
      });

      if (subscriptions.length > 0) {
        const topicData: Topic = {
          Name: this.getText(topic, "Path"),
          Properties: this.getTopicProperties(topic),
          Subscriptions: subscriptions,
        };
        topics.push(topicData);
      }
    });

    return topics;
  }

  getQueueProperties(queue: Element) {
    return {
      LockDuration: this.getIsoTime(queue, "LockDuration"),
      RequiresDuplicateDetection: this.getBool(
        queue,
        "RequiresDuplicateDetection"
      ),
      RequiresSession: this.getBool(queue, "RequiresSession"),
      DefaultMessageTimeToLive: this.getIsoTime(
        queue,
        "DefaultMessageTimeToLive"
      ),
      DeadLetteringOnMessageExpiration: this.getBool(
        queue,
        "EnableDeadLetteringOnMessageExpiration"
      ),
      DuplicateDetectionHistoryTimeWindow: this.getIsoTime(
        queue,
        "DuplicateDetectionHistoryTimeWindow"
      ),
      MaxDeliveryCount: this.getInt(queue, "MaxDeliveryCount"),
      ForwardTo: this.getText(queue, "ForwardTo"),
      ForwardDeadLetteredMessagesTo: this.getText(
        queue,
        "ForwardDeadLetteredMessagesTo"
      ),
    } as QueueProperties;
  }

  getTopicProperties(topic: Element) {
    return {
      DefaultMessageTimeToLive: this.getIsoTime(
        topic,
        "DefaultMessageTimeToLive"
      ),
      DuplicateDetectionHistoryTimeWindow: this.getIsoTime(
        topic,
        "DuplicateDetectionHistoryTimeWindow"
      ),
      AutoDeleteOnIdle: this.getIsoTime(topic, "AutoDeleteOnIdle"),
      MaxSizeInMegabytes: this.getInt(topic, "MaxSizeInMegabytes"),
      RequiresDuplicateDetection: this.getBool(
        topic,
        "RequiresDuplicateDetection"
      ),
      EnableBatchedOperations: this.getBool(topic, "EnableBatchedOperations"),
      SupportOrdering: this.getBool(topic, "SupportOrdering"),
      EnableFilteringMessagesBeforePublishing: this.getBool(
        topic,
        "EnableFilteringMessagesBeforePublishing"
      ),
      IsAnonymousAccessible: this.getBool(topic, "IsAnonymousAccessible"),
      Status: this.getText(topic, "Status"),
      UserMetadata: this.getText(topic, "UserMetadata"),
      EnablePartitioning: this.getBool(topic, "EnablePartitioning"),
      EnableExpress: this.getBool(topic, "EnableExpress"),
      IsReadOnly: this.getBool(topic, "IsReadOnly"),
    } as TopicProperties;
  }

  getSubscriptionProperties(sub: Element) {
    return {
      LockDuration: this.getIsoTime(sub, "LockDuration"),
      RequiresSession: this.getBool(sub, "RequiresSession"),
      DefaultMessageTimeToLive: this.getIsoTime(
        sub,
        "DefaultMessageTimeToLive"
      ),
      DeadLetteringOnMessageExpiration: this.getBool(
        sub,
        "EnableDeadLetteringOnMessageExpiration"
      ),
      MaxDeliveryCount: this.getInt(sub, "MaxDeliveryCount"),
      ForwardTo: this.getText(sub, "ForwardTo"),
      ForwardDeadLetteredMessagesTo: this.getText(
        sub,
        "ForwardDeadLetteredMessagesTo"
      ),
    } as SubscriptionProperties;
  }

  getSubscriptionRules(sub: Element) {
    console.log(sub);
    return [];
  }

  getIsoTime(element: Element, key: string) {
    const value = element.querySelector(key)?.textContent || "";

    if (!value) {
      return "";
    }

    const maxDuration = this.getMaxDuration(key);
    const minDuration = this.getMinDuration(key);

    return durationToIso(value, maxDuration, minDuration);
  }

  getMinDuration(key: string) {
    switch (key) {
      case "LockDuration":
        return 1 * 60 * 1000; // 1 minute;
      default:
        return 1 * 1000; // 1 second;
    }
  }

  getMaxDuration(key: string) {
    switch (key) {
      case "DuplicateDetectionHistoryTimeWindow":
      case "LockDuration":
        return 5 * 60 * 1000; // 5 minute;
      default:
        return 1 * 60 * 60 * 1000; // 1 hour
    }
  }

  getText(element: Element, key: string) {
    return element.querySelector(key)?.textContent?.trim() || "";
  }

  getBool(element: Element, key: string) {
    return element.querySelector(key)?.textContent === "True";
  }

  getInt(element: Element, key: string) {
    return parseInt(element.querySelector(key)?.textContent || "0", 10);
  }
}
