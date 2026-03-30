export default function Navbar({ search, onSearchChange, user, onLogout }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-xl">📝</span>
          </div>
          <h1 className="text-xl font-bold text-gray-700">Keep</h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-600 text-sm hidden sm:block">{user.name}</span>
            </div>
          )}
          <button
            onClick={onLogout}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}