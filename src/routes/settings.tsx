import { createFileRoute } from '@tanstack/react-router';
import {
  Database,
  Download,
  Eye,
  FileJson,
  Landmark,
  Plus,
  RotateCcw,
  Save,
  ShieldAlert,
  SlidersHorizontal,
  Trash2,
  UserCog,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import type { FormEvent } from 'react';
import { useEffect, useId, useState } from 'react';
import { toast } from 'sonner';
import { MoneyValue } from '#/components/money-value';
import { Button } from '#/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import { Switch } from '#/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs';
import { Textarea } from '#/components/ui/textarea';
import { useFinly } from '#/context/finly-context';
import {
  CURRENCIES,
  formatLiveNumericInput,
  parseNumericInput,
} from '#/lib/format';
import { cn } from '#/lib/utils';
import type { ThemePreference } from '#/types/finly';

export const Route = createFileRoute('/settings')({
  component: SettingsScreen,
});

function SettingsScreen() {
  const {
    profile,
    wallets,
    updateProfile,
    togglePrivacyBlur,
    addWallet,
    exportCsv,
    exportJson,
    resetWorkspaceEmpty,
    restoreDemoWorkspace,
  } = useFinly();
  const { theme, setTheme } = useTheme();
  const baseId = useId();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [businessName, setBusinessName] = useState(profile.businessName ?? '');
  const [emergencyBufferRaw, setEmergencyBufferRaw] = useState(() =>
    formatLiveNumericInput(String(profile.emergencyBuffer), profile.currency),
  );
  const [baselineTargetRaw, setBaselineTargetRaw] = useState(() =>
    formatLiveNumericInput(
      String(profile.baselineDailyTarget),
      profile.currency,
    ),
  );

  const [bankName, setBankName] = useState(profile.paymentDetails.bankName);
  const [accountNumber, setAccountNumber] = useState(
    profile.paymentDetails.accountNumber,
  );
  const [accountHolder, setAccountHolder] = useState(
    profile.paymentDetails.accountHolder,
  );
  const [defaultTermsDays, setDefaultTermsDays] = useState(
    String(profile.paymentDetails.defaultTermsDays),
  );
  const [paymentNotes, setPaymentNotes] = useState(
    profile.paymentDetails.notes ?? '',
  );

  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletOpening, setNewWalletOpening] = useState('');
  const [newWalletIsBiz, setNewWalletIsBiz] = useState(true);

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  useEffect(() => {
    setDisplayName(profile.displayName);
    setBusinessName(profile.businessName ?? '');
    setEmergencyBufferRaw(
      formatLiveNumericInput(String(profile.emergencyBuffer), profile.currency),
    );
    setBaselineTargetRaw(
      formatLiveNumericInput(
        String(profile.baselineDailyTarget),
        profile.currency,
      ),
    );
    setBankName(profile.paymentDetails.bankName);
    setAccountNumber(profile.paymentDetails.accountNumber);
    setAccountHolder(profile.paymentDetails.accountHolder);
    setDefaultTermsDays(String(profile.paymentDetails.defaultTermsDays));
    setPaymentNotes(profile.paymentDetails.notes ?? '');
  }, [profile]);

  const handleSaveWorkspace = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim() || 'Alex Zayyan',
      businessName: businessName.trim() || undefined,
      emergencyBuffer: parseNumericInput(emergencyBufferRaw),
      baselineDailyTarget: Math.max(1, parseNumericInput(baselineTargetRaw)),
    });
    toast.success('Workspace & Safe-to-Spend rules saved');
  };

  const handleSavePaymentDetails = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile({
      paymentDetails: {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim(),
        defaultTermsDays: Number.parseInt(defaultTermsDays, 10) || 14,
        notes: paymentNotes.trim() || undefined,
      },
    });
    toast.success('Default invoice payment details updated');
  };

  const handleCreateWallet = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newWalletName.trim()) return;
    addWallet({
      name: newWalletName.trim(),
      openingBalance: parseNumericInput(newWalletOpening),
      isBusinessWallet: newWalletIsBiz,
    });
    setNewWalletName('');
    setNewWalletOpening('');
  };

  const handleConfirmReset = async () => {
    if (deleteConfirmationText !== 'DELETE') return;
    await resetWorkspaceEmpty();
    setDeleteConfirmationText('');
    setResetDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="font-mono text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
          Settings
        </h1>
        <p className="font-mono text-xs text-muted-foreground sm:text-sm">
          Manage your profile, wallets, display preferences, and data backups.
        </p>
      </div>

      <Tabs defaultValue="workspace" className="space-y-6 gap-4">
        <TabsList className="grid w-full grid-cols-2 gap-1.5 sm:inline-flex sm:w-auto mb-0">
          <TabsTrigger value="workspace" className="px-4">
            <UserCog className="size-3.5" />
            <span>Profile &amp; Wallets</span>
          </TabsTrigger>
          <TabsTrigger value="display" className="px-4">
            <SlidersHorizontal className="size-3.5" />
            <span>Display &amp; Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="px-4">
            <Landmark className="size-3.5" />
            <span>Invoice Details</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="px-4">
            <Database className="size-3.5" />
            <span>Backup &amp; Reset</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. Profile & Wallets Tab */}
        <TabsContent value="workspace">
          <div className="grid grid-cols-12 items-stretch gap-4">
            {/* Left Card: Profile & Spending Rules */}
            <div className="bento-card bento-card-static col-span-12 flex h-full flex-col justify-between gap-5 bg-card p-6 lg:col-span-6">
              <div className="flex items-start justify-between gap-2 border-b-2 border-border pb-4">
                <div className="space-y-1">
                  <h2 className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground sm:text-sm">
                    Profile &amp; Spending Rules
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground">
                    Set your name, safety buffer, and daily spending goal
                  </p>
                </div>
                <span className="inline-flex h-6 shrink-0 items-center rounded-lg border-2 border-border bg-muted px-2.5 font-mono text-[10px] font-bold uppercase text-foreground">
                  Budget
                </span>
              </div>

              <form
                onSubmit={handleSaveWorkspace}
                className="flex flex-1 flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={`${baseId}-name`}
                        className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Your Name
                      </Label>
                      <Input
                        id={`${baseId}-name`}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="h-10 rounded-xl bg-background font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={`${baseId}-biz`}
                        className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Business / Studio Name
                      </Label>
                      <Input
                        id={`${baseId}-biz`}
                        placeholder="Optional"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="h-10 rounded-xl bg-background font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={`${baseId}-buffer`}
                        className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Safety Buffer ({CURRENCIES[profile.currency].symbol})
                      </Label>
                      <Input
                        id={`${baseId}-buffer`}
                        inputMode="decimal"
                        value={emergencyBufferRaw}
                        onChange={(e) =>
                          setEmergencyBufferRaw(
                            formatLiveNumericInput(
                              e.target.value,
                              profile.currency,
                            ),
                          )
                        }
                        className="h-10 rounded-xl bg-background font-mono text-xs tabular-nums"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={`${baseId}-baseline`}
                        className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Daily Spending Goal
                      </Label>
                      <Input
                        id={`${baseId}-baseline`}
                        inputMode="decimal"
                        value={baselineTargetRaw}
                        onChange={(e) =>
                          setBaselineTargetRaw(
                            formatLiveNumericInput(
                              e.target.value,
                              profile.currency,
                            ),
                          )
                        }
                        className="h-10 rounded-xl bg-background font-mono text-xs tabular-nums"
                      />
                    </div>
                  </div>

                  {/* Helpful Rule Explanation Box */}
                  <div className="rounded-xl border-2 border-border bg-muted/40 p-3.5 font-mono text-xs text-muted-foreground">
                    <p className="font-bold text-foreground">
                      How Safe-to-Spend works
                    </p>
                    <p className="mt-1 leading-relaxed">
                      Your{' '}
                      <strong className="text-foreground">Safety Buffer</strong>{' '}
                      is kept untouched at all times. Your remaining balance is
                      divided across the days left in the month.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end border-t-2 border-border pt-4">
                  <Button
                    type="submit"
                    className="h-10 gap-2 rounded-xl bg-primary px-5 font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground cursor-pointer"
                  >
                    <Save className="size-4" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Card: Wallets Manager */}
            <div className="bento-card bento-card-static col-span-12 flex h-full flex-col justify-between gap-5 bg-card p-6 lg:col-span-6">
              <div className="flex items-start justify-between gap-2 border-b-2 border-border pb-4">
                <div className="space-y-1">
                  <h2 className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground sm:text-sm">
                    Your Wallets ({wallets.length})
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground">
                    Keep business and personal accounts organized
                  </p>
                </div>
                <span className="inline-flex h-6 shrink-0 items-center rounded-lg border-2 border-border bg-muted px-2.5 font-mono text-[10px] font-bold uppercase text-foreground">
                  Accounts
                </span>
              </div>

              <div className="space-y-2.5">
                {wallets.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between rounded-xl border-2 border-border bg-background px-4 py-3 text-xs"
                  >
                    <div>
                      <p className="font-mono font-bold text-foreground">
                        {w.name}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {w.isBusinessWallet
                          ? 'Business Account'
                          : 'Personal Account'}
                      </p>
                    </div>
                    <MoneyValue
                      amount={w.balance}
                      className="font-mono text-sm font-extrabold text-foreground tabular-nums"
                    />
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleCreateWallet}
                className="space-y-3 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-4"
              >
                <p className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground">
                  Add New Wallet
                </p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <Input
                    placeholder="e.g., Savings Account"
                    value={newWalletName}
                    onChange={(e) => setNewWalletName(e.target.value)}
                    className="h-9 rounded-xl bg-background font-mono text-xs"
                  />
                  <Input
                    inputMode="decimal"
                    placeholder="Starting balance (0.00)"
                    value={newWalletOpening}
                    onChange={(e) =>
                      setNewWalletOpening(
                        formatLiveNumericInput(
                          e.target.value,
                          profile.currency,
                        ),
                      )
                    }
                    className="h-9 rounded-xl bg-background font-mono text-xs tabular-nums"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <label
                    htmlFor={`${baseId}-new-wal-biz`}
                    className="flex items-center gap-2 font-mono text-xs font-semibold text-muted-foreground cursor-pointer"
                  >
                    <Switch
                      id={`${baseId}-new-wal-biz`}
                      size="sm"
                      checked={newWalletIsBiz}
                      onCheckedChange={setNewWalletIsBiz}
                    />
                    <span>Business account</span>
                  </label>
                  <Button
                    type="submit"
                    size="xs"
                    disabled={!newWalletName.trim()}
                    className="h-8 gap-1 rounded-xl bg-primary px-3 font-mono text-xs font-extrabold text-primary-foreground"
                  >
                    <Plus className="size-3.5" />
                    <span>Add Wallet</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </TabsContent>

        {/* 2. Display & Privacy Tab (Balanced 2-Column Grid) */}
        <TabsContent value="display">
          <div className="grid grid-cols-12 items-stretch gap-4">
            {/* Left Card: Theme, Currency & Privacy */}
            <div className="bento-card bento-card-static col-span-12 flex h-full flex-col justify-between gap-5 bg-card p-6 lg:col-span-6">
              <div className="flex items-start justify-between gap-2 border-b-2 border-border pb-4">
                <div className="space-y-1">
                  <h2 className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground sm:text-sm">
                    Appearance &amp; Privacy
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground">
                    Customize theme, currency, and balance visibility
                  </p>
                </div>
                <span className="inline-flex h-6 shrink-0 items-center rounded-lg border-2 border-border bg-muted px-2.5 font-mono text-[10px] font-bold uppercase text-foreground">
                  Display
                </span>
              </div>

              <div className="space-y-5">
                {/* Color Theme */}
                <div className="space-y-2">
                  <Label className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    App Theme
                  </Label>
                  <RadioGroup
                    value={theme ?? profile.themePreference}
                    onValueChange={(val) => {
                      setTheme(val);
                      updateProfile({
                        themePreference: val as ThemePreference,
                      });
                    }}
                    className="grid grid-cols-3 gap-2.5"
                  >
                    {(['dark', 'light', 'system'] as const).map((mode) => {
                      const active =
                        (theme ?? profile.themePreference) === mode;
                      return (
                        <label
                          key={mode}
                          htmlFor={`${baseId}-theme-${mode}`}
                          className={cn(
                            'brutal-btn flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl font-mono text-xs font-bold capitalize',
                            active
                              ? 'border-border bg-primary font-extrabold text-primary-foreground'
                              : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground',
                          )}
                        >
                          <RadioGroupItem
                            id={`${baseId}-theme-${mode}`}
                            value={mode}
                            className="sr-only"
                          />
                          <span>{mode}</span>
                        </label>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <Label className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Currency
                  </Label>
                  <div className="flex h-10 items-center justify-between rounded-xl border-2 border-border bg-background px-3.5 font-mono text-xs">
                    <span className="font-bold text-foreground">
                      USD ($) — US Dollar
                    </span>
                    <span className="rounded-md border border-border bg-primary px-2 py-0.5 text-[10px] font-extrabold uppercase text-primary-foreground">
                      Default
                    </span>
                  </div>
                </div>

                {/* Privacy Masking Switch */}
                <div className="flex items-center justify-between gap-4 rounded-2xl border-2 border-border bg-background p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border-2 border-info-border bg-info-bg text-info">
                      <Eye className="size-4" />
                    </span>
                    <div>
                      <Label
                        htmlFor={`${baseId}-privacy`}
                        className="font-mono text-xs font-bold text-foreground cursor-pointer"
                      >
                        Hide Balances ($ ••••••)
                      </Label>
                      <p className="font-mono text-xs text-muted-foreground">
                        Blur all money amounts when using your screen in public.
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={`${baseId}-privacy`}
                    checked={profile.privacyBlurEnabled}
                    onCheckedChange={(checked) => togglePrivacyBlur(checked)}
                  />
                </div>
              </div>
            </div>

            {/* Right Card: Label Style */}
            <div className="bento-card bento-card-static col-span-12 flex h-full flex-col justify-between gap-5 bg-card p-6 lg:col-span-6">
              <div className="flex items-start justify-between gap-2 border-b-2 border-border pb-4">
                <div className="space-y-1">
                  <h2 className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground sm:text-sm">
                    Label Style
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground">
                    Choose between everyday words or accounting terms
                  </p>
                </div>
                <span className="inline-flex h-6 shrink-0 items-center rounded-lg border-2 border-border bg-muted px-2.5 font-mono text-[10px] font-bold uppercase text-foreground">
                  Copywriting
                </span>
              </div>

              <RadioGroup
                value={profile.plainTermsEnabled ? 'plain' : 'accounting'}
                onValueChange={(val) => {
                  const plain = val === 'plain';
                  updateProfile({ plainTermsEnabled: plain });
                  toast.success(
                    plain
                      ? 'Switched to Simple Labels'
                      : 'Switched to Accounting Labels',
                  );
                }}
                className="grid gap-3.5"
              >
                <label
                  htmlFor={`${baseId}-term-plain`}
                  className={cn(
                    'flex cursor-pointer items-start gap-3.5 rounded-2xl border-2 p-4 transition-all',
                    profile.plainTermsEnabled
                      ? 'border-primary bg-accent/60'
                      : 'border-border bg-background hover:bg-accent/40',
                  )}
                >
                  <RadioGroupItem
                    id={`${baseId}-term-plain`}
                    value="plain"
                    className="mt-0.5"
                  />
                  <div className="space-y-2">
                    <p className="font-mono text-xs font-extrabold text-foreground">
                      Simple Labels (Recommended)
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      Uses clear, everyday words across all cards and tables.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5 font-mono text-[10px] font-bold">
                      <span className="rounded-md border border-inflow-border bg-inflow-bg px-2 py-0.5 text-inflow">
                        Income
                      </span>
                      <span className="rounded-md border border-outflow-border bg-outflow-bg px-2 py-0.5 text-outflow">
                        Expenses
                      </span>
                      <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-foreground">
                        Unpaid Invoices
                      </span>
                    </div>
                  </div>
                </label>

                <label
                  htmlFor={`${baseId}-term-acct`}
                  className={cn(
                    'flex cursor-pointer items-start gap-3.5 rounded-2xl border-2 p-4 transition-all',
                    !profile.plainTermsEnabled
                      ? 'border-primary bg-accent/60'
                      : 'border-border bg-background hover:bg-accent/40',
                  )}
                >
                  <RadioGroupItem
                    id={`${baseId}-term-acct`}
                    value="accounting"
                    className="mt-0.5"
                  />
                  <div className="space-y-2">
                    <p className="font-mono text-xs font-extrabold text-foreground">
                      Accounting Labels
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      Uses standard bookkeeping terms across all screens.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5 font-mono text-[10px] font-bold">
                      <span className="rounded-md border border-inflow-border bg-inflow-bg px-2 py-0.5 text-inflow">
                        Cash In
                      </span>
                      <span className="rounded-md border border-outflow-border bg-outflow-bg px-2 py-0.5 text-outflow">
                        Cash Out
                      </span>
                      <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-foreground">
                        Receivables
                      </span>
                    </div>
                  </div>
                </label>
              </RadioGroup>
            </div>
          </div>
        </TabsContent>

        {/* 3. Invoice Details Tab (Balanced 2-Column Grid) */}
        <TabsContent value="payment">
          <div className="grid grid-cols-12 items-stretch gap-4">
            {/* Left Card: Default Payment Details Form */}
            <div className="bento-card bento-card-static col-span-12 flex h-full flex-col justify-between gap-5 bg-card p-6 lg:col-span-7">
              <div className="flex items-start justify-between gap-2 border-b-2 border-border pb-4">
                <div className="space-y-1">
                  <h2 className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground sm:text-sm">
                    Default Invoice Payment Details
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground">
                    Automatically added to every new invoice you create
                  </p>
                </div>
                <span className="inline-flex h-6 shrink-0 items-center rounded-lg border-2 border-border bg-muted px-2.5 font-mono text-[10px] font-bold uppercase text-foreground">
                  Billing
                </span>
              </div>

              <form
                onSubmit={handleSavePaymentDetails}
                className="flex flex-1 flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={`${baseId}-bank`}
                        className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Bank Name
                      </Label>
                      <Input
                        id={`${baseId}-bank`}
                        placeholder="e.g., Mercury / Chase / Wise"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="h-10 rounded-xl bg-background font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={`${baseId}-acct-num`}
                        className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Account Number
                      </Label>
                      <Input
                        id={`${baseId}-acct-num`}
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="h-10 rounded-xl bg-background font-mono text-xs tabular-nums"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={`${baseId}-holder`}
                        className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Account Holder Name
                      </Label>
                      <Input
                        id={`${baseId}-holder`}
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        className="h-10 rounded-xl bg-background font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Default Due Date
                      </Label>
                      <Select
                        value={defaultTermsDays}
                        onValueChange={setDefaultTermsDays}
                      >
                        <SelectTrigger className="h-10 w-full rounded-xl border-2 border-border bg-background font-mono text-xs font-semibold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">In 7 Days</SelectItem>
                          <SelectItem value="14">In 14 Days</SelectItem>
                          <SelectItem value="30">In 30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`${baseId}-pay-notes`}
                      className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Extra Invoice Note
                    </Label>
                    <Textarea
                      id={`${baseId}-pay-notes`}
                      rows={3}
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      className="rounded-xl border-2 border-border bg-background font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end border-t-2 border-border pt-4">
                  <Button
                    type="submit"
                    className="h-10 gap-2 rounded-xl bg-primary px-5 font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground cursor-pointer"
                  >
                    <Save className="size-4" />
                    <span>Save Invoice Details</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Card: Live Invoice Payment Block Preview */}
            <div className="bento-card bento-card-static col-span-12 flex h-full flex-col justify-between gap-5 bg-card p-6 lg:col-span-5">
              <div className="flex items-start justify-between gap-2 border-b-2 border-border pb-4">
                <div className="space-y-1">
                  <h2 className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground sm:text-sm">
                    Invoice Footer Preview
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground">
                    How your payment instructions look on client invoices
                  </p>
                </div>
                <span className="inline-flex h-6 shrink-0 items-center rounded-lg border-2 border-border bg-muted px-2.5 font-mono text-[10px] font-bold uppercase text-foreground">
                  Preview
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4 rounded-2xl border-2 border-border bg-background p-4 font-mono text-xs">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-extrabold uppercase tracking-wider text-foreground">
                      Payment Instructions
                    </span>
                    <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      Due in {defaultTermsDays || '14'}d
                    </span>
                  </div>
                  <div className="space-y-1 text-muted-foreground">
                    <p>
                      <span className="text-foreground font-semibold">
                        Bank:
                      </span>{' '}
                      {bankName || 'Not set'}
                    </p>
                    <p>
                      <span className="text-foreground font-semibold">
                        Account:
                      </span>{' '}
                      <span className="tabular-nums">
                        {accountNumber || 'Not set'}
                      </span>
                    </p>
                    <p>
                      <span className="text-foreground font-semibold">
                        Holder:
                      </span>{' '}
                      {accountHolder || 'Not set'}
                    </p>
                  </div>
                </div>

                {paymentNotes && (
                  <div className="rounded-xl border border-border bg-muted/50 p-2.5 text-[11px] text-muted-foreground">
                    &ldquo;{paymentNotes}&rdquo;
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t-2 border-border pt-3 font-mono text-xs text-muted-foreground">
                <span>Included in WhatsApp share</span>
                <span className="font-bold text-inflow">Active</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 4. Backup & Reset Tab (Balanced 2-Column Grid) */}
        <TabsContent value="backup">
          <div className="grid grid-cols-12 items-stretch gap-4">
            {/* Left Card: Export & Backup */}
            <div className="bento-card bento-card-static col-span-12 flex h-full flex-col justify-between gap-5 bg-card p-6 lg:col-span-6">
              <div className="flex items-start justify-between gap-2 border-b-2 border-border pb-4">
                <div className="space-y-1">
                  <h2 className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground sm:text-sm">
                    Export &amp; Backup Data
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground">
                    Download your data anytime for spreadsheets or backups
                  </p>
                </div>
                <span className="inline-flex h-6 shrink-0 items-center rounded-lg border-2 border-border bg-muted px-2.5 font-mono text-[10px] font-bold uppercase text-foreground">
                  Local Data
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-border bg-background p-3.5">
                  <div>
                    <p className="font-mono text-xs font-bold text-foreground">
                      CSV Spreadsheet
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      Export all transactions for Excel or Google Sheets
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={exportCsv}
                    className="h-9 shrink-0 gap-1.5 rounded-xl font-mono text-xs font-bold"
                  >
                    <Download className="size-3.5 text-inflow" />
                    <span>CSV</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-border bg-background p-3.5">
                  <div>
                    <p className="font-mono text-xs font-bold text-foreground">
                      Full JSON Backup
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      Complete copy of wallets, transactions, and invoices
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={exportJson}
                    className="h-9 shrink-0 gap-1.5 rounded-xl font-mono text-xs font-bold"
                  >
                    <FileJson className="size-3.5 text-info" />
                    <span>JSON</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-border bg-background p-3.5">
                  <div>
                    <p className="font-mono text-xs font-bold text-foreground">
                      Sample Data
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      Restore the default demo transactions and invoices
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void restoreDemoWorkspace()}
                    className="h-9 shrink-0 gap-1.5 rounded-xl font-mono text-xs font-bold"
                  >
                    <RotateCcw className="size-3.5 text-warning transition-transform group-hover:-rotate-45" />
                    <span>Restore</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Card: Danger Zone */}
            <div className="bento-card bento-card-static col-span-12 flex h-full flex-col justify-between gap-5 border-outflow-border bg-outflow-bg p-6 lg:col-span-6">
              <div className="flex items-start justify-between gap-2 border-b-2 border-outflow-border pb-4">
                <div className="space-y-1">
                  <h2 className="flex items-center gap-2 font-mono text-xs font-extrabold uppercase tracking-wider text-outflow sm:text-sm">
                    <ShieldAlert className="size-4" />
                    <span>Danger Zone</span>
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground">
                    Clear all transactions, invoices, and wallets on this device
                  </p>
                </div>
                <span className="inline-flex h-6 shrink-0 items-center rounded-lg border-2 border-outflow-border bg-card px-2.5 font-mono text-[10px] font-bold uppercase text-outflow">
                  Reset
                </span>
              </div>

              <div className="rounded-xl border-2 border-outflow-border bg-card/90 p-4 font-mono text-xs text-muted-foreground">
                <p className="font-bold text-foreground">
                  Before you reset your workspace:
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>All recorded income and expenses will be deleted</li>
                  <li>All client invoices and wallet balances will reset</li>
                  <li>Download a JSON backup first if you want a copy</li>
                </ul>
              </div>

              <div className="flex items-center justify-end border-t-2 border-outflow-border pt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setDeleteConfirmationText('');
                    setResetDialogOpen(true);
                  }}
                  className="h-10 gap-2 rounded-xl bg-outflow px-5 font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground hover:bg-outflow/90 cursor-pointer"
                >
                  <Trash2 className="size-4" />
                  <span>Clear All Data</span>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* 2-Step Destructive Reset Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="brutal-surface rounded-3xl border-2 border-border bg-popover p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono text-lg font-bold text-outflow">
              Clear All Data?
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              This permanently removes your transactions, invoices, and wallet
              balances from this browser. Download a backup first if you want to
              keep a copy.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label
              htmlFor={`${baseId}-confirm-delete`}
              className="font-mono text-xs font-semibold text-foreground"
            >
              Type <code className="font-mono font-bold">DELETE</code> to
              confirm:
            </Label>
            <Input
              id={`${baseId}-confirm-delete`}
              placeholder="DELETE"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              className="h-10 rounded-xl bg-background font-mono text-xs"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setResetDialogOpen(false)}
              className="h-10 rounded-xl font-mono text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteConfirmationText !== 'DELETE'}
              onClick={() => void handleConfirmReset()}
              className="h-10 rounded-xl bg-outflow font-mono text-xs font-extrabold text-primary-foreground hover:bg-outflow/90"
            >
              Delete Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
