import { useState } from 'react'

const menuItems = [
  { icon: '📝', label: 'Notes', active: true },
  { icon: '📌', label: 'Pinned', active: false },
  { icon: '🗑️', label: 'Archive', active: false },
  { icon: '🗂️', label: 'Trash', active: false },
]

export default function Sidebar({ isOpen, onClose }) {
  const [activeItem, setActiveItem] = useState('Notes')

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-gray-700">Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-3">
          <ul className="space-y-1">
            {menuItems.map(item => (
              <li key={item.label}>
                <button
                  onClick={() => {
                    setActiveItem(item.label)
                    onClose()
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    activeItem === item.label
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Reminder section */}
        <div className="p-4 mt-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <span className="text-lg">🔔</span>
            <span>Reminders</span>
          </button>
        </div>

        {/* Labels section */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 px-4">Labels</h3>
          <ul className="space-y-1">
            {['Work', 'Personal', 'Ideas'].map(label => (
              <li key={label}>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                  <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Desktop sidebar - always visible */}
      <aside className="w-64 bg-white shadow-sm min-h-screen sticky top-0 hidden md:block">
        <nav className="p-3">
          <ul className="space-y-1">
            {menuItems.map(item => (
              <li key={item.label}>
                <button
                  onClick={() => setActiveItem(item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    activeItem === item.label
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Reminder section */}
        <div className="p-4 mt-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <span className="text-lg">🔔</span>
            <span>Reminders</span>
          </button>
        </div>

        {/* Labels section */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 px-4">Labels</h3>
          <ul className="space-y-1">
            {['Work', 'Personal', 'Ideas'].map(label => (
              <li key={label}>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                  <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  )
}