import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const COLORS = ['#ffffff', '#f28b82', '#fdd663', '#fff475', '#cbf0f8', '#d7aefb', '#e6c9a8', '#a7ffeb']

export default function Notes() {
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [search, setSearch] = useState('')
  const [newNote, setNewNote] = useState({ title: '', content: '', color: '#ffffff' })
  const [editingId, setEditingId] = useState(null)
  const [editNote, setEditNote] = useState({})
  const [user, setUser] = useState(null)

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
    } catch (err) {
      console.error('Error creating note:', err)
    }
  }

  const updateNote = async (id) => {
    try {
      const res = await api.put(`/notes/${id}`, editNote)
      setNotes(notes.map(n => n._id === id ? res.data : n))
      setEditingId(null)
      setEditNote({})
    } catch (err) {
      console.error('Error updating note:', err)
    }
  }

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`)
      setNotes(notes.filter(n => n._id !== id))
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

  const startEdit = (note) => {
    setEditingId(note._id)
    setEditNote({ ...note })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditNote({})
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-700">Keep Notes</h1>
          <div className="flex items-center gap-4">
            {user && <span className="text-gray-600">Hi, {user.name}</span>}
            <button onClick={logout} className="text-red-500 hover:text-red-600">Logout</button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Create Note */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border-l-4" style={{ borderLeftColor: newNote.color }}>
          <input
            type="text"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="w-full mb-2 px-2 py-1 text-lg font-medium border-none focus:outline-none"
          />
          <textarea
            placeholder="Take a note..."
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="w-full mb-3 px-2 py-1 border-none focus:outline-none resize-none"
            rows="2"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setNewNote({ ...newNote, color })}
                  className="w-6 h-6 rounded-full border-2 cursor-pointer"
                  style={{ backgroundColor: color, borderColor: newNote.color === color ? '#4285f4' : 'transparent' }}
                />
              ))}
            </div>
            <button
              onClick={createNote}
              className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredNotes.map(note => (
            <div
              key={note._id}
              className="bg-white rounded-xl shadow-md overflow-hidden relative group"
              style={{ backgroundColor: note.color }}
            >
              {note.pinned && (
                <div className="absolute top-2 right-2 text-yellow-500 text-lg">📌</div>
              )}

              {editingId === note._id ? (
                <div className="p-4">
                  <input
                    type="text"
                    value={editNote.title}
                    onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                    className="w-full mb-2 px-2 py-1 border rounded focus:outline-none"
                  />
                  <textarea
                    value={editNote.content}
                    onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                    className="w-full mb-3 px-2 py-1 border rounded focus:outline-none resize-none"
                    rows="3"
                  />
                  <div className="flex gap-1 mb-3">
                    {COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setEditNote({ ...editNote, color })}
                        className="w-5 h-5 rounded-full border-2"
                        style={{ backgroundColor: color, borderColor: editNote.color === color ? '#4285f4' : 'transparent' }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateNote(note._id)}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  {note.title && <h3 className="font-medium text-gray-800 mb-1">{note.title}</h3>}
                  {note.content && <p className="text-gray-600 text-sm whitespace-pre-wrap">{note.content}</p>}

                  <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => togglePin(note)}
                      className="p-1 text-gray-500 hover:text-yellow-500"
                      title={note.pinned ? 'Unpin' : 'Pin'}
                    >
                      {note.pinned ? '📌' : '📍'}
                    </button>
                    <button
                      onClick={() => startEdit(note)}
                      className="p-1 text-gray-500 hover:text-blue-500"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="p-1 text-gray-500 hover:text-red-500"
                      title="Delete"
                    >
                      🗑️
                    </button>
                    <div className="flex gap-1 ml-auto">
                      {COLORS.map(color => (
                        <button
                          key={color}
                          onClick={async () => {
                            await api.put(`/notes/${note._id}`, { ...note, color })
                            fetchNotes()
                          }}
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color, borderColor: note.color === color ? '#4285f4' : '#ddd' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No notes found</p>
        )}
      </div>
    </div>
  )
}