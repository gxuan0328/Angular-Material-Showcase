/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update filterbar/filterbar-3`
*/

import {
  Component,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  OnDestroy,
  inject,
  viewChild,
} from '@angular/core';

import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {
  OverlayModule,
  Overlay,
  OverlayRef,
  OverlayPositionBuilder,
  CdkOverlayOrigin,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { PortalModule } from '@angular/cdk/portal';
import { Subject, take, takeUntil } from 'rxjs';
// get device.service using `npx @ngm-dev/cli add utils/services`
import { DeviceService } from '../../utils/services/device.service';
interface ChartOption {
  value: string;
  label: string;
  icon: string;
  thumbnail: 'bar' | 'line' | 'donut';
  description: string;
  disabled?: boolean;
}

@Component({
  selector: 'ngm-dev-block-filterbar-3',
  templateUrl: './filterbar-3.component.html',
  imports: [MatSelectModule, MatIconModule, OverlayModule, PortalModule],
})
export class Filterbar3Component implements OnDestroy {
  private overlay = inject(Overlay);
  private overlayPositionBuilder = inject(OverlayPositionBuilder);
  private viewContainerRef = inject(ViewContainerRef);

  readonly tooltipTemplate =
    viewChild.required<TemplateRef<any>>('tooltipTemplate');
  readonly barChartThumbnail =
    viewChild.required<ElementRef>('barChartThumbnail');
  readonly lineChartThumbnail =
    viewChild.required<ElementRef>('lineChartThumbnail');
  readonly donutChartThumbnail = viewChild.required<ElementRef>(
    'donutChartThumbnail',
  );
  readonly trigger = viewChild.required(CdkOverlayOrigin);

  private overlayRef: OverlayRef | null = null;
  private destroy$ = new Subject<void>();
  private tooltipHoverState = {
    isOverOption: false,
    isOverTooltip: false,
  };
  private deviceService = inject(DeviceService);

  selectedChart = 'line';
  isTooltipOpen = false;
  activeChartOption: ChartOption | null = null;

  chartOptions: ChartOption[] = [
    {
      value: 'bar',
      label: 'Bar Chart',
      icon: 'bar_chart',
      thumbnail: 'bar',
      description:
        'Bar charts display data using rectangular bars of different heights. They are ideal for comparing values across categories.',
    },
    {
      value: 'line',
      label: 'Line Chart',
      icon: 'show_chart',
      thumbnail: 'line',
      description:
        'Line charts display information as a series of data points connected by straight line segments. They are ideal for showing trends over time.',
    },
    {
      value: 'donut',
      label: 'Donut Chart',
      icon: 'donut_large',
      thumbnail: 'donut',
      description:
        'Donut charts are circular charts with a hole in the center. They show the relationship of parts to a whole, similar to pie charts.',
    },
    {
      value: 'scatter',
      label: 'Scatter Plot',
      icon: 'scatter_plot',
      thumbnail: 'line',
      description:
        'Scatter plots use dots to represent values for two different variables. They are useful for showing the relationship between two variables.',
      disabled: true,
    },
  ];

  ngOnDestroy(): void {
    this.hideTooltip();
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSelectedChartOption(): ChartOption | undefined {
    return this.chartOptions.find(
      (option) => option.value === this.selectedChart,
    );
  }

  showTooltip(option: ChartOption, element: HTMLElement): void {
    this.deviceService.isHandset$
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((isHandset) => {
        if (isHandset) {
          return;
        }

        if (option.disabled) {
          return;
        }

        // If tooltip is already open for this option, don't recreate it
        if (this.overlayRef && this.activeChartOption === option) {
          this.tooltipHoverState.isOverOption = true;
          return;
        }

        this.hideTooltip();
        this.activeChartOption = option;
        this.tooltipHoverState.isOverOption = true;

        // Create position strategy
        const positionStrategy = this.overlayPositionBuilder
          .flexibleConnectedTo(new ElementRef(element))
          .withPositions([
            {
              originX: 'start',
              originY: 'center',
              overlayX: 'end',
              overlayY: 'center',
              offsetX: -8,
            },
          ]);

        // Create the overlay
        this.overlayRef = this.overlay.create({
          positionStrategy,
          scrollStrategy: this.overlay.scrollStrategies.close(),
          hasBackdrop: false,
        });

        // Create portal from template
        const portal = new TemplatePortal(
          this.tooltipTemplate(),
          this.viewContainerRef,
        );

        // Attach portal to overlay
        this.overlayRef.attach(portal);
      });
  }

  onTooltipMouseEnter(): void {
    this.tooltipHoverState.isOverTooltip = true;
  }

  onTooltipMouseLeave(): void {
    this.tooltipHoverState.isOverTooltip = false;
    // Use setTimeout to allow the mouse to move to the tooltip
    setTimeout(() => this.checkToHideTooltip(), 50);
  }

  onOptionMouseLeave(): void {
    this.tooltipHoverState.isOverOption = false;
    // Use setTimeout to allow the mouse to move to the tooltip
    setTimeout(() => this.checkToHideTooltip(), 50);
  }

  private checkToHideTooltip(): void {
    // Only hide if mouse is neither over the option nor the tooltip
    if (
      !this.tooltipHoverState.isOverOption &&
      !this.tooltipHoverState.isOverTooltip
    ) {
      this.hideTooltip();
    }
  }

  hideTooltip(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.tooltipHoverState.isOverOption = false;
    this.tooltipHoverState.isOverTooltip = false;
  }

  getThumbnailSvg(option: ChartOption): ElementRef | null {
    if (!option || !option.thumbnail) {
      return null;
    }

    switch (option.thumbnail) {
      case 'bar':
        return this.barChartThumbnail();
      case 'line':
        return this.lineChartThumbnail();
      case 'donut':
        return this.donutChartThumbnail();
      default:
        return null;
    }
  }

  onOptionKeyUp(matSelect: MatSelect): void {
    if (!matSelect.panelOpen) {
      return;
    }
    const activeOption = matSelect.options.find((option) => option.active);
    if (activeOption && !activeOption.disabled) {
      const chartOption = this.chartOptions.find(
        (option) => option.value === activeOption.value,
      );
      if (chartOption && !chartOption.disabled) {
        this.showTooltip(chartOption, activeOption._getHostElement());
        return;
      }
    }
    this.hideTooltip();
  }

  onOpenedChange(opened: boolean): void {
    if (!opened) {
      this.hideTooltip();
    }
  }
}
