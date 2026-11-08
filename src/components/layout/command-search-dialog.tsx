import { useNavigate } from '@tanstack/react-router';
import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  FileText,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { MoneyValue } from '#/components/money-value';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '#/components/ui/dialog';
import { Input } from '#/components/ui/input';
import { useFinly } from '#/context/finly-context';
import { isTransferCategory } from '#/lib/constants';
import { formatFriendlyDate } from '#/lib/format';
import { cn } from '#/lib/utils';

interface CommandSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandSearchDialog({
  open,
  onOpenChange,
}: CommandSearchDialogProps) {
  const {
    transactions,
    invoices,
    todayISO,
    isInvoicingVisible,
    openQuickEntry,
  } = useFinly();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onOpenChange, open]);

  const normalizedQuery = query.trim().toLowerCase();

  const matchingTransactions = useMemo(() => {
    if (!normalizedQuery) return transactions.slice(0, 5);
    return transactions
      .filter(
        (tx) =>
          tx.category.toLowerCase().includes(normalizedQuery) ||
          (tx.note ?? '').toLowerCase().includes(normalizedQuery) ||
          String(tx.amount).includes(normalizedQuery),
      )
      .slice(0, 6);
  }, [normalizedQuery, transactions]);

  const matchingInvoices = useMemo(() => {
    if (!isInvoicingVisible) return [];
    if (!normalizedQuery) return invoices.slice(0, 3);
    return invoices
      .filter(
        (inv) =>
          inv.clientName.toLowerCase().includes(normalizedQuery) ||
          inv.invoiceNumber.toLowerCase().includes(normalizedQuery) ||
          (inv.projectTitle ?? '').toLowerCase().includes(normalizedQuery),
      )
      .slice(0, 5);
  }, [invoices, isInvoicingVisible, normalizedQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="brutal-surface overflow-hidden rounded-3xl border-2 border-border bg-popover/80 p-6 sm:max-w-lg"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Search transactions, categories, clients, and invoices
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2.5 pb-2">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder="Search transactions, clients, notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 border-2 border-transparent bg-muted/80 px-4 font-mono text-xs shadow-none focus-visible:border-[#6366F1] focus-visible:ring-2 focus-visible:ring-[#6366F1] sm:text-sm"
          />
          <DialogClose asChild disabled={false}>
            <Button size="icon-xs" aria-label="Close search dialog">
              <X className="size-4" />
            </Button>
          </DialogClose>
        </div>

        <div className="max-h-[65vh] space-y-4 overflow-y-auto">
          {/* Quick Action */}
          <div>
            <p className="pb-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </p>
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                openQuickEntry('money_out');
              }}
              className="group flex w-full items-center gap-2.5 rounded-xl border-2 border-transparent px-2 py-2 text-left font-mono text-xs font-bold text-foreground transition-all hover:border-border hover:bg-accent cursor-pointer"
            >
              <span className="flex size-7 items-center justify-center rounded-lg border-2 border-border bg-primary text-primary-foreground transition-transform group-hover:rotate-90">
                <Plus className="size-4 stroke-[2.5]" />
              </span>
              <span>Add New Transaction</span>
            </button>
          </div>

          {/* Transactions */}
          <div>
            <p className="pb-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Transactions ({matchingTransactions.length})
            </p>
            {matchingTransactions.length === 0 ? (
              <p className="px-2 py-3 font-mono text-xs text-muted-foreground">
                No matching transactions found.
              </p>
            ) : (
              <div className="space-y-1">
                {matchingTransactions.map((tx) => {
                  const isInflow = tx.type === 'money_in';
                  const isTransfer = isTransferCategory(tx.category);
                  return (
                    <button
                      key={tx.id}
                      type="button"
                      onClick={() => {
                        onOpenChange(false);
                        void navigate({
                          to: '/history',
                          search: {
                            q: query || undefined,
                            category: undefined,
                          },
                        });
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border-2 border-transparent px-2.5 py-2 text-left transition-all hover:border-border hover:bg-accent cursor-pointer"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={cn(
                            'flex size-7 shrink-0 items-center justify-center rounded-lg border',
                            isTransfer
                              ? 'border-[#6366F1]/30 bg-[#6366F1]/15 text-[#6366F1]'
                              : isInflow
                                ? 'border-inflow-border bg-inflow-bg text-inflow'
                                : 'border-outflow-border bg-outflow-bg text-outflow',
                          )}
                        >
                          {isTransfer ? (
                            <ArrowLeftRight className="size-3.5" />
                          ) : isInflow ? (
                            <ArrowUpRight className="size-3.5" />
                          ) : (
                            <ArrowDownRight className="size-3.5" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-mono text-xs font-bold text-foreground">
                            {tx.note || tx.category}
                          </p>
                          <p className="font-mono text-[11px] text-muted-foreground">
                            {tx.category} ·{' '}
                            {formatFriendlyDate(tx.date, todayISO)}
                          </p>
                        </div>
                      </div>
                      <MoneyValue
                        amount={tx.amount}
                        signedType={tx.type}
                        className={cn(
                          'shrink-0 font-mono text-xs font-extrabold tabular-nums',
                          isInflow ? 'text-inflow' : 'text-outflow',
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Invoices */}
          {isInvoicingVisible && (
            <div>
              <p className="pb-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Invoices ({matchingInvoices.length})
              </p>
              {matchingInvoices.length === 0 ? (
                <p className="px-2 py-2 font-mono text-xs text-muted-foreground">
                  No matching invoices.
                </p>
              ) : (
                <div className="space-y-1">
                  {matchingInvoices.map((inv) => (
                    <button
                      key={inv.id}
                      type="button"
                      onClick={() => {
                        onOpenChange(false);
                        void navigate({ to: '/invoices' });
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border-2 border-transparent px-2.5 py-2 text-left transition-all hover:border-border hover:bg-accent cursor-pointer"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-info-border bg-info-bg text-info">
                          <FileText className="size-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 truncate font-mono text-xs font-bold text-foreground">
                            <span className="truncate">{inv.clientName}</span>
                            <span className="inline-flex shrink-0 items-center rounded border border-[#6366F1]/30 bg-[#6366F1]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#6366F1]">
                              #{inv.invoiceNumber}
                            </span>
                          </p>
                          <p className="truncate font-mono text-[11px] text-muted-foreground">
                            {inv.projectTitle || `Due ${inv.dueDate}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            'font-mono text-[10px] uppercase',
                            (inv.status === 'sent' || inv.status === 'draft') &&
                              'border-[#6366F1]/30 bg-[#6366F1]/15 text-[#6366F1]',
                          )}
                        >
                          {inv.status}
                        </Badge>
                        <MoneyValue
                          amount={inv.totalAmount}
                          className="font-mono text-xs font-bold text-foreground"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
