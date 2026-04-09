import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface MockTeam {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly memberCount: number;
  readonly lead: string;
  readonly members: readonly string[];
}

interface TeamsDocument {
  readonly teams: readonly MockTeam[];
}

/**
 * In-memory teams API backed by `assets/mock-data/teams.json`.
 * Exposes team records with member id references. Resolving member
 * details is the caller's responsibility (see MockUsersApi.getById).
 */
@Injectable({ providedIn: 'root' })
export class MockTeamsApi {
  private readonly http = inject(HttpClient);

  private readonly _teams = signal<readonly MockTeam[]>([]);
  private readonly _loaded = signal<boolean>(false);

  readonly teams: Signal<readonly MockTeam[]> = this._teams.asReadonly();
  readonly loaded: Signal<boolean> = this._loaded.asReadonly();

  async load(): Promise<void> {
    if (this._loaded()) return;
    const doc = await firstValueFrom(this.http.get<TeamsDocument>('assets/mock-data/teams.json'));
    this._teams.set(doc.teams);
    this._loaded.set(true);
  }

  getById(id: string): MockTeam | undefined {
    return this._teams().find(t => t.id === id);
  }
}
