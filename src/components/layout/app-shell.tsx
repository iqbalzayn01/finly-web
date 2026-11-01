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
    return <div className="min-h-screen bg-background">{children}</div>;
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
    <div className="flex min-h-screen flex-col bg-white text-foreground dark:bg-zinc-950">
      {/* Offline Resilience Sticky Banner */}
      {isOffline && (
        <div className="no-print sticky top-0 z-50 flex items-center justify-center gap-2 border-b border-warning-border bg-warning-bg px-4 py-1.5 font-mono text-xs font-semibold text-amber-900 dark:text-warning">
          <WifiOff className="size-3.5 shrink-0" />
          <span>
            Working Offline · Transactions saved locally on this device
          </span>
        </div>
      )}

      {/* Borderless Top Bar (PRD v2.1.0 §2.1 — bg-white dark:bg-zinc-950 border-none) */}
      <header className="no-print sticky top-0 z-40 border-none bg-white shadow-none dark:bg-zinc-950">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
          {/* 1. Left Zone: Brand Spark (#C9F31D) + Finly Wordmark */}
          <div className="flex items-center">
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5 rounded-xl py-1 pr-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary">
                <BrandLogo size={24} variant="monochrome" />
              </span>
              <span className="font-mono text-lg font-black tracking-tight text-foreground">
                Finly
              </span>
            </Link>
          </div>

          {/* 2. Center Zone: Minimalist Bento Pill Container (Desktop >= 768px — PRD §2.1) */}
          <nav
            aria-label="Core workspace navigation"
            className="hidden items-center justify-center gap-1 rounded-2xl border border-border p-1.5 md:flex"
          >
            {centerNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'rounded-xl px-4 py-1.5 font-mono text-xs tracking-wider transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  item.active
                    ? 'bg-primary font-bold text-primary-foreground shadow-xs'
                    : 'font-semibold text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 3. Right Zone: Quick Search, Theme Switcher, Notifications, Profile Dropdown */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            {/* Quick Search (⌘K) */}
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => setSearchOpen(true)}
              aria-label="Search transactions and invoices (Cmd+K)"
              //   className="min-h-10 min-w-10 gap-2 rounded-xl text-muted-foreground border border-border hover:bg-card hover:text-foreground sm:min-h-9 lg:bg-card"
              className="gap-2 rounded-full text-muted-foreground border border-border hover:text-foreground cursor-pointer"
            >
              <Search className="size-4 shrink-0" />
              <span className="hidden font-mono text-[11px] font-semibold lg:inline">
                Search
              </span>
              <kbd className="hidden rounded-md bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground xl:inline-block dark:bg-background">
                ⌘K
              </kbd>
            </Button>

            {/* Single-Click Theme Switcher */}
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              onClick={handleToggleTheme}
              aria-label="Switch between light and dark mode"
              className="rounded-full text-muted-foreground border border-border hover:text-foreground cursor-pointer"
            >
              <Sun className="size-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute size-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
            </Button>

            {/* Notification Popover */}
            <Popover
              open={notificationsOpen}
              onOpenChange={setNotificationsOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  aria-label="View cashflow and invoice notifications"
                  className="rounded-full text-muted-foreground border border-border hover:text-foreground cursor-pointer"
                >
                  <Bell className="size-4" />
                  {alertCount > 0 && (
                    <span
                      className={cn(
                        'absolute top-2 right-2 size-2 rounded-full ring-2 ring-white dark:ring-zinc-950',
                        hasUrgentAlert ? 'bg-outflow' : 'bg-primary',
                      )}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-80 rounded-2xl border-border bg-popover p-4 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <p className="font-mono text-[11px] font-bold tracking-wider text-foreground">
                    Cashflow Alerts
                  </p>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {formatMonthYear(todayISO)}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  {invoiceSummary.overdueCount > 0 && (
                    <Link
                      to="/invoices"
                      onClick={() => setNotificationsOpen(false)}
                      className="flex items-start gap-2.5 rounded-xl border border-outflow-border bg-outflow-bg p-2.5 transition-colors hover:bg-outflow-bg/80"
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
                          past due — review &amp; ping
                        </p>
                      </div>
                    </Link>
                  )}

                  {invoiceSummary.waitingCount > 0 && (
                    <Link
                      to="/invoices"
                      onClick={() => setNotificationsOpen(false)}
                      className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/40 p-2.5 transition-colors hover:bg-secondary"
                    >
                      <FileText className="mt-0.5 size-4 shrink-0 text-info" />
                      <div>
                        <p className="font-bold text-foreground">
                          {invoiceSummary.waitingCount} Pending Client{' '}
                          {invoiceSummary.waitingCount === 1
                            ? 'Invoice'
                            : 'Invoices'}
                        </p>
                        <p className="text-muted-foreground">
                          <MoneyValue
                            amount={invoiceSummary.waitingAmount}
                            className="font-bold text-foreground"
                          />{' '}
                          waiting to settle
                        </p>
                      </div>
                    </Link>
                  )}

                  <div
                    className={cn(
                      'flex items-start gap-2.5 rounded-xl border p-2.5',
                      safeToSpend.status === 'deficit'
                        ? 'border-outflow-border bg-outflow-bg'
                        : 'border-border bg-muted/30',
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
                        Safe-to-Spend:{' '}
                        <MoneyValue
                          amount={safeToSpend.dailySafeToSpend}
                          className="font-extrabold"
                        />{' '}
                        / day
                      </p>
                      <p className="text-muted-foreground">
                        {safeToSpend.daysRemainingInCycle}D left in cycle ·{' '}
                        {safeToSpend.runwayMonths} mo runway
                      </p>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* User Profile Dropdown ([AZ v] — PRD §2.1) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Open user profile and workspace menu"
                  className="rounded-full text-muted-foreground border border-border hover:text-foreground cursor-pointer"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary-foreground font-mono text-[11px] font-bold text-primary">
                      {initials || 'AZ'}
                    </AvatarFallback>
                  </Avatar>
                  {/* <ChevronDown className="size-3.5 text-muted-foreground" /> */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 rounded-2xl border-border bg-popover p-1.5 shadow-2xl"
              >
                <DropdownMenuLabel className="flex flex-col gap-0.5 px-2.5 py-2">
                  <p className="truncate font-mono text-xs font-bold text-foreground">
                    {profile.displayName}
                  </p>
                  <p className="truncate font-mono text-[11px] font-normal text-muted-foreground">
                    {profile.email}
                  </p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Privacy Masking Toggle ($ ••••••) */}
                <div className="flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <EyeOff className="size-3.5 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      Privacy Mask ($ ••••••)
                    </span>
                  </div>
                  <Switch
                    size="sm"
                    checked={profile.privacyBlurEnabled}
                    onCheckedChange={(checked) => togglePrivacyBlur(checked)}
                    aria-label="Toggle privacy balance mask"
                  />
                </div>

                <DropdownMenuSeparator />

                {/* Settings & Preferences (/settings) */}
                <DropdownMenuItem
                  asChild
                  className="rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer"
                >
                  <Link to="/settings">
                    <Settings className="size-3.5" />
                    <span>Settings &amp; Preferences</span>
                  </Link>
                </DropdownMenuItem>

                {/* Export Data (CSV) */}
                <DropdownMenuItem
                  onClick={exportCsv}
                  className="rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Export Data (CSV)</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Sign Out */}
                <DropdownMenuItem
                  asChild
                  className="rounded-xl px-2.5 py-2 text-xs font-medium text-outflow focus:text-outflow cursor-pointer"
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

      {/* Main Content Canvas with Rounded Top Corners (PRD v2.1.0 §2 & DESIGN.md §1.1) */}
      <main className="mx-auto mb-16 w-full max-w-7xl flex-1 p-4 sm:mb-0 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation (< 768px) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="no-print fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-border bg-white/95 px-2 backdrop-blur-md md:hidden dark:bg-muted/95"
      >
        <Link
          to="/"
          className={cn(
            'flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 font-mono text-[10px] font-semibold transition-colors',
            location.pathname === '/'
              ? 'font-bold text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <LayoutDashboard
            className={cn(
              'size-4',
              location.pathname === '/' && 'text-primary',
            )}
          />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/history"
          className={cn(
            'flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 font-mono text-[10px] font-semibold transition-colors',
            location.pathname.startsWith('/history')
              ? 'font-bold text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <History
            className={cn(
              'size-4',
              location.pathname.startsWith('/history') && 'text-primary',
            )}
          />
          <span>History</span>
        </Link>

        <button
          type="button"
          onClick={() => openQuickEntry('money_out')}
          aria-label="Record new transaction"
          className="flex size-12 -translate-y-2 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="size-6 stroke-[2.5]" />
        </button>

        <Link
          to="/invoices"
          className={cn(
            'flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 font-mono text-[10px] font-semibold transition-colors',
            location.pathname.startsWith('/invoices')
              ? 'font-bold text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <FileText
            className={cn(
              'size-4',
              location.pathname.startsWith('/invoices') && 'text-primary',
            )}
          />
          <span>Invoices</span>
        </Link>

        <Link
          to="/settings"
          className={cn(
            'flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 font-mono text-[10px] font-semibold transition-colors',
            location.pathname.startsWith('/settings')
              ? 'font-bold text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Settings
            className={cn(
              'size-4',
              location.pathname.startsWith('/settings') && 'text-primary',
            )}
          />
          <span>Settings</span>
        </Link>
      </nav>

      {/* Global Dialogs */}
      <CommandSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <QuickTransactionModal />
    </div>
  );
}
