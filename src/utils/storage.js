const STORAGE_KEY = "max-gains";

export function loadData(defaultData) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultData;
    }

    const parsed = JSON.parse(saved);

    return {
      ...defaultData,
      ...parsed,
    };
  } catch (error) {
    console.error(
      "Could not load MAX GAINS data:",
      error
    );

    return defaultData;
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error(
      "Could not save MAX GAINS data:",
      error
    );
  }
}