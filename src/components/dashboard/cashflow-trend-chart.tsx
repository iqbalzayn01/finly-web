import { useId, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import type { ChartConfig } from "#/components/ui/chart";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "#/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { useFinly } from "#/context/finly-context";
import { buildAreaChartSeries } from "#/lib/cashflow";
import { formatCurrency, formatUSD } from "#/lib/format";
import { cn } from "#/lib/utils";
import type { AreaChartDataPoint, ChartTimeRange } from "#/types/finly";

const TIME_RANGES: ChartTimeRange[] = ["1W", "1M", "3M", "6M", "1Y"];

export function CashflowTrendChart() {
	const { transactions, todayISO, profile, terminology, selectedWalletId } =
		useFinly();
	const rawId = useId().replace(/:/g, "");
	const [timeRange, setTimeRange] = useState<ChartTimeRange>("1M");

	const series = useMemo(
		() =>
			buildAreaChartSeries(transactions, todayISO, timeRange, selectedWalletId),
		[selectedWalletId, timeRange, todayISO, transactions],
	);

	const chartConfig = useMemo<ChartConfig>(
		() => ({
			income: {
				label: terminology.inflow,
				color: "var(--inflow)",
			},
			expenses: {
				label: terminology.outflow,
				color: "var(--outflow)",
			},
		}),
		[terminology.inflow, terminology.outflow],
	);

	const incomeGradientId = `fillIncome_${rawId}`;
	const expensesGradientId = `fillExpenses_${rawId}`;

	return (
		<Card className="shadow-neu-raised rounded-2xl border border-zinc-100 bg-white py-5 dark:border-zinc-800 dark:bg-zinc-900">
			<CardHeader className="flex flex-col justify-between gap-4 border-b border-border/60 pb-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<CardTitle className="text-base font-bold">
						Cashflow Overview
					</CardTitle>
					<CardDescription className="text-xs">
						Interactive {terminology.inflow.toLowerCase()} vs.{" "}
						{terminology.outflow.toLowerCase()} trend in USD
					</CardDescription>
				</div>

				{/* Interactive Time Range Filter: 1W, 1M, 3M, 6M, 1Y (PRD §3.3) */}
				<ToggleGroup
					type="single"
					value={timeRange}
					onValueChange={(val) => {
						if (val) setTimeRange(val as ChartTimeRange);
					}}
					variant="outline"
					size="sm"
					aria-label="Select cashflow chart time range"
					className="shadow-neu-inset justify-start rounded-xl p-1 bg-zinc-100 sm:justify-end dark:bg-zinc-800"
				>
					{TIME_RANGES.map((range) => (
						<ToggleGroupItem
							key={range}
							value={range}
							aria-label={`Show ${range} cashflow trend`}
							className="rounded-lg px-3 text-xs font-semibold data-[state=on]:shadow-neu-sm data-[state=on]:bg-zinc-900 data-[state=on]:font-bold data-[state=on]:text-white dark:data-[state=on]:bg-white dark:data-[state=on]:text-zinc-900"
						>
							{range}
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</CardHeader>

			<CardContent className="px-2 pt-5 sm:px-6">
				<ChartContainer
					config={chartConfig}
					className={cn(
						"aspect-auto h-72 w-full",
						profile.privacyBlurEnabled && "privacy-masked",
					)}
				>
					<AreaChart
						data={series}
						margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
					>
						<defs>
							<linearGradient id={incomeGradientId} x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
								<stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
							</linearGradient>
							<linearGradient
								id={expensesGradientId}
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
								<stop offset="95%" stopColor="#F43F5E" stopOpacity={0.05} />
							</linearGradient>
						</defs>

						<CartesianGrid
							vertical={false}
							strokeDasharray="3 3"
							className="stroke-border/60"
						/>
						<XAxis
							dataKey="label"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={24}
							className="text-xs"
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							width={54}
							tickFormatter={(val: number) =>
								formatCurrency(val, "USD", { compact: true })
							}
							className="text-xs tabular-nums"
						/>

						{/* Point-Level Popover Tooltip with Formatted Date, USD Values & Net Difference (PRD §4.3) */}
						<ChartTooltip
							cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
							content={
								<ChartTooltipContent
									indicator="dot"
									labelFormatter={(_value, payload) => {
										const point = payload?.[0]?.payload as
											| AreaChartDataPoint
											| undefined;
										return point?.tooltipDate ?? String(_value ?? "");
									}}
									formatter={(value, name, item, index) => {
										const numVal = Number(value) || 0;
										const isIncome = name === "income";
										const point = item.payload as
											| AreaChartDataPoint
											| undefined;
										const netDiff = point?.net ?? 0;

										return (
											<div className="flex w-full flex-col gap-1.5">
												<div className="flex items-center justify-between gap-4">
													<div className="flex items-center gap-2">
														<span
															className={cn(
																"size-2.5 shrink-0 rounded-full",
																isIncome ? "bg-emerald-500" : "bg-rose-500",
															)}
														/>
														<span className="text-muted-foreground">
															{isIncome
																? terminology.inflow
																: terminology.outflow}
														</span>
													</div>
													<span
														className={cn(
															"font-semibold tabular-nums",
															isIncome
																? "text-emerald-600 dark:text-emerald-400"
																: "text-rose-600 dark:text-rose-400",
														)}
													>
														{isIncome ? "+" : "-"}
														{formatUSD(numVal)}
													</span>
												</div>

												{index === 1 && point && (
													<div className="flex items-center justify-between gap-4 border-t border-border/70 pt-1.5">
														<span className="font-medium text-muted-foreground">
															Net Difference
														</span>
														<span
															className={cn(
																"font-bold tabular-nums",
																netDiff >= 0
																	? "text-emerald-600 dark:text-emerald-400"
																	: "text-rose-600 dark:text-rose-400",
															)}
														>
															{netDiff >= 0 ? "+" : "-"}
															{formatUSD(Math.abs(netDiff))}
														</span>
													</div>
												)}
											</div>
										);
									}}
								/>
							}
						/>

						<Area
							dataKey="income"
							type="monotone"
							fill={`url(#${incomeGradientId})`}
							stroke="var(--color-income)"
							strokeWidth={2}
						/>
						<Area
							dataKey="expenses"
							type="monotone"
							fill={`url(#${expensesGradientId})`}
							stroke="var(--color-expenses)"
							strokeWidth={2}
						/>
						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
