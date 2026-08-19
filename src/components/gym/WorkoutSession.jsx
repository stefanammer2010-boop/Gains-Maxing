import { useState } from "react";

import WorkoutTimer from "./WorkoutTimer";

import {
  findPreviousWorkout,
  getPreviousExercise,
  calculateVolume,
} from "../../utils/workout";

export default function WorkoutSession({
  data,
  updateData,
  routine,
  goBack,
}) {
  const startedAt = useState(
    () => Date.now()
  )[0];

  const previousWorkout =
    findPreviousWorkout(
      data.workouts,
      routine.id
    );

  const [sets, setSets] = useState(() =>
    routine.exercises.map(
      (exercise) =>
        Array.from(
          {
            length: exercise.sets,
          },
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
    field,
    value
  ) => {
    setSets((current) => {
      const copy =
        structuredClone(current);

      copy[exerciseIndex][setIndex][
        field
      ] = value;

      return copy;
    });
  };

  const saveWorkout = () => {
    const finishedAt = Date.now();

    const duration = Math.floor(
      (finishedAt - startedAt) / 1000
    );

    const exercises =
      routine.exercises.map(
        (exercise, index) => ({
          exerciseId: exercise.id,

          name: exercise.name,

          sets: sets[index],
        })
      );

    const workout = {
      id: crypto.randomUUID(),

      routineId: routine.id,

      routineName: routine.name,

      date: new Date().toISOString(),

      startedAt,

      finishedAt,

      duration,

      exercises,
    };

    updateData({
      workouts: [
        ...data.workouts,
        workout,
      ],
    });

    alert(
      `Workout gespeichert 🔥\n\nDauer: ${Math.floor(
        duration / 60
      )} Minuten`
    );

    goBack();
  };

  return (
    <div className="page">
      <button
        className="back-button"
        onClick={goBack}
      >
        ← WORKOUTS
      </button>

      <div className="workout-header">
        <div>
          <p className="eyebrow">
            LIVE SESSION
          </p>

          <h1>{routine.name}</h1>
        </div>

        <WorkoutTimer
          startedAt={startedAt}
        />
      </div>

      {routine.exercises.length ===
      0 ? (
        <div className="card">
          <h2>
            No exercises yet.
          </h2>

          <p className="muted">
            Add exercises before
            starting this workout.
          </p>
        </div>
      ) : (
        <>
          {routine.exercises.map(
            (
              exercise,
              exerciseIndex
            ) => {
              const previousExercise =
                getPreviousExercise(
                  previousWorkout,
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
                        Target:{" "}
                        {exercise.reps} reps
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
                                  ?.weight ||
                                exercise.weight ||
                                "kg"
                              }
                              value={
                                currentSet.weight
                              }
                              onChange={(
                                event
                              ) =>
                                updateSet(
                                  exerciseIndex,
                                  setIndex,
                                  "weight",
                                  event.target
                                    .value
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
                                  ?.reps ||
                                exercise.reps
                              }
                              value={
                                currentSet.reps
                              }
                              onChange={(
                                event
                              ) =>
                                updateSet(
                                  exerciseIndex,
                                  setIndex,
                                  "reps",
                                  event.target
                                    .value
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

                  <div className="previous-volume">
                    Previous volume:{" "}
                    {previousExercise
                      ? calculateVolume(
                          previousExercise.sets
                        ).toLocaleString()
                      : "—"}{" "}
                    kg
                  </div>
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