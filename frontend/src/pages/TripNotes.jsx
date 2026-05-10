import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import * as notesService from '../services/notesService';

const initialNotes = [
  { id: 1, title: 'Packing Reminders', content: 'Don\'t forget European power adapters and comfortable walking shoes.', date: '2026-05-08', stop: 'General' },
  { id: 2, title: 'Restaurant Recs', content: 'Try L\'As du Fallafel in Le Marais (Paris) and Cafe de Jaren in Amsterdam.', date: '2026-05-09', stop: 'Paris' },
  { id: 3, title: 'Museum Passes', content: 'Need to pick up the museum pass before 10 AM.', date: '2026-05-10', stop: 'Amsterdam' }
];

const stopsList = ['General', 'Paris', 'Amsterdam', 'Prague', 'Rome'];

export default function TripNotes() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStop, setFilterStop] = useState('All');
  const [error, setError] = useState(null);

  const { tripId: routeTripId } = useParams();
  const tripId = routeTripId || 1; 

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await notesService.getNotes(tripId);
        // Map backend tagType to stop, and parse JSON content for title
        const parsedNotes = data.map(n => {
          let parsedTitle = 'Note';
          let parsedContent = n.content;
          try {
            const obj = JSON.parse(n.content);
            if (obj.title && obj.text) {
              parsedTitle = obj.title;
              parsedContent = obj.text;
            }
          } catch (e) {} // Not JSON, ignore
          return {
            id: n.id,
            title: parsedTitle,
            content: parsedContent,
            stop: n.tagType || 'General',
            date: n.createdAt ? n.createdAt.split('T')[0] : ''
          };
        });
        setNotes(parsedNotes);
      } catch (err) {
        console.error(err);
        setNotes(initialNotes);
        setError('Failed to load notes. Showing preview data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, [tripId]);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [stop, setStop] = useState('General');

  const openForm = (note = null) => {
    if (note) {
      setEditingId(note.id);
      setTitle(note.title);
      setContent(note.content);
      setStop(note.stop || 'General');
    } else {
      setEditingId(null);
      setTitle('');
      setContent('');
      setStop('General');
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setTitle('');
    setContent('');
    setStop('General');
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const combinedContent = JSON.stringify({ title, text: content });

    try {
      if (editingId) {
        if (!String(editingId).startsWith('temp')) {
          await notesService.updateNote(tripId, editingId, { content: combinedContent, tagType: stop });
        }
        setNotes(notes.map(n => 
          n.id === editingId 
            ? { ...n, title, content, stop }
            : n
        ));
      } else {
        const notePayload = { content: combinedContent, tagType: stop };
        let newNoteData;
        try {
          newNoteData = await notesService.createNote(tripId, notePayload);
        } catch (err) {
          console.error('API failed:', err.message);
          newNoteData = { id: `temp${Date.now()}`, createdAt: new Date().toISOString() };
        }

        const newNote = {
          id: newNoteData.id,
          title,
          content,
          stop,
          date: newNoteData.createdAt.split('T')[0]
        };
        setNotes([newNote, ...notes]);
      }
      closeForm();
    } catch {
      setError('Failed to save note.');
    }
  };

  const removeNote = async (id) => {
    try {
      if (!String(id).startsWith('temp')) {
        await notesService.deleteNote(tripId, id);
      }
      setNotes(notes.filter(note => note.id !== id));
    } catch {
      setError('Failed to delete note.');
    }
  };

  const filteredNotes = filterStop === 'All' 
    ? notes 
    : notes.filter(n => n.stop === filterStop);

  return (
    <div>
      <Navbar />
      <div className="container section">
        <main>
          <SectionHeader
            title="Trip Notes & Journal"
            subtitle="Jot down memories, packing reminders, and useful links."
            action={
              <button 
                className="btn btn-primary" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => openForm()}
              >
                <FiPlus /> Add Note
              </button>
            }
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label className="muted" style={{ fontSize: '14px' }}>Filter by Stop:</label>
              <select 
                className="input" 
                style={{ width: 'auto', padding: '6px 12px' }}
                value={filterStop} 
                onChange={(e) => setFilterStop(e.target.value)}
              >
                <option value="All">All Stops & General</option>
                {stopsList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {showForm && (
            <div className="card glass" style={{ padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '16px' }}>{editingId ? 'Edit Note' : 'Add New Note'}</h3>
              <form onSubmit={handleSaveNote} style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="muted" style={{ display: 'block', marginBottom: '6px' }}>Title</label>
                    <input 
                      className="input" 
                      placeholder="e.g., Train Schedule Links" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="muted" style={{ display: 'block', marginBottom: '6px' }}>Stop / Category</label>
                    <select 
                      className="input" 
                      value={stop} 
                      onChange={(e) => setStop(e.target.value)}
                    >
                      {stopsList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="muted" style={{ display: 'block', marginBottom: '6px' }}>Content</label>
                  <textarea 
                    className="input" 
                    rows="5"
                    placeholder="Write your notes here..." 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    required 
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-primary" type="submit">Save Note</button>
                  <button className="btn btn-ghost" type="button" onClick={closeForm}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid-3">
            {filteredNotes.map(note => (
              <div key={note.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{note.title}</h3>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                      className="btn btn-ghost" 
                      style={{ padding: '6px', color: 'var(--muted)' }}
                      onClick={() => openForm(note)}
                      title="Edit Note"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button 
                      className="btn btn-ghost" 
                      style={{ padding: '6px', color: '#dc2626' }}
                      onClick={() => removeNote(note.id)}
                      title="Delete Note"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="tag tag-purple">{note.stop}</span>
                  <span className="muted" style={{ fontSize: '12px' }}>{note.date}</span>
                </div>
                <div style={{ flex: 1, whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.5' }}>
                  {note.content}
                </div>
              </div>
            ))}
            {filteredNotes.length === 0 && !showForm && (
              <div className="muted" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                {notes.length === 0 ? 'No notes yet. Click "Add Note" to get started.' : 'No notes match the selected filter.'}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
