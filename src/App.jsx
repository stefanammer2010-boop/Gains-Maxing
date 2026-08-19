import { useMemo, useState } from "react";
import "./App.css";
import WorkoutTimer from "./components/gym/WorkoutTimer";
import BarcodeScanner from "./components/food/BarcodeScanner";
import MealDetails from "./components/MealDetails";
const defaultData = {
  profile: {
    name: "Athlete",
    calories: 3500,
    dayType: "training",
    protein: 180,
    carbs: 400,
    fat: 100,
    water: 3,
    sleep: 8,
    sleepLogged: 0,
    trainingDays: [
  1,
  2,
  4,
  5,
  6,
],
  },

  routines: [
    { id: 1, name: "Push", exercises: [] },
    { id: 2, name: "Pull", exercises: [] },
    { id: 3, name: "Legs", exercises: [] },
    { id: 4, name: "Upper", exercises: [] },
  ],

  workouts: [],
  meals: [],
};

function loadData() {
  try {
    const saved = localStorage.getItem("max-gains");

    if (saved) {
      const parsed = JSON.parse(saved);

      return {
        ...defaultData,
        ...parsed,
      };
    }
  } catch {}

  return defaultData;
}

function App() {
  const [data, setData] = useState(loadData);
  const [page, setPage] = useState("home");
const [selectedMeal, setSelectedMeal] =
  useState(null);
  const [activeRoutine, setActiveRoutine] = useState(null);

  const [editingRoutine, setEditingRoutine] = useState(null);

  const [foodMeal, setFoodMeal] = useState("Breakfast");

  const updateData = (changes) => {
    setData((current) => {
      const updated = {
        ...current,
        ...changes,
      };

      localStorage.setItem(
        "max-gains",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const today = new Date().toDateString();

  const todayMeals = data.meals.filter(
    (meal) => meal.date === today
  );

  const nutrition = useMemo(() => {
    return todayMeals.reduce(
      (total, meal) => ({
        calories: total.calories + Number(meal.calories || 0),
        protein: total.protein + Number(meal.protein || 0),
        carbs: total.carbs + Number(meal.carbs || 0),
        fat: total.fat + Number(meal.fat || 0),
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    );
  }, [todayMeals]);

  return (
    <div className="app">
      <Header />

  <main className="app-main"></main>
      <main>
        {page === "home" && (
         <Home
  data={data}
  nutrition={nutrition}
  setPage={setPage}
  updateData={updateData}
/>
        )}

        {page === "training" && (
          <Training
            data={data}
            updateData={updateData}
            activeRoutine={activeRoutine}
            setActiveRoutine={setActiveRoutine}
            editingRoutine={editingRoutine}
            setEditingRoutine={setEditingRoutine}
          />
        )}

       {page === "food" && (
  <Food
    data={data}
    updateData={updateData}
    nutrition={nutrition}
    foodMeal={foodMeal}
    setFoodMeal={setFoodMeal}
    setPage={setPage}
    setSelectedMeal={setSelectedMeal}
  />
)}
{page === "meal" && selectedMeal && (
  <MealDetails
    meal={selectedMeal}
    data={data}
    updateData={updateData}
    goBack={() => {
      setSelectedMeal(null);
      setPage("food");
    }}
    openAddFood={() => {
      setFoodMeal(selectedMeal);
      setPage("food");
    }}
    editFood={() => {}}
  />
)}
        {page === "progress" && (
          <Progress data={data} />
        )}

        {page === "settings" && (
          <Settings
            data={data}
            updateData={updateData}
          />
        )}
      </main>

      <Navigation
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

/* =========================
   HEADER
========================= */
function Header() {
  return null;
}

/* =========================
   HOME
========================= */

function Home({
  data,
  nutrition,
  setPage,
  updateData,
}) {
  const calorieProgress =
    data.profile.calories > 0
      ? Math.min(
          nutrition.calories / data.profile.calories,
          1
        )
      : 0;

  const proteinProgress =
    data.profile.protein > 0
      ? Math.min(
          nutrition.protein / data.profile.protein,
          1
        )
      : 0;

  const sleepProgress =
  data.profile.sleep > 0
    ? Math.min(
        (data.profile.sleepLogged || 0) /
          data.profile.sleep,
        1
      )
    : 0;
    const waterProgress =
  data.profile.water > 0
    ? Math.min(
        (data.profile.waterLogged || 0) /
          data.profile.water,
        1
      )
    : 0;







const isTrainingDay =
  data.profile.dayType === "training";

  const [waterOpen, setWaterOpen] = useState(false);
const [sleepOpen, setSleepOpen] = useState(false);
const trainingProgress =
  data.workouts.length > 0 ? 1 : 0;

const score = Math.round(
  calorieProgress * 25 +
    proteinProgress * 25 +
    sleepProgress * 20 +
    waterProgress * 10 +
    (isTrainingDay
      ? trainingProgress * 20
      : 20)
);
  return (
  <div className="page home-page">

    <section className="home-header">
      <div>
        <span className="home-eyebrow">
          TODAY'S MISSION
        </span>

        <h1>
          MAXIMIZE
          <br />
          <span>YOUR GAINS.</span>
        </h1>

        <p>
          Train hard. Eat enough. Recover.
        </p>

        <div className="day-status">
          {isTrainingDay ? (
            <>
              <span className="status-dot" />
              <strong>TRAINING DAY</strong>
            </>
          ) : (
            <>
              <span className="status-dot rest" />
              <strong>REST DAY</strong>
            </>
          )}
        </div>
      </div>

      <div className="home-score">
        <strong>{score}</strong>
        <span>/100</span>
        <small>GAINS SCORE</small>
      </div>
    </section>


    <section className="home-stats">

   


      <div
        className="home-stat-card clickable"
        onClick={() => setPage("food")}
      >
        <div className="home-stat-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 3v18" />
            <path d="M8 3v7" />
            <path d="M12 3v7" />
            <path d="M8 10c2.2 0 4-1.6 4-3.5V3" />
            <path d="M17 3v18" />
            <path d="M17 3c2 2 3 4.5 3 7 0 2.5-1 4-3 4" />
          </svg>
        </div>

        <div>
          <span>CALORIES</span>

          <strong>
            {Math.round(nutrition.calories)}
          </strong>

          <small>
            / {data.profile.calories} kcal
          </small>
        </div>
      </div>


      <div
        className="home-stat-card clickable"
        onClick={() => setPage("food")}
      >
        <div className="home-stat-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v18" />
            <path d="M5 8c0-2.8 2-5 4.5-5S14 5.2 14 8v3H5V8z" />
            <path d="M14 11h5" />
            <path d="M17 8v6" />
          </svg>
        </div>

        <div>
          <span>PROTEIN</span>

          <strong>
            {Math.round(nutrition.protein)}g
          </strong>

          <small>
            / {data.profile.protein}g
          </small>
        </div>
      </div>

   <div
        className="home-stat-card clickable"
        onClick={() => setPage("training")}
      >
        <div className="home-stat-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 7v10" />
            <path d="M18 7v10" />
            <path d="M3 9v6" />
            <path d="M21 9v6" />
            <path d="M6 12h12" />
            <path d="M3 12h3" />
            <path d="M18 12h3" />
          </svg>
        </div>

        <div>
          <span>TRAINING</span>

          <strong>
            {data.workouts.length}
          </strong>

          <small>saved workouts</small>
        </div>
      </div>

<div
  className={`dashboard-card clickable ${
    waterOpen ? "water-open" : ""
  }`}
  onClick={() => setWaterOpen(!waterOpen)}
>
        <div className="home-stat-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11z" />
          </svg>
        </div>

        <div>
          <span>WATER</span>

          <strong>
            {(data.profile.waterLogged || 0).toFixed(1)}L
          </strong>

          <small>
            / {data.profile.water}L
          </small>
        </div>

       {waterOpen && (
  <div
    className="water-controls"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="water-controls">

  <button
    className="secondary-button"
    onClick={() =>
      updateData({
        profile: {
          ...data.profile,
          waterLogged: Math.max(
            0,
            (data.profile.waterLogged || 0) - 0.5
          ),
        },
      })
    }
  >
    −0.5L
  </button>

  <button
    className="secondary-button"
    onClick={() =>
      updateData({
        profile: {
          ...data.profile,
          waterLogged: Math.max(
            0,
            (data.profile.waterLogged || 0) - 0.25
          ),
        },
      })
    }
  >
    −0.25L
  </button>

  <button
    className="primary-button"
    onClick={() =>
      updateData({
        profile: {
          ...data.profile,
          waterLogged:
            (data.profile.waterLogged || 0) + 0.25,
        },
      })
    }
  >
    +0.25L
  </button>

  <button
    className="primary-button"
    onClick={() =>
      updateData({
        profile: {
          ...data.profile,
          waterLogged:
            (data.profile.waterLogged || 0) + 0.5,
        },
      })
    }
  >
    +0.5L
  </button>

</div>

            <button
              className="primary-button"
              onClick={() =>
                updateData({
                  profile: {
                    ...data.profile,
                    waterLogged:
                      (data.profile.waterLogged || 0) + 0.5,
                  },
                })
              }
            >
              +0.5L
            </button>
          </div>
        )}
      </div>

    </section>


   <section
  className={`home-recovery clickable ${
    sleepOpen ? "recovery-open" : ""
  } ${waterOpen ? "water-open-recovery" : ""}`}

onClick={() => setSleepOpen(!sleepOpen)}
    >
      <div className="recovery-left">

        <div className="home-stat-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 18h16" />
            <path d="M6 18v-5h12v5" />
            <path d="M7 13V9h4v4" />
            <path d="M11 10h5a2 2 0 0 1 2 2v1" />
          </svg>
        </div>

        <div>
          <span>RECOVERY</span>
          <h2>Sleep</h2>
        </div>

      </div>

      <div className="sleep-value">
        <strong>
          {data.profile.sleepLogged || 0}h
        </strong>

        <span>
          / {data.profile.sleep}h
        </span>
      </div>

      <div className="recovery-bar">
        <div
          style={{
            width: `${Math.min(
              ((data.profile.sleepLogged || 0) /
                data.profile.sleep) *
                100,
              100
            )}%`,
          }}
        />
      </div>

      {sleepOpen && (
        <input
          className="sleep-input"
          type="number"
          step="0.5"
          min="0"
          max="24"
          placeholder="How many hours did you sleep?"
          value={data.profile.sleepLogged || ""}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            updateData({
              profile: {
                ...data.profile,
                sleepLogged:
                  Number(e.target.value) || 0,
              },
            })
          }
        />
      )}
    </section>


    <section className="next-action-card">

      <span>NEXT BEST ACTION</span>

      <h2>
        {nutrition.protein <
        data.profile.protein
          ? "Get your protein in."
          : "You're on track."}
      </h2>

      <p>
        {nutrition.protein <
        data.profile.protein
          ? `${Math.round(
              data.profile.protein -
                nutrition.protein
            )}g protein remaining today.`
          : "Keep executing the basics."}
      </p>

    </section>

  </div>
);
}

/* =========================
   TRAINING
========================= */

function Training({
  data,
  updateData,
  activeRoutine,
  setActiveRoutine,
  editingRoutine,
  setEditingRoutine,
}) {
  const [showNewWorkout, setShowNewWorkout] =
    useState(false);

  if (activeRoutine) {
    return (
      <WorkoutSession
        data={data}
        updateData={updateData}
        routine={activeRoutine}
        goBack={() => setActiveRoutine(null)}
      />
    );
  }

  return (
    <div className="page">
    <div className="training-header">
  <span>GYM</span>
  <h1>Your workouts.</h1>
  <p>Train hard. Track your progress.</p>
</div>

<div className="routine-grid">
  {data.routines.map((routine, index) => (
    <div
      className="routine-card"
      key={routine.id}
    >
      <div className="routine-card-top">
        <div className="routine-number">
          {String(index + 1).padStart(2, "0")}
        </div>

        <button
          className="routine-menu-button"
          onClick={(e) => {
            e.stopPropagation();

            const menu =
              e.currentTarget.nextElementSibling;

            menu.classList.toggle(
              "routine-menu-open"
            );
          }}
        >
          ⋯
        </button>

        <div className="routine-menu">
          <button
            onClick={() =>
              setEditingRoutine(routine)
            }
          >
            EDIT
          </button>

          <button
            className="routine-delete-menu"
            onClick={() => {
              const confirmed =
                window.confirm(
                  `Delete "${routine.name}"?\n\nThis will remove the routine.`
                );

              if (!confirmed) return;

              updateData({
                routines:
                  data.routines.filter(
                    (item) =>
                      item.id !== routine.id
                  ),
              });
            }}
          >
            DELETE
          </button>
        </div>
      </div>

      <h2>{routine.name}</h2>

      <p>
        {routine.exercises.length} exercises
      </p>

      <button
        className="primary-button"
        onClick={() =>
          setActiveRoutine(routine)
        }
      >
        START
      </button>
    </div>
  ))}

  <button
    className="new-workout-card"
    onClick={() =>
      setShowNewWorkout(true)
    }
  >
    <span>＋</span>

    <strong>NEW WORKOUT</strong>

    <small>
      Create another routine
    </small>
  </button>
</div>

      {editingRoutine && (
        <RoutineEditor
          data={data}
          updateData={updateData}
          routine={editingRoutine}
          close={() =>
            setEditingRoutine(null)
          }
        />
      )}

      {showNewWorkout && (
        <NewWorkout
          data={data}
          updateData={updateData}
          close={() =>
            setShowNewWorkout(false)
          }
        />
      )}
    </div>
  );
}
function NewWorkout({
  data,
  updateData,
  close,
}) {
  const [name, setName] = useState("");

  const createWorkout = () => {
    if (!name.trim()) return;

    const newRoutine = {
      id: Date.now(),
      name: name.trim(),
      exercises: [],
    };

    updateData({
      routines: [
        ...data.routines,
        newRoutine,
      ],
    });

    close();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">
              NEW WORKOUT
            </p>

            <h2>Create routine</h2>
          </div>

          <button
            className="close-button"
            onClick={close}
          >
            ×
          </button>
        </div>

        <label>
          Workout name

          <input
            autoFocus
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Chest, Arms, Full Body..."
          />
        </label>

        <button
          className="primary-button"
          onClick={createWorkout}
        >
          CREATE WORKOUT
        </button>
      </div>
    </div>
  );
}


/* =========================
   ROUTINE EDITOR
========================= */

function RoutineEditor({
  data,
  updateData,
  routine,
  close,
}) {
  const [name, setName] = useState(
    routine.name
  );

  const [exerciseName, setExerciseName] =
    useState("");

  const [sets, setSets] = useState(3);

  const [reps, setReps] = useState(8);

  const [weight, setWeight] = useState(0);

  const exercises = routine.exercises;

  const saveRoutine = () => {
    const updatedRoutines =
      data.routines.map((item) =>
        item.id === routine.id
          ? {
              ...item,
              name,
            }
          : item
      );

    updateData({
      routines: updatedRoutines,
    });

    close();
  };

  const addExercise = () => {
    if (!exerciseName.trim()) return;

    const newExercise = {
      id: Date.now(),
      name: exerciseName,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
    };

    const updatedRoutines =
      data.routines.map((item) =>
        item.id === routine.id
          ? {
              ...item,
              name,
              exercises: [
                ...item.exercises,
                newExercise,
              ],
            }
          : item
      );

    updateData({
      routines: updatedRoutines,
    });

    setExerciseName("");
    setSets(3);
    setReps(8);
    setWeight(0);

    routine.exercises.push(newExercise);
  };

  const deleteExercise = (exerciseId) => {
    const updatedRoutines =
      data.routines.map((item) =>
        item.id === routine.id
          ? {
              ...item,
              exercises:
                item.exercises.filter(
                  (exercise) =>
                    exercise.id !== exerciseId
                ),
            }
          : item
      );

    updateData({
      routines: updatedRoutines,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">
              EDIT ROUTINE
            </p>

            <h2>{routine.name}</h2>
          </div>

          <button
            className="close-button"
            onClick={close}
          >
            ×
          </button>
        </div>

        <label>
          Routine name

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
        </label>

        <h3>Exercises</h3>

        {exercises.map((exercise) => (
          <div
            className="exercise-preview"
            key={exercise.id}
          >
            <div>
              <strong>
                {exercise.name}
              </strong>

              <small>
                {exercise.sets} sets ×{" "}
                {exercise.reps} reps
                {" • "}
                {exercise.weight} kg
              </small>
            </div>

            <button
              className="delete-button"
              onClick={() =>
                deleteExercise(
                  exercise.id
                )
              }
            >
              ×
            </button>
          </div>
        ))}

        <div className="add-exercise">
          <p className="eyebrow">
            ADD EXERCISE
          </p>

          <label>
            Exercise name

            <input
              value={exerciseName}
              onChange={(e) =>
                setExerciseName(
                  e.target.value
                )
              }
              placeholder="Bench Press"
            />
          </label>

          <div className="form-grid">
            <label>
              Sets

              <input
                type="number"
                value={sets}
                onChange={(e) =>
                  setSets(e.target.value)
                }
              />
            </label>

            <label>
              Target reps

              <input
                type="number"
                value={reps}
                onChange={(e) =>
                  setReps(e.target.value)
                }
              />
            </label>
          </div>

          <label>
            Starting weight

            <input
              type="number"
              value={weight}
              onChange={(e) =>
                setWeight(e.target.value)
              }
            />
          </label>

          <button
            className="secondary-button full"
            onClick={addExercise}
          >
            + ADD EXERCISE
          </button>
        </div>

        <button
          className="primary-button"
          onClick={saveRoutine}
        >
          SAVE ROUTINE
        </button>
      </div>
    </div>
  );
}

/* =========================
   WORKOUT SESSION
========================= */
function WorkoutSession({
  data,
  updateData,
  routine,
  goBack,
}) {
  // Zeitpunkt, an dem das Workout gestartet wurde
  const [startedAt] = useState(() => Date.now());

  const previousWorkout =
    [...data.workouts]
      .reverse()
      .find(
        (workout) =>
          workout.routineId === routine.id
      );

  const [sets, setSets] = useState(() =>
    routine.exercises.map((exercise) =>
      Array.from(
        { length: exercise.sets },
        () => ({
          weight: "",
          reps: "",
        })
      )
    )
  );

  const updateSet = (
    exerciseIndex,
    setIndex,
    key,
    value
  ) => {
    setSets((current) => {
      const copy = structuredClone(current);

      copy[exerciseIndex][setIndex][key] =
        value;

      return copy;
    });
  };

  const saveWorkout = () => {
    const finishedAt = Date.now();

    const duration = Math.floor(
      (finishedAt - startedAt) / 1000
    );

    const workout = {
      id: Date.now(),

      date: new Date().toISOString(),

      routineId: routine.id,

      routineName: routine.name,

      startedAt,

      finishedAt,

      duration,

      exercises: routine.exercises.map(
        (exercise, index) => ({
          exerciseId: exercise.id,

          name: exercise.name,

          sets: sets[index],
        })
      ),
    };

    updateData({
      workouts: [
        ...data.workouts,
        workout,
      ],
    });

    alert(
      `Training gespeichert 🔥\n\nTrainingszeit: ${formatDuration(
        duration
      )}`
    );

    goBack();
  };

  return (
    <div className="page">
      <button
        className="back-button"
        onClick={goBack}
      >
        ← Routines
      </button>

      <div className="workout-header">
        <div>
          <p className="eyebrow">
            LIVE TRAINING
          </p>

          <h1>{routine.name}</h1>
        </div>

        <WorkoutTimer
          startedAt={startedAt}
        />
      </div>

      <p className="muted">
        Today's performance is in the
        foreground. Your last session stays
        grey.
      </p>

      {routine.exercises.length === 0 ? (
        <div className="card">
          <h2>No exercises yet.</h2>

          <p className="muted">
            Go back and add exercises to this
            routine.
          </p>
        </div>
      ) : (
        <>
          {routine.exercises.map(
            (exercise, exerciseIndex) => {
              const previousExercise =
                previousWorkout?.exercises?.find(
                  (item) =>
                    item.exerciseId ===
                    exercise.id
                );

              return (
                <div
                  className="exercise-card"
                  key={exercise.id}
                >
                  <div className="exercise-title">
                    <div>
                      <h2>
                        {exercise.name}
                      </h2>

                      <span>
                        {exercise.sets} sets ×{" "}
                        {exercise.reps} target
                      </span>
                    </div>
                  </div>

                  <div className="set-header">
                    <span>SET</span>
                    <span>WEIGHT</span>
                    <span>REPS</span>
                  </div>

                  {Array.from(
                    {
                      length:
                        exercise.sets,
                    },
                    (_, setIndex) => {
                      const previousSet =
                        previousExercise
                          ?.sets?.[
                          setIndex
                        ];

                      const currentSet =
                        sets[
                          exerciseIndex
                        ][setIndex];

                      return (
                        <div
                          className="set-row"
                          key={setIndex}
                        >
                          <strong>
                            {setIndex + 1}
                          </strong>

                          <div>
                            <input
                              type="number"
                              step="0.5"
                              placeholder={
                                previousSet
                                  ?.weight
                                  ? String(
                                      previousSet.weight
                                    )
                                  : String(
                                      exercise.weight ||
                                        ""
                                    )
                              }
                              value={
                                currentSet.weight
                              }
                              onChange={(e) =>
                                updateSet(
                                  exerciseIndex,
                                  setIndex,
                                  "weight",
                                  e.target.value
                                )
                              }
                            />

                            {previousSet && (
                              <small className="last-value">
                                last:{" "}
                                {
                                  previousSet.weight
                                }{" "}
                                kg
                              </small>
                            )}
                          </div>

                          <div>
                            <input
                              type="number"
                              placeholder={
                                previousSet
                                  ?.reps
                                  ? String(
                                      previousSet.reps
                                    )
                                  : String(
                                      exercise.reps
                                    )
                              }
                              value={
                                currentSet.reps
                              }
                              onChange={(e) =>
                                updateSet(
                                  exerciseIndex,
                                  setIndex,
                                  "reps",
                                  e.target.value
                                )
                              }
                            />

                            {previousSet && (
                              <small className="last-value">
                                last:{" "}
                                {
                                  previousSet.reps
                                }{" "}
                                reps
                              </small>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              );
            }
          )}

          <button
            className="primary-button save-training"
            onClick={saveWorkout}
          >
            ✓ FINISH & SAVE WORKOUT
          </button>
        </>
      )}
    </div>
  );
}
function formatDuration(seconds) {
  const hours = Math.floor(
    seconds / 3600
  );

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }

  if (minutes > 0) {
    return `${minutes}min ${secs}s`;
  }

  return `${secs}s`;
}
/* =========================
   FOOD
========================= */

function Food({
  data,
  updateData,
  nutrition,
  foodMeal,
  setFoodMeal,
  setPage,
  setSelectedMeal,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const meals = [
    ["Breakfast", "sunrise", "Frühstück"],
    ["Lunch", "sun", "Mittagessen"],
    ["Dinner", "moon", "Abendessen"],
    ["Snack", "star", "Snacks"],
  ];

  const calorieGoal = Number(data.profile.calories || 0);
  const caloriesConsumed = Number(nutrition.calories || 0);

  const calorieProgress =
    calorieGoal > 0
      ? Math.min(caloriesConsumed / calorieGoal, 1)
      : 0;

  const caloriesLeft = Math.max(
    0,
    Math.round(calorieGoal - caloriesConsumed)
  );

  return (
    <div className="page food-page">
      {/* =========================
          HEADER
      ========================= */}
      <div className="food-header">
        <div>
          <span className="food-eyebrow">TODAY</span>
          <h1>Fuel your gains.</h1>
          <p>Everything you eat today in one place.</p>
        </div>
      </div>

      {/* =========================
          CALORIES + MACROS
      ========================= */}
      <div className="nutrition-dashboard">
        <div className="calorie-area">
          <div className="calorie-ring">
            <div
              className="ring-progress"
              style={{
                "--progress": `${calorieProgress * 100}%`,
              }}
            >
              <div className="ring-inner">
                <strong>{caloriesLeft}</strong>
                <span>kcal left</span>
              </div>
            </div>
          </div>

          <div className="calorie-caption">
            <span>DAILY CALORIES</span>
            <strong>
              {Math.round(caloriesConsumed)} / {calorieGoal} kcal
            </strong>
          </div>
        </div>

        <div className="macro-summary">
          <Macro
            label="Protein"
            value={nutrition.protein}
            goal={data.profile.protein}
            unit="g"
          />

          <Macro
            label="Carbs"
            value={nutrition.carbs}
            goal={data.profile.carbs}
            unit="g"
          />

          <Macro
            label="Fat"
            value={nutrition.fat}
            goal={data.profile.fat}
            unit="g"
          />
        </div>
      </div>

      {/* =========================
          REMAINING
      ========================= */}
      

      {/* =========================
          MEALS
      ========================= */}
      <div className="meal-list">
        {meals.map(([key, icon, title]) => {
          const mealFoods = data.meals.filter(
            (meal) =>
              meal.date === new Date().toDateString() &&
              meal.meal === key
          );

          const mealCalories = mealFoods.reduce(
            (sum, food) =>
              sum + Number(food.calories || 0),
            0
          );

          return (
            <div
              className="meal-section"
              key={key}
            >
              {/* MEAL HEADER */}
              <div
                className="meal-header clickable-meal"
                onClick={() => {
                  setSelectedMeal(key);
                  setPage("meal");
                }}
              >
                <div className="meal-title-area">
                  <span className="meal-icon">
                    {icon === "sunrise" && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 18h18" />
                        <path d="M5 18a7 7 0 0 1 14 0" />
                        <path d="M12 3v3" />
                        <path d="M5.6 7.6l2.1 2.1" />
                        <path d="M18.4 7.6l-2.1 2.1" />
                      </svg>
                    )}

                    {icon === "sun" && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2" />
                        <path d="M12 20v2" />
                        <path d="M4.93 4.93l1.41 1.41" />
                        <path d="M17.66 17.66l1.41 1.41" />
                        <path d="M2 12h2" />
                        <path d="M20 12h2" />
                        <path d="M4.93 19.07l1.41-1.41" />
                        <path d="M17.66 6.34l1.41-1.41" />
                      </svg>
                    )}

                    {icon === "moon" && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5z" />
                      </svg>
                    )}

                    {icon === "star" && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3z" />
                      </svg>
                    )}
                  </span>

                  <div>
                    <h2>{title}</h2>

                    <small>
                      {mealCalories} kcal
                    </small>
                  </div>
                </div>

                {/* PLUS BUTTON */}
                <button
                  className="add-food-button"
                  aria-label={`Add food to ${title}`}
                  onClick={(e) => {
                    e.stopPropagation();

                    setFoodMeal(key);
                    setShowAdd(true);
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                </button>
              </div>

              {/* FOOD */}
              {mealFoods.length === 0 ? (
                <div className="empty-meal">
                  Nothing logged yet
                </div>
              ) : (
                <div className="food-list">
                  {mealFoods.map((food) => (
                    <div
                      className="food-row"
                      key={food.id}
                    >
                      <div className="food-info">
                        <strong>{food.name}</strong>

                        <small>
                          {food.amount
                            ? `${food.amount} g/ml • `
                            : ""}
                          {food.protein}g protein •{" "}
                          {food.carbs}g carbs •{" "}
                          {food.fat}g fat
                        </small>
                      </div>

                      <div className="food-actions">
                        <strong>
                          {food.calories} kcal
                        </strong>

                        <button
                          className="food-edit-button"
                          aria-label={`Edit ${food.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFood(food);
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                          </svg>
                        </button>

                        <button
                          className="food-delete-button"
                          aria-label={`Delete ${food.name}`}
                          onClick={(e) => {
                            e.stopPropagation();

                            const confirmed =
                              window.confirm(
                                `"${food.name}" löschen?`
                              );

                            if (!confirmed) return;

                            updateData({
                              meals: data.meals.filter(
                                (item) =>
                                  item.id !== food.id
                              ),
                            });
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v5" />
                            <path d="M14 11v5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ADD FOOD */}
      {showAdd && (
        <AddFood
          meal={foodMeal}
          data={data}
          updateData={updateData}
          close={() => setShowAdd(false)}
        />
      )}

      {/* EDIT FOOD */}
      {editingFood && (
        <EditFood
          food={editingFood}
          data={data}
          updateData={updateData}
          close={() => setEditingFood(null)}
        />
      )}
    </div>
  );
}

function Macro({
  label,
  value,
  goal,
  unit,
}) {
  const safeValue = Number(value || 0);
  const safeGoal = Number(goal || 0);

  const progress =
    safeGoal > 0
      ? Math.min(safeValue / safeGoal, 1)
      : 0;

  return (
    <div className="macro">
      <div className="macro-top">
        <span>{label}</span>

        <strong>
          {Math.round(safeValue)}
          {unit}
          <small>
            {" "}
            / {Math.round(safeGoal)}
            {unit}
          </small>
        </strong>
      </div>

      <div className="macro-bar">
        <div
          style={{
            width: `${progress * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================
   ADD FOOD
========================= */
function AddFood({
  meal,
  data,
  updateData,
  close,
}) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const [amount, setAmount] = useState(100);

  const [showScanner, setShowScanner] =
    useState(false);

  const [loadingProduct, setLoadingProduct] =
    useState(false);

  const [productError, setProductError] =
    useState("");

  const add = () => {
    if (!name.trim()) return;

    const portion =
      Number(amount || 100) / 100;

    const food = {
      id: Date.now(),

      date: new Date().toDateString(),

      meal,

      name,

      amount: Number(amount || 100),

      calories: Math.round(
        Number(calories || 0) * portion
      ),

      protein:
        Math.round(
          Number(protein || 0) *
            portion *
            10
        ) / 10,

      carbs:
        Math.round(
          Number(carbs || 0) *
            portion *
            10
        ) / 10,

      fat:
        Math.round(
          Number(fat || 0) *
            portion *
            10
        ) / 10,
    };

    updateData({
      meals: [
        ...data.meals,
        food,
      ],
    });

    close();
  };

  const handleBarcode = async (barcode) => {
    setShowScanner(false);

    setLoadingProduct(true);

    setProductError("");

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
      );

      const result = await response.json();

      if (
        result.status !== 1 ||
        !result.product
      ) {
        throw new Error(
          "Produkt nicht gefunden"
        );
      }

      const product = result.product;

      const nutrients =
        product.nutriments || {};

      setName(
        product.product_name_de ||
          product.product_name ||
          "Unknown product"
      );

      setCalories(
        Math.round(
          nutrients[
            "energy-kcal_100g"
          ] || 0
        )
      );

      setProtein(
        Math.round(
          (nutrients.proteins_100g || 0) *
            10
        ) / 10
      );

      setCarbs(
        Math.round(
          (nutrients.carbohydrates_100g ||
            0) *
            10
        ) / 10
      );

      setFat(
        Math.round(
          (nutrients.fat_100g || 0) *
            10
        ) / 10
      );

      // Nach dem Scannen standardmäßig
      // 100 g auswählen.
      setAmount(100);
    } catch (error) {
      console.error(error);

      setProductError(
        "Produkt wurde nicht gefunden. Du kannst die Werte manuell eingeben."
      );
    } finally {
      setLoadingProduct(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop">
        <div className="modal food-modal">
          <div className="modal-header">
            <div>
              <p className="eyebrow">
                ADD FOOD
              </p>

              <h2>{meal}</h2>
            </div>

            <button
              className="close-button"
              onClick={close}
            >
              ×
            </button>
          </div>

          <button
            className="barcode-button"
            onClick={() =>
              setShowScanner(true)
            }
          >
            📷 SCAN BARCODE
          </button>

          {loadingProduct && (
            <div className="product-loading">
              🔎 Searching product...
            </div>
          )}

          {productError && (
            <div className="product-error">
              {productError}
            </div>
          )}

          <label>
            Food name

            <input
              autoFocus
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Chicken, rice, Skyr..."
            />
          </label>

          <label>
            Amount (g / ml)

            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder="500"
            />
          </label>

          <div className="form-grid">
            <label>
              Calories / 100 g

              <input
                type="number"
                value={calories}
                onChange={(e) =>
                  setCalories(
                    e.target.value
                  )
                }
                placeholder="65"
              />
            </label>

            <label>
              Protein / 100 g

              <input
                type="number"
                value={protein}
                onChange={(e) =>
                  setProtein(
                    e.target.value
                  )
                }
                placeholder="11"
              />
            </label>

            <label>
              Carbs / 100 g

              <input
                type="number"
                value={carbs}
                onChange={(e) =>
                  setCarbs(
                    e.target.value
                  )
                }
                placeholder="4"
              />
            </label>

            <label>
              Fat / 100 g

              <input
                type="number"
                value={fat}
                onChange={(e) =>
                  setFat(e.target.value)
                }
                placeholder="0.2"
              />
            </label>
          </div>

          <p className="nutrition-note">
            Die Nährwerte oben sind pro 100 g/ml.
            Beim Speichern werden sie automatisch
            auf deine Portion umgerechnet.
          </p>

          <button
            className="primary-button"
            onClick={add}
          >
            ADD FOOD
          </button>
        </div>
      </div>

      {showScanner && (
        <BarcodeScanner
          onProductFound={handleBarcode}
          close={() =>
            setShowScanner(false)
          }
        />
      )}
    </>
  );
}

/* =========================
   PROGRESS
========================= */
function EditFood({
  food,
  data,
  updateData,
  close,
}) {
  const [name, setName] = useState(food.name);

  const [amount, setAmount] = useState(
    food.amount || 100
  );

  const [calories, setCalories] = useState(
    food.amount
      ? (food.calories / food.amount) * 100
      : food.calories
  );

  const [protein, setProtein] = useState(
    food.amount
      ? (food.protein / food.amount) * 100
      : food.protein
  );

  const [carbs, setCarbs] = useState(
    food.amount
      ? (food.carbs / food.amount) * 100
      : food.carbs
  );

  const [fat, setFat] = useState(
    food.amount
      ? (food.fat / food.amount) * 100
      : food.fat
  );

  const save = () => {
    const multiplier =
      Number(amount || 100) / 100;

    const updatedFood = {
      ...food,

      name,

      amount: Number(amount || 100),

      calories: Math.round(
        Number(calories || 0) *
          multiplier
      ),

      protein:
        Math.round(
          Number(protein || 0) *
            multiplier *
            10
        ) / 10,

      carbs:
        Math.round(
          Number(carbs || 0) *
            multiplier *
            10
        ) / 10,

      fat:
        Math.round(
          Number(fat || 0) *
            multiplier *
            10
        ) / 10,
    };

    updateData({
      meals: data.meals.map((item) =>
        item.id === food.id
          ? updatedFood
          : item
      ),
    });

    close();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal food-modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">
              EDIT FOOD
            </p>

            <h2>{food.name}</h2>
          </div>

          <button
            className="close-button"
            onClick={close}
          >
            ×
          </button>
        </div>

        <label>
          Food name

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
        </label>

        <label>
          Amount (g / ml)

          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />
        </label>

        <div className="form-grid">
          <label>
            Calories / 100 g

            <input
              type="number"
              value={calories}
              onChange={(e) =>
                setCalories(e.target.value)
              }
            />
          </label>

          <label>
            Protein / 100 g

            <input
              type="number"
              value={protein}
              onChange={(e) =>
                setProtein(e.target.value)
              }
            />
          </label>

          <label>
            Carbs / 100 g

            <input
              type="number"
              value={carbs}
              onChange={(e) =>
                setCarbs(e.target.value)
              }
            />
          </label>

          <label>
            Fat / 100 g

            <input
              type="number"
              value={fat}
              onChange={(e) =>
                setFat(e.target.value)
              }
            />
          </label>
        </div>

        <button
          className="primary-button"
          onClick={save}
        >
          SAVE CHANGES
        </button>
      </div>
    </div>
  );
}
function Progress({ data }) {
  return (
    <div className="page">
      <PageTitle
        eyebrow="PROGRESS"
        title="Your history."
        description="Every saved workout stays here."
      />

      {data.workouts.length === 0 ? (
        <div className="card">
          <h2>No workouts yet.</h2>

          <p className="muted">
            Your completed sessions will
            appear here.
          </p>
        </div>
      ) : (
        <div className="card">
          {[...data.workouts]
            .reverse()
            .map((workout) => (
              <div
                className="history-workout"
                key={workout.id}
              >
                <div>
                  <strong>
                    {workout.routineName}
                  </strong>

                  <small>
                    {new Date(
                      workout.date
                    ).toLocaleDateString(
                      "de-DE"
                    )}
                  </small>
                </div>

                <span>
                  {
                    workout.exercises.length
                  }{" "}
                  exercises
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

/* =========================
   SETTINGS
========================= */

function Settings({
  data,
  updateData,
}) {
  const update = (
    key,
    value
  ) => {
    updateData({
      profile: {
        ...data.profile,
        [key]: value,
      },
    });
  };

  return (
    <div className="page">
      <PageTitle
        eyebrow="SETTINGS"
        title="Your targets."
        description="Set the targets shown in your dashboard."
      />

<div className="card">
  <p className="eyebrow">
    WEEKLY SCHEDULE
  </p>

  <h2>Training days</h2>

  <p className="muted">
    Choose which days are training days.
    All other days become recovery days.
  </p>

  <div className="training-day-grid">
    {[
      [1, "MON", "Montag"],
      [2, "TUE", "Dienstag"],
      [3, "WED", "Mittwoch"],
      [4, "THU", "Donnerstag"],
      [5, "FRI", "Freitag"],
      [6, "SAT", "Samstag"],
      [7, "SUN", "Sonntag"],
    ].map(([day, short, full]) => {
      const active =
        data.profile.trainingDays?.includes(
          day
        );

      return (
        <button
          key={day}
          className={
            active
              ? "training-day active"
              : "training-day"
          }
          onClick={() => {
            const current =
              data.profile.trainingDays || [];

            const updated = active
              ? current.filter(
                  (item) => item !== day
                )
              : [...current, day];

            updateData({
              profile: {
                ...data.profile,
                trainingDays: updated,
              },
            });
          }}
        >
          <strong>{short}</strong>

          <span>
            {active
              ? "🏋️ Training"
              : "🛌 Rest"}
          </span>

          <small>{full}</small>
        </button>
      );
    })}
  </div>
</div>
      <div className="card">
        <div className="day-type-section">
  <p className="eyebrow">TODAY</p>

  <h3>What kind of day is it?</h3>

  <div className="day-type-buttons">
    <button
      className={
        data.profile.dayType === "training"
          ? "primary-button"
          : "secondary-button"
      }
      onClick={() =>
        update("dayType", "training")
      }
    >
      🏋️ TRAINING DAY
    </button>

    <button
      className={
        data.profile.dayType === "rest"
          ? "primary-button"
          : "secondary-button"
      }
      onClick={() =>
        update("dayType", "rest")
      }
    >
      🛌 REST DAY
    </button>
  </div>
</div>
        <label>
          Name

          <input
            value={data.profile.name}
            onChange={(e) =>
              update(
                "name",
                e.target.value
              )
            }
          />
        </label>

        <div className="form-grid">
          <label>
            Calories

            <input
              type="number"
              value={
                data.profile.calories
              }
              onChange={(e) =>
                update(
                  "calories",
                  Number(
                    e.target.value
                  )
                )
              }
            />
          </label>

          <label>
            Protein

            <input
              type="number"
              value={
                data.profile.protein
              }
              onChange={(e) =>
                update(
                  "protein",
                  Number(
                    e.target.value
                  )
                )
              }
            />
          </label>

          <label>
            Carbs

            <input
              type="number"
              value={
                data.profile.carbs
              }
              onChange={(e) =>
                update(
                  "carbs",
                  Number(
                    e.target.value
                  )
                )
              }
            />
          </label>

          <label>
            Fat

            <input
              type="number"
              value={
                data.profile.fat
              }
              onChange={(e) =>
                update(
                  "fat",
                  Number(
                    e.target.value
                  )
                )
              }
            />
          </label>
          <label>
  Water (L)

  <input
    type="number"
    step="0.1"
    min="0"
    max="20"
    value={data.profile.water}
    onChange={(e) =>
      update(
        "water",
        Number(e.target.value)
      )
    }
  />
</label>
        </div>
      </div>
    </div>
  );
}

/* =========================
   NAVIGATION
========================= */

function Navigation({
  page,
  setPage,
}) {
  return (
    <nav className="navigation">
      <Nav
        active={page === "home"}
        icon="⌂"
        label="Home"
        onClick={() =>
          setPage("home")
        }
      />

      <Nav
        active={page === "training"}
        icon="🏋️"
        label="Gym"
        onClick={() =>
          setPage("training")
        }
      />

      <Nav
        active={page === "food"}
        icon="🍗"
        label="Food"
        onClick={() =>
          setPage("food")
        }
      />

      <Nav
        active={page === "progress"}
        icon="📈"
        label="Progress"
        onClick={() =>
          setPage("progress")
        }
      />

      <Nav
        active={page === "settings"}
        icon="⚙️"
        label="Settings"
        onClick={() =>
          setPage("settings")
        }
      />
    </nav>
  );
}

function Nav({
  active,
  icon,
  label,
  onClick,
}) {
  return (
    <button
      className={
        active
          ? "nav-button active"
          : "nav-button"
      }
      onClick={onClick}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

/* =========================
   HELPERS
========================= */

function PageTitle({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="page-title">
      <p className="eyebrow">
        {eyebrow}
      </p>

      <h1>{title}</h1>

      <p className="muted">
        {description}
      </p>
    </div>
  );
}

export default App;