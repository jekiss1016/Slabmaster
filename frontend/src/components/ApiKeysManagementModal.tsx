import React, { useState } from 'react';
import {
  KeyRound,
  Copy,
  Check,
  AlertTriangle,
  X,
  Terminal,
  Calendar,
  Layers
} from 'lucide-react';
import { ApiKeyItem, AVAILABLE_API_SCOPES } from '../types/apiKeys';

interface ApiKeysManagementModalProps {
  isDark: boolean;
  onClose: () => void;
  onKeyGenerated: (newKey: ApiKeyItem) => void;
}

export const ApiKeysManagementModal: React.FC<ApiKeysManagementModalProps> = ({
  isDark,
  onClose,
  onKeyGenerated
}) => {
  const [tokenName, setTokenName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['read', 'write', 'sync']);
  const [expiresInDays, setExpiresInDays] = useState<number>(365);
  const [generatedKey, setGeneratedKey] = useState<ApiKeyItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleScope = (scopeId: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((s) => s !== scopeId) : [...prev, scopeId]
    );
  };

  const handleGenerate = () => {
    if (!tokenName.trim()) {
      setErrorMsg('Please enter a descriptive name for this API token.');
      return;
    }
    if (selectedScopes.length === 0) {
      setErrorMsg('Please select at least one permission scope.');
      return;
    }
    setErrorMsg(null);

    const hexRandom = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const fullToken = 'sm_live_' + hexRandom;
    const prefix = fullToken.substring(0, 14);

    const now = new Date();
    const expiresAt =
      expiresInDays > 0
        ? new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : null;

    const newKey: ApiKeyItem = {
      id: 'key-' + Date.now(),
      name: tokenName.trim(),
      keyPrefix: prefix,
      token: fullToken,
      scopes: selectedScopes.join(','),
      isActive: true,
      lastUsedAt: null,
      expiresAt,
      createdAt: now.toISOString(),
    };

    setGeneratedKey(newKey);
    onKeyGenerated(newKey);
  };

  const copyToClipboard = () => {
    if (generatedKey?.token) {
      navigator.clipboard.writeText(generatedKey.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-slate-800 bg-slate-850' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Generate ERP API Integration Token</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                RESTful credentials with External ID routing for SAP S/4HANA two-way synchronization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center space-x-3 text-sm font-medium">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!generatedKey ? (
            /* Creation Form */
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Token Name / Client Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. SAP S/4HANA Production Gateway, WBS Lot Daemon"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Token Expiration</span>
                </label>
                <select
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(Number(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value={30}>30 Days</option>
                  <option value={90}>90 Days</option>
                  <option value={180}>180 Days (Semi-Annual)</option>
                  <option value={365}>1 Year (Recommended for ERP Services)</option>
                  <option value={0}>Never Expires (Daemon / Long-term)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4" />
                  <span>Permission Scopes</span>
                </label>
                <div className="space-y-2.5">
                  {AVAILABLE_API_SCOPES.map((scope) => {
                    const isChecked = selectedScopes.includes(scope.id);
                    return (
                      <div
                        key={scope.id}
                        onClick={() => toggleScope(scope.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-start space-x-3 select-none ${
                          isChecked
                            ? isDark
                              ? 'bg-blue-950/40 border-blue-600/60 text-white'
                              : 'bg-blue-50/70 border-blue-300 text-blue-950'
                            : isDark
                            ? 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 pointer-events-none"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-bold flex items-center space-x-2">
                            <span>{scope.label}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              scope:{scope.id}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {scope.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Key Generated - Reveal Screen */
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>Security Notice: Copy Your API Token Now</span>
                </div>
                <p className="text-xs leading-relaxed">
                  This token string is displayed <strong>only once</strong> for security. If you lose this token, you will need to revoke it and generate a new key in SlabMaster.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Live API Secret Key
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={generatedKey.token}
                    className={`w-full pr-28 pl-4 py-3 rounded-xl font-mono text-sm border font-semibold select-all ${
                      isDark ? 'bg-slate-950 border-emerald-500/50 text-emerald-400' : 'bg-slate-50 border-emerald-600/50 text-emerald-700'
                    }`}
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`absolute right-2 px-3.5 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Key</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Developer Integration Quickstart */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Terminal className="w-4 h-4 text-blue-500" />
                  <span>ERP Integration Quickstart</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Pass the token via the <code className="text-blue-500 font-mono">X-API-Key</code> header or Bearer authorization to query and upsert records using SAP External IDs:
                </p>
                <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto select-all leading-relaxed">
                  curl -X POST &quot;https://dev.slabmasterapp.com/api/v1/jobs/upsert&quot; \<br />
                  &nbsp;&nbsp;-H &quot;X-API-Key: {generatedKey.token}&quot; \<br />
                  &nbsp;&nbsp;-H &quot;Content-Type: application/json&quot; \<br />
                  &nbsp;&nbsp;-d &apos;&#123;&quot;external_id&quot;: &quot;SAP-ORD-90210&quot;, &quot;lot_external_id&quot;: &quot;LOT-14&quot;, &quot;job_name&quot;: &quot;Master Bath Vanity&quot;&#125;&apos;
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end space-x-3 p-4 border-t ${isDark ? 'border-slate-800 bg-slate-850' : 'border-slate-100 bg-slate-50'}`}>
          {!generatedKey ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition flex items-center space-x-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Create API Token</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition flex items-center space-x-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Done (I have copied my token)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
