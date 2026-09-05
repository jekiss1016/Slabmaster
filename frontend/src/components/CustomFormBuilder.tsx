import React, { useState } from 'react';
import { FormTemplate, FormField, FormFieldType, UOMType } from '../types/forms';
import {
  Plus,
  Trash2,
  Save,
  X,
  FileText,
  CheckSquare,
  AlignLeft,
  Hash,
  List,
  Camera,
  PenTool,
  Calendar,
  AlertCircle,
  HelpCircle,
  MoveUp,
  MoveDown,
  Table
} from 'lucide-react';

interface CustomFormBuilderProps {
  initialTemplate?: FormTemplate | null;
  isDark: boolean;
  onSave: (template: FormTemplate) => void;
  onCancel: () => void;
}

export const CustomFormBuilder: React.FC<CustomFormBuilderProps> = ({
  initialTemplate,
  isDark,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState(initialTemplate?.title || '');
  const [description, setDescription] = useState(initialTemplate?.description || '');
  const [category, setCategory] = useState<FormTemplate['category']>(initialTemplate?.category || 'QA_INSPECTION');
  const [fields, setFields] = useState<FormField[]>(() => {
    if (initialTemplate?.fields && initialTemplate.fields.length > 0) {
      return JSON.parse(JSON.stringify(initialTemplate.fields));
    }
    return [
      {
        id: 'f_' + Date.now() + '_1',
        label: 'Quality / Installation Checklist Item',
        type: 'checkbox',
        required: true,
        helpText: 'Verify job meets standard tolerance criteria.'
      }
    ];
  });

  const [activeNewOption, setActiveNewOption] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addField = (type: FormFieldType) => {
    const id = 'f_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const newField: FormField = {
      id,
      label: type === 'table_matrix'
        ? 'Room Takeoff & Countertop Config Matrix'
        : type === 'signature'
        ? 'Digital Signature Sign-Off'
        : type === 'photo'
        ? 'Photo Documentation'
        : 'New Field Question',
      type,
      required: true,
      placeholder: '',
      helpText: type === 'table_matrix' ? 'Document room-by-room countertop dimensions, SQFT, materials, and sink cutouts.' : '',
      uomOptions: type === 'number_uom' ? ['SF', 'LF', 'EA', 'HR'] : undefined,
      defaultUom: type === 'number_uom' ? 'SF' : undefined,
      options: type === 'dropdown_single' || type === 'dropdown_multi' ? ['Option 1', 'Option 2'] : undefined,
      matrixColumns: type === 'table_matrix' ? [
        { id: 'room', label: 'Room', type: 'text' },
        { id: 'ctop_type', label: 'Ctop Type', type: 'select', options: ['Quartz', 'Granite', 'Marble', 'Porcelain'] },
        { id: 'material', label: 'Material', type: 'text' },
        { id: 'ctop_sqft', label: 'CTOP SQFT', type: 'number', isSummable: true },
        { id: 'splash_sqft', label: 'Splash SQFT', type: 'number', isSummable: true },
        { id: 'sink_model', label: 'Sink Model', type: 'text' },
        { id: 'edge_profile', label: 'Edge Profile', type: 'select', options: ['Eased', 'Bevel', 'Bullnose', 'Ogee', 'Mitered'] }
      ] : undefined,
      defaultMatrixRows: type === 'table_matrix' ? ['Kitchen', 'Island', 'Master Bath'] : undefined
    };
    setFields([...fields, newField]);
  };

  const removeField = (idx: number) => {
    setFields(fields.filter((_, i) => i !== idx));
  };

  const moveField = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= fields.length) return;
    const newFields = [...fields];
    const temp = newFields[idx];
    newFields[idx] = newFields[targetIdx];
    newFields[targetIdx] = temp;
    setFields(newFields);
  };

  const updateField = (idx: number, key: keyof FormField, val: any) => {
    const newFields = [...fields];
    newFields[idx] = { ...newFields[idx], [key]: val };
    setFields(newFields);
  };

  const addDropdownOption = (fieldIdx: number, fieldId: string) => {
    const optText = (activeNewOption[fieldId] || '').trim();
    if (!optText) return;
    const currentOpts = fields[fieldIdx].options || [];
    if (!currentOpts.includes(optText)) {
      updateField(fieldIdx, 'options', [...currentOpts, optText]);
    }
    setActiveNewOption((prev) => ({ ...prev, [fieldId]: '' }));
  };

  const removeDropdownOption = (fieldIdx: number, optIdx: number) => {
    const currentOpts = fields[fieldIdx].options || [];
    updateField(fieldIdx, 'options', currentOpts.filter((_, i) => i !== optIdx));
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please provide a form template title.');
      return;
    }
    if (fields.length === 0) {
      setErrorMsg('Please add at least one field to this form.');
      return;
    }

    const template: FormTemplate = {
      id: initialTemplate?.id || 'ft_' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      category,
      version: (initialTemplate?.version || 0) + 1,
      fields,
      createdAt: initialTemplate?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onSave(template);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className={`max-w-4xl w-full max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ${
        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight">
                {initialTemplate ? `Edit Custom Form: ${initialTemplate.title}` : 'Build New Custom Form Template'}
              </h3>
              <p className="text-[11px] text-slate-500">Configure modular fields, UOMs, photos, required validation, and signatures</p>
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

        {/* Builder Body */}
        <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Template Details */}
          <div className={`p-4 rounded-xl border space-y-4 ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-xs mb-1">Form Template Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stone Countertop Field QA Inspection"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-xs font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-xs mb-1">Category Classification</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 border rounded-lg text-xs font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                >
                  <option value="QA_INSPECTION">QA Inspection</option>
                  <option value="INSTALLATION">Installation & Sign-Off</option>
                  <option value="TEMPLATE">Laser Template & CAD</option>
                  <option value="PUNCHOUT">Punchout & Remake</option>
                  <option value="SAFETY">Safety & Compliance</option>
                  <option value="GENERAL">General Purpose</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-xs mb-1">Form Description & Field Purpose</label>
              <input
                type="text"
                placeholder="e.g. Field inspection of seam alignments, overhangs, edge polish, and cutouts."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-xs text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Field Palette Toolbar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">Add Form Fields</span>
              <span className="text-[11px] text-slate-500">{fields.length} field(s) defined</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => addField('text')}
                className="p-2.5 rounded-lg border text-xs font-bold flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer transition-all"
              >
                <AlignLeft className="w-4 h-4 text-blue-500" />
                <span>+ Short Text</span>
              </button>

              <button
                type="button"
                onClick={() => addField('textarea')}
                className="p-2.5 rounded-lg border text-xs font-bold flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer transition-all"
              >
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>+ Long Notes</span>
              </button>

              <button
                type="button"
                onClick={() => addField('number_uom')}
                className="p-2.5 rounded-lg border text-xs font-bold flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer transition-all"
              >
                <Hash className="w-4 h-4 text-emerald-500" />
                <span>+ Number (UOM)</span>
              </button>

              <button
                type="button"
                onClick={() => addField('dropdown_single')}
                className="p-2.5 rounded-lg border text-xs font-bold flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer transition-all"
              >
                <List className="w-4 h-4 text-amber-500" />
                <span>+ Single Dropdown</span>
              </button>

              <button
                type="button"
                onClick={() => addField('dropdown_multi')}
                className="p-2.5 rounded-lg border text-xs font-bold flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer transition-all"
              >
                <List className="w-4 h-4 text-orange-500" />
                <span>+ Multi-Select</span>
              </button>

              <button
                type="button"
                onClick={() => addField('checkbox')}
                className="p-2.5 rounded-lg border text-xs font-bold flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer transition-all"
              >
                <CheckSquare className="w-4 h-4 text-teal-500" />
                <span>+ Checkbox</span>
              </button>

              <button
                type="button"
                onClick={() => addField('photo')}
                className="p-2.5 rounded-lg border text-xs font-bold flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer transition-all"
              >
                <Camera className="w-4 h-4 text-rose-500" />
                <span>+ Photo Upload</span>
              </button>

              <button
                type="button"
                onClick={() => addField('signature')}
                className="p-2.5 rounded-lg border text-xs font-bold flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer transition-all"
              >
                <PenTool className="w-4 h-4 text-purple-500" />
                <span>+ Touch Signature</span>
              </button>

              <button
                type="button"
                onClick={() => addField('table_matrix')}
                className="p-2.5 rounded-lg border text-xs font-bold flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer transition-all border-blue-400 text-blue-800 dark:text-blue-300"
              >
                <Table className="w-4 h-4 text-blue-500" />
                <span>+ Config Table Grid</span>
              </button>
            </div>
          </div>

          {/* Configured Fields List */}
          <div className="space-y-4">
            {fields.map((field, idx) => (
              <div
                key={field.id}
                className={`p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-xs text-blue-600 uppercase tracking-wide">
                      {field.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveField(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === fields.length - 1}
                      onClick={() => moveField(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeField(idx)}
                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded cursor-pointer"
                      title="Delete Field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold mb-1 text-slate-600 dark:text-slate-400">Field Question / Label *</label>
                    <input
                      type="text"
                      required
                      value={field.label}
                      onChange={(e) => updateField(idx, 'label', e.target.value)}
                      className="w-full p-2 border rounded-lg text-xs font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                    />
                  </div>

                  <div className="flex items-center space-x-4 pt-5">
                    <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(idx, 'required', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className={field.required ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                        Required Field *
                      </span>
                    </label>
                  </div>
                </div>

                {/* Additional Field-Type Configurations */}
                {field.type === 'number_uom' && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Allowed Units of Measure</label>
                    <div className="flex items-center space-x-4 text-xs font-bold">
                      {(['SF', 'LF', 'EA', 'HR'] as UOMType[]).map((uom) => {
                        const currentUoms = field.uomOptions || ['SF', 'LF', 'EA', 'HR'];
                        const isChecked = currentUoms.includes(uom);
                        return (
                          <label key={uom} className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateField(idx, 'uomOptions', [...currentUoms, uom]);
                                } else {
                                  updateField(idx, 'uomOptions', currentUoms.filter((u) => u !== uom));
                                }
                              }}
                              className="w-3.5 h-3.5 text-blue-600 rounded"
                            />
                            <span>{uom}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {(field.type === 'dropdown_single' || field.type === 'dropdown_multi') && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Dropdown Choice Options</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(field.options || []).map((opt, oIdx) => (
                        <span key={oIdx} className="px-2.5 py-1 bg-white dark:bg-slate-800 border rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
                          <span>{opt}</span>
                          <button
                            type="button"
                            onClick={() => removeDropdownOption(idx, oIdx)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Add choice option (e.g. 'Pass - Clean')"
                        value={activeNewOption[field.id] || ''}
                        onChange={(e) => setActiveNewOption({ ...activeNewOption, [field.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addDropdownOption(idx, field.id);
                          }
                        }}
                        className="flex-1 p-2 border rounded-lg text-xs text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => addDropdownOption(idx, field.id)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 cursor-pointer"
                      >
                        + Add Choice
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Field Helper Text (Optional)</label>
                  <input
                    type="text"
                    placeholder="Instructions shown to field technician..."
                    value={field.helpText || ''}
                    onChange={(e) => updateField(idx, 'helpText', e.target.value)}
                    className="w-full p-2 border rounded-lg text-xs text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  />
                </div>
              </div>
            ))}
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{initialTemplate ? 'Update Form Template' : 'Create Form Template'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};