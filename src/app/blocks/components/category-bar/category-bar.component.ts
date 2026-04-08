/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update components/category-bar`
*/

import { Component, computed, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { cx } from '../../utils/functions/cx';
import {
  AvailableChartColors,
  AvailableChartColorsKeys,
  getColorClassName,
} from '../../utils/functions/chart-utils';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export type CategoryBarMarker = {
  value: number;
  tooltip?: string;
};

export type CategoryBarProps = {
  values: number[];
  colors?: AvailableChartColorsKeys[];
  marker?: CategoryBarMarker;
  showLabels?: boolean;
};

const getMarkerBgColor = (
  marker: number | undefined,
  values: number[],
  colors: AvailableChartColorsKeys[],
): string => {
  if (marker === undefined) return '';

  if (marker === 0) {
    for (let index = 0; index < values.length; index++) {
      if (values[index] > 0) {
        return getColorClassName(colors[index], 'bg');
      }
    }
  }

  let prefixSum = 0;
  for (let index = 0; index < values.length; index++) {
    prefixSum += values[index];
    if (prefixSum >= marker) {
      return getColorClassName(colors[index], 'bg');
    }
  }

  return getColorClassName(colors[values.length - 1], 'bg');
};

const getPositionLeft = (
  value: number | undefined,
  maxValue: number,
): number => (value ? (value / maxValue) * 100 : 0);

const sumNumericArray = (arr: number[]) =>
  arr.reduce((prefixSum, num) => prefixSum + num, 0);

const formatNumber = (num: number): string => {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  return num.toFixed(1);
};

@Component({
  selector: 'ngm-dev-block-ui-category-bar',
  templateUrl: './category-bar.component.html',
  imports: [MatTooltip],
})
export class CategoryBarComponent {
  values = input.required<number[]>();
  colors = input<AvailableChartColorsKeys[]>(AvailableChartColors);
  marker = input<CategoryBarMarker>();
  showLabels = input(true, { transform: coerceBooleanProperty });

  // expose cx to template for composing classes with dynamic pieces
  public readonly cx = cx;

  readonly sumValues = computed(() => sumNumericArray(this.values()));

  readonly markerBgColor = computed(() =>
    getMarkerBgColor(this.marker()?.value, this.values(), this.colors()),
  );

  readonly adjustedMarkerValue = computed(() => {
    const marker = this.marker();
    if (marker === undefined) return undefined;
    if (marker.value < 0) return 0;
    const maxValue = this.sumValues();
    if (marker.value > maxValue) return maxValue;
    return marker.value;
  });

  readonly markerPositionLeft = computed(() =>
    getPositionLeft(this.adjustedMarkerValue(), this.sumValues()),
  );

  // Helper methods for template
  readonly formatNumber = formatNumber;
  readonly getPositionLeft = getPositionLeft;

  // Method to generate bar labels data
  generateBarLabels() {
    const values = this.values();
    const sumValues = this.sumValues();
    let prefixSum = 0;
    let sumConsecutiveHiddenLabels = 0;

    return values.map((widthPercentage, index) => {
      prefixSum += widthPercentage;

      const showLabel =
        (widthPercentage >= 0.1 * sumValues ||
          sumConsecutiveHiddenLabels >= 0.09 * sumValues) &&
        sumValues - prefixSum >= 0.1 * sumValues &&
        prefixSum >= 0.1 * sumValues &&
        prefixSum < 0.9 * sumValues;

      sumConsecutiveHiddenLabels = showLabel
        ? 0
        : (sumConsecutiveHiddenLabels += widthPercentage);

      const widthPositionLeft = getPositionLeft(widthPercentage, sumValues);

      return {
        index,
        prefixSum,
        showLabel,
        widthPositionLeft,
      };
    });
  }

  // Method to generate bar segments data
  generateBarSegments() {
    const values = this.values();
    const colors = this.colors();
    const maxValue = this.sumValues();

    return values.map((value, index) => {
      const barColor = colors[index] ?? 'gray';
      const percentage = (value / maxValue) * 100;
      return {
        index,
        value,
        barColor: barColor as AvailableChartColorsKeys,
        percentage,
        colorClass: getColorClassName(
          barColor as AvailableChartColorsKeys,
          'bg',
        ),
        isHidden: percentage === 0,
      };
    });
  }
}
