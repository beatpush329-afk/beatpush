/**
 * WebSocket Manager
 * Handles real-time connections for notifications, messaging, and live streaming
 */

import { useAuthStore } from '@/store/authStore';

export enum WebSocketEventType {
  // Connection events
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  RECONNECTING = 'reconnecting',

  // Notification events
  NOTIFICATION_NEW = 'notification:new',
  NOTIFICATION_READ = 'notification:read',
  NOTIFICATION_DELETE = 'notification:delete',

  // Messaging events
  MESSAGE_NEW = 'message:new',
  MESSAGE_READ = 'message:read',
  MESSAGE_DELETED = 'message:deleted',
  TYPING_INDICATOR = 'typing:indicator',

  // Live streaming events
  STREAM_STARTED = 'stream:started',
  STREAM_ENDED = 'stream:ended',
  STREAM_VIEWER_COUNT = 'stream:viewer_count',
  STREAM_COMMENT = 'stream:comment',

  // User presence events
  USER_ONLINE = 'user:online',
  USER_OFFLINE = 'user:offline',
  USER_STATUS_CHANGED = 'user:status_changed',

  // Beat events
  BEAT_PUBLISHED = 'beat:published',
  BEAT_FEATURED = 'beat:featured',
  BEAT_TRENDING = 'beat:trending',

  // Social events
  FOLLOW_USER = 'social:follow_user',
  LIKE_BEAT = 'social:like_beat',
  COMMENT_BEAT = 'social:comment_beat',

  // Payment events
  PAYMENT_RECEIVED = 'payment:received',
  ORDER_COMPLETED = 'order:completed',
  REFUND_PROCESSED = 'refund:processed',
}

export interface WebSocketMessage {
  type: WebSocketEventType;
  data: Record<string, any>;
  timestamp: number;
  userId?: string;
}

export interface WebSocketListener {
  (message: WebSocketMessage): void;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  read: boolean;
  createdAt: string;
  attachments?: Array<{ url: string; type: string }>;
}

export interface StreamUpdate {
  streamId: string;
  viewerCount: number;
  status: 'live' | 'ended';
  title: string;
  artistId: string;
  artistName: string;
}

class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string | null = null;
  private listeners: Map<WebSocketEventType, Set<WebSocketListener>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageQueue: WebSocketMessage[] = [];
  private isConnecting = false;

  constructor() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    // Convert HTTP to WS, HTTPS to WSS
    this.url = baseUrl
      .replace(/^http:\/\//, 'ws://')
      .replace(/^https:\/\//, 'wss://')
      .replace(/\/api\/v1$/, ''); // Remove API path if present
  }

  /**
   * Connect to WebSocket server
   */
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;
      this.token = token;

      try {
        this.ws = new WebSocket(`${this.url}/ws?token=${token}`);

        this.ws.onopen = () => {
          console.log('[WebSocket] Connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.emit(WebSocketEventType.CONNECTED, {});
          this.startHeartbeat();
          this.flushMessageQueue();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('[WebSocket] Failed to parse message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('[WebSocket] Error:', error);
          this.isConnecting = false;
          this.emit(WebSocketEventType.ERROR, { error: error.toString() });
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('[WebSocket] Disconnected');
          this.isConnecting = false;
          this.stopHeartbeat();
          this.emit(WebSocketEventType.DISCONNECTED, {});
          this.attemptReconnect();
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.token = null;
    this.reconnectAttempts = 0;
    this.messageQueue = [];
  }

  /**
   * Send message through WebSocket
   */
  send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message if not connected
      this.messageQueue.push(message);
      // Try to reconnect if not already attempting
      if (!this.isConnecting && this.token) {
        this.connect(this.token).catch(console.error);
      }
    }
  }

  /**
   * Subscribe to event type
   */
  subscribe(eventType: WebSocketEventType, listener: WebSocketListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        listeners.delete(listener);
      }
    };
  }

  /**
   * Unsubscribe from event type
   */
  unsubscribe(eventType: WebSocketEventType, listener: WebSocketListener): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  /**
   * Private: Handle incoming message
   */
  private handleMessage(message: WebSocketMessage): void {
    this.emit(message.type, message.data);
  }

  /**
   * Private: Emit event to all listeners
   */
  private emit(eventType: WebSocketEventType, data: Record<string, any>): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const message: WebSocketMessage = {
        type: eventType,
        data,
        timestamp: Date.now(),
      };
      listeners.forEach((listener) => {
        try {
          listener(message);
        } catch (error) {
          console.error(`[WebSocket] Error in listener for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Private: Attempt to reconnect
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    this.emit(WebSocketEventType.RECONNECTING, { attempt: this.reconnectAttempts });

    this.reconnectTimeout = setTimeout(() => {
      if (this.token) {
        this.connect(this.token).catch((error) => {
          console.error('[WebSocket] Reconnection failed:', error);
          this.attemptReconnect();
        });
      }
    }, delay);
  }

  /**
   * Private: Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Private: Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Private: Flush queued messages
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (message) {
        this.ws.send(JSON.stringify(message));
      }
    }
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get reconnection status
   */
  isReconnecting(): boolean {
    return this.reconnectAttempts > 0 && this.reconnectAttempts < this.maxReconnectAttempts;
  }
}

// Export singleton instance
export const wsManager = new WebSocketManager();

export default wsManager;
