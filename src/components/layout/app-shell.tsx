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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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

  const centerNavItems = [
    {
      label: 'Dashboard',
      to: '/' as const,
      active: location.pathname === '/',
    },
    {
      label: 'History',
      to: '/history' as const,
      active: location.pathname.startsWith('/history'),
    },
    ...(isInvoicingVisible
      ? [
          {
            label: 'Invoices',
            to: '/invoices' as const,
            active: location.pathname.startsWith('/invoices'),
          },
        ]
      : []),
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

      {/* Top Navigation Bar */}
      <header className="glass-header no-print sticky top-0 z-40 w-full">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
          {/* 1. Left Zone: Brand Logo */}
          <div className="flex items-center">
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
          </div>

          {/* 2. Center Zone: Navigation Bar */}
          <nav
            aria-label="Main navigation"
            className="brutal-surface hidden items-center justify-center gap-1 rounded-2xl bg-card p-1 md:flex"
          >
            {centerNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'inline-flex h-8 items-center justify-center rounded-xl border-2 px-4 font-mono text-xs tracking-wide transition-all duration-150 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  item.active
                    ? 'border-border bg-primary font-extrabold text-primary-foreground'
                    : 'border-transparent font-semibold text-muted-foreground hover:bg-accent/80 hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 3. Right Zone: Action Controls */}
          <div className="flex items-center justify-end gap-2">
            {/* Search (⌘K) */}
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setSearchOpen(true)}
              aria-label="Search transactions and invoices (Cmd+K)"
              className="h-10 gap-2 rounded-xl border-2 border-border bg-card px-3 font-mono text-xs font-bold text-foreground backdrop-blur-md hover:bg-accent/80"
            >
              <Search className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-foreground" />
              <span className="hidden lg:inline">Search</span>
              <kbd className="hidden rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground xl:inline-block">
                ⌘K
              </kbd>
            </Button>

            {/* Theme Switcher */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleToggleTheme}
              aria-label="Switch between light and dark mode"
              className="relative size-10 rounded-xl border-2 border-border bg-card backdrop-blur-md hover:bg-accent/80"
            >
              <Sun className="size-4 scale-100 rotate-0 transition-transform duration-200 group-hover:rotate-45 dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute size-4 scale-0 rotate-90 transition-transform duration-200 dark:scale-100 dark:rotate-0 dark:group-hover:-rotate-12" />
            </Button>

            {/* Notifications Popover */}
            <Popover
              open={notificationsOpen}
              onOpenChange={setNotificationsOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="View alerts"
                  className="relative size-10 rounded-xl border-2 border-border bg-card backdrop-blur-md hover:bg-accent/80"
                >
                  <Bell className="size-4 transition-transform duration-200 group-hover:rotate-12" />
                  {alertCount > 0 && (
                    <span
                      className={cn(
                        'absolute top-1.5 right-1.5 size-2.5 rounded-full border-2 border-card',
                        hasUrgentAlert ? 'bg-outflow' : 'bg-primary',
                      )}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
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
                      onClick={() => setNotificationsOpen(false)}
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
                      onClick={() => setNotificationsOpen(false)}
                      className="flex items-start gap-2.5 rounded-xl border-2 border-border bg-muted/50 p-3 transition-transform hover:-translate-y-0.5 hover:bg-accent"
                    >
                      <FileText className="mt-0.5 size-4 shrink-0 text-info" />
                      <div>
                        <p className="font-bold text-foreground">
                          {invoiceSummary.waitingCount} Unpaid{' '}
                          {invoiceSummary.waitingCount === 1
                            ? 'Invoice'
                            : 'Invoices'}
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

            {/* User Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
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
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
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
                    <span className="font-semibold text-foreground">
                      Hide Balances
                    </span>
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
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 mx-auto mb-20 w-full max-w-7xl flex-1 p-4 sm:mb-0 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation (< 768px) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="glass-header no-print fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t-2 border-border px-2 md:hidden"
      >
        <Link
          to="/"
          className={cn(
            'flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 font-mono text-[10px] font-semibold transition-all active:scale-95',
            location.pathname === '/'
              ? 'bg-accent font-extrabold text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <LayoutDashboard className="size-4" />
          <span>Home</span>
        </Link>

        <Link
          to="/history"
          className={cn(
            'flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 font-mono text-[10px] font-semibold transition-all active:scale-95',
            location.pathname.startsWith('/history')
              ? 'bg-accent font-extrabold text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <History className="size-4" />
          <span>History</span>
        </Link>

        <button
          type="button"
          onClick={() => openQuickEntry('money_out')}
          aria-label="Add transaction"
          className="brutal-btn flex size-12 -translate-y-2 items-center justify-center rounded-2xl border-border bg-primary text-primary-foreground cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="size-6 stroke-[2.5] transition-transform duration-200 hover:rotate-90" />
        </button>

        <Link
          to="/invoices"
          className={cn(
            'flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 font-mono text-[10px] font-semibold transition-all active:scale-95',
            location.pathname.startsWith('/invoices')
              ? 'bg-accent font-extrabold text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <FileText className="size-4" />
          <span>Invoices</span>
        </Link>

        <Link
          to="/settings"
          className={cn(
            'flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 font-mono text-[10px] font-semibold transition-all active:scale-95',
            location.pathname.startsWith('/settings')
              ? 'bg-accent font-extrabold text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Settings className="size-4" />
          <span>Settings</span>
        </Link>
      </nav>

      {/* Global Dialogs */}
      <CommandSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <QuickTransactionModal />
    </div>
  );
}
