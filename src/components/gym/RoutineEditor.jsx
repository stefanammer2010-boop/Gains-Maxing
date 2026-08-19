import { useState } from "react";

export default function RoutineEditor({
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

  const saveRoutine = (
    exercises = routine.exercises
  ) => {
    const updatedRoutines =
      data.routines.map((item) =>
        item.id === routine.id
          ? {
              ...item,
              name,
              exercises,
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

    const exercise = {
      id: crypto.randomUUID(),

      name: exerciseName.trim(),

      sets: Number(sets),

      reps: Number(reps),

      weight: Number(weight),
    };

    saveRoutine([
      ...routine.exercises,
      exercise,
    ]);
  };

  const deleteExercise = (
    exerciseId
  ) => {
    const exercises =
      routine.exercises.filter(
        (exercise) =>
          exercise.id !== exerciseId
      );

    saveRoutine(exercises);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">
              EDIT WORKOUT
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
          Workout name

          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </label>

        <h3>Exercises</h3>

        {routine.exercises.map(
          (exercise) => (
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
          )
        )}

        <div className="add-exercise">
          <p className="eyebrow">
            ADD EXERCISE
          </p>

          <label>
            Exercise name

            <input
              value={exerciseName}
              onChange={(event) =>
                setExerciseName(
                  event.target.value
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
                min="1"
                value={sets}
                onChange={(event) =>
                  setSets(
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              Target reps

              <input
                type="number"
                min="1"
                value={reps}
                onChange={(event) =>
                  setReps(
                    event.target.value
                  )
                }
              />
            </label>
          </div>

          <label>
            Starting weight

            <input
              type="number"
              min="0"
              step="0.5"
              value={weight}
              onChange={(event) =>
                setWeight(
                  event.target.value
                )
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
          onClick={() =>
            saveRoutine()
          }
        >
          SAVE WORKOUT
        </button>
      </div>
    </div>
  );
}