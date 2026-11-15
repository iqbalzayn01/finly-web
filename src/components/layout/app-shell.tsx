import { Link, useLocation } from '@tanstack/react-router';
import {
  Bell,
  Download,
  EyeOff,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Moon,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  Sun,
  TriangleAlert,
  WifiOff,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { BrandLogo } from '#/components/brand-logo';
import { CommandSearchDialog } from '#/components/layout/command-search-dialog';
import { MoneyValue } from '#/components/money-value';
import { QuickTransactionModal } from '#/components/transactions/quick-transaction-modal';
import { Avatar, AvatarFallback } from '#/components/ui/avatar';
import { Button } from '#/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu';
import {
  FloatingDock,
  type FloatingDockEntry,
  type FloatingDockItem,
} from '#/components/ui/floating-dock';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover';
import { Switch } from '#/components/ui/switch';
import { useFinly } from '#/context/finly-context';
import { calculateInvoiceSummary } from '#/lib/cashflow';
import { formatMonthYear } from '#/lib/format';
import { cn } from '#/lib/utils';

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const {
    profile,
    invoices,
    safeToSpend,
    todayISO,
    isInvoicingVisible,
    togglePrivacyBlur,
    openQuickEntry,
    exportCsv,
  } = useFinly();
  const { resolvedTheme, setTheme } = useTheme();

  const [searchOpen, setSearchOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const invoiceSummary = useMemo(
    () => calculateInvoiceSummary(invoices, todayISO),
    [invoices, todayISO],
  );

  const alertCount = useMemo(() => {
    let count = 0;
    if (invoiceSummary.overdueCount > 0) count += 1;
    else if (invoiceSummary.waitingCount > 0) count += 1;
    if (safeToSpend.status !== 'healthy') count += 1;
    return count;
  }, [
    invoiceSummary.overdueCount,
    invoiceSummary.waitingCount,
    safeToSpend.status,
  ]);

  const hasUrgentAlert =
    invoiceSummary.overdueCount > 0 || safeToSpend.status === 'deficit';

  const isAuthRoute =
    location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthRoute) {
    return (
      <div className="relative min-h-screen bg-background">
        {/* Background Gradient Blur (Primary #C9F31D + Tertiary #6366F1) */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-0 z-0 h-screen overflow-hidden select-none"
        >
          <div className="ambient-gradient-blur absolute -top-10 left-1/2 h-[75vh] w-[140%] -translate-x-1/2" />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  const navRouteItems: FloatingDockItem[] = [
    {
      id: 'home',
      title: 'Dashboard',
      to: '/',
      isActive: location.pathname === '/',
      icon: <LayoutDashboard />,
    },
    {
      id: 'history',
      title: 'History',
      to: '/history',
      isActive: location.pathname.startsWith('/history'),
      icon: <History />,
    },
    ...(isInvoicingVisible
      ? [
          {
            id: 'invoices',
            title: 'Invoices',
            to: '/invoices' as const,
            isActive: location.pathname.startsWith('/invoices'),
            icon: <FileText />,
          },
        ]
      : []),
    {
      id: 'settings',
      title: 'Settings',
      to: '/settings',
      isActive: location.pathname.startsWith('/settings'),
      icon: <Settings />,
    },
  ];

  const mobileDockItems: FloatingDockItem[] = [
    navRouteItems[0],
    navRouteItems[1],
    {
      id: 'add-transaction',
      title: 'Add Transaction',
      onClick: () => openQuickEntry('money_out'),
      variant: 'primary',
      icon: (
        <Plus className="stroke-[2.5] transition-transform duration-200 group-hover:rotate-90" />
      ),
    },
    ...navRouteItems.slice(2),
  ];

  const initials = profile.displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleToggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const alertDotBadge =
    alertCount > 0 ? (
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute top-0.5 right-0.5 z-20 size-2.5 rounded-full border-2 border-card',
          hasUrgentAlert ? 'bg-outflow' : 'bg-primary',
        )}
      />
    ) : null;

  const renderAlertsMenu = (
    trigger: ReactNode,
    align: 'center' | 'end' = 'end',
  ) => (
    <AlertsPopover
      trigger={trigger}
      align={align}
      todayISO={todayISO}
      invoiceSummary={invoiceSummary}
      safeToSpend={safeToSpend}
    />
  );

  const renderAccountMenu = (trigger: ReactNode) => (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="brutal-surface w-64 rounded-2xl border-2 border-border bg-popover p-2"
      >
        <DropdownMenuLabel className="flex flex-col gap-0.5 px-2.5 py-2">
          <p className="truncate font-mono text-xs font-extrabold text-foreground">
            {profile.displayName}
          </p>
          <p className="truncate font-mono text-[11px] font-normal text-muted-foreground">
            {profile.email}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-border" />

        {/* Hide Balances Toggle */}
        <div className="flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-xs">
          <div className="flex items-center gap-2">
            <EyeOff className="size-3.5 text-muted-foreground" />
            <span className="font-semibold text-foreground">Hide Balances</span>
          </div>
          <Switch
            size="sm"
            checked={profile.privacyBlurEnabled}
            onCheckedChange={(checked) => togglePrivacyBlur(checked)}
            aria-label="Toggle privacy balance mask"
          />
        </div>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          asChild
          className="rounded-xl px-2.5 py-2 text-xs font-semibold cursor-pointer"
        >
          <Link to="/settings">
            <Settings className="size-3.5" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={exportCsv}
          className="rounded-xl px-2.5 py-2 text-xs font-semibold cursor-pointer"
        >
          <Download className="size-3.5" />
          <span>Export CSV</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          asChild
          className="rounded-xl px-2.5 py-2 text-xs font-semibold text-outflow focus:text-outflow cursor-pointer"
        >
          <Link to="/login">
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const desktopDockItems: FloatingDockEntry[] = [
    {
      id: 'brand',
      title: 'Finly',
      to: '/',
      variant: 'brand',
      icon: <BrandLogo size={20} className="fill-black" />,
    },
    { type: 'divider', id: 'divider-nav' },
    ...navRouteItems,
    { type: 'divider', id: 'divider-actions' },
    {
      id: 'search',
      title: 'Search (⌘K)',
      onClick: () => setSearchOpen(true),
      icon: <Search />,
    },
    {
      id: 'theme',
      title: 'Switch between light and dark mode',
      onClick: handleToggleTheme,
      icon: (
        <>
          <Sun className="dark:hidden" />
          <Moon className="hidden dark:block" />
        </>
      ),
    },
    {
      id: 'notifications',
      title: 'Alerts',
      badge: alertDotBadge,
      icon: <Bell />,
      renderTrigger: (button) => renderAlertsMenu(button, 'center'),
    },
    {
      id: 'account',
      title: profile.displayName || 'Account',
      variant: 'avatar',
      icon: (
        <Avatar className="size-full rounded-full">
          <AvatarFallback className="rounded-full bg-primary font-mono text-[11px] font-extrabold text-primary-foreground">
            {initials || 'AZ'}
          </AvatarFallback>
        </Avatar>
      ),
      renderTrigger: (button) => renderAccountMenu(button),
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      {/* Background Gradient Blur (Primary #C9F31D + Tertiary #6366F1) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-screen overflow-hidden select-none"
      >
        <div className="ambient-gradient-blur absolute -top-10 left-1/2 h-[75vh] w-[140%] -translate-x-1/2" />
      </div>

      {/* Offline Banner */}
      {isOffline && (
        <div className="no-print sticky top-0 z-50 flex items-center justify-center gap-2 border-b-2 border-warning-border bg-warning-bg px-4 py-2 font-mono text-xs font-bold text-amber-900 dark:text-warning">
          <WifiOff className="size-3.5 shrink-0" />
          <span>Offline mode — changes are saved on your device</span>
        </div>
      )}

      {/* Desktop Top Floating Dock (>= 768px) */}
      <FloatingDock
        items={desktopDockItems}
        placement="top"
        ariaLabel="Main navigation"
      />

      {/* Mobile Top Header (< 768px) */}
      <header className="glass-header no-print sticky top-0 z-40 w-full md:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Brand Logo */}
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 rounded-xl py-1 pr-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="brutal-surface flex size-10 items-center justify-center rounded-xl bg-primary transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
              <BrandLogo size={22} className="fill-black" />
            </span>
            <span className="font-mono text-lg font-black tracking-tight text-foreground">
              Finly
            </span>
          </Link>

          {/* Mobile Header Action Controls */}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search transactions and invoices (Cmd+K)"
              className="size-10 rounded-xl border-2 border-border bg-card backdrop-blur-md hover:bg-accent/80"
            >
              <Search className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-foreground" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleToggleTheme}
              aria-label="Switch between light and dark mode"
              className="size-10 rounded-xl border-2 border-border bg-card backdrop-blur-md hover:bg-accent/80"
            >
              <Sun className="size-4 transition-transform duration-200 group-hover:rotate-45 dark:hidden" />
              <Moon className="hidden size-4 transition-transform duration-200 dark:block dark:group-hover:-rotate-12" />
            </Button>

            {renderAlertsMenu(
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="View alerts"
                className="relative size-10 rounded-xl border-2 border-border bg-card backdrop-blur-md hover:bg-accent/80"
              >
                <Bell className="size-4 transition-transform duration-200 group-hover:rotate-12" />
                {alertDotBadge}
              </Button>,
              'end',
            )}

            {renderAccountMenu(
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Open account menu"
                className="size-10 rounded-xl border-2 border-border bg-card p-0 backdrop-blur-md hover:bg-accent/80"
              >
                <Avatar className="size-7 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary font-mono text-[11px] font-extrabold text-primary-foreground">
                    {initials || 'AZ'}
                  </AvatarFallback>
                </Avatar>
              </Button>,
            )}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 p-4 pb-24 sm:p-6 sm:pb-24 md:pt-6 md:pb-8 lg:px-8">
        {children}
      </main>

      {/* Mobile Floating Dock Navigation (< 768px) */}
      <FloatingDock items={mobileDockItems} placement="bottom" />

      {/* Global Dialogs */}
      <CommandSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <QuickTransactionModal />
    </div>
  );
}

interface AlertsPopoverProps {
  trigger: ReactNode;
  align: 'center' | 'end';
  todayISO: string;
  invoiceSummary: ReturnType<typeof calculateInvoiceSummary>;
  safeToSpend: ReturnType<typeof useFinly>['safeToSpend'];
}

function AlertsPopover({
  trigger,
  align,
  todayISO,
  invoiceSummary,
  safeToSpend,
}: AlertsPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={12}
        className="brutal-surface w-80 rounded-2xl border-2 border-border bg-popover p-4"
      >
        <div className="flex items-center justify-between border-b-2 border-border pb-2.5">
          <p className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground">
            Alerts
          </p>
          <span className="font-mono text-[11px] font-semibold text-muted-foreground">
            {formatMonthYear(todayISO)}
          </span>
        </div>

        <div className="mt-3 space-y-2.5 text-xs">
          {invoiceSummary.overdueCount > 0 && (
            <Link
              to="/invoices"
              onClick={() => setOpen(false)}
              className="flex items-start gap-2.5 rounded-xl border-2 border-outflow-border bg-outflow-bg p-3 transition-transform hover:-translate-y-0.5"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-outflow" />
              <div>
                <p className="font-bold text-foreground">
                  {invoiceSummary.overdueCount} Overdue Invoice
                  {invoiceSummary.overdueCount > 1 ? 's' : ''}
                </p>
                <p className="text-muted-foreground">
                  <MoneyValue
                    amount={invoiceSummary.overdueAmount}
                    className="font-bold text-outflow"
                  />{' '}
                  past due — click to view
                </p>
              </div>
            </Link>
          )}

          {invoiceSummary.waitingCount > 0 && (
            <Link
              to="/invoices"
              onClick={() => setOpen(false)}
              className="flex items-start gap-2.5 rounded-xl border-2 border-border bg-muted/50 p-3 transition-transform hover:-translate-y-0.5 hover:bg-accent"
            >
              <FileText className="mt-0.5 size-4 shrink-0 text-info" />
              <div>
                <p className="font-bold text-foreground">
                  {invoiceSummary.waitingCount} Unpaid{' '}
                  {invoiceSummary.waitingCount === 1 ? 'Invoice' : 'Invoices'}
                </p>
                <p className="text-muted-foreground">
                  <MoneyValue
                    amount={invoiceSummary.waitingAmount}
                    className="font-bold text-foreground"
                  />{' '}
                  waiting for payment
                </p>
              </div>
            </Link>
          )}

          <div
            className={cn(
              'flex items-start gap-2.5 rounded-xl border-2 p-3',
              safeToSpend.status === 'deficit'
                ? 'border-outflow-border bg-outflow-bg'
                : 'border-border bg-muted/40',
            )}
          >
            <ShieldAlert
              className={cn(
                'mt-0.5 size-4 shrink-0',
                safeToSpend.status === 'deficit'
                  ? 'text-outflow'
                  : 'text-inflow',
              )}
            />
            <div>
              <p className="font-bold text-foreground">
                Safe to spend:{' '}
                <MoneyValue
                  amount={safeToSpend.dailySafeToSpend}
                  className="font-extrabold"
                />{' '}
                / day
              </p>
              <p className="text-muted-foreground">
                {safeToSpend.daysRemainingInCycle} days left this month
              </p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
