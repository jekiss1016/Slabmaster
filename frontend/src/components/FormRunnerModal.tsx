import React, { useState, useRef, useEffect } from 'react';
import { FormTemplate, FormField, UOMType } from '../types/forms';
import { OfflineFormSubmission, saveOfflineSubmission } from '../offlineStorage';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Camera,
  Trash2,
  Eraser,
  PenTool,
  Save,
  X,
  Clock,
  Check,
  Calendar,
  Layers,
  MapPin
} from 'lucide-react';

interface FormRunnerModalProps {
  formTemplate: FormTemplate;
  jobId: string;
  jobName: string;
  lotNumber: string;
  communityName: string;
  activityId?: string;
  activityName?: string;
  packetId: string;
  currentUser: string;
  isDark: boolean;
  initialSubmission?: OfflineFormSubmission | null;
  onSaveDraft: (submission: OfflineFormSubmission) => void;
  onComplete: (submission: OfflineFormSubmission) => void;
  onClose: () => void;
}

export const FormRunnerModal: React.FC<FormRunnerModalProps> = ({
  formTemplate,
  jobId,
  jobName,
  lotNumber,
  communityName,
  activityId,
  activityName,
  packetId,
  currentUser,
  isDark,
  initialSubmission,
  onSaveDraft,
  onComplete,
  onClose
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>(() => initialSubmission?.answers || {});
  const [signatures, setSignatures] = useState<Record<string, string>>(() => initialSubmission?.signatures || {});
  const [photos, setPhotos] = useState<Record<string, string[]>>(() => initialSubmission?.photos || {});
  const [status, setStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'>(() => initialSubmission?.status || 'NOT_STARTED');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Active signature canvas drawing states
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const isDrawing = useRef<Record<string, boolean>>({});

  // Initialize canvas with existing signatures
  useEffect(() => {
    Object.entries(signatures).forEach(([fieldId, dataUrl]) => {
      const canvas = canvasRefs.current[fieldId];
      if (canvas && dataUrl) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          };
          img.src = dataUrl;
        }
      }
    });
  }, [signatures]);

  const startDrawing = (fieldId: string, e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current[fieldId] = true;
    const canvas = canvasRefs.current[fieldId];
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = isDark ? '#38bdf8' : '#1e40af';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (fieldId: string, e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current[fieldId]) return;
    const canvas = canvasRefs.current[fieldId];
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = (fieldId: string) => {
    if (!isDrawing.current[fieldId]) return;
    isDrawing.current[fieldId] = false;
    const canvas = canvasRefs.current[fieldId];
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setSignatures((prev) => ({ ...prev, [fieldId]: dataUrl }));
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
      if (status === 'NOT_STARTED') setStatus('IN_PROGRESS');
    }
  };

  const clearSignature = (fieldId: string) => {
    const canvas = canvasRefs.current[fieldId];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignatures((prev) => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  };

  const handlePhotoUpload = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const base64 = loadEvt.target?.result as string;
        if (base64) {
          setPhotos((prev) => ({
            ...prev,
            [fieldId]: [...(prev[fieldId] || []), base64]
          }));
          setValidationErrors((prev) => {
            const next = { ...prev };
            delete next[fieldId];
            return next;
          });
          if (status === 'NOT_STARTED') setStatus('IN_PROGRESS');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (fieldId: string, photoIdx: number) => {
    setPhotos((prev) => ({
      ...prev,
      [fieldId]: (prev[fieldId] || []).filter((_, idx) => idx !== photoIdx)
    }));
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
    if (status === 'NOT_STARTED') setStatus('IN_PROGRESS');
  };

  // Save Draft action
  const handleSaveDraft = () => {
    const draftStatus = status === 'NOT_STARTED' ? 'IN_PROGRESS' : status;
    setStatus(draftStatus);
    const submission: OfflineFormSubmission = {
      jobId,
      activityId,
      packetId,
      formId: formTemplate.id,
      formTitle: formTemplate.title,
      status: draftStatus,
      answers,
      signatures,
      photos,
      savedAt: new Date().toISOString(),
      submittedBy: currentUser,
      isSynced: true
    };
    saveOfflineSubmission(submission);
    onSaveDraft(submission);
    setSaveSuccessMsg('Form draft saved locally. You can return anytime.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Submit Completed Form action
  const handleComplete = () => {
    const errors: Record<string, string> = {};

    formTemplate.fields.forEach((field) => {
      if (!field.required) return;

      if (field.type === 'signature') {
        if (!signatures[field.id]) {
          errors[field.id] = 'Digital signature is required to complete this form.';
        }
      } else if (field.type === 'photo') {
        if (!photos[field.id] || photos[field.id].length === 0) {
          errors[field.id] = 'At least one photo attachment is required.';
        }
      } else if (field.type === 'checkbox') {
        if (answers[field.id] !== true) {
          errors[field.id] = 'Must verify and check this required box.';
        }
      } else if (field.type === 'number_uom') {
        const val = answers[field.id]?.value;
        if (val === undefined || val === null || val === '') {
          errors[field.id] = 'Measurement quantity is required.';
        }
      } else if (field.type === 'dropdown_multi') {
        const val = answers[field.id];
        if (!Array.isArray(val) || val.length === 0) {
          errors[field.id] = 'Please select at least one option.';
        }
      } else {
        const val = answers[field.id];
        if (val === undefined || val === null || String(val).trim() === '') {
          errors[field.id] = 'This field is required for completion.';
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSaveSuccessMsg(null);
      return;
    }

    setValidationErrors({});
    setStatus('COMPLETED');
    const submission: OfflineFormSubmission = {
      jobId,
      activityId,
      packetId,
      formId: formTemplate.id,
      formTitle: formTemplate.title,
      status: 'COMPLETED',
      answers,
      signatures,
      photos,
      savedAt: new Date().toISOString(),
      submittedBy: currentUser,
      isSynced: true
    };
    saveOfflineSubmission(submission);
    onComplete(submission);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 z-50 overflow-y-auto">
      <div className={`w-full h-full sm:h-auto sm:max-h-[94vh] sm:max-w-3xl flex flex-col rounded-none sm:rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ${
        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Sticky Header (Mobile Optimized) */}
        <div className={`p-3.5 sm:p-5 border-b flex items-center justify-between gap-2.5 shrink-0 ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-black text-sm sm:text-base tracking-tight truncate">{formTemplate.title}</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5 truncate">
                <span className="font-semibold text-blue-600 dark:text-blue-400 truncate">{communityName}</span>
                <span>•</span>
                <span className="shrink-0">Lot {lotNumber}</span>
                {activityName && (
                  <>
                    <span>•</span>
                    <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold px-1 rounded shrink-0">{activityName}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Status Badge */}
            {status === 'COMPLETED' ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>COMPLETED</span>
              </span>
            ) : status === 'IN_PROGRESS' ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>IN PROGRESS</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center space-x-1">
                <span>⚪</span>
                <span>NOT STARTED</span>
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Legend Bar */}
        <div className={`px-4 py-1.5 text-[10px] sm:text-[11px] border-b flex items-center justify-between shrink-0 ${
          isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-100/70 border-slate-200 text-slate-500'
        }`}>
          <span className="font-semibold">Legend:</span>
          <div className="flex items-center space-x-2.5">
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span><span>Blank</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span>Draft</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span>Signed</span></span>
          </div>
        </div>

        {/* Notifications */}
        {saveSuccessMsg && (
          <div className="m-3 p-2.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {Object.keys(validationErrors).length > 0 && (
          <div className="m-3 p-2.5 bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Please complete all required fields highlighted in red below before marking as completed.</span>
          </div>
        )}

        {/* Form Body Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {formTemplate.fields.map((field, idx) => {
            const hasError = !!validationErrors[field.id];

            return (
              <div
                key={field.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  hasError
                    ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-800'
                    : isDark
                    ? 'bg-slate-950 border-slate-800'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <label className="font-bold text-xs flex items-center space-x-1.5 text-slate-800 dark:text-slate-200">
                      <span>{idx + 1}. {field.label}</span>
                      {field.required && (
                        <span className="text-rose-500 font-black text-sm" title="Required">*</span>
                      )}
                    </label>
                    {field.helpText && (
                      <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{field.helpText}</p>
                    )}
                  </div>
                </div>

                {/* Field Control Type Switcher */}
                {field.type === 'text' && (
                  <input
                    type="text"
                    placeholder={field.placeholder || 'Enter text...'}
                    value={answers[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-xs font-semibold text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 min-h-[42px]"
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    rows={3}
                    placeholder={field.placeholder || 'Enter notes or observations...'}
                    value={answers[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-xs font-medium text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
                  />
                )}

                {field.type === 'number_uom' && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      step="any"
                      placeholder={field.placeholder || '0.00'}
                      value={answers[field.id]?.value ?? ''}
                      onChange={(e) => {
                        const currentUom = answers[field.id]?.uom || field.defaultUom || 'SF';
                        handleFieldChange(field.id, { value: e.target.value, uom: currentUom });
                      }}
                      className="flex-1 p-2.5 border rounded-lg text-xs font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 min-h-[42px]"
                    />
                    <div className="flex items-center border rounded-lg p-1 bg-slate-100 dark:bg-slate-900 dark:border-slate-700 shrink-0">
                      {(field.uomOptions || ['SF', 'LF', 'EA', 'HR']).map((uom) => {
                        const selectedUom = answers[field.id]?.uom || field.defaultUom || 'SF';
                        const isSelected = selectedUom === uom;
                        return (
                          <button
                            key={uom}
                            type="button"
                            onClick={() => {
                              const currentVal = answers[field.id]?.value ?? '';
                              handleFieldChange(field.id, { value: currentVal, uom });
                            }}
                            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            {uom}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {field.type === 'dropdown_single' && (
                  <select
                    value={answers[field.id] || field.defaultValue || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-xs font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 min-h-[42px] cursor-pointer"
                  >
                    <option value="">-- Select Option --</option>
                    {(field.options || []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === 'dropdown_multi' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {(field.options || []).map((opt) => {
                      const selectedList: string[] = Array.isArray(answers[field.id]) ? answers[field.id] : [];
                      const isChecked = selectedList.includes(opt);

                      return (
                        <label
                          key={opt}
                          className={`p-2.5 rounded-lg border text-xs font-bold flex items-center space-x-2 cursor-pointer transition-all min-h-[42px] ${
                            isChecked
                              ? 'bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-950/60 dark:border-blue-700 dark:text-blue-300'
                              : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleFieldChange(field.id, [...selectedList, opt]);
                              } else {
                                handleFieldChange(field.id, selectedList.filter((item) => item !== opt));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="truncate">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {field.type === 'checkbox' && (
                  <label className="flex items-center space-x-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={answers[field.id] === true}
                      onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded cursor-pointer shrink-0"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Verified & Approved Compliance
                    </span>
                  </label>
                )}

                {field.type === 'datetime' && (
                  <input
                    type="datetime-local"
                    value={answers[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-xs font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 min-h-[42px]"
                  />
                )}

                {/* Photo Upload with Native Mobile Camera Trigger */}
                {field.type === 'photo' && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer flex items-center space-x-2 transition-all active:scale-95 min-h-[44px]">
                        <Camera className="w-4 h-4" />
                        <span>Take Photo / Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          multiple
                          onChange={(e) => handlePhotoUpload(field.id, e)}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {photos[field.id]?.length || 0} attached
                      </span>
                    </div>

                    {/* Photo Thumbnails */}
                    {photos[field.id] && photos[field.id].length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        {photos[field.id].map((b64, pIdx) => (
                          <div key={pIdx} className="relative group rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-black aspect-video flex items-center justify-center">
                            <img src={b64} alt={'Attachment ' + (pIdx + 1)} className="object-cover w-full h-full" />
                            <button
                              type="button"
                              onClick={() => removePhoto(field.id, pIdx)}
                              className="absolute top-1 right-1 p-1.5 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 cursor-pointer shadow-md"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Touch Signature Canvas (Finger / Stylus) */}
                {field.type === 'signature' && (
                  <div className="space-y-2">
                    <div className="relative border-2 border-dashed rounded-xl bg-slate-50 dark:bg-slate-950 p-1 border-slate-300 dark:border-slate-700">
                      <canvas
                        ref={(el) => (canvasRefs.current[field.id] = el)}
                        width={600}
                        height={180}
                        onMouseDown={(e) => startDrawing(field.id, e)}
                        onMouseMove={(e) => draw(field.id, e)}
                        onMouseUp={() => stopDrawing(field.id)}
                        onMouseLeave={() => stopDrawing(field.id)}
                        onTouchStart={(e) => startDrawing(field.id, e)}
                        onTouchMove={(e) => draw(field.id, e)}
                        onTouchEnd={() => stopDrawing(field.id)}
                        className="w-full h-40 bg-transparent touch-none cursor-crosshair rounded-lg"
                      />
                      {!signatures[field.id] && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-semibold space-x-1.5 p-2 text-center">
                          <PenTool className="w-4 h-4 text-blue-500 shrink-0" />
                          <span>Sign with finger or stylus in this box</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">
                        {signatures[field.id] ? '✓ Digital signature captured' : 'Signature required'}
                      </span>
                      <button
                        type="button"
                        onClick={() => clearSignature(field.id)}
                        className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-bold cursor-pointer flex items-center space-x-1 min-h-[36px]"
                      >
                        <Eraser className="w-3.5 h-3.5" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Validation Error Text */}
                {hasError && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{validationErrors[field.id]}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Sticky Mobile-Optimized Footer Actions */}
        <div className={`p-3.5 sm:p-5 border-t flex items-center justify-between gap-2.5 shrink-0 ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2.5 border rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer min-h-[44px]"
          >
            Close
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3.5 sm:px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer flex items-center space-x-1.5 transition-all min-h-[44px]"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={handleComplete}
              className="px-4 sm:px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-md cursor-pointer flex items-center space-x-1.5 transition-all min-h-[44px] active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete & Sign</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};