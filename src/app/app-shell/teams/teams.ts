import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { MockTeam, MockTeamsApi } from '../../core/mock-api/mock-teams';
import { MockUser, MockUsersApi } from '../../core/mock-api/mock-users';

interface ResolvedTeam {
  readonly team: MockTeam;
  readonly lead: MockUser | undefined;
  readonly members: readonly MockUser[];
}

@Component({
  selector: 'app-teams',
  imports: [
    RouterLink,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  template: `
    <div class="teams">
      <header class="teams__header">
        <div>
          <p class="teams__eyebrow">管理後台 · 團隊</p>
          <h1 class="teams__title">團隊與成員</h1>
          <p class="teams__subtitle">
            共 {{ teamsApi.teams().length }} 個團隊 · 跨部門檢視與管理成員歸屬
          </p>
        </div>
        <button mat-flat-button color="primary" type="button">
          <mat-icon>group_add</mat-icon>
          <span>新增團隊</span>
        </button>
      </header>

      <div class="teams__grid">
        @for (entry of resolved(); track entry.team.id) {
          <mat-card appearance="outlined" class="teams__card">
            <mat-card-header>
              <div mat-card-avatar class="teams__avatar">
                <mat-icon>{{ teamIcon(entry.team.id) }}</mat-icon>
              </div>
              <mat-card-title>{{ entry.team.name }}</mat-card-title>
              <mat-card-subtitle>
                {{ entry.team.description }} · {{ entry.team.memberCount }} 位成員
              </mat-card-subtitle>
            </mat-card-header>

            <mat-card-content class="teams__card-content">
              @if (entry.lead) {
                <div class="teams__lead">
                  <span class="teams__lead-avatar">{{ entry.lead.avatar }}</span>
                  <div class="teams__lead-text">
                    <strong>{{ entry.lead.displayName }}</strong>
                    <span>團隊主管</span>
                  </div>
                </div>
                <mat-divider />
              }

              <mat-list class="teams__members">
                @for (member of entry.members; track member.id) {
                  <mat-list-item [routerLink]="['/app/users', member.id]" class="teams__member-row">
                    <span matListItemAvatar class="teams__member-avatar">{{ member.avatar }}</span>
                    <span matListItemTitle>{{ member.displayName }}</span>
                    <span matListItemLine>{{ member.email }}</span>
                    <mat-chip matListItemMeta class="teams__role">{{
                      roleLabel(member.role)
                    }}</mat-chip>
                  </mat-list-item>
                }
              </mat-list>
            </mat-card-content>

            <mat-card-actions>
              <button mat-button type="button">
                <mat-icon>settings</mat-icon>
                團隊設定
              </button>
              <button mat-button color="primary" type="button">
                <mat-icon>person_add</mat-icon>
                邀請成員
              </button>
            </mat-card-actions>
          </mat-card>
        }
      </div>
    </div>
  `,
  styleUrl: './teams.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'teams-host' },
})
export class Teams implements OnInit {
  protected readonly teamsApi = inject(MockTeamsApi);
  private readonly usersApi = inject(MockUsersApi);

  protected readonly resolved = computed<readonly ResolvedTeam[]>(() =>
    this.teamsApi.teams().map<ResolvedTeam>(team => ({
      team,
      lead: this.usersApi.getById(team.lead),
      members: team.members.map(id => this.usersApi.getById(id)).filter((u): u is MockUser => !!u),
    })),
  );

  async ngOnInit(): Promise<void> {
    await Promise.all([this.usersApi.load(), this.teamsApi.load()]);
  }

  protected teamIcon(id: string): string {
    switch (id) {
      case 't-engineering':
        return 'code';
      case 't-design':
        return 'palette';
      case 't-bi':
        return 'insights';
      case 't-ops':
        return 'support_agent';
      case 't-marketing':
        return 'campaign';
      case 't-finance':
        return 'paid';
      default:
        return 'groups';
    }
  }

  protected roleLabel(role: string): string {
    const labels: Record<string, string> = {
      owner: '擁有者',
      admin: '管理員',
      analyst: '分析師',
      viewer: '檢視者',
    };
    return labels[role] ?? role;
  }
}
