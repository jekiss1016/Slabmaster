import React, { useState } from 'react';
import { FormPacket, FormTemplate, StaticAttachment } from '../types/forms';
import {
  Layers,
  FileText,
  FileCode,
  Upload,
  Trash2,
  Save,
  X,
  Plus,
  CheckCircle,
  AlertCircle,
  Paperclip
} from 'lucide-react';

interface FormPacketBuilderModalProps {
  initialPacket?: FormPacket | null;
  availableTemplates: FormTemplate[];
  isDark: boolean;
  onSave: (packet: FormPacket) => void;
  onCancel: () => void;
}

export const FormPacketBuilderModal: React.FC<FormPacketBuilderModalProps> = ({
  initialPacket,
  availableTemplates,
  isDark,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState(initialPacket?.name || '');
  const [description, setDescription] = useState(initialPacket?.description || '');
  const [targetScope, setTargetScope] = useState<'JOB' | 'ACTIVITY' | 'HYBRID'>(initialPacket?.targetScope || 'HYBRID');
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>(() => {
    return initialPacket?.formTemplates?.map((t) => t.id) || [];
  });
  const [staticAttachments, setStaticAttachments] = useState<StaticAttachment[]>(() => {
    return initialPacket?.staticAttachments ? JSON.parse(JSON.stringify(initialPacket.staticAttachments)) : [];
  });
  const [applicableActivityTypes, setApplicableActivityTypes] = useState<string[]>(() => {
    return initialPacket?.applicableActivityTypes || ['QA Inspection', 'Stone Install'];
  });
  const [newActivityTypeInput, setNewActivityTypeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      const fileType: 'PDF' | 'CAD' | 'IMAGE' = ext.includes('PDF') ? 'PDF' : ext.includes('DWG') || ext.includes('DXF') ? 'CAD' : 'IMAGE';
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      const newAttachment: StaticAttachment = {
        id: 'att_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        name: file.name,
        type: fileType,
        fileUrl: '#attachment_' + file.name,
        fileSize: sizeMb
      };

      setStaticAttachments((prev) => [...prev, newAttachment]);
    });
  };

  const removeAttachment = (attId: string) => {
    setStaticAttachments((prev) => prev.filter((a) => a.id !== attId));
  };

  const handleToggleTemplate = (templateId: string) => {
    if (selectedTemplateIds.includes(templateId)) {
      setSelectedTemplateIds(selectedTemplateIds.filter((id) => id !== templateId));
    } else {
      setSelectedTemplateIds([...selectedTemplateIds, templateId]);
    }
  };

  const handleAddActivityType = () => {
    const trimmed = newActivityTypeInput.trim();
    if (trimmed && !applicableActivityTypes.includes(trimmed)) {
      setApplicableActivityTypes([...applicableActivityTypes, trimmed]);
      setNewActivityTypeInput('');
    }
  };

  const handleRemoveActivityType = (act: string) => {
    setApplicableActivityTypes(applicableActivityTypes.filter((a) => a !== act));
  };

  const handleSavePacket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please provide a packet name.');
      return;
    }
    if (selectedTemplateIds.length === 0 && staticAttachments.length === 0) {
      setErrorMsg('A packet must bundle at least one form template or static reference attachment.');
      return;
    }

    const bundledTemplates = availableTemplates.filter((t) => selectedTemplateIds.includes(t.id));

    const packet: FormPacket = {
      id: initialPacket?.id || 'pkt_' + Date.now(),
      name: name.trim(),
      description: description.trim(),
      targetScope,
      applicableActivityTypes,
      formTemplates: bundledTemplates,
      staticAttachments,
      createdAt: initialPacket?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onSave(packet);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className={`max-w-3xl w-full max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ${
        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-600 text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight">
                {initialPacket ? `Edit Form Packet: ${initialPacket.name}` : 'Assemble New Form Packet'}
              </h3>
              <p className="text-[11px] text-slate-500">Bundle multi-stage forms, CAD drawings, and spec sheets into a unified packet</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="m-4 p-3 bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSavePacket} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Packet Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-xs mb-1">Packet Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Standard Residential Installation & Turnover Packet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-xs font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-xs mb-1">Attachment Scope</label>
              <select
                value={targetScope}
                onChange={(e) => setTargetScope(e.target.value as any)}
                className="w-full p-2.5 border rounded-lg text-xs font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
              >
                <option value="HYBRID">Hybrid (Job & Activity)</option>
                <option value="JOB">Job Master Level</option>
                <option value="ACTIVITY">Activity Milestone Level</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-xs mb-1">Packet Description</label>
            <input
              type="text"
              placeholder="e.g. Mandatory sign-off packet required before final invoicing."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-xs text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
            />
          </div>

          {/* Applicable Activity Types */}
          <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 space-y-2.5">
            <label className="block font-bold text-xs">Applicable Milestone Activity Types</label>
            <div className="flex flex-wrap gap-2">
              {applicableActivityTypes.map((act) => (
                <span key={act} className="px-2.5 py-1 bg-white dark:bg-slate-900 border rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
                  <span>{act}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveActivityType(act)}
                    className="text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                placeholder="Add milestone type (e.g. 'Punchout Walk', 'Template')"
                value={newActivityTypeInput}
                onChange={(e) => setNewActivityTypeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddActivityType();
                  }
                }}
                className="flex-1 p-2 border rounded-lg text-xs text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
              />
              <button
                type="button"
                onClick={handleAddActivityType}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-500 cursor-pointer"
              >
                + Add Type
              </button>
            </div>
          </div>

          {/* Bundled Form Templates Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">Bundle Custom Forms</span>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">{selectedTemplateIds.length} form(s) selected</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableTemplates.map((tpl) => {
                const isSelected = selectedTemplateIds.includes(tpl.id);

                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleToggleTemplate(tpl.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-purple-50 border-purple-400 text-purple-900 dark:bg-purple-950/60 dark:border-purple-700 dark:text-purple-200 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by parent div
                      className="w-4 h-4 text-purple-600 rounded mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs truncate">{tpl.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{tpl.description}</div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-1">
                        {tpl.fields.length} fields • Category: {tpl.category}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Static Reference Documents (PDF, CAD, Image specs) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">Static Reference Materials (PDF / CAD / Images)</span>
              <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs cursor-pointer flex items-center space-x-1.5 transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>+ Attach File</span>
                <input
                  type="file"
                  accept=".pdf,.dwg,.dxf,image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {staticAttachments.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed text-center text-xs text-slate-400 dark:border-slate-800">
                No static CAD or spec sheets attached yet. Click "+ Attach File" to add reference drawings.
              </div>
            ) : (
              <div className="space-y-2">
                {staticAttachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-lg border flex items-center justify-between bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs font-semibold"
                  >
                    <div className="flex items-center space-x-2.5">
                      {att.type === 'PDF' ? (
                        <FileText className="w-4 h-4 text-rose-500" />
                      ) : att.type === 'CAD' ? (
                        <FileCode className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Paperclip className="w-4 h-4 text-emerald-500" />
                      )}
                      <span>{att.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({att.fileSize || '1.0 MB'})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Save Actions */}
          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 border rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{initialPacket ? 'Update Form Packet' : 'Create Form Packet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};