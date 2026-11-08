import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
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
          className="rounded-lg border-[#6366F1]/30 bg-[#6366F1]/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#6366F1]"
        >
          Draft
        </Badge>
      );
    case 'sent':
      return (
        <Badge
          variant="outline"
          className="rounded-lg border-[#6366F1]/30 bg-[#6366F1]/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#6366F1]"
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

  const handleCopyInvoiceLink = async (invoice: Invoice) => {
    const url = buildWhatsAppInvoiceUrl(
      invoice,
      profile.currency,
      profile.businessName || profile.displayName,
    );
    try {
      await navigator.clipboard.writeText(url);
      toast.success(`Share link for #${invoice.invoiceNumber} copied`);
    } catch {
      toast.error('Unable to access clipboard');
    }
  };

  const filterTabs: Array<{ id: FilterTab; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'unpaid', label: 'Unpaid' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'paid', label: 'Paid' },
    { id: 'draft', label: 'Drafts' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h1 className="font-mono text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
            Client Invoices
          </h1>
          <p className="font-mono text-xs text-muted-foreground sm:text-sm">
            Create invoices, track overdue payments, and mark bills as paid.
          </p>
        </div>

        <Button
          type="button"
          size="default"
          onClick={() => setCreateModalOpen(true)}
          className="h-10 gap-2 rounded-xl bg-primary px-4 font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground"
        >
          <Plus className="size-4 stroke-[2.5] transition-transform duration-200 group-hover:rotate-90" />
          <span>New Invoice</span>
        </Button>
      </div>

      {/* 12-Column Bento Grid */}
      <div className="grid grid-cols-12 items-stretch gap-4">
        {/* Bento Stat 1: Waiting to Be Paid */}
        <div className="bento-card col-span-12 flex h-full flex-col justify-between gap-4 bg-card p-6 sm:col-span-4">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Waiting to Be Paid
            </p>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-muted-foreground text-muted-foreground">
              <Clock className="size-5" />
            </span>
          </div>

          <MoneyValue
            amount={summary.waitingAmount}
            className="font-mono text-2xl font-black tracking-tight text-foreground tabular-nums sm:text-3xl"
          />

          <div className="flex items-center justify-between border-t-2 border-border pt-3 font-mono text-xs">
            <span className="text-muted-foreground">Pending</span>
            <span className="font-bold text-foreground tabular-nums">
              {summary.waitingCount}{' '}
              {summary.waitingCount === 1 ? 'invoice' : 'invoices'}
            </span>
          </div>
        </div>

        {/* Bento Stat 2: Overdue */}
        <div className="bento-card col-span-12 flex h-full flex-col justify-between gap-4 bg-card p-6 sm:col-span-4">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Overdue
            </p>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-muted-foreground text-muted-foreground">
              <TriangleAlert className="size-5" />
            </span>
          </div>

          <MoneyValue
            amount={summary.overdueAmount}
            className={cn(
              'font-mono text-2xl font-black tracking-tight tabular-nums sm:text-3xl',
              summary.overdueCount > 0 ? 'text-outflow' : 'text-foreground',
            )}
          />

          <div className="flex items-center justify-between border-t-2 border-border pt-3 font-mono text-xs">
            <span className="text-muted-foreground">Needs follow-up</span>
            <span
              className={cn(
                'font-bold tabular-nums',
                summary.overdueCount > 0 ? 'text-outflow' : 'text-foreground',
              )}
            >
              {summary.overdueCount}{' '}
              {summary.overdueCount === 1 ? 'client' : 'clients'}
            </span>
          </div>
        </div>

        {/* Bento Stat 3: Paid This Month */}
        <div className="bento-card col-span-12 flex h-full flex-col justify-between gap-4 bg-card p-6 sm:col-span-4">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Paid This Month
            </p>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-muted-foreground text-muted-foreground">
              <CheckCircle2 className="size-5" />
            </span>
          </div>

          <MoneyValue
            amount={summary.collectedThisMonthAmount}
            className="font-mono text-2xl font-black tracking-tight text-inflow tabular-nums sm:text-3xl"
          />

          <div className="flex items-center justify-between border-t-2 border-border pt-3 font-mono text-xs">
            <span className="text-muted-foreground">Collected</span>
            <span className="font-bold text-foreground tabular-nums">
              {summary.collectedThisMonthCount}{' '}
              {summary.collectedThisMonthCount === 1 ? 'invoice' : 'invoices'}
            </span>
          </div>
        </div>

        {/* Bento Table: Invoices List (Span-12) */}
        <div className="bento-card bento-card-static col-span-12 overflow-hidden bg-card">
          {/* Filter Pills + Search Header */}
          <div className="flex flex-col justify-between gap-4 border-b-2 border-border p-6 sm:flex-row sm:items-center">
            <div
              role="tablist"
              aria-label="Filter invoices by status"
              className="brutal-surface flex flex-wrap items-center gap-1 rounded-xl bg-background p-1"
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
                      'inline-flex h-8 items-center gap-1.5 rounded-lg border-2 px-3 font-mono text-xs transition-all duration-150 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      active
                        ? 'border-border bg-primary font-extrabold text-primary-foreground'
                        : 'border-transparent font-semibold text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        'rounded-md border px-1.5 py-0.5 text-[10px] tabular-nums',
                        active
                          ? 'border-primary-foreground/30 bg-primary-foreground/15 font-bold text-primary-foreground'
                          : 'border-border bg-muted text-muted-foreground',
                      )}
                    >
                      {countsByTab[tab.id]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search client or #INV..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 rounded-xl border-2 border-border bg-background pl-10 font-mono text-xs"
              />
            </div>
          </div>

          {/* Table or Empty State */}
          {filteredInvoices.length === 0 ? (
            <div className="p-6">
              <Empty className="rounded-2xl border-2 border-dashed border-border bg-muted/30 py-10">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText className="size-5 text-foreground" />
                  </EmptyMedia>
                  <EmptyTitle className="font-mono text-base font-bold">
                    {invoices.length === 0
                      ? 'No invoices yet'
                      : 'No matching invoices'}
                  </EmptyTitle>
                  <EmptyDescription className="font-mono text-xs">
                    Create a client invoice in seconds and add the payment to
                    your balance when it is paid.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    type="button"
                    onClick={() => setCreateModalOpen(true)}
                    className="h-10 gap-2 rounded-xl bg-primary px-5 font-mono text-xs font-extrabold uppercase text-primary-foreground"
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
                  <TableHeader className="bg-muted/60">
                    <TableRow className="border-b-2 border-border">
                      <TableHead className="pl-6 font-mono text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Client / Project
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Invoice #
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Due Date
                      </TableHead>
                      <TableHead className="text-right font-mono text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Amount
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="pr-6 text-right font-mono text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
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
                          className="border-border transition-colors hover:bg-accent/70"
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
                          <TableCell>
                            <span className="inline-flex items-center rounded-md border border-[#6366F1]/30 bg-[#6366F1]/15 px-2 py-0.5 font-mono text-xs font-bold text-[#6366F1] tabular-nums">
                              #{inv.invoiceNumber}
                            </span>
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
                            <div className="flex items-center justify-end gap-2">
                              {!isPaid && (
                                <Button
                                  type="button"
                                  size="xs"
                                  onClick={() => setInvoiceToSettle(inv)}
                                  className="gap-1 rounded-lg bg-primary font-mono text-[11px] font-extrabold text-primary-foreground cursor-pointer"
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
                                  className="group gap-1 rounded-lg border-[#6366F1]/30 bg-[#6366F1]/10 font-mono text-[11px] font-bold text-[#6366F1] hover:border-[#6366F1] hover:bg-[#6366F1]/25 hover:text-[#818CF8]"
                                >
                                  <span>Share Link</span>
                                  <ArrowUpRight className="size-3.5 text-[#6366F1] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#818CF8]" />
                                </Button>
                              )}
                              <Button
                                type="button"
                                size="xs"
                                variant="outline"
                                onClick={() => handleCopyInvoiceLink(inv)}
                                className="gap-1 rounded-lg border-[#6366F1]/30 bg-[#6366F1]/10 font-mono text-[11px] font-bold text-[#6366F1] hover:border-[#6366F1] hover:bg-[#6366F1]/25"
                              >
                                <Copy className="size-3.5" />
                                <span className="hidden xl:inline">
                                  Copy Link
                                </span>
                              </Button>
                              <Button
                                type="button"
                                size="xs"
                                variant="ghost"
                                onClick={() => setInvoiceToPreview(inv)}
                                aria-label={`Preview invoice ${inv.invoiceNumber}`}
                                className="gap-1 rounded-lg font-mono text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                              >
                                <Eye className="size-3.5" />
                                <span className="hidden lg:inline">
                                  {isPaid ? 'Receipt' : 'View'}
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
              <div className="divide-y-2 divide-border md:hidden">
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
                            <span className="inline-flex items-center rounded-md border border-[#6366F1]/30 bg-[#6366F1]/15 px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#6366F1] tabular-nums">
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
                          <div className="mt-1">
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
                          className="h-8 gap-1 rounded-xl font-mono font-bold"
                        >
                          <Eye className="size-3.5" />
                          <span>{isPaid ? 'Receipt' : 'View'}</span>
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          onClick={() => handleCopyInvoiceLink(inv)}
                          className="h-8 gap-1 rounded-xl border-[#6366F1]/30 bg-[#6366F1]/10 font-mono font-bold text-[#6366F1] hover:border-[#6366F1] hover:bg-[#6366F1]/25"
                        >
                          <Copy className="size-3.5" />
                          <span>Copy Link</span>
                        </Button>
                        {!isPaid && (
                          <Button
                            type="button"
                            size="xs"
                            variant="outline"
                            onClick={() => handleWhatsAppShare(inv)}
                            className="group h-8 gap-1 rounded-xl border-[#6366F1]/30 bg-[#6366F1]/10 font-mono font-bold text-[#6366F1] hover:border-[#6366F1] hover:bg-[#6366F1]/25 hover:text-[#818CF8]"
                          >
                            <span>Share Link</span>
                            <ArrowUpRight className="size-3.5 text-[#6366F1] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#818CF8]" />
                          </Button>
                        )}
                        {!isPaid && (
                          <Button
                            type="button"
                            size="xs"
                            onClick={() => setInvoiceToSettle(inv)}
                            className="h-8 gap-1 rounded-xl bg-primary font-mono font-extrabold text-primary-foreground cursor-pointer"
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
