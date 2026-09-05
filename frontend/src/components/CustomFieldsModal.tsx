import React, { useState } from 'react';
import {
  CustomFieldDefinition,
  CustomAttributeTarget,
  CustomAttributeType
} from '../types/customAttributes';
import {
  Sliders,
  Plus,
  Trash2,
  X,
  Check,
  Building2,
  Briefcase,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface CustomFieldsModalProps {
  customFields: CustomFieldDefinition[];
  isDark: boolean;
  onSaveCustomFields: (updated: CustomFieldDefinition[]) => void;
  onClose: () => void;
}

export const CustomFieldsModal: React.FC<CustomFieldsModalProps> = ({
  customFields,
  isDark,
  onSaveCustomFields,
  onClose
}) => {
  const [fields, setFields] = useState<CustomFieldDefinition[]>(customFields);
  const [selectedTarget, setSelectedTarget] = useState<CustomAttributeTarget>('JOB');
  const [isAdding, setIsAdding] = useState(false);

  // New field form state
  const [label, setLabel] = useState('');
  const [name, setName] = useState('');
  const [dataType, setDataType] = useState<CustomAttributeType>('text');
  const [category, setCategory] = useState('Operational Metadata');
  const [isRequired, setIsRequired] = useState(false);
  const [plantScope, setPlantScope] = useState('ALL');
  const [optionsStr, setOptionsStr] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredFields = fields.filter((f) => f.targetEntity === selectedTarget);

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    // Auto-generate camelCase name if not explicitly typed
    if (!name || name === label.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')) {
      const camel = newLabel
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, '')
        .replace(/[^a-zA-Z0-9]/g, '');
      setName(camel);
    }
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setErrorMsg('Field Label is required.');
      return;
    }
    if (!name.trim()) {
      setErrorMsg('Attribute Key Name is required.');
      return;
    }

    const newDef: CustomFieldDefinition = {
      id: `cf_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      targetEntity: selectedTarget,
      name: name.trim(),
      label: label.trim(),
      dataType,
      category: category.trim() || 'General',
      isRequired,
      plantScope,
      options:
        dataType === 'select'
          ? optionsStr.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
      displayOrder: filteredFields.length + 1
    };

    const updated = [...fields, newDef];
    setFields(updated);
    onSaveCustomFields(updated);

    // Reset form
    setLabel('');
    setName('');
    setDataType('text');
    setCategory('Operational Metadata');
    setIsRequired(false);
    setPlantScope('ALL');
    setOptionsStr('');
    setErrorMsg(null);
    setIsAdding(false);
  };

  const handleDeleteField = (id: string) => {
    const updated = fields.filter((f) => f.id !== id);
    setFields(updated);
    onSaveCustomFields(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className={`w-full max-w-4xl rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Dynamic Custom Attributes Engine</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Define and manage runtime custom fields for Jobs, Accounts, Activities, and Slabs across all plant facilities.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Entity Selector Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-3 shrink-0 bg-slate-100/50 dark:bg-slate-950/30 gap-2 overflow-x-auto">
          {(['JOB', 'ACCOUNT', 'ACTIVITY', 'SLAB'] as CustomAttributeTarget[]).map((tgt) => (
            <button
              key={tgt}
              type="button"
              onClick={() => {
                setSelectedTarget(tgt);
                setIsAdding(false);
              }}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 cursor-pointer transition-all flex items-center space-x-2 ${
                selectedTarget === tgt
                  ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900 shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tgt === 'JOB' && <Briefcase className="w-3.5 h-3.5" />}
              {tgt === 'ACCOUNT' && <Building2 className="w-3.5 h-3.5" />}
              {tgt === 'ACTIVITY' && <Layers className="w-3.5 h-3.5" />}
              {tgt === 'SLAB' && <Sparkles className="w-3.5 h-3.5" />}
              <span>{tgt} Attributes</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800">
                {fields.filter((f) => f.targetEntity === tgt).length}
              </span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Active {selectedTarget} Attributes ({filteredFields.length})
            </h3>
            {!isAdding && (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-xs cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Define New Attribute</span>
              </button>
            )}
          </div>

          {/* Add Field Inline Form */}
          {isAdding && (
            <form onSubmit={handleAddField} className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-600 uppercase tracking-wide">
                  New {selectedTarget} Attribute Definition
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Display Label *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fab Change Reason"
                    value={label}
                    onChange={(e) => handleLabelChange(e.target.value)}
                    className="w-full p-2 border rounded-lg text-xs font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Attribute Key Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. fabChangeReason"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded-lg text-xs font-mono text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Data Type *
                  </label>
                  <select
                    value={dataType}
                    onChange={(e) => setDataType(e.target.value as CustomAttributeType)}
                    className="w-full p-2 border rounded-lg text-xs font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  >
                    <option value="text">Text (Single Line)</option>
                    <option value="number">Numeric</option>
                    <option value="currency">Currency ($ USD)</option>
                    <option value="date">Date</option>
                    <option value="select">Dropdown (List of Values)</option>
                    <option value="boolean">Boolean (Yes / No)</option>
                    <option value="url">URL Link</option>
                  </select>
                </div>
              </div>

              {dataType === 'select' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Dropdown Options (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. None, Builder Plan Revision, Field Seam Relocation, Material Defect"
                    value={optionsStr}
                    onChange={(e) => setOptionsStr(e.target.value)}
                    className="w-full p-2 border rounded-lg text-xs text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Category Header
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fabrication Specifications"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded-lg text-xs text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Plant Facility Scope
                  </label>
                  <select
                    value={plantScope}
                    onChange={(e) => setPlantScope(e.target.value)}
                    className="w-full p-2 border rounded-lg text-xs text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  >
                    <option value="ALL">All National Facilities (Global)</option>
                    <option value="ATL">Atlanta Manufacturing Plant (ATL)</option>
                    <option value="PHX">Phoenix Metro Plant (PHX)</option>
                    <option value="TUC">Tucson East Plant (TUC)</option>
                    <option value="DEN">Denver North Hub (DEN)</option>
                    <option value="TPA">Tampa Facility (TPA)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRequired}
                      onChange={(e) => setIsRequired(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>Required Field</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer shadow-xs"
                >
                  Save Attribute
                </button>
              </div>
            </form>
          )}

          {/* List of Defined Attributes */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3">Label</th>
                  <th className="p-3">Attribute Key</th>
                  <th className="p-3">Data Type</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Plant Scope</th>
                  <th className="p-3">Required</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredFields.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      No custom attributes defined for {selectedTarget}. Click "+ Define New Attribute" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredFields.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{f.label}</td>
                      <td className="p-3 font-mono text-slate-500">{f.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                          {f.dataType.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{f.category}</td>
                      <td className="p-3 font-mono text-slate-500">{f.plantScope}</td>
                      <td className="p-3">
                        {f.isRequired ? (
                          <span className="text-rose-500 font-bold">Yes</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteField(f.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded cursor-pointer"
                          title="Delete Attribute Definition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0 bg-slate-50 dark:bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Close & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
