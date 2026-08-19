export function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  return [
    hours,
    minutes,
    seconds,
  ]
    .map((value) =>
      String(value).padStart(2, "0")
    )
    .join(":");
}

export function calculateVolume(sets) {
  return sets.reduce(
    (total, set) => {
      const weight = Number(set.weight || 0);
      const reps = Number(set.reps || 0);

      return total + weight * reps;
    },
    0
  );
}

export function findPreviousWorkout(
  workouts,
  routineId
) {
  return [...workouts]
    .reverse()
    .find(
      (workout) =>
        workout.routineId === routineId
    );
}

export function getPreviousExercise(
  workout,
  exerciseId
) {
  return workout?.exercises?.find(
    (exercise) =>
      exercise.exerciseId === exerciseId
  );
}