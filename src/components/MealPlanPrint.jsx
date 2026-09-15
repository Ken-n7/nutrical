import { FOOD_ITEMS, MEAL_PERIODS } from '../data/mealPlanData';

function resolveItems(rows = []) {
  return rows
    .map((row) => {
      const items = (row.group && FOOD_ITEMS[row.group]) || [];
      if (items.length === 0) return null;
      const fIdx = Math.min(row.foodIndex || 0, items.length - 1);
      return items[Math.min(fIdx, Math.max(items.length - 1, 0))];
    })
    .filter(Boolean);
}

function today() {
  return new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function MealPlanPrint({ mealPlan, patient }) {
  if (!mealPlan) return null;

  const patientName = patient?.name?.trim() || '—';

  return (
    <div className="meal-plan-print">
      <header>
        <div>NutriCal — One-Day Meal Plan</div>
        <div>
          Patient: {patientName}
          <span className="meal-plan-print-date"> | Date: {today()}</span>
        </div>
      </header>

      <table>
        <colgroup>
          <col className="meal-col-meal" />
          <col />
          <col className="meal-col-measure" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">Meal</th>
            <th scope="col">Sample Menu</th>
            <th scope="col">Household Measure</th>
          </tr>
        </thead>
        <tbody>
          {MEAL_PERIODS.map(({ key, label }) => {
            const items = resolveItems(mealPlan[key]);
            if (items.length === 0) {
              return (
                <tr key={key}>
                  <th scope="row">{label}</th>
                  <td className="meal-plan-empty">—</td>
                  <td className="meal-plan-empty">—</td>
                </tr>
              );
            }
            return items.map((food, i) => (
              <tr key={`${key}-${i}`}>
                {i === 0 && (
                  <th scope="row" rowSpan={items.length}>
                    {label}
                  </th>
                )}
                <td>{food.name}</td>
                <td>{food.measure}</td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}