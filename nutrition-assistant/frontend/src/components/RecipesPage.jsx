import React, { useState } from 'react';

const RECIPES = [
  { id: 1, name: 'Masala Oats', emoji: '🥣', time: '10 min', calories: 280, category: 'Breakfast', tags: ['Veg', 'High Fiber'] },
  { id: 2, name: 'Quinoa Bowl', emoji: '🥗', time: '20 min', calories: 380, category: 'Lunch', tags: ['Veg', 'High Protein'] },
  { id: 3, name: 'Dal Soup', emoji: '🍲', time: '30 min', calories: 220, category: 'Dinner', tags: ['Veg', 'High Protein'] },
  { id: 4, name: 'Mango Lassi', emoji: '🥤', time: '5 min', calories: 180, category: 'Snack', tags: ['Veg', 'Probiotic'] },
  { id: 5, name: 'Paneer Bhurji', emoji: '🍳', time: '15 min', calories: 320, category: 'Breakfast', tags: ['Veg', 'High Protein'] },
  { id: 6, name: 'Ragi Roti', emoji: '🫓', time: '20 min', calories: 150, category: 'Dinner', tags: ['Veg', 'Gluten-free'] },
];

function RecipesPage() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const cats = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const filtered = filter === 'All' ? RECIPES : RECIPES.filter(r => r.category === filter);

  return (
    <div className="content animate-in">
      <div className="page-header">
        <div className="page-title">Healthy Recipes</div>
        <div className="page-sub">Curated recipes matching your dietary preferences</div>
      </div>

      <div className="flex-c gap-2" style={{ marginBottom: 20 }}>
        {cats.map(c => (
          <button key={c} className={`btn btn-sm ${filter === c ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid-3">
        {filtered.map(r => (
          <div key={r.id} className="recipe-card" onClick={() => setSelected(r)}>
            <div className="recipe-img" style={{ background: r.category === 'Breakfast' ? '#FFF8E1' : r.category === 'Lunch' ? '#E8F5E9' : r.category === 'Dinner' ? '#EDE7F6' : '#E0F7FA' }}>
              {r.emoji}
            </div>
            <div className="recipe-body">
              <div className="recipe-title">{r.name}</div>
              <div className="recipe-meta">⏱ {r.time} · 🔥 {r.calories} kcal</div>
              <div className="flex-c gap-2" style={{ marginTop: 8 }}>
                {r.tags.map(t => <span key={t} className="tag tag-green">{t}</span>)}
                <span className="tag tag-gray">{r.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={e => e.target.className === 'modal-overlay' && setSelected(null)}>
          <div className="modal">
            <div style={{ fontSize: 60, textAlign: 'center', marginBottom: 12 }}>{selected.emoji}</div>
            <div className="modal-title" style={{ textAlign: 'center' }}>{selected.name}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
              <span className="tag tag-amber">⏱ {selected.time}</span>
              <span className="tag tag-red">🔥 {selected.calories} kcal</span>
              <span className="tag tag-gray">{selected.category}</span>
            </div>
            <div style={{ background: 'var(--canvas)', borderRadius: 'var(--radius)', padding: '14px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink3)', marginBottom: 8, textTransform: 'uppercase' }}>Ingredients</div>
              <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.8 }}>Detailed ingredients would be loaded from the API. This is a demo recipe card showing the layout.</div>
            </div>
            <div style={{ background: 'var(--canvas)', borderRadius: 'var(--radius)', padding: '14px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink3)', marginBottom: 8, textTransform: 'uppercase' }}>Instructions</div>
              <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.8 }}>Step-by-step cooking instructions would be displayed here from the database.</div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
              <button className="btn btn-primary">❤️ Save Recipe</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .recipe-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: .2s;
          cursor: pointer;
        }
        .recipe-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--green-mid);
          transform: translateY(-2px);
        }
        .recipe-img {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
        }
        .recipe-body {
          padding: 14px;
        }
        .recipe-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 4px;
        }
        .recipe-meta {
          font-size: 11px;
          color: var(--ink3);
        }
      `}</style>
    </div>
  );
}

export default RecipesPage;