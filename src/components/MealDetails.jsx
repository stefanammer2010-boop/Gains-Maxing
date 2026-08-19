import { useMemo } from "react";

function MealDetails({
  meal,
  data,
  updateData,
  goBack,
  openAddFood,
  editFood,
}) {
  const today = new Date().toDateString();

  const foods = data.meals.filter(
    (food) =>
      food.date === today &&
      food.meal === meal
  );

  const totals = useMemo(() => {
    return foods.reduce(
      (total, food) => ({
        calories:
          total.calories +
          Number(food.calories || 0),

        protein:
          total.protein +
          Number(food.protein || 0),

        carbs:
          total.carbs +
          Number(food.carbs || 0),

        fat:
          total.fat +
          Number(food.fat || 0),
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    );
  }, [foods]);

  const mealNames = {
    Breakfast: "Frühstück",
    Lunch: "Mittagessen",
    Dinner: "Abendessen",
    Snack: "Snacks",
  };

  const mealIcons = {
    Breakfast: "🍳",
    Lunch: "🍗",
    Dinner: "🍝",
    Snack: "🍫",
  };

  const deleteFood = (food) => {
    const confirmed = window.confirm(
      `"${food.name}" wirklich löschen?`
    );

    if (!confirmed) return;

    updateData({
      meals: data.meals.filter(
        (item) => item.id !== food.id
      ),
    });
  };

  return (
    <div className="page meal-details-page">
      <button
        className="back-button"
        onClick={goBack}
      >
        ← Food
      </button>

      <div className="meal-details-header">
        <div>
          <p className="eyebrow">
            TODAY'S MEAL
          </p>

          <h1>
            {mealIcons[meal]}{" "}
            {mealNames[meal]}
          </h1>

          <p className="muted">
            Everything you ate in this meal.
          </p>
        </div>
      </div>

      <div className="meal-total-card">
        <div>
          <strong>
            {Math.round(totals.calories)}
          </strong>

          <span>kcal</span>
        </div>

        <div>
          <strong>
            {Math.round(totals.protein)}g
          </strong>

          <span>protein</span>
        </div>

        <div>
          <strong>
            {Math.round(totals.carbs)}g
          </strong>

          <span>carbs</span>
        </div>

        <div>
          <strong>
            {Math.round(totals.fat)}g
          </strong>

          <span>fat</span>
        </div>
      </div>

      <div className="meal-food-list">
        {foods.length === 0 ? (
          <div className="card empty-meal-details">
            <div className="empty-food-icon">
              🍽️
            </div>

            <h2>
              Noch nichts gegessen
            </h2>

            <p className="muted">
              Füge dein erstes Lebensmittel
              zu dieser Mahlzeit hinzu.
            </p>

            <button
              className="primary-button"
              onClick={openAddFood}
            >
              + ADD FOOD
            </button>
          </div>
        ) : (
          <>
            {foods.map((food) => (
              <div
                className="meal-food-card"
                key={food.id}
              >
                <div className="meal-food-main">
                  <div className="meal-food-icon">
                    🍽️
                  </div>

                  <div>
                    <h3>
                      {food.name}
                    </h3>

                    <p>
                      {food.amount
                        ? `${food.amount} g/ml`
                        : "Portion"}
                    </p>
                  </div>
                </div>

                <div className="meal-food-nutrition">
                  <strong>
                    {food.calories} kcal
                  </strong>

                  <span>
                    {food.protein}g P
                  </span>

                  <span>
                    {food.carbs}g C
                  </span>

                  <span>
                    {food.fat}g F
                  </span>
                </div>

                <div className="meal-food-actions">
                  <button
                    className="food-edit-button"
                    onClick={() =>
                      editFood(food)
                    }
                  >
                    ✎
                  </button>

                  <button
                    className="food-delete-button"
                    onClick={() =>
                      deleteFood(food)
                    }
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            <button
              className="primary-button meal-add-button"
              onClick={openAddFood}
            >
              + ADD FOOD
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default MealDetails;