import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { MockNotificationsApi, MockNotification } from './mock-notifications';

const SEED: MockNotification[] = [
  {
    id: 'n-1',
    type: 'system',
    severity: 'info',
    title: 'Sync done',
    message: 'Data sync finished',
    read: false,
    timestamp: '2026-04-09T09:00:00+08:00',
    href: '/app/reports',
  },
  {
    id: 'n-2',
    type: 'billing',
    severity: 'warning',
    title: 'Card expiring',
    message: 'VISA **** 4242',
    read: false,
    timestamp: '2026-04-09T08:30:00+08:00',
    href: '/app/billing',
  },
  {
    id: 'n-3',
    type: 'invite',
    severity: 'info',
    title: 'New member',
    message: 'Ivy joined',
    read: true,
    timestamp: '2026-04-08T22:00:00+08:00',
    href: '',
  },
];

describe('MockNotificationsApi', () => {
  let api: MockNotificationsApi;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockNotificationsApi,
      ],
    });
    api = TestBed.inject(MockNotificationsApi);
    httpMock = TestBed.inject(HttpTestingController);
    const p = api.load();
    httpMock.expectOne('assets/mock-data/notifications.json').flush({ notifications: SEED });
    await p;
  });

  afterEach(() => httpMock.verify());

  it('loads notifications and reports unread count', () => {
    expect(api.notifications().length).toBe(3);
    expect(api.unreadCount()).toBe(2);
  });

  it('filter "unread" returns only unread items', () => {
    api.setFilter('unread');
    expect(api.filtered().length).toBe(2);
    expect(api.filtered().every(n => !n.read)).toBe(true);
  });

  it('filter "system" returns only system type', () => {
    api.setFilter('system');
    expect(api.filtered().length).toBe(1);
    expect(api.filtered()[0].id).toBe('n-1');
  });

  it('filter "billing" returns only billing type', () => {
    api.setFilter('billing');
    expect(api.filtered().length).toBe(1);
    expect(api.filtered()[0].id).toBe('n-2');
  });

  it('markAsRead flips read flag', () => {
    api.markAsRead('n-1');
    expect(api.notifications().find(n => n.id === 'n-1')?.read).toBe(true);
    expect(api.unreadCount()).toBe(1);
  });

  it('markAllAsRead clears unread count', () => {
    api.markAllAsRead();
    expect(api.unreadCount()).toBe(0);
  });
});
