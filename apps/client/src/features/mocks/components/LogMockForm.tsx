import { useState } from 'react';
import { useCreateMockTest } from '../hooks/useMocks';
import type { CreateMockTestDTO } from '@gate/shared-types';

const inputStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  borderRadius: '10px',
  padding: '10px 14px',
  width: '100%',
  fontSize: '14px',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontFamily: 'Syne, sans-serif',
  fontWeight: '600' as const,
  color: 'var(--muted)',
  marginBottom: '6px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

const GATE_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

export function LogMockForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate, isPending, error } = useCreateMockTest();
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    testName: '',
    year: undefined as number | undefined,
    totalMarks: 100,
    obtainedMarks: 0,
    totalQuestions: 65,
    attemptedQuestions: 0,
    correctAnswers: 0,
    negativeMarks: 0,
    timeTakenMinutes: 180,
    date: today,
  });

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Compute derived stats
  const accuracy = form.attemptedQuestions > 0
    ? Math.round((form.correctAnswers / form.attemptedQuestions) * 100)
    : 0;
  const percentile = form.totalMarks > 0
    ? Math.round((form.obtainedMarks / form.totalMarks) * 100)
    : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const dto: CreateMockTestDTO = {
      ...form,
      subjectWiseBreakdown: [],
    };
    mutate(dto, {
      onSuccess: () => {
        setForm({
          testName: '', year: undefined, totalMarks: 100, obtainedMarks: 0,
          totalQuestions: 65, attemptedQuestions: 0, correctAnswers: 0,
          negativeMarks: 0, timeTakenMinutes: 180, date: today,
        });
        onSuccess?.();
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm px-3 py-2 rounded-lg"
           style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--warn)' }}>
          {error.message}
        </p>
      )}

      {/* Live preview */}
      {(form.obtainedMarks > 0 || form.correctAnswers > 0) && (
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl"
             style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)' }}>
          <div className="text-center">
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Score</p>
            <p className="font-display font-bold text-xl" style={{ color: 'var(--primary)' }}>
              {percentile}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Accuracy</p>
            <p className="font-display font-bold text-xl"
               style={{ color: accuracy >= 70 ? 'var(--accent)' : accuracy >= 50 ? 'var(--gold)' : 'var(--warn)' }}>
              {accuracy}%
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Test Name</label>
          <input style={inputStyle} type="text" placeholder="GATE 2024 / Testbook Full Mock"
            value={form.testName} onChange={(e) => set('testName', e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>Year (optional)</label>
          <select style={inputStyle} value={form.year ?? ''}
            onChange={(e) => set('year', e.target.value ? +e.target.value : undefined)}>
            <option value="">— Select Year —</option>
            {GATE_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label style={labelStyle}>Total Marks</label>
          <input style={inputStyle} type="number" min={0}
            value={form.totalMarks} onChange={(e) => set('totalMarks', +e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Marks Obtained</label>
          <input style={inputStyle} type="number"
            value={form.obtainedMarks} onChange={(e) => set('obtainedMarks', +e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Negative Marks</label>
          <input style={inputStyle} type="number" min={0}
            value={form.negativeMarks} onChange={(e) => set('negativeMarks', +e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label style={labelStyle}>Total Qs</label>
          <input style={inputStyle} type="number" min={0}
            value={form.totalQuestions} onChange={(e) => set('totalQuestions', +e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Attempted</label>
          <input style={inputStyle} type="number" min={0}
            value={form.attemptedQuestions} onChange={(e) => set('attemptedQuestions', +e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Correct</label>
          <input style={inputStyle} type="number" min={0}
            value={form.correctAnswers} onChange={(e) => set('correctAnswers', +e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Time Taken (min)</label>
          <input style={inputStyle} type="number" min={0} max={180}
            value={form.timeTakenMinutes} onChange={(e) => set('timeTakenMinutes', +e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Date</label>
          <input style={inputStyle} type="date"
            value={form.date} onChange={(e) => set('date', e.target.value)} required />
        </div>
      </div>

      <button type="submit" disabled={isPending} className="btn-primary w-full py-3 text-sm"
        style={{ opacity: isPending ? 0.6 : 1 }}>
        {isPending ? 'Saving...' : '+ Record Mock Test'}
      </button>
    </form>
  );
}
