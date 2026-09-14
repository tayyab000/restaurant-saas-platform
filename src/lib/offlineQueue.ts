// src/lib/offlineQueue.ts
// Offline-first sync utility representing IndexedDB queue

export interface SyncEvent {
  id: string;
  type: string;
  payload: {
    order?: {
      localId: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  timestamp: number;
  status: 'QUEUED' | 'SYNCING' | 'SYNCED' | 'FAILED';
}

class OfflineQueue {
  private queue: SyncEvent[] = [];

  // In real app, this would save to IndexedDB
  async enqueue(type: string, payload: SyncEvent['payload']) {
    const event: SyncEvent = {
      id: crypto.randomUUID(),
      type,
      payload,
      timestamp: Date.now(),
      status: 'QUEUED',
    };
    this.queue.push(event);
    await this.sync();
    return event;
  }

  async getPendingEvents() {
    return this.queue.filter(e => e.status === 'QUEUED' || e.status === 'FAILED');
  }

  async sync() {
    const pending = await this.getPendingEvents();
    if (pending.length === 0) return;

    if (!navigator.onLine) {
      console.log('Offline. Will sync when online.');
      return;
    }

    try {
      const response = await fetch('/api/orders/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': localStorage.getItem('tenantId') || '',
        },
        body: JSON.stringify(pending),
      });

      if (response.ok) {
        const { results } = await response.json();
        results.forEach((res: { localId: string }) => {
          const event = this.queue.find(e => e.payload.order?.localId === res.localId);
          if (event) {
            event.status = 'SYNCED';
          }
        });
      }
    } catch (error) {
      console.error('Sync failed', error);
      pending.forEach(e => e.status = 'FAILED');
    }
  }
}

export const syncQueue = typeof window !== 'undefined' ? new OfflineQueue() : null;
