"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, ArrowLeft, TrendingUp } from "lucide-react";

export default function StrategyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [strategy, setStrategy] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-red-600">
        <p>{error}</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/strategies"><ArrowLeft className="mr-2 h-4 w-4" />Back to Strategies</Link>
        </Button>
      </div>
    );
  }

  if (!strategy) return null;

  // Always use normalized fields from logic if present
  const entryLong = strategy.logic?.entryLong ?? strategy.entryLong;
  const entryShort = strategy.logic?.entryShort ?? strategy.entryShort;
  const exitLong = strategy.logic?.exitLong ?? strategy.exitLong;
  const exitShort = strategy.logic?.exitShort ?? strategy.exitShort;
  const riskManagement = strategy.logic?.riskManagement ?? strategy.riskManagement;

  // Helper to render condition details, including secondaryIndicator, in a human-readable format
  const renderCondition = (cond: any) => {
    // Main indicator
    const main = `${cond.indicator || cond.type}${cond.params?.period ? ' ' + cond.params.period : ''}`;
    // Logic
    const logic = cond.logic || cond.operator || '';
    // Secondary indicator (if present)
    let secondary = '';
    if (cond.secondaryIndicator) {
      const sec = cond.secondaryIndicator;
      secondary = `${sec.type || ''}${sec.params?.period ? ' ' + sec.params.period : ''}`;
    }
    // Value (if present and not a secondary indicator)
    let value = '';
    if (!secondary && cond.value !== undefined && cond.value !== null) {
      value = cond.value;
    }
    // Source
    const source = cond.params?.source ? ` (source: ${cond.params.source})` : '';

    return (
      <li className="mb-1">
        <span className="font-semibold text-purple-800 dark:text-purple-200">{main}</span>
        <span className="mx-1 text-purple-700 dark:text-purple-300">{logic}</span>
        {secondary ? (
          <span className="font-semibold text-purple-800 dark:text-purple-200">{secondary}</span>
        ) : value ? (
          <span className="font-semibold text-purple-900 dark:text-purple-100">{value}</span>
        ) : null}
        {source && <span className="text-gray-500">{source}</span>}
      </li>
    );
  };

  return (
    <div className="container py-10 max-w-2xl mx-auto">
      <Button variant="outline" className="mb-6" asChild>
        <Link href="/strategies"><ArrowLeft className="mr-2 h-4 w-4" />Back to Strategies</Link>
      </Button>
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-purple-200/80 to-white dark:from-purple-950/80 dark:to-gray-900/90 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 p-6 rounded-b-3xl">
          <CardTitle className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="inline-block bg-white/10 rounded-full px-4 py-1 text-lg font-semibold text-purple-100 shadow">{strategy.name}</span>
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold shadow ${strategy.status === "active" ? "bg-green-400/80 text-green-900" : "bg-yellow-300/80 text-yellow-900"}`}>{strategy.status === "active" ? "Active" : "In Development"}</span>
          </CardTitle>
          <CardDescription className="text-sm text-purple-100/80 mt-2">Created {strategy.created_at || strategy.createdAt}</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-lg font-bold text-purple-900 dark:text-purple-200 mb-1">Symbol: <span className="font-mono text-purple-700 dark:text-purple-300">{strategy.symbol}</span></div>
              <div className="text-md text-gray-700 dark:text-gray-300">Execution Mode: <span className="font-semibold">{strategy.execution_mode || "N/A"}</span></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(strategy.tags || []).map((tag: string) => (
                <span key={tag} className="rounded-full bg-purple-300/40 text-purple-900 px-3 py-1 text-xs font-bold shadow-sm border border-purple-400/30">{tag}</span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-semibold text-lg">{strategy.performance || "N/A"} in backtests</span>
            </div>
            <p className="mt-2 text-md text-gray-700 dark:text-gray-300 font-medium italic">{strategy.description || strategy.symbol}</p>
          </div>

          {/* Entry/Exit Blocks */}
          <div className="mb-8">
            <h3 className="font-bold text-xl text-purple-800 mb-3">Strategy Logic</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'entryLong', data: entryLong },
                { key: 'entryShort', data: entryShort },
                { key: 'exitLong', data: exitLong },
                { key: 'exitShort', data: exitShort },
              ].map(({ key, data }) => (
                data && Array.isArray(data?.conditionGroups) ? (
                  <div key={key} className="bg-white dark:bg-purple-950/40 rounded-2xl shadow p-4 border border-purple-200/40">
                    <div className="font-semibold text-purple-700 text-lg mb-2 capitalize flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-purple-400"></span>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    {data.conditionGroups.map((group: any, idx: number) => (
                      <div key={idx} className="ml-2 mt-2 mb-2 p-2 bg-purple-50/60 dark:bg-purple-900/30 rounded-xl border border-purple-100/40">
                        <div className="font-semibold text-xs text-purple-700 mb-1">Condition Group {idx + 1}</div>
                        {Array.isArray(group.conditions) && group.conditions.length > 0 ? (
                          <ul className="list-disc ml-5 text-xs text-gray-800 dark:text-gray-200">
                            {group.conditions.map(renderCondition)}
                          </ul>
                        ) : (
                          <div className="text-xs text-gray-500">No conditions defined.</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null
              ))}
            </div>
          </div>

          {/* Risk Management */}
          {riskManagement && (
            <div className="mb-8">
              <h3 className="font-bold text-xl text-purple-800 mb-3">Risk Management</h3>
              {typeof riskManagement === 'object' && Object.keys(riskManagement).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(riskManagement).map(([key, value]) => (
                    <div key={key} className="bg-purple-50/60 dark:bg-purple-900/30 rounded-xl border border-purple-100/40 p-4 flex flex-col gap-1 shadow">
                      <span className="text-xs uppercase tracking-wider text-purple-700 font-bold">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-md text-purple-900 dark:text-purple-100 font-semibold">
                        {Array.isArray(value)
                          ? (value.length > 0
                              ? value.map((rule: any, idx: number) => (
                                  <div key={idx} className="mb-1">
                                    {typeof rule === 'object'
                                      ? Object.entries(rule).map(([rk, rv]) => `${rk}: ${typeof rv === 'object' ? JSON.stringify(rv) : rv}`).join(', ')
                                      : String(rule)}
                                  </div>
                                ))
                              : 'N/A')
                          : (typeof value === 'object'
                              ? JSON.stringify(value)
                              : String(value))}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500">No risk management rules defined.</div>
              )}
            </div>
          )}

          {/* Trade Execution Dashboard */}
          <div className="mb-8">
            <h3 className="font-bold text-xl text-purple-800 mb-3">Trade Execution Dashboard</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-white dark:bg-purple-950/40 rounded-2xl border border-purple-200/40 p-4 shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${strategy.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="font-semibold text-md">Trade Execution Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${strategy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{strategy.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">{strategy.status === 'active' ? 'This strategy is currently executing trades.' : 'Trade execution is not active for this strategy.'}</div>
                <Button size="sm" variant={strategy.status === 'active' ? 'destructive' : 'default'} className="mt-2" disabled>
                  {strategy.status === 'active' ? 'Deactivate Execution' : 'Activate Execution'}
                </Button>
              </div>
              {/* Placeholder for trade stats - replace with real data if available */}
              <div className="flex-1 bg-white dark:bg-purple-950/40 rounded-2xl border border-purple-200/40 p-4 shadow flex flex-col justify-center items-center">
                <div className="font-semibold text-lg text-purple-800 mb-2">Trade Stats</div>
                <div className="text-2xl font-extrabold text-purple-900 dark:text-purple-100">--</div>
                <div className="text-xs text-gray-500 mt-1">(Trade stats coming soon)</div>
              </div>
            </div>
          </div>

          {/* Raw Logic (if available) */}
          {strategy.logic && (
            <div className="mb-4">
              <h3 className="font-semibold text-purple-700 mb-1">Raw Strategy Logic</h3>
              <pre className="bg-black-500 rounded p-2 text-xs overflow-x-auto mt-1">
                {JSON.stringify(strategy.logic, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
