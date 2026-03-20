import { useState } from 'react';
import { useCreateStudySession } from '../hooks/useStudy';
import type { GATESubject, StudySessionType } from '@gate/shared-types';

const SUBJECTS: GATESubject[] = [
  'Engineering Mathematics', 'General Aptitude', 'Data Structures',
  'Algorithms', 'Computer Networks', 'Operating Systems',
  'Database Management', 'Computer Organization', 'Theory of Computation',
  'Compiler Design', 'Digital Logic',
];

const SESSION_TYPES: { value: StudySessionType; label: string }[] = [
  { value: 'reading', label: '📖 Reading' },
  { value: 'practice', label: '✏️ Practice' },
  { value: 'revision', label: '🔄 Revision' },
  { value: 'mock', label: '🎯 Mock' },
];

interface Props {
  onSuccess?: () => void;
}

const inputStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  borderRadius: '10px',
  padding: '10px 14px',
  width: '100%',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export function LogSessionForm({ onSuccess }: Props) {
  const { mutate, isPending, error } = useCreateStudySession();
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    subject: SUBJECTS[0],
    topic: '',
    durationMinutes: 60,
    sessionType: 'practice' as StudySessionType,
    questionsAttempted: 0,
    questionsCorrect: 0,
    notes: '',
    date: today,
  });

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => {
        setForm({
          subject: SUBJECTS[0], topic: '', durationMinutes: 60,
          sessionType: 'practice', questionsAttempted: 0, questionsCorrect: 0,
          notes: '', date: today,
        });
        onSuccess?.();
      },
    });
  }

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: '600',
    color: 'var(--muted)',
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm px-3 py-2 rounded-lg" style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--warn)' }}>
          {error.message}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Subject</label>
          <select
            style={inputStyle}
            value={form.subject}
            onChange={(e) => set('subject', e.target.value)}
          >
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Session Type</label>
          <select
            style={inputStyle}
            value={form.sessionType}
            onChange={(e) => set('sessionType', e.target.value)}
          >
            {SESSION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Topic</label>
        <input
          style={inputStyle}
          type="text"
          placeholder="e.g. Dijkstra's Algorithm, Graph BFS"
          value={form.topic}
          onChange={(e) => set('topic', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label style={labelStyle}>Duration (min)</label>
          <input
            style={inputStyle}
            type="number"
            min={1}
            max={720}
            value={form.durationMinutes}
            onChange={(e) => set('durationMinutes', +e.target.value)}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Attempted</label>
          <input
            style={inputStyle}
            type="number"
            min={0}
            value={form.questionsAttempted}
            onChange={(e) => set('questionsAttempted', +e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Correct</label>
          <input
            style={inputStyle}
            type="number"
            min={0}
            max={form.questionsAttempted}
            value={form.questionsCorrect}
            onChange={(e) => set('questionsCorrect', +e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Date</label>
          <input
            style={inputStyle}
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Notes (optional)</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Quick note..."
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full py-3 text-sm"
        style={{ opacity: isPending ? 0.6 : 1 }}
      >
        {isPending ? 'Saving...' : '+ Log Session'}
      </button>
    </form>
  );
}
