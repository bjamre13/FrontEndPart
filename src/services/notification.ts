/**
 * Represents a notification.
 */
export interface Notification {
  /**
   * The recipient's email address.
   */
  recipient: string;
  /**
   * The subject of the notification.
   */
  subject: string;
  /**
   * The body of the notification.
   */
  body: string;
}

/**
 * Sends a notification.
 *
 * @param notification The notification to send.
 * @returns A promise that resolves when the notification is sent.
 */
export async function sendNotification(notification: Notification): Promise<void> {
  // TODO: Implement this by calling an API.
  console.log("Sending notification to", notification.recipient, "with subject", notification.subject);
}
