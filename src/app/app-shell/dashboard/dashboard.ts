import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

import { Router } from '@angular/router';

import { MockDashboardApi } from '../../core/mock-api/mock-dashboard';
import { ChartPaletteService, withAlpha } from '../../core/charts/chart-palette';
import { OnboardingStore, OnboardingStep } from './onboarding-store';

/**
 * Glacier Analytics dashboard — composes a KPI row, a 90-day revenue area
 * chart, a plan distribution donut chart, a top-pages bar list, an activity
 * feed, and a dismissible onboarding checklist into one OnPush component.
 *
 * Data comes from MockDashboardApi (HTTP-backed JSON fixtures). Chart colors
 * track ChartPaletteService so palette swaps and dark-mode flips redraw with
 * the correct tokens.
 */
@Component({
  selector: 'app-dashboard',
  imports: [
    DecimalPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    BaseChartDirective,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dashboard-host' },
})
export class Dashboard implements OnInit {
  private readonly router = inject(Router);
  protected readonly dashboard = inject(MockDashboardApi);
  protected readonly palette = inject(ChartPaletteService);
  protected readonly onboarding = inject(OnboardingStore);

  protected readonly revenueChart = signal<ChartConfiguration<'line'>>(this.buildRevenueChart());
  protected readonly plansChart = signal<ChartConfiguration<'doughnut'>>(this.buildPlansChart());

  protected readonly completedSteps = computed<number>(
    () => this.onboarding.steps().filter(s => s.done).length,
  );
  protected readonly onboardingProgress = computed<number>(() => {
    const steps = this.onboarding.steps();
    if (steps.length === 0) return 0;
    return Math.round((this.completedSteps() / steps.length) * 100);
  });

  constructor() {
    // Recompute the chart configs whenever the palette service swaps colors.
    effect(() => {
      // Track palette signal to trigger rebuilds on theme/palette changes.
      this.palette.palette();
      this.revenueChart.set(this.buildRevenueChart());
      this.plansChart.set(this.buildPlansChart());
    });

    // Read real CSS token values once the first render finishes.
    afterNextRender(() => {
      this.palette.recompute();
    });
  }

  async ngOnInit(): Promise<void> {
    await this.dashboard.load();
    // Rebuild chart data after fixtures land.
    this.revenueChart.set(this.buildRevenueChart());
    this.plansChart.set(this.buildPlansChart());
  }

  protected dismissOnboarding(): void {
    this.onboarding.dismiss();
  }

  protected resetOnboarding(): void {
    this.onboarding.reset();
  }

  protected onStepClick(step: OnboardingStep): void {
    this.onboarding.toggleStep(step.id);
  }

  protected async onContinue(): Promise<void> {
    const next = this.onboarding.nextIncompleteStep();
    if (next?.href) {
      await this.router.navigate([next.href]);
    }
  }

  protected formatKpi(value: number, unit: string): string {
    if (unit === 'USD') {
      return `$${value.toLocaleString()}`;
    }
    if (unit === '%') {
      return `${value}%`;
    }
    if (unit === 'users') {
      return value.toLocaleString();
    }
    return value.toLocaleString();
  }

  protected deltaLabel(delta: number): string {
    const sign = delta >= 0 ? '+' : '';
    return `${sign}${delta.toFixed(1)}%`;
  }

  protected feedIcon(type: string): string {
    switch (type) {
      case 'signup':
        return 'person_add';
      case 'upgrade':
        return 'upgrade';
      case 'alert':
        return 'warning';
      case 'invoice':
        return 'receipt_long';
      case 'comment':
        return 'chat_bubble';
      default:
        return 'info';
    }
  }

  protected stepIcon(step: OnboardingStep): string {
    return step.done ? 'check_circle' : 'radio_button_unchecked';
  }

  private buildRevenueChart(): ChartConfiguration<'line'> {
    const points = this.dashboard.revenue();
    const p = this.palette.palette();
    return {
      type: 'line',
      data: {
        labels: points.map(pt => pt.label),
        datasets: [
          {
            label: '日營收',
            data: points.map(pt => pt.value),
            borderColor: p.primary,
            backgroundColor: withAlpha(p.primary, 0.15),
            pointBackgroundColor: p.primary,
            pointBorderColor: p.surface,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.4,
            fill: true,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` $${Number(ctx.parsed.y).toLocaleString()}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
          },
          y: {
            grid: { color: withAlpha(p.outlineVariant, 0.4) },
            ticks: {
              callback: v => `$${Number(v).toLocaleString()}`,
            },
          },
        },
      },
    };
  }

  private buildPlansChart(): ChartConfiguration<'doughnut'> {
    const plans = this.dashboard.plans().plans;
    const p = this.palette.palette();
    const colors = [p.primary, p.tertiary, p.secondary, p.error];
    return {
      type: 'doughnut',
      data: {
        labels: plans.map(plan => plan.label),
        datasets: [
          {
            label: '方案分布',
            data: plans.map(plan => plan.count),
            backgroundColor: plans.map((_, i) => colors[i % colors.length]!),
            borderColor: p.surface,
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 10, padding: 12 } },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${Number(ctx.parsed).toLocaleString()} 位`,
            },
          },
        },
      },
    };
  }
}
