export default function RoutineCard({
  routine,
  onStart,
  onEdit,
}) {
  return (
    <div className="routine-card">
      <div className="routine-number">
        {String(routine.id).padStart(2, "0")}
      </div>

      <h2>{routine.name}</h2>

      <p>
        {routine.exercises.length} exercises
      </p>

      <div className="routine-buttons">
        <button
          className="primary-button"
          onClick={onStart}
        >
          START
        </button>

        <button
          className="secondary-button"
          onClick={onEdit}
        >
          EDIT
        </button>
      </div>
    </div>
  );
}