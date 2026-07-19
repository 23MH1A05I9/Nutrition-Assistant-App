import React, { useState, useEffect } from 'react';
import api from '../services/api';

function MealPlanPage() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMealPlan();
  }, []);

  const fetchMealPlan = async () => {
    try {
      const response = await api.get('/meal-plans');
      if (response.data.length > 0) {
        setPlan(response.data[0]);
      } else {
        // Use mock data if no plan exists
        setPlan({
          title: 'Balanced Vegetarian Plan',
          calories: 1800,
          protein: 75,
          carbohydrates: 220,
          fats: 60,
          fiber: 30,
          breakfast: [{ item: 'Oats with fruits & nuts', calories: 320, protein: 10 }, { item: 'Green smoothie', calories: 150, protein: 5 }],
          lunch: [{ item: 'Quinoa khichdi', calories: 380, protein: 18 }, { item: 'Mixed vegetable curry', calories: 220, protein: 8 }, { item: 'Low-fat yogurt', calories: 80, protein: 6 }],
          snacks: [{ item: 'Apple with almond butter', calories: 200, protein: 5 }, { item: 'Herbal tea', calories: 10, protein: 0 }],
          dinner: [{ item: 'Whole wheat roti (2)', calories: 180, protein: 6 }, { item: 'Dal tadka', calories: 260, protein: 16 }, { item: 'Steamed broccoli', calories: 55, protein: 4 }],
          instructions: 'Drink 8 glasses of water daily. Avoid processed foods. Have dinner by 7 PM.',
          createdDate: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const MealSection = ({ title, em, items }) => (
    <div className="meal-section">
      <div className="meal-section-title">{em} {title}</div>
      {items?.map((item, i) => (
        <div key={i} className="meal-item">
          <span>{item.item}</span>
          <div className="flex-c gap-2">
            <span className="tag tag-amber">{item.calories} kcal</span>
            <span className="tag tag-blue">{item.protein}g protein</span>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <div className="content">Loading...</div>;
  }

  if (!plan) {
    return (
      <div className="content">
        <div className="page-header">
          <div className="page-title">My Meal Plan</div>
          <div className="page-sub">No meal plan assigned yet</div>
        </div>
        <div className="card">
          <div className="empty-state">
            <div className="empty-em">🥗</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No Meal Plan Yet</div>
            <div style={{ color: 'var(--ink3)' }}>Your dietitian will assign a meal plan soon.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">My Meal Plan</div>
            <div className="page-sub">{plan.title} · Created {plan.createdDate}</div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary">📥 Download PDF</button>
            <button className="btn btn-outline">📊 Nutritional Analysis</button>
          </div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Calories', val: `${plan.calories} kcal`, em: '🔥', color: 'var(--red)' },
          { label: 'Protein', val: `${plan.protein}g`, em: '💪', color: 'var(--blue)' },
          { label: 'Carbohydrates', val: `${plan.carbohydrates}g`, em: '🌾', color: 'var(--green)' },
          { label: 'Fats', val: `${plan.fats}g`, em: '🥑', color: 'var(--amber)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.em}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '.04em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div>
          <MealSection title="Breakfast" em="🌅" items={plan.breakfast} />
          <MealSection title="Lunch" em="☀️" items={plan.lunch} />
        </div>
        <div>
          <MealSection title="Snacks" em="🍎" items={plan.snacks} />
          <MealSection title="Dinner" em="🌙" items={plan.dinner} />
        </div>
      </div>

      <div className="card mt-4" style={{ marginTop: 16, background: 'var(--green-pale)', border: '1.5px solid var(--green-mid)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 24 }}>📋</div>
          <div>
            <div className="card-title text-green">Dietitian's Instructions</div>
            <div style={{ fontSize: 13, color: 'var(--ink2)', marginTop: 4 }}>{plan.instructions}</div>
          </div>
        </div>
      </div>

      <style>{`
        .meal-section {
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px;
          margin-bottom: 10px;
        }
        .meal-section-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--green);
          text-transform: uppercase;
          letter-spacing: .06em;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .meal-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
        }
        .meal-item:last-child {
          border-bottom: none;
        }
        .flex-c {
          display: flex;
          align-items: center;
        }
        .gap-2 { gap: 8px; }
        .grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .text-green { color: var(--green); }
      `}</style>
    </div>
  );
}

export default MealPlanPage;