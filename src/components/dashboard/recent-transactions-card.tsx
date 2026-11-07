import {
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  ReceiptText,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '#/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import { useFinly } from '#/context/finly-context';
import { paginateItems } from '#/lib/cashflow';
import { formatFriendlyDate } from '#/lib/format';
import { cn } from '#/lib/utils';

type LedgerFilterTab = 'all' | 'income' | 'expenses';

const PAGE_SIZE = 10;

export function RecentTransactionsCard() {
  const {
    transactions,
    wallets,
    todayISO,
    terminology,
    selectedWalletId,
    setSelectedWalletId,
    openQuickEntry,
    deleteTransaction,
  } = useFinly();

  const [filterTab, setFilterTab] = useState<LedgerFilterTab>('all');
  const [page, setPage] = useState<number>(1);
  const [lastWalletId, setLastWalletId] = useState<string>(selectedWalletId);

  if (lastWalletId !== selectedWalletId) {
    setLastWalletId(selectedWalletId);
    setPage(1);
  }

  const walletNameById = useMemo(
    () => new Map(wallets.map((w) => [w.id, w.name])),
    [wallets],
  );

  const walletScoped = useMemo(() => {
    if (selectedWalletId === 'all') return transactions;
    return transactions.filter((tx) => tx.walletId === selectedWalletId);
  }, [selectedWalletId, transactions]);

  const tabCounts = useMemo(() => {
    let income = 0;
    let expenses = 0;
    for (const tx of walletScoped) {
      if (tx.type === 'money_in') income += 1;
      else expenses += 1;
    }
    return {
      all: walletScoped.length,
      income,
      expenses,
    };
  }, [walletScoped]);

  const filteredTransactions = useMemo(() => {
    if (filterTab === 'income') {
      return walletScoped.filter((tx) => tx.type === 'money_in');
    }
    if (filterTab === 'expenses') {
      return walletScoped.filter((tx) => tx.type === 'money_out');
    }
    return walletScoped;
  }, [filterTab, walletScoped]);

  const paginated = useMemo(
    () => paginateItems(filteredTransactions, page, PAGE_SIZE),
    [filteredTransactions, page],
  );

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
    <div className="bento-card bento-card-static col-span-12 overflow-hidden bg-card">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b-2 border-border p-6 sm:flex-row sm:items-center">
        <div className="space-y-0.5">
          <h2 className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground sm:text-sm">
            Recent Activity
          </h2>
          <p className="font-mono text-xs text-muted-foreground">
            Your latest income and expenses
          </p>
        </div>

        {/* Filter Pills: All, Income, Expenses */}
        <div
          role="tablist"
          aria-label="Filter recent transactions"
          className="brutal-surface flex flex-wrap items-center gap-1 rounded-xl bg-muted/50 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filterTab === 'all'}
            onClick={() => {
              setFilterTab('all');
              setPage(1);
            }}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg border-2 px-3 font-mono text-xs transition-all duration-150 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
              filterTab === 'all'
                ? 'border-border bg-primary font-extrabold text-primary-foreground'
                : 'border-transparent font-semibold text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <span>All ({tabCounts.all})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={filterTab === 'income'}
            onClick={() => {
              setFilterTab('income');
              setPage(1);
            }}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg border-2 px-3 font-mono text-xs transition-all duration-150 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
              filterTab === 'income'
                ? 'border-border bg-inflow font-extrabold text-primary-foreground'
                : 'border-transparent font-semibold text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <span
              className={cn(
                'size-2 rounded-full',
                filterTab === 'income' ? 'bg-primary-foreground' : 'bg-inflow',
              )}
            />
            <span>
              {terminology.inflow} ({tabCounts.income})
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={filterTab === 'expenses'}
            onClick={() => {
              setFilterTab('expenses');
              setPage(1);
            }}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg border-2 px-3 font-mono text-xs transition-all duration-150 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
              filterTab === 'expenses'
                ? 'border-border bg-outflow font-extrabold text-primary-foreground'
                : 'border-transparent font-semibold text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <span
              className={cn(
                'size-2 rounded-full',
                filterTab === 'expenses'
                  ? 'bg-primary-foreground'
                  : 'bg-outflow',
              )}
            />
            <span>
              {terminology.outflow} ({tabCounts.expenses})
            </span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div>
        {transactions.length === 0 ? (
          <div className="p-6">
            <Empty className="rounded-2xl border-2 border-dashed border-border bg-muted/30 py-10">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ReceiptText className="size-5 text-foreground" />
                </EmptyMedia>
                <EmptyTitle className="font-mono text-base font-bold">
                  No transactions yet
                </EmptyTitle>
                <EmptyDescription className="font-mono text-xs">
                  Add your first income or expense to start tracking your daily
                  spending limit.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  type="button"
                  onClick={() => openQuickEntry('money_in')}
                  className="h-10 gap-2 rounded-xl px-5 font-mono text-xs font-extrabold uppercase tracking-wider"
                >
                  <Plus className="size-4" />
                  <span>Add Transaction</span>
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : paginated.data.length === 0 ? (
          <div className="p-6">
            <Empty className="rounded-2xl border-2 border-dashed border-border bg-muted/30 py-8">
              <EmptyHeader>
                <EmptyTitle className="font-mono text-sm font-bold">
                  No matching transactions
                </EmptyTitle>
                <EmptyDescription className="font-mono text-xs">
                  Switch filters or clear the wallet filter to see more items.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilterTab('all');
                    setSelectedWalletId('all');
                    setPage(1);
                  }}
                  className="rounded-xl font-mono text-xs font-bold"
                >
                  Show All
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-muted/60">
                <TableRow className="border-b-2 border-border">
                  <TableHead className="pl-6 font-mono text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    Description
                  </TableHead>
                  <TableHead className="hidden font-mono text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground sm:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="font-mono text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="hidden font-mono text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground md:table-cell">
                    Wallet
                  </TableHead>
                  <TableHead className="text-right font-mono text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    Amount
                  </TableHead>
                  <TableHead className="w-12 pr-6 text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginated.data.map((tx) => {
                  const walletName =
                    walletNameById.get(tx.walletId) ?? 'Checking';
                  const isInflow = tx.type === 'money_in';

                  return (
                    <TableRow
                      key={tx.id}
                      className="group border-border transition-colors hover:bg-accent/70"
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              'flex size-8 shrink-0 items-center justify-center rounded-xl border-2 transition-transform duration-150 group-hover:scale-105',
                              isInflow
                                ? 'border-inflow-border bg-inflow-bg text-inflow'
                                : 'border-outflow-border bg-outflow-bg text-outflow',
                            )}
                          >
                            {isInflow ? (
                              <ArrowUpRight className="size-4" />
                            ) : (
                              <ArrowDownRight className="size-4" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="max-w-44 truncate font-mono text-xs font-bold text-foreground sm:max-w-xs sm:text-sm">
                              {tx.note || tx.category}
                            </p>
                            <p className="font-mono text-[11px] text-muted-foreground sm:hidden">
                              {tx.category} · {walletName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className="rounded-lg border-border bg-card font-mono text-[11px] font-semibold text-foreground"
                        >
                          {tx.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">
                        {formatFriendlyDate(tx.date, todayISO)}
                      </TableCell>
                      <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                        {walletName}
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
                      <TableCell className="pr-6 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => deleteTransaction(tx.id)}
                          aria-label={`Delete ${tx.note || tx.category}`}
                          className="text-muted-foreground hover:text-outflow"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination Footer */}
            <div className="flex flex-col items-center justify-between gap-3 border-t-2 border-border bg-muted/40 px-6 py-3.5 sm:flex-row">
              <p className="font-mono text-xs text-muted-foreground tabular-nums">
                Showing{' '}
                <strong className="font-bold text-foreground">
                  {rangeStart}–{rangeEnd}
                </strong>{' '}
                of{' '}
                <strong className="font-bold text-foreground">
                  {paginated.totalItems}
                </strong>{' '}
                items
              </p>

              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent className="gap-1.5">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#recent-transactions"
                      aria-disabled={!canPrev}
                      tabIndex={!canPrev ? -1 : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        if (canPrev) {
                          setPage((prev) => Math.max(1, prev - 1));
                        }
                      }}
                      className={cn(
                        'h-8 rounded-xl border-2 border-border bg-card font-mono text-xs font-bold cursor-pointer',
                        !canPrev && 'pointer-events-none opacity-45',
                      )}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink
                      href="#recent-transactions"
                      isActive
                      size="default"
                      onClick={(e) => e.preventDefault()}
                      className="h-8 cursor-default rounded-xl border-2 border-border bg-primary px-3 font-mono text-xs font-extrabold text-primary-foreground tabular-nums hover:bg-primary hover:text-primary-foreground shadow-none"
                    >
                      Page {paginated.currentPage} of {paginated.totalPages}
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      href="#recent-transactions"
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
                        'h-8 rounded-xl border-2 border-border bg-card font-mono text-xs font-bold cursor-pointer',
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
  );
}
