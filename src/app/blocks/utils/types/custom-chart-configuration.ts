/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update utils/types`
*/

import {
  ChartConfiguration,
  ChartOptions,
  ChartType,
  DefaultDataPoint,
} from 'chart.js';

export type VerticalHoverLineOptions = {
  color?: string;
};

export type HoverSegmentOptions = {
  color?: string;
  indexAxis?: 'x' | 'y';
};

type PluginsOf<TType extends ChartType> =
  ChartOptions<TType> extends { plugins?: infer P } ? NonNullable<P> : never;

export type CustomPluginOptionsByType<TType extends ChartType> =
  PluginsOf<TType> & {
    verticalHoverLine?: VerticalHoverLineOptions;
    hoverSegment?: HoverSegmentOptions;
  };

export type CustomChartOptions<TType extends ChartType = ChartType> = Omit<
  ChartOptions<TType>,
  'plugins'
> & {
  plugins?: CustomPluginOptionsByType<TType>;
};

export type CustomChartConfiguration<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown,
> = Omit<ChartConfiguration<TType, TData, TLabel>, 'options'> & {
  options?: CustomChartOptions<TType>;
};
