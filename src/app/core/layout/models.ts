/**
 * Layout primitive types shared across the four shells (landing, catalog,
 * admin, auth). Keep this file free of runtime logic — types only.
 */

export interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly icon?: string;
  readonly badge?: string;
  readonly children?: readonly NavItem[];
}

export interface Breadcrumb {
  readonly label: string;
  readonly href?: string;
}

export interface ShellLink {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

export type BlockDisplayCategory = 'application' | 'marketing' | 'enhanced';
