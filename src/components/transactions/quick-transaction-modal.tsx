import {
  AlertTriangle,
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  Plus,
  RotateCcw,
  X,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Button } from '#/components/ui/button';
import { Checkbox } from '#/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '#/components/ui/dialog';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import { useFinly } from '#/context/finly-context';
import { getUniversalCategories, isTransferCategory } from '#/lib/constants';
import {
  CURRENCIES,
  formatLiveNumericInput,
  formatUSD,
  parseNumericInput,
} from '#/lib/format';
import {
  clearTransactionDraft,
  loadTransactionDraft,
  saveTransactionDraft,
} from '#/lib/storage';
import { cn } from '#/lib/utils';
import type { TransactionDraft, TransactionType } from '#/types/finly';

export function QuickTransactionModal() {
  const {
    wallets,
    todayISO,
    terminology,
    isQuickEntryOpen,
    quickEntryDefaultType,
    closeQuickEntry,
    addTransaction,
  } = useFinly();

  const amountInputRef = useRef<HTMLInputElement | null>(null);
  const baseId = useId();

  const [txType, setTxType] = useState<TransactionType>(quickEntryDefaultType);
  const [rawAmount, setRawAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [customCategoryMode, setCustomCategoryMode] = useState<boolean>(false);
  const [customCategoryText, setCustomCategoryText] = useState<string>('');
  const [walletId, setWalletId] = useState<string>(wallets[0]?.id ?? '');
  const [txDate, setTxDate] = useState<string>(todayISO);
  const [note, setNote] = useState<string>('');
  const [isBusiness, setIsBusiness] = useState<boolean>(true);
  const [confirmOverflow, setConfirmOverflow] = useState<boolean>(false);
  const [recoverableDraft, setRecoverableDraft] =
    useState<TransactionDraft | null>(null);

  const presetCategories = useMemo(
    () => getUniversalCategories(txType),
    [txType],
  );

  useEffect(() => {
    if (!isQuickEntryOpen) return;

    const defaultCategories = getUniversalCategories(quickEntryDefaultType);
    setTxType(quickEntryDefaultType);
    setRawAmount('');
    setCategory(defaultCategories[0] ?? 'Food & Personal');
    setCustomCategoryMode(false);
    setCustomCategoryText('');
    setWalletId(wallets[0]?.id ?? '');
    setTxDate(todayISO);
    setNote('');
    setIsBusiness(true);
    setConfirmOverflow(false);

    const savedDraft = loadTransactionDraft();
    if (savedDraft?.rawAmount && parseNumericInput(savedDraft.rawAmount) > 0) {
      setRecoverableDraft(savedDraft);
    } else {
      setRecoverableDraft(null);
    }

    const focusTimer = window.setTimeout(() => {
      amountInputRef.current?.focus();
    }, 60);

    return () => window.clearTimeout(focusTimer);
  }, [isQuickEntryOpen, quickEntryDefaultType, todayISO, wallets]);

  useEffect(() => {
    if (!isQuickEntryOpen) return;
    if (!rawAmount.trim() && !note.trim()) return;

    saveTransactionDraft({
      type: txType,
      rawAmount,
      category: customCategoryMode
        ? customCategoryText.trim() || category
        : category,
      walletId,
      note,
      isBusiness,
      updatedAt: Date.now(),
    });
  }, [
    category,
    customCategoryMode,
    customCategoryText,
    isBusiness,
    isQuickEntryOpen,
    note,
    rawAmount,
    txType,
    walletId,
  ]);

  const handleTypeSwitch = (nextType: TransactionType) => {
    setTxType(nextType);
    const nextPresets = getUniversalCategories(nextType);
    if (!customCategoryMode) {
      setCategory(nextPresets[0] ?? 'Client Invoices');
    }
  };

  const handleRestoreDraft = () => {
    if (!recoverableDraft) return;
    setTxType(recoverableDraft.type);
    setRawAmount(recoverableDraft.rawAmount);
    const presets = getUniversalCategories(recoverableDraft.type);
    if (presets.includes(recoverableDraft.category)) {
      setCustomCategoryMode(false);
      setCategory(recoverableDraft.category);
    } else {
      setCustomCategoryMode(true);
      setCustomCategoryText(recoverableDraft.category);
    }
    if (wallets.some((w) => w.id === recoverableDraft.walletId)) {
      setWalletId(recoverableDraft.walletId);
    }
    setNote(recoverableDraft.note);
    setIsBusiness(recoverableDraft.isBusiness);
    setRecoverableDraft(null);
  };

  const handleDismissDraft = () => {
    clearTransactionDraft();
    setRecoverableDraft(null);
  };

  const numericAmount = parseNumericInput(rawAmount);
  const currencyMeta = CURRENCIES.USD;
  const isOverflow = numericAmount > currencyMeta.overflowThreshold;

  const resolvedCategory = customCategoryMode
    ? customCategoryText.trim()
    : category;
  const canSubmit =
    numericAmount > 0 &&
    resolvedCategory.length > 0 &&
    (!isOverflow || confirmOverflow);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    addTransaction({
      amount: numericAmount,
      type: txType,
      category: resolvedCategory,
      walletId: walletId || wallets[0]?.id || 'wal_business',
      date: txDate || todayISO,
      note: note.trim() || undefined,
      isBusiness,
    });

    clearTransactionDraft();
    setRecoverableDraft(null);
    closeQuickEntry();
  };

  return (
    <Dialog
      open={isQuickEntryOpen}
      onOpenChange={(open) => {
        if (!open) closeQuickEntry();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="brutal-surface rounded-3xl border-2 border-border bg-popover p-6 sm:max-w-lg"
      >
        <div className="flex justify-between">
          <DialogHeader>
            <DialogTitle className="font-mono text-lg font-black uppercase tracking-tight">
              Add Transaction
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Record income or an expense in seconds.
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild disabled={false}>
            <Button size="icon-xs" aria-label="Close dialog">
              <X className="size-4" />
            </Button>
          </DialogClose>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 no-scrollbar max-h-[90vh] overflow-y-auto"
        >
          {/* Draft Recovery Banner */}
          {recoverableDraft && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-info-border bg-info-bg px-3.5 py-2.5 font-mono text-xs">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <RotateCcw className="size-3.5 text-info" />
                <span>
                  Restore unsaved draft (${recoverableDraft.rawAmount})?
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  size="xs"
                  onClick={handleRestoreDraft}
                  className="rounded-lg bg-primary font-mono font-bold text-primary-foreground"
                >
                  Restore
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant="ghost"
                  onClick={handleDismissDraft}
                  className="font-mono"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {/* TRANSACTION TYPE */}
          <div className="space-y-1.5">
            <Label className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Type
            </Label>
            <div className="brutal-surface grid grid-cols-2 gap-1.5 rounded-2xl bg-muted/50 p-1">
              <button
                type="button"
                onClick={() => handleTypeSwitch('money_out')}
                className={cn(
                  'flex h-10 items-center justify-center gap-1.5 rounded-xl border-2 px-3 font-mono text-xs transition-all duration-150 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  txType === 'money_out'
                    ? 'border-border bg-outflow font-extrabold text-primary-foreground'
                    : 'border-transparent font-semibold text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <ArrowDownRight className="size-4 shrink-0" />
                <span>{terminology.outflowAction}</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeSwitch('money_in')}
                className={cn(
                  'flex h-10 items-center justify-center gap-1.5 rounded-xl border-2 px-3 font-mono text-xs transition-all duration-150 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  txType === 'money_in'
                    ? 'border-border bg-inflow font-extrabold text-primary-foreground'
                    : 'border-transparent font-semibold text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <ArrowUpRight className="size-4 shrink-0" />
                <span>{terminology.inflowAction}</span>
              </button>
            </div>
          </div>

          {/* AMOUNT (USD) */}
          <div className="space-y-1.5">
            <Label
              htmlFor={`${baseId}-amount`}
              className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Amount (USD)
            </Label>
            <div className="brutal-surface flex items-center gap-2 rounded-2xl bg-background px-4 py-2.5 transition-colors focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]">
              <span className="font-mono text-2xl font-black text-muted-foreground select-none tabular-nums">
                $
              </span>
              <input
                ref={amountInputRef}
                id={`${baseId}-amount`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0.00"
                value={rawAmount}
                onChange={(e) => {
                  setRawAmount(formatLiveNumericInput(e.target.value, 'USD'));
                  setConfirmOverflow(false);
                }}
                className="h-10 w-full bg-transparent font-mono text-2xl font-black tracking-tight text-foreground placeholder:text-muted-foreground/40 focus:outline-hidden tabular-nums"
              />
            </div>
          </div>

          {/* Overflow Safeguard */}
          {isOverflow && (
            <div className="space-y-2 rounded-2xl border-2 border-warning-border bg-warning-bg p-3 font-mono text-xs">
              <div className="flex items-start gap-2 text-amber-900 dark:text-warning">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <p className="font-medium">
                  Large amount alert:{' '}
                  <strong className="tabular-nums">
                    {formatUSD(numericAmount)}
                  </strong>{' '}
                  is over $1,000,000.00.
                </p>
              </div>
              <div className="flex items-center gap-2 pl-6">
                <Checkbox
                  id={`${baseId}-overflow-confirm`}
                  checked={confirmOverflow}
                  onCheckedChange={(checked) =>
                    setConfirmOverflow(checked === true)
                  }
                />
                <Label
                  htmlFor={`${baseId}-overflow-confirm`}
                  className="cursor-pointer font-mono text-xs font-semibold text-foreground"
                >
                  Yes, this amount is correct.
                </Label>
              </div>
            </div>
          )}

          {/* CATEGORY */}
          <div className="space-y-2">
            <Label className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Category
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {presetCategories.map((preset) => {
                const isSelected = !customCategoryMode && category === preset;
                const isTransfer = isTransferCategory(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setCustomCategoryMode(false);
                      setCategory(preset);
                    }}
                    className={cn(
                      'inline-flex h-9 items-center gap-1.5 rounded-xl border-2 px-3 font-mono text-xs transition-all duration-150 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]',
                      isTransfer
                        ? isSelected
                          ? 'border-[#6366F1] bg-[#6366F1]/20 font-extrabold text-[#6366F1]'
                          : 'border-[#6366F1]/30 bg-[#6366F1]/10 font-semibold text-[#6366F1] hover:border-[#6366F1] hover:bg-[#6366F1]/15'
                        : isSelected
                          ? 'border-border bg-primary font-extrabold text-primary-foreground'
                          : 'border-border bg-background font-semibold text-foreground hover:bg-accent',
                    )}
                  >
                    {isTransfer && <ArrowLeftRight className="size-3.5" />}
                    <span>{preset}</span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setCustomCategoryMode(true)}
                className={cn(
                  'inline-flex h-9 items-center gap-1 rounded-xl border-2 border-dashed px-3 font-mono text-xs transition-all duration-150 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  customCategoryMode
                    ? 'border-border bg-primary font-extrabold text-primary-foreground'
                    : 'border-border bg-transparent font-semibold text-muted-foreground hover:text-foreground',
                )}
              >
                <Plus className="size-3.5" />
                <span>Custom</span>
              </button>
            </div>
            {customCategoryMode && (
              <Input
                placeholder="Type custom category..."
                value={customCategoryText}
                onChange={(e) => setCustomCategoryText(e.target.value)}
                className="mt-1.5 h-10 rounded-xl bg-background font-mono text-xs"
              />
            )}
          </div>

          {/* WALLET ACCOUNT & DATE */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Wallet
              </Label>
              <Select value={walletId} onValueChange={setWalletId}>
                <SelectTrigger className="h-10 w-full rounded-xl border-2 border-border bg-background font-mono text-xs font-semibold">
                  <SelectValue placeholder="Choose wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name} ({formatUSD(w.balance)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor={`${baseId}-date`}
                className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Date
              </Label>
              <Input
                id={`${baseId}-date`}
                type="date"
                value={txDate}
                onChange={(e) => setTxDate(e.target.value)}
                className="h-10 rounded-xl bg-background font-mono text-xs tabular-nums"
              />
            </div>
          </div>

          {/* NOTE / DESCRIPTION */}
          <div className="space-y-1.5">
            <Label
              htmlFor={`${baseId}-note`}
              className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Note (Optional)
            </Label>
            <Input
              id={`${baseId}-note`}
              placeholder="e.g., Office supplies or client project"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-10 rounded-xl bg-background font-mono text-xs"
            />
          </div>

          {/* Business Transaction Checkbox */}
          <div className="flex items-center gap-2.5 rounded-2xl border-2 border-border bg-background px-3.5 py-2.5">
            <Checkbox
              id={`${baseId}-biz`}
              checked={isBusiness}
              onCheckedChange={(checked) => setIsBusiness(checked === true)}
            />
            <Label
              htmlFor={`${baseId}-biz`}
              className="cursor-pointer font-mono text-xs font-semibold text-foreground"
            >
              Business transaction (for tax records)
            </Label>
          </div>

          {/* DialogFooter */}
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeQuickEntry}
              className="h-10 rounded-xl font-mono text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="h-10 rounded-xl bg-primary px-6 font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground cursor-pointer"
            >
              Save Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
