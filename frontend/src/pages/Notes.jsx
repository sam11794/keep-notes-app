import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import NoteCard from '../components/NoteCard'
import NoteModal from '../components/NoteModal'

const COLORS = ['#ffffff', '#f28b82', '#fdd663', '#fff475', '#cbf0f8', '#d7aefb', '#e6c9a8', '#a7ffeb']

export default function Notes() {
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)
  const [isInputExpanded, setIsInputExpanded] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '', color: '#ffffff' })
  const [selectedNote, setSelectedNote] = useState(null)
  const [activeModal, setActiveModal] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes')
      setNotes(res.data)
    } catch (err) {
      console.error('Error fetching notes:', err)
    }
  }

  const createNote = async () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return
    try {
      const res = await api.post('/notes', newNote)
      setNotes([res.data, ...notes])
      setNewNote({ title: '', content: '', color: '#ffffff' })
      setIsInputExpanded(false)
    } catch (err) {
      console.error('Error creating note:', err)
    }
  }

  const updateNote = async (id, updatedNote) => {
    try {
      const res = await api.put(`/notes/${id}`, updatedNote)
      setNotes(notes.map(n => n._id === id ? res.data : n))
      setActiveModal(null)
      setSelectedNote(null)
    } catch (err) {
      console.error('Error updating note:', err)
    }
  }

  const changeNoteColor = async (id, color) => {
    try {
      const note = notes.find(n => n._id === id)
      if (note) {
        const res = await api.put(`/notes/${id}`, { ...note, color })
        setNotes(notes.map(n => n._id === id ? res.data : n))
      }
    } catch (err) {
      console.error('Error changing note color:', err)
    }
  }

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`)
      setNotes(notes.filter(n => n._id !== id))
      setActiveModal(null)
      setSelectedNote(null)
    } catch (err) {
      console.error('Error deleting note:', err)
    }
  }

  const togglePin = async (note) => {
    try {
      const res = await api.put(`/notes/${note._id}`, { ...note, pinned: !note.pinned })
      setNotes(notes.map(n => n._id === note._id ? res.data : n))
    } catch (err) {
      console.error('Error toggling pin:', err)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  )

  const pinnedNotes = filteredNotes.filter(n => n.pinned)
  const otherNotes = filteredNotes.filter(n => !n.pinned)

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Navbar search={search} onSearchChange={setSearch} user={user} onLogout={logout} onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Floating Add Note Input */}
            <div
              className={`bg-white rounded-lg shadow-md mb-6 transition-all duration-300 ${
                isInputExpanded ? 'shadow-lg' : ''
              }`}
              style={{ backgroundColor: newNote.color }}
            >
              <div className={`transition-all duration-300 ${isInputExpanded ? 'p-4' : 'p-3'}`}>
                {isInputExpanded && (
                  <input
                    type="text"
                    placeholder="Title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="w-full mb-2 px-3 py-2 text-lg font-medium border-none bg-transparent focus:outline-none placeholder-gray-500"
                  />
                )}
                <div className="flex items-center gap-2">
                  {!isInputExpanded ? (
                    <input
                      type="text"
                      placeholder="Take a note..."
                      value={newNote.content}
                      onFocus={() => setIsInputExpanded(true)}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      className="flex-1 px-3 py-2 border-none bg-transparent focus:outline-none placeholder-gray-400"
                    />
                  ) : (
                    <textarea
                      placeholder="Take a note..."
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      className="w-full px-3 py-2 border-none bg-transparent focus:outline-none resize-none placeholder-gray-400"
                      rows="3"
                    />
                  )}
                </div>

                {isInputExpanded && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      {COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewNote({ ...newNote, color })}
                          className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer"
                          style={{
                            backgroundColor: color,
                            borderColor: newNote.color === color ? '#4285f4' : 'transparent'
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsInputExpanded(false)
                          setNewNote({ title: '', content: '', color: '#ffffff' })
                        }}
                        className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={createNote}
                        className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pinned Notes */}
            {pinnedNotes.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <span>📌</span> Pinned
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pinnedNotes.map(note => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={() => {
                        setSelectedNote(note)
                        setActiveModal('edit')
                      }}
                      onDelete={() => deleteNote(note._id)}
                      onTogglePin={() => togglePin(note)}
                      onColorChange={changeNoteColor}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Notes */}
            {otherNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <h2 className="text-sm font-medium text-gray-500 mb-3">Other notes</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {otherNotes.map(note => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={() => {
                        setSelectedNote(note)
                        setActiveModal('edit')
                      }}
                      onDelete={() => deleteNote(note._id)}
                      onTogglePin={() => togglePin(note)}
                      onColorChange={changeNoteColor}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredNotes.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500">No notes yet. Start by creating one!</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {activeModal === 'edit' && selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={() => {
            setActiveModal(null)
            setSelectedNote(null)
          }}
          onSave={(updatedNote) => updateNote(selectedNote._id, updatedNote)}
          onDelete={() => deleteNote(selectedNote._id)}
          onTogglePin={() => togglePin(selectedNote)}
        />
      )}
    </div>
  )
}