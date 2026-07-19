import React, { useState } from 'react';

const FOOD_DB = [
  { name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 2 },
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Banana (medium)', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: 'Whole Milk (200ml)', calories: 130, protein: 6.4, carbs: 9.6, fat: 7.2 },
  { name: 'Spinach (100g)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { name: 'Almonds (30g)', calories: 174, protein: 6, carbs: 6, fat: 15 },
  { name: 'Oats (40g)', calories: 148, protein: 5, carbs: 26, fat: 3 },
  { name: 'Greek Yogurt (150g)', calories: 89, protein: 17, carbs: 5, fat: 0.5 },
];

function FoodSearchPage() {
  const [q, setQ] = useState('');
  const results = q.length > 1 ? FOOD_DB.filter(f => f.name.toLowerCase().includes(q.toLowerCase())) : FOOD_DB;

  return (
    <div className="content animate-in">
      <div className="page-header">
        <div className="page-title">Food Database</div>
        <div className="page-sub">Search nutritional information for any food</div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <input className="form-input" placeholder="🔍 Search foods — e.g. rice, banana, chicken..." value={q} onChange={e => setQ(e.target.value)} style={{ fontSize: 15 }} />
      </div>

      <div className="card">
        <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 12 }}>Showing {results.length} results</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Carbohydrates</th>
                <th>Fat</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((f, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{f.name}</td>
                  <td><span className="tag tag-red">{f.calories} kcal</span></td>
                  <td>{f.protein}g</td>
                  <td>{f.carbs}g</td>
                  <td>{f.fat}g</td>
                  <td><button className="btn btn-sm btn-secondary">+ Add to Log</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FoodSearchPage;