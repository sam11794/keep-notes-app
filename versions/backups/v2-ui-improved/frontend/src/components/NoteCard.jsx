import { useState } from 'react'

const COLORS = ['#ffffff', '#f28b82', '#fdd663', '#fff475', '#cbf0f8', '#d7aefb', '#e6c9a8', '#a7ffeb']

export default function NoteCard({ note, onEdit, onDelete, onTogglePin, onColorChange }) {
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleColorChange = async (color) => {
    setShowColorPicker(false)
    if (onColorChange) {
      await onColorChange(note._id, color)
    }
  }

  return (
    <div
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
      style={{ backgroundColor: note.color }}
      onClick={onEdit}
    >
      {/* Pin indicator */}
      {note.pinned && (
        <div className="absolute top-2 right-2 z-10">
          <span className="text-yellow-500 text-sm">📌</span>
        </div>
      )}

      <div className="p-4">
        {/* Title */}
        {note.title && (
          <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{note.title}</h3>
        )}

        {/* Content */}
        {note.content && (
          <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-6">{note.content}</p>
        )}
      </div>

      {/* Action Bar - shows on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-2 py-1.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center gap-1">
          {/* Pin button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePin()
            }}
            className="p-1.5 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors"
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            <span className="text-sm">{note.pinned ? '📌' : '📍'}</span>
          </button>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* Color picker */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowColorPicker(!showColorPicker)
              }}
              className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              title="Change color"
            >
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: note.color, border: '1px solid #ddd' }} />
            </button>

            {showColorPicker && (
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex gap-1.5 flex-wrap w-28">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor: note.color === color ? '#4285f4' : 'transparent'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-400">
          {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  )
}