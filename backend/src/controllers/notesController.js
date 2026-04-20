const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');

// Helper: safely parse tags regardless of MySQL JSON auto-parse
const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try { return JSON.parse(tags); } catch { return []; }
  }
  return [];
};

const parseNote = (row) => ({
  ...row,
  tags: parseTags(row.tags),
  is_pinned: !!row.is_pinned,
  is_archived: !!row.is_archived,
});

// GET /api/notes
const getAllNotes = async (req, res) => {
  try {
    const { search, category, pinned, archived, sort = 'updated_at', order = 'DESC' } = req.query;
    const userId = req.user.id;

    let query = 'SELECT * FROM notes WHERE user_id = ?';
    const params = [userId];

    if (archived === 'true') {
      query += ' AND is_archived = TRUE';
    } else {
      query += ' AND is_archived = FALSE';
    }

    if (pinned === 'true') { query += ' AND is_pinned = TRUE'; }
    if (category) { query += ' AND category = ?'; params.push(category); }
    if (search) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const validSorts = ['created_at', 'updated_at', 'title'];
    const validOrders = ['ASC', 'DESC'];
    const safeSort = validSorts.includes(sort) ? sort : 'updated_at';
    const safeOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';
    query += ` ORDER BY is_pinned DESC, ${safeSort} ${safeOrder}`;

    const [notes] = await pool.query(query, params);
    res.json({ success: true, data: { notes: notes.map(parseNote), total: notes.length } });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/notes/:id
const getNoteById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notes WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, data: { note: parseNote(rows[0]) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, content = '', category = 'General', color = '#ffffff', tags = [], is_pinned = false } = req.body;
    const id = uuidv4();

    await pool.query(
      'INSERT INTO notes (id, user_id, title, content, category, color, tags, is_pinned) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, req.user.id, title, content, category, color, JSON.stringify(tags), is_pinned ? 1 : 0]
    );

    const [rows] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
    res.status(201).json({ success: true, message: 'Note created', data: { note: parseNote(rows[0]) } });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const [existing] = await pool.query(
      'SELECT id FROM notes WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const { title, content, category, color, tags, is_pinned, is_archived } = req.body;
    const updates = [];
    const params = [];

    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (content !== undefined) { updates.push('content = ?'); params.push(content); }
    if (category !== undefined) { updates.push('category = ?'); params.push(category); }
    if (color !== undefined) { updates.push('color = ?'); params.push(color); }
    if (tags !== undefined) { updates.push('tags = ?'); params.push(JSON.stringify(tags)); }
    if (is_pinned !== undefined) { updates.push('is_pinned = ?'); params.push(is_pinned ? 1 : 0); }
    if (is_archived !== undefined) { updates.push('is_archived = ?'); params.push(is_archived ? 1 : 0); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    params.push(req.params.id, req.user.id);
    await pool.query(`UPDATE notes SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`, params);

    const [rows] = await pool.query('SELECT * FROM notes WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Note updated', data: { note: parseNote(rows[0]) } });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM notes WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// PATCH /api/notes/:id/pin
const togglePin = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT is_pinned FROM notes WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Note not found' });
    const newPin = !rows[0].is_pinned;
    await pool.query('UPDATE notes SET is_pinned = ? WHERE id = ?', [newPin ? 1 : 0, req.params.id]);
    res.json({ success: true, message: `Note ${newPin ? 'pinned' : 'unpinned'}`, data: { is_pinned: newPin } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/notes/stats
const getStats = async (req, res) => {
  try {
    const [[total]] = await pool.query(
      'SELECT COUNT(*) as count FROM notes WHERE user_id = ? AND is_archived = FALSE', [req.user.id]
    );
    const [[pinned]] = await pool.query(
      'SELECT COUNT(*) as count FROM notes WHERE user_id = ? AND is_pinned = TRUE', [req.user.id]
    );
    const [[archived]] = await pool.query(
      'SELECT COUNT(*) as count FROM notes WHERE user_id = ? AND is_archived = TRUE', [req.user.id]
    );
    const [categories] = await pool.query(
      'SELECT category, COUNT(*) as count FROM notes WHERE user_id = ? AND is_archived = FALSE GROUP BY category',
      [req.user.id]
    );
    res.json({ success: true, data: { total: total.count, pinned: pinned.count, archived: archived.count, categories } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getAllNotes, getNoteById, createNote, updateNote, deleteNote, togglePin, getStats };
