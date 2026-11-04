import { createFileRoute } from '@tanstack/react-router';
import {
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  MessageCircle,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { CreateInvoiceModal } from '#/components/invoices/create-invoice-modal';
import {
  buildWhatsAppInvoiceUrl,
  InvoicePreviewDialog,
} from '#/components/invoices/invoice-preview-dialog';
import { SettleInvoiceDialog } from '#/components/invoices/settle-invoice-dialog';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import { useFinly } from '#/context/finly-context';
import { calculateInvoiceSummary } from '#/lib/cashflow';
import { formatRelativeDueDate } from '#/lib/format';
import { cn } from '#/lib/utils';
import type { Invoice, InvoiceStatus } from '#/types/finly';

export const Route = createFileRoute('/invoices')({
  component: InvoicesScreen,
});

type FilterTab = 'all' | 'unpaid' | 'overdue' | 'paid' | 'draft';

function renderInvoiceStatusBadge(status: InvoiceStatus) {
  switch (status) {
    case 'draft':
      return (
        <Badge
          variant="outline"
          className="rounded-lg border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
        >
          Draft
        </Badge>
      );
    case 'sent':
      return (
        <Badge
          variant="outline"
          className="rounded-lg border-info-border bg-info-bg px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-info"
        >
          Sent
        </Badge>
      );
    case 'overdue':
      return (
        <Badge
          variant="outline"
          className="gap-1.5 rounded-lg border-outflow-border bg-outflow-bg px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-outflow"
        >
          <span className="size-1.5 rounded-full bg-outflow animate-pulse" />
          <span>Overdue</span>
        </Badge>
      );
    case 'paid':
      return (
        <Badge
          variant="outline"
          className="rounded-lg border-inflow-border bg-inflow-bg px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-inflow"
        >
          Paid
        </Badge>
      );
  }
}

function InvoicesScreen() {
  const { profile, invoices, todayISO, deleteInvoice } = useFinly();

  const [statusTab, setStatusTab] = useState<FilterTab>('all');
  const [query, setQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [invoiceToSettle, setInvoiceToSettle] = useState<Invoice | null>(null);
  const [invoiceToPreview, setInvoiceToPreview] = useState<Invoice | null>(
    null,
  );

  const summary = useMemo(
    () => calculateInvoiceSummary(invoices, todayISO),
    [invoices, todayISO],
  );

  const countsByTab = useMemo(() => {
    const counts: Record<FilterTab, number> = {
      all: invoices.length,
      unpaid: 0,
      overdue: 0,
      paid: 0,
      draft: 0,
    };
    for (const inv of invoices) {
      if (inv.status === 'sent' || inv.status === 'overdue') {
        counts.unpaid += 1;
      }
      if (inv.status === 'overdue') counts.overdue += 1;
      if (inv.status === 'paid') counts.paid += 1;
      if (inv.status === 'draft') counts.draft += 1;
    }
    return counts;
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return invoices.filter((inv) => {
      if (
        statusTab === 'unpaid' &&
        inv.status !== 'sent' &&
        inv.status !== 'overdue'
      ) {
        return false;
      }
      if (
        statusTab !== 'all' &&
        statusTab !== 'unpaid' &&
        inv.status !== statusTab
      ) {
        return false;
      }
      if (normalizedQuery) {
        const haystack =
          `${inv.clientName} ${inv.invoiceNumber} ${inv.projectTitle ?? ''}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    });
  }, [invoices, query, statusTab]);

  const handleWhatsAppShare = (invoice: Invoice) => {
    const url = buildWhatsAppInvoiceUrl(
      invoice,
      profile.currency,
      profile.businessName || profile.displayName,
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filterTabs: Array<{ id: FilterTab; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'unpaid', label: 'Unpaid' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'paid', label: 'Paid' },
    { id: 'draft', label: 'Drafts' },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header (PRD v2.1.0 §4) */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="space-y-0.5">
          <h1 className="font-mono text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
            Invoices &amp; Receivables
          </h1>
          <p className="font-mono text-base text-muted-foreground">
            Issue client bills, track payment statuses, and settle funds
            directly into cashflow.
          </p>
        </div>

        <Button
          type="button"
          size="lg"
          onClick={() => setCreateModalOpen(true)}
          className="min-h-11 gap-2 rounded-2xl bg-primary font-mono text-xs font-extrabold tracking-wider text-primary-foreground shadow-xs hover:bg-primary-hover cursor-pointer"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>New Invoice</span>
        </Button>
      </div>

      {/* 12-Column Bento Matrix (gap-2 mobile / gap-4 desktop — PRD v2.1.0 §4) */}
      <div className="grid grid-cols-12 gap-2 sm:gap-4">
        {/* Bento Stat 1: Unpaid */}
        <div className="bento-card col-span-12 flex items-start justify-between gap-3 border border-border bg-zinc-900 p-6 text-white sm:col-span-4 dark:bg-card">
          <div className="space-y-1.5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Waiting To Be Paid
            </p>
            <MoneyValue
              amount={summary.waitingAmount}
              className="font-mono text-2xl font-black tracking-tighter text-white tabular-nums sm:text-3xl"
            />
            <p className="font-mono text-xs text-muted-foreground">
              {summary.waitingCount}{' '}
              {summary.waitingCount === 1
                ? 'Invoice Pending'
                : 'Invoices Pending'}
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-info-bg text-info">
            <Clock className="size-5" />
          </span>
        </div>

        {/* Bento Stat 2: Overdue */}
        <div className="bento-card col-span-12 flex items-start justify-between gap-3 border border-border p-6 sm:col-span-4  dark:border-zinc-800">
          <div className="space-y-1.5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-outflow">
              Overdue (Needs Action)
            </p>
            <MoneyValue
              amount={summary.overdueAmount}
              className="font-mono text-2xl font-black tracking-tighter text-outflow tabular-nums sm:text-3xl"
            />
            <p className="font-mono text-xs text-muted-foreground">
              {summary.overdueCount}{' '}
              {summary.overdueCount === 1 ? 'Client Late' : 'Clients Late'}
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-outflow-bg text-outflow">
            <TriangleAlert className="size-5" />
          </span>
        </div>

        {/* Bento Stat 3: Collected */}
        <div className="bento-card col-span-12 flex items-start justify-between gap-3 border border-border p-6 sm:col-span-4 dark:border-zinc-800">
          <div className="space-y-1.5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-inflow">
              Paid This Month
            </p>
            <MoneyValue
              amount={summary.collectedThisMonthAmount}
              className="font-mono text-2xl font-black tracking-tighter text-inflow tabular-nums sm:text-3xl"
            />
            <p className="font-mono text-xs text-muted-foreground">
              {summary.collectedThisMonthCount}{' '}
              {summary.collectedThisMonthCount === 1 ? 'Invoice' : 'Invoices'}{' '}
              Collected
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-inflow-bg text-inflow">
            <CheckCircle2 className="size-5" />
          </span>
        </div>

        {/* Bento Table: Invoices List (Span-12) */}
        <div className="bento-card bento-card-static col-span-12 overflow-hidden border border-border bg-card dark:border-zinc-800">
          {/* Filter Pills + Search Header */}
          <div className="flex flex-col justify-between gap-3 border-b border-border/70 p-4 sm:flex-row sm:items-center sm:px-6">
            <div
              role="tablist"
              aria-label="Filter invoices by status"
              className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-white p-1 dark:border-zinc-800 dark:bg-background"
            >
              {filterTabs.map((tab) => {
                const active = statusTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setStatusTab(tab.id)}
                    className={cn(
                      'inline-flex min-h-8 items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      active
                        ? 'bg-primary font-bold text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        'rounded-md px-1.5 py-0.5 text-[10px] tabular-nums',
                        active
                          ? 'bg-primary-foreground/15 font-bold text-primary-foreground'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {countsByTab[tab.id]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search client or #INV..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 rounded-xl border-border bg-white pl-9 font-mono text-xs dark:border-zinc-800 dark:bg-background"
              />
            </div>
          </div>

          {/* Table or Empty State */}
          {filteredInvoices.length === 0 ? (
            <div className="p-6">
              <Empty className="rounded-2xl border border-dashed border-border bg-white/60 py-10 dark:bg-muted/60">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText className="size-5 text-foreground" />
                  </EmptyMedia>
                  <EmptyTitle className="font-mono text-base font-bold">
                    {invoices.length === 0
                      ? 'No invoices created yet'
                      : 'No invoices match this filter'}
                  </EmptyTitle>
                  <EmptyDescription className="font-mono text-xs">
                    Create a clean, printable client invoice in seconds and sync
                    its payment straight into your cashflow balance.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    type="button"
                    onClick={() => setCreateModalOpen(true)}
                    className="min-h-11 gap-2 rounded-xl bg-primary px-5 font-mono text-xs font-extrabold uppercase text-primary-foreground hover:bg-primary-hover"
                  >
                    <Plus className="size-4" />
                    <span>Create First Invoice</span>
                  </Button>
                </EmptyContent>
              </Empty>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader className="bg-white/60 dark:bg-muted/70">
                    <TableRow className="border-border/70">
                      <TableHead className="pl-6 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Client / Project
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Invoice #
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Due Date
                      </TableHead>
                      <TableHead className="text-right font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Amount
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="pr-6 text-right font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((inv) => {
                      const isPaid = inv.status === 'paid';
                      return (
                        <TableRow
                          key={inv.id}
                          className="border-border/60 transition-colors hover:bg-white/80 dark:hover:bg-muted/60"
                        >
                          <TableCell className="pl-6">
                            <p className="font-mono text-sm font-bold text-foreground">
                              {inv.clientName}
                            </p>
                            <p className="font-mono text-xs text-muted-foreground">
                              {inv.projectTitle ||
                                `${inv.items.length} item(s)`}
                            </p>
                          </TableCell>
                          <TableCell className="font-mono text-xs font-bold text-foreground tabular-nums">
                            #{inv.invoiceNumber}
                          </TableCell>
                          <TableCell>
                            <p
                              className={cn(
                                'font-mono text-xs font-bold',
                                inv.status === 'overdue'
                                  ? 'text-outflow'
                                  : 'text-foreground',
                              )}
                            >
                              {formatRelativeDueDate(
                                inv.dueDate,
                                todayISO,
                                isPaid,
                              )}
                            </p>
                            <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                              {inv.dueDate}
                            </p>
                          </TableCell>
                          <TableCell className="text-right">
                            <MoneyValue
                              amount={inv.totalAmount}
                              className={cn(
                                'font-mono text-sm font-extrabold tabular-nums',
                                isPaid ? 'text-inflow' : 'text-foreground',
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            {renderInvoiceStatusBadge(inv.status)}
                          </TableCell>
                          <TableCell className="pr-6">
                            <div className="flex items-center justify-end gap-1.5">
                              {!isPaid && (
                                <Button
                                  type="button"
                                  size="xs"
                                  onClick={() => setInvoiceToSettle(inv)}
                                  className="gap-1 rounded-lg bg-primary font-mono text-[11px] font-extrabold text-primary-foreground hover:bg-primary-hover cursor-pointer"
                                >
                                  <CheckCircle2 className="size-3.5" />
                                  <span>Mark Paid</span>
                                </Button>
                              )}
                              {!isPaid && (
                                <Button
                                  type="button"
                                  size="xs"
                                  variant="outline"
                                  onClick={() => handleWhatsAppShare(inv)}
                                  className="gap-1 rounded-lg border-border bg-white font-mono text-[11px] font-semibold dark:border-zinc-700 dark:bg-muted"
                                >
                                  <MessageCircle className="size-3.5" />
                                  <span>
                                    {inv.status === 'overdue'
                                      ? 'WhatsApp'
                                      : 'Share'}
                                  </span>
                                </Button>
                              )}
                              <Button
                                type="button"
                                size="xs"
                                variant="ghost"
                                onClick={() => setInvoiceToPreview(inv)}
                                aria-label={`Preview invoice ${inv.invoiceNumber}`}
                                className="gap-1 rounded-lg font-mono text-[11px] text-muted-foreground hover:text-foreground"
                              >
                                <Eye className="size-3.5" />
                                <span className="hidden lg:inline">
                                  {isPaid ? 'Receipt' : 'Preview'}
                                </span>
                              </Button>
                              <Button
                                type="button"
                                size="icon-xs"
                                variant="ghost"
                                onClick={() => deleteInvoice(inv.id)}
                                aria-label={`Delete invoice ${inv.invoiceNumber}`}
                                className="text-muted-foreground hover:text-outflow"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="divide-y divide-border/70 md:hidden">
                {filteredInvoices.map((inv) => {
                  const isPaid = inv.status === 'paid';
                  return (
                    <div key={inv.id} className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-mono text-sm font-bold text-foreground">
                              {inv.clientName}
                            </p>
                            <span className="font-mono text-xs text-muted-foreground tabular-nums">
                              #{inv.invoiceNumber}
                            </span>
                          </div>
                          <p className="truncate font-mono text-xs text-muted-foreground">
                            {inv.projectTitle || `Due ${inv.dueDate}`} ·{' '}
                            {formatRelativeDueDate(
                              inv.dueDate,
                              todayISO,
                              isPaid,
                            )}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <MoneyValue
                            amount={inv.totalAmount}
                            className="font-mono text-base font-extrabold text-foreground"
                          />
                          <div className="mt-0.5">
                            {renderInvoiceStatusBadge(inv.status)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          onClick={() => setInvoiceToPreview(inv)}
                          className="min-h-9 gap-1 rounded-xl font-mono font-semibold"
                        >
                          <Eye className="size-3.5" />
                          <span>{isPaid ? 'Receipt' : 'Preview'}</span>
                        </Button>
                        {!isPaid && (
                          <Button
                            type="button"
                            size="xs"
                            variant="outline"
                            onClick={() => handleWhatsAppShare(inv)}
                            className="min-h-9 gap-1 rounded-xl font-mono font-semibold"
                          >
                            <MessageCircle className="size-3.5" />
                            <span>
                              {inv.status === 'overdue' ? 'Ping' : 'WhatsApp'}
                            </span>
                          </Button>
                        )}
                        {!isPaid && (
                          <Button
                            type="button"
                            size="xs"
                            onClick={() => setInvoiceToSettle(inv)}
                            className="min-h-9 gap-1 rounded-xl bg-primary font-mono font-extrabold text-primary-foreground hover:bg-primary-hover cursor-pointer"
                          >
                            <CheckCircle2 className="size-3.5" />
                            <span>Mark Paid</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <CreateInvoiceModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreatedAndShare={(created) => handleWhatsAppShare(created)}
        onCreatedAndPrint={(created) => {
          setInvoiceToPreview(created);
          window.setTimeout(() => window.print(), 250);
        }}
      />

      <SettleInvoiceDialog
        invoice={invoiceToSettle}
        open={invoiceToSettle !== null}
        onOpenChange={(open) => {
          if (!open) setInvoiceToSettle(null);
        }}
      />

      <InvoicePreviewDialog
        invoice={invoiceToPreview}
        open={invoiceToPreview !== null}
        onOpenChange={(open) => {
          if (!open) setInvoiceToPreview(null);
        }}
      />
    </div>
  );
}
