import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  FilterX,
  Plus,
  ReceiptText,
  Search,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { MoneyValue } from '#/components/money-value';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty';
import { Input } from '#/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '#/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import { useFinly } from '#/context/finly-context';
import { calculateMonthlySummary, paginateItems } from '#/lib/cashflow';
import { formatFriendlyDate } from '#/lib/format';
import { cn } from '#/lib/utils';
import type { TransactionType } from '#/types/finly';

export interface HistorySearchParams {
  q?: string;
  category?: string;
  sort?: 'recent' | 'largest';
}

const PAGE_SIZE = 10;

export const Route = createFileRoute('/history')({
  validateSearch: (search: Record<string, unknown>): HistorySearchParams => ({
    q: typeof search.q === 'string' && search.q.trim() ? search.q : undefined,
    category:
      typeof search.category === 'string' && search.category.trim()
        ? search.category
        : undefined,
    sort:
      search.sort === 'largest' || search.sort === 'recent'
        ? search.sort
        : undefined,
  }),
  component: HistoryScreen,
});

function HistoryScreen() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const {
    transactions,
    wallets,
    todayISO,
    terminology,
    openQuickEntry,
    deleteTransaction,
    exportCsv,
  } = useFinly();

  const [query, setQuery] = useState(searchParams.q ?? '');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>(
    searchParams.sort === 'largest' ? 'money_out' : 'all',
  );
  const [walletFilter, setWalletFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>(
    searchParams.category ?? 'all',
  );
  const [sortMode, setSortMode] = useState<'recent' | 'largest'>(
    searchParams.sort ?? 'recent',
  );
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setQuery(searchParams.q ?? '');
    if (searchParams.category) {
      setCategoryFilter(searchParams.category);
    }
    if (searchParams.sort === 'largest') {
      setSortMode('largest');
      setTypeFilter('money_out');
    }
    setPage(1);
  }, [searchParams.category, searchParams.q, searchParams.sort]);

  const walletNameById = useMemo(
    () => new Map(wallets.map((w) => [w.id, w.name])),
    [wallets],
  );

  const monthlySummary = useMemo(
    () => calculateMonthlySummary(transactions, todayISO, walletFilter),
    [todayISO, transactions, walletFilter],
  );

  const allCategories = useMemo(() => {
    const unique = new Set<string>();
    for (const tx of transactions) {
      unique.add(tx.category);
    }
    return Array.from(unique).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const list = transactions.filter((tx) => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (walletFilter !== 'all' && tx.walletId !== walletFilter) return false;
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) {
        return false;
      }
      if (normalizedQuery) {
        const haystack =
          `${tx.category} ${tx.note ?? ''} ${tx.date} ${tx.amount}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    });

    if (sortMode === 'largest') {
      return [...list].sort((a, b) => b.amount - a.amount);
    }
    return list;
  }, [categoryFilter, query, sortMode, transactions, typeFilter, walletFilter]);

  const paginated = useMemo(
    () => paginateItems(filteredTransactions, page, PAGE_SIZE),
    [filteredTransactions, page],
  );

  const filteredStats = useMemo(() => {
    let totalIn = 0;
    let totalOut = 0;
    for (const tx of filteredTransactions) {
      if (tx.type === 'money_in') totalIn += tx.amount;
      else totalOut += tx.amount;
    }
    return {
      totalIn,
      totalOut,
      net: totalIn - totalOut,
    };
  }, [filteredTransactions]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    typeFilter !== 'all' ||
    walletFilter !== 'all' ||
    categoryFilter !== 'all' ||
    sortMode !== 'recent';

  const resetAllFilters = () => {
    setQuery('');
    setTypeFilter('all');
    setWalletFilter('all');
    setCategoryFilter('all');
    setSortMode('recent');
    setPage(1);
    void navigate({
      search: { q: undefined, category: undefined, sort: undefined },
      replace: true,
    });
  };

  const canPrev = paginated.currentPage > 1 && paginated.totalItems > PAGE_SIZE;
  const canNext =
    paginated.currentPage < paginated.totalPages &&
    paginated.totalItems > PAGE_SIZE;
  const rangeStart =
    paginated.totalItems === 0
      ? 0
      : (paginated.currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(
    paginated.currentPage * PAGE_SIZE,
    paginated.totalItems,
  );

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="space-y-0.5">
          <h1 className="font-mono text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
            Activity History
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            Search, filter, and export every USD{' '}
            {terminology.inflow.toLowerCase()} &amp;{' '}
            {terminology.outflow.toLowerCase()} entry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={exportCsv}
            disabled={transactions.length === 0}
            className="min-h-11 gap-1.5 rounded-2xl border-border bg-card font-mono text-xs font-bold"
          >
            <Download className="size-4" />
            <span>Export CSV</span>
          </Button>
          <Button
            type="button"
            onClick={() => openQuickEntry('money_out')}
            className="min-h-11 gap-1.5 rounded-2xl bg-primary px-5 font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground hover:bg-primary-hover cursor-pointer"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Record Transaction</span>
          </Button>
        </div>
      </div>

      {/* 12-Column Bento Grid Matrix (gap-2 mobile / gap-4 desktop) */}
      <div className="grid grid-cols-12 gap-2 sm:gap-4">
        {/* Top Spending Categories Bento Tile */}
        {monthlySummary.topOutflowCategories.length > 0 && (
          <div className="bento-card bento-card-static col-span-12 border border-borders p-5 sm:px-6 dark:border-zinc-800">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                  Top {terminology.outflow} Categories (30D)
                </h2>
                <p className="font-mono text-xs text-muted-foreground">
                  Click a category chip to isolate spending entries
                </p>
              </div>
              <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-accent-foreground">
                Breakdown
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {monthlySummary.topOutflowCategories.slice(0, 6).map((cat) => {
                const active = categoryFilter === cat.category;
                return (
                  <button
                    key={cat.category}
                    type="button"
                    onClick={() => {
                      if (active) {
                        setCategoryFilter('all');
                      } else {
                        setCategoryFilter(cat.category);
                        setTypeFilter('money_out');
                      }
                      setPage(1);
                    }}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      active
                        ? 'border-primary bg-primary font-bold text-primary-foreground'
                        : 'border-border bg-white text-foreground hover:border-zinc-400 dark:border-zinc-700 dark:bg-muted dark:hover:border-zinc-600',
                    )}
                  >
                    <span className="font-semibold">{cat.category}</span>
                    <MoneyValue
                      amount={cat.amount}
                      className={cn(
                        'font-extrabold tabular-nums',
                        active ? 'text-primary-foreground' : 'text-outflow',
                      )}
                    />
                    <span
                      className={cn(
                        'rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                        active
                          ? 'bg-primary-foreground/15 text-primary-foreground'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {cat.percentage}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search & Filter Controls Bento Tile */}
        <div className="bento-card bento-card-static col-span-12 space-y-3 border border-border p-5 sm:px-6 dark:border-zinc-800">
          <div className="grid gap-2 sm:gap-3 md:grid-cols-12">
            <div className="relative md:col-span-5">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notes, categories, or USD amounts..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                className="h-10 rounded-xl border-border bg-white pl-9 font-mono text-xs dark:border-zinc-800 dark:bg-background"
              />
            </div>

            <div className="md:col-span-3">
              <Select
                value={walletFilter}
                onValueChange={(val) => {
                  setWalletFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger
                  aria-label="Filter by wallet"
                  className="h-10 w-full rounded-xl border-border bg-white font-mono text-xs dark:border-zinc-800 dark:bg-background"
                >
                  <SelectValue placeholder="All Wallets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Wallets</SelectItem>
                  {wallets.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Select
                value={categoryFilter}
                onValueChange={(val) => {
                  setCategoryFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger
                  aria-label="Filter by category"
                  className="h-10 w-full rounded-xl border-border bg-white font-mono text-xs dark:border-zinc-800 dark:bg-background"
                >
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Select
                value={sortMode}
                onValueChange={(val) => {
                  setSortMode(val as 'recent' | 'largest');
                  setPage(1);
                }}
              >
                <SelectTrigger
                  aria-label="Sort transactions"
                  className="h-10 w-full rounded-xl border-border bg-white font-mono text-xs dark:border-zinc-800 dark:bg-background"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="largest">Largest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-3">
            <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-white p-1 dark:border-zinc-800 dark:bg-background">
              <button
                type="button"
                onClick={() => {
                  setTypeFilter('all');
                  setPage(1);
                }}
                className={cn(
                  'min-h-8 rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  typeFilter === 'all'
                    ? 'bg-primary font-bold text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => {
                  setTypeFilter('money_in');
                  setPage(1);
                }}
                className={cn(
                  'inline-flex min-h-8 items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  typeFilter === 'money_in'
                    ? 'bg-inflow font-bold text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'size-2 rounded-full',
                    typeFilter === 'money_in'
                      ? 'bg-primary-foreground'
                      : 'bg-inflow',
                  )}
                />
                <span>{terminology.inflow}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTypeFilter('money_out');
                  setPage(1);
                }}
                className={cn(
                  'inline-flex min-h-8 items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  typeFilter === 'money_out'
                    ? 'bg-outflow font-bold text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'size-2 rounded-full',
                    typeFilter === 'money_out'
                      ? 'bg-primary-foreground'
                      : 'bg-outflow',
                  )}
                />
                <span>{terminology.outflow}</span>
              </button>

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={resetAllFilters}
                  className="gap-1 rounded-lg font-mono text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <FilterX className="size-3.5" />
                  <span>Reset</span>
                </Button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono text-xs tabular-nums">
              <span className="text-muted-foreground">
                {terminology.inflow}:{' '}
                <MoneyValue
                  amount={filteredStats.totalIn}
                  signedType="money_in"
                  className="font-extrabold text-inflow"
                />
              </span>
              <span className="text-muted-foreground">
                {terminology.outflow}:{' '}
                <MoneyValue
                  amount={filteredStats.totalOut}
                  signedType="money_out"
                  className="font-extrabold text-outflow"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Paginated Ledger Bento Table (Span-12) */}
        <div
          id="history-table"
          className="bento-card bento-card-static col-span-12 overflow-hidden border border-border dark:border-zinc-800"
        >
          {paginated.data.length === 0 ? (
            <div className="p-6">
              <Empty className="rounded-2xl border border-dashed border-border bg-white/60 py-10 dark:bg-muted/60">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ReceiptText className="size-5 text-foreground" />
                  </EmptyMedia>
                  <EmptyTitle className="font-mono text-base font-bold">
                    {transactions.length === 0
                      ? 'Your ledger is empty'
                      : 'No matching transactions'}
                  </EmptyTitle>
                  <EmptyDescription className="font-mono text-xs">
                    {transactions.length === 0
                      ? 'Record your first income or expense in USD to populate your cashflow history.'
                      : 'Try broadening your search terms or clearing active filters.'}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  {transactions.length === 0 ? (
                    <Button
                      type="button"
                      onClick={() => openQuickEntry('money_in')}
                      className="min-h-11 gap-2 rounded-xl bg-primary px-5 font-mono text-xs font-extrabold uppercase text-primary-foreground"
                    >
                      <Plus className="size-4" />
                      <span>Record First Transaction</span>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetAllFilters}
                      className="min-h-10 rounded-xl font-mono font-semibold cursor-pointer"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </EmptyContent>
              </Empty>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-accent dark:bg-muted/70">
                  <TableRow className="border-border/70">
                    <TableHead className="pl-6 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Transaction / Note
                    </TableHead>
                    <TableHead className="hidden font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Date
                    </TableHead>
                    <TableHead className="hidden font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground md:table-cell">
                      Wallet Account
                    </TableHead>
                    <TableHead className="text-right font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Amount (USD)
                    </TableHead>
                    <TableHead className="w-12 pr-5 text-right">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.data.map((tx) => {
                    const isInflow = tx.type === 'money_in';
                    return (
                      <TableRow
                        key={tx.id}
                        className="border-border/60 transition-colors hover:bg-accent dark:hover:bg-muted/60"
                      >
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                'flex size-8 shrink-0 items-center justify-center rounded-xl',
                                isInflow
                                  ? 'bg-inflow-bg text-inflow'
                                  : 'bg-outflow-bg text-outflow',
                              )}
                            >
                              {isInflow ? (
                                <ArrowUpRight className="size-4" />
                              ) : (
                                <ArrowDownRight className="size-4" />
                              )}
                            </span>
                            <div className="min-w-0">
                              <p className="max-w-xs truncate font-mono text-xs font-semibold text-foreground sm:text-sm">
                                {tx.note || tx.category}
                              </p>
                              <p className="font-mono text-[11px] text-muted-foreground sm:hidden">
                                {tx.category}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant="outline"
                            className="rounded-lg border-border bg-white/80 font-mono text-[11px] font-medium text-foreground dark:border-zinc-700 dark:bg-muted"
                          >
                            {tx.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">
                          <div>{formatFriendlyDate(tx.date, todayISO)}</div>
                          <div className="text-[11px] opacity-75">
                            {tx.date}
                          </div>
                        </TableCell>
                        <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                          {walletNameById.get(tx.walletId) ?? 'Checking'}
                        </TableCell>
                        <TableCell className="text-right">
                          <MoneyValue
                            amount={tx.amount}
                            signedType={tx.type}
                            className={cn(
                              'font-mono text-xs font-extrabold tabular-nums sm:text-sm',
                              isInflow ? 'text-inflow' : 'text-outflow',
                            )}
                          />
                        </TableCell>
                        <TableCell className="pr-5 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => deleteTransaction(tx.id)}
                            aria-label={`Delete ${tx.note || tx.category}`}
                            className="text-muted-foreground hover:text-outflow cursor-pointer dark:hover:text-outflow"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Strict 10-Row Pagination Footer */}
              <div className="flex flex-col items-center justify-between gap-3 border-t border-border/70 bg-accent px-6 py-3.5 sm:flex-row dark:bg-muted/60">
                <p className="font-mono text-xs text-muted-foreground tabular-nums">
                  Showing{' '}
                  <strong className="font-bold text-foreground">
                    {rangeStart} - {rangeEnd}
                  </strong>{' '}
                  of{' '}
                  <strong className="font-bold text-foreground">
                    {paginated.totalItems}
                  </strong>{' '}
                  records
                </p>

                <Pagination className="mx-0 w-auto justify-end">
                  <PaginationContent className="gap-1.5">
                    <PaginationItem>
                      <PaginationPrevious
                        href="#history-table"
                        aria-disabled={!canPrev}
                        tabIndex={!canPrev ? -1 : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          if (canPrev) {
                            setPage((prev) => Math.max(1, prev - 1));
                          }
                        }}
                        className={cn(
                          'h-8 rounded-xl font-mono text-xs cursor-pointer',
                          !canPrev && 'pointer-events-none opacity-45',
                        )}
                      />
                    </PaginationItem>

                    <PaginationItem>
                      <PaginationLink
                        href="#history-table"
                        isActive
                        size="default"
                        onClick={(e) => e.preventDefault()}
                        className="h-8 cursor-default rounded-full border border-border px-3 font-mono text-xs font-bold text-primary-foreground tabular-nums dark:bg-primary hover:text-primary-foreground"
                      >
                        Page {paginated.currentPage} of {paginated.totalPages}
                      </PaginationLink>
                    </PaginationItem>

                    <PaginationItem>
                      <PaginationNext
                        href="#history-table"
                        aria-disabled={!canNext}
                        tabIndex={!canNext ? -1 : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          if (canNext) {
                            setPage((prev) =>
                              Math.min(paginated.totalPages, prev + 1),
                            );
                          }
                        }}
                        className={cn(
                          'h-8 rounded-xl font-mono text-xs cursor-pointer',
                          !canNext && 'pointer-events-none opacity-45',
                        )}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
