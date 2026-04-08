import { NavItem, Breadcrumb, ShellLink, BlockDisplayCategory } from './models';

describe('core/layout/models', () => {
  it('NavItem carries a label, path, icon, and optional children', () => {
    const item: NavItem = {
      label: '儀表板',
      path: '/app/dashboard',
      icon: 'dashboard',
      children: [],
    };
    expect(item.label).toBe('儀表板');
    expect(item.path).toBe('/app/dashboard');
    expect(item.icon).toBe('dashboard');
    expect(item.children).toEqual([]);
  });

  it('Breadcrumb requires label and optional href', () => {
    const crumb: Breadcrumb = { label: '使用者', href: '/app/users' };
    expect(crumb.label).toBe('使用者');
    expect(crumb.href).toBe('/app/users');
  });

  it('ShellLink has label + external flag', () => {
    const link: ShellLink = { label: 'Docs', href: 'https://angular.dev', external: true };
    expect(link.external).toBe(true);
  });

  it('BlockDisplayCategory enumerates the three families', () => {
    const a: BlockDisplayCategory = 'application';
    const b: BlockDisplayCategory = 'marketing';
    const c: BlockDisplayCategory = 'enhanced';
    expect([a, b, c]).toEqual(['application', 'marketing', 'enhanced']);
  });
});
