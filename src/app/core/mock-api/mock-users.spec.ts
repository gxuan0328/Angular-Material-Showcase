import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { MockUsersApi, MockUser } from './mock-users';

const SEED_USERS: MockUser[] = [
  {
    id: 'u-1',
    email: 'alice@example.com',
    displayName: 'Alice Chen',
    role: 'owner',
    status: 'active',
    avatar: 'AC',
    lastLoginAt: '2026-04-09T09:00:00+08:00',
    createdAt: '2025-01-01T00:00:00+08:00',
    tags: ['taipei'],
  },
  {
    id: 'u-2',
    email: 'bob@example.com',
    displayName: 'Bob Lin',
    role: 'analyst',
    status: 'invited',
    avatar: 'BL',
    lastLoginAt: '',
    createdAt: '2026-04-08T09:00:00+08:00',
    tags: ['engineering'],
  },
  {
    id: 'u-3',
    email: 'carol@example.com',
    displayName: 'Carol Wang',
    role: 'viewer',
    status: 'suspended',
    avatar: 'CW',
    lastLoginAt: '2026-03-01T09:00:00+08:00',
    createdAt: '2025-06-01T09:00:00+08:00',
    tags: ['hr'],
  },
];

describe('MockUsersApi', () => {
  let api: MockUsersApi;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockUsersApi,
      ],
    });
    api = TestBed.inject(MockUsersApi);
    httpMock = TestBed.inject(HttpTestingController);
    const loadPromise = api.load();
    httpMock.expectOne('assets/mock-data/users.json').flush({ users: SEED_USERS });
    await loadPromise;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads users from the JSON fixture', () => {
    expect(api.loaded()).toBe(true);
    expect(api.users().length).toBe(3);
    expect(api.stats().total).toBe(3);
    expect(api.stats().active).toBe(1);
    expect(api.stats().invited).toBe(1);
    expect(api.stats().suspended).toBe(1);
  });

  it('filteredUsers applies status filter', () => {
    api.setFilters({ status: 'active' });
    expect(api.filteredUsers().length).toBe(1);
    expect(api.filteredUsers()[0].email).toBe('alice@example.com');
  });

  it('filteredUsers applies role filter', () => {
    api.setFilters({ role: 'analyst' });
    expect(api.filteredUsers().length).toBe(1);
    expect(api.filteredUsers()[0].email).toBe('bob@example.com');
  });

  it('filteredUsers applies text search across name, email, and tags', () => {
    api.setFilters({ search: 'alice' });
    expect(api.filteredUsers().length).toBe(1);

    api.setFilters({ search: 'HR' });
    expect(api.filteredUsers().length).toBe(1);
    expect(api.filteredUsers()[0].id).toBe('u-3');
  });

  it('resetFilters returns to default all/all', () => {
    api.setFilters({ status: 'active', search: 'alice' });
    api.resetFilters();
    expect(api.filteredUsers().length).toBe(3);
  });

  it('create() rejects invalid email', async () => {
    const result = await api.create({
      email: 'not-an-email',
      displayName: 'X',
      role: 'viewer',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('InvalidCredentials');
  });

  it('create() rejects duplicate email', async () => {
    const result = await api.create({
      email: 'alice@example.com',
      displayName: 'Duplicate',
      role: 'viewer',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('EmailAlreadyInUse');
  });

  it('create() prepends a new user with status invited', async () => {
    const result = await api.create({
      email: 'new@example.com',
      displayName: 'New User',
      role: 'analyst',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe('invited');
      expect(result.value.avatar).toBe('NU');
    }
    expect(api.users().length).toBe(4);
    expect(api.users()[0].email).toBe('new@example.com');
  });

  it('update() patches the matching user', async () => {
    const result = await api.update('u-2', { status: 'active' });
    expect(result.ok).toBe(true);
    expect(api.getById('u-2')?.status).toBe('active');
  });

  it('update() returns UserNotFound for unknown id', async () => {
    const result = await api.update('does-not-exist', { status: 'active' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe('UserNotFound');
  });

  it('remove() deletes by id', async () => {
    const result = await api.remove('u-2');
    expect(result.ok).toBe(true);
    expect(api.users().length).toBe(2);
    expect(api.getById('u-2')).toBeUndefined();
  });

  it('bulkRemove() removes multiple users atomically', async () => {
    const result = await api.bulkRemove(['u-1', 'u-3']);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.removed).toBe(2);
    expect(api.users().length).toBe(1);
    expect(api.users()[0].id).toBe('u-2');
  });
});
