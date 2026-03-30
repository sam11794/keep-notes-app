import { useState, useEffect } from 'react'
import api from '../utils/api'

const COLORS = ['#ffffff', '#f28b82', '#fdd663', '#fff475', '#cbf0f8', '#d7aefb', '#e6c9a8', '#a7ffeb']

export default function NoteModal({ note, onClose, onSave, onDelete, onTogglePin }) {
  const [form, setForm] = useState({ title: '', content: '', color: '#ffffff' })

  useEffect(() => {
    setForm({ title: note.title || '', content: note.content || '', color: note.color || '#ffffff' })
  }, [note])

  const handleSave = () => {
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 -z-10" onClick={onClose} />

      {/* Modal */}
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
        style={{ backgroundColor: form.color }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePin}
              className="p-2 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors"
              title={note.pinned ? 'Unpin' : 'Pin'}
            >
              <span className="text-lg">{note.pinned ? '📌' : '📍'}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDelete}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full mb-3 px-2 py-1 text-xl font-medium border-none bg-transparent focus:outline-none placeholder-gray-400"
          />
          <textarea
            placeholder="Take a note..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full px-2 py-1 border-none bg-transparent focus:outline-none resize-none min-h-[120px] placeholder-gray-400"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200/50 bg-white/50">
          <div className="flex items-center gap-1">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => setForm({ ...form, color })}
                className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: form.color === color ? '#4285f4' : 'transparent'
                }}
              />
            ))}
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}