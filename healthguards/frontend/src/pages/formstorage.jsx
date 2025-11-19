export const saveStep = (stepName, data) => {
  const all = JSON.parse(localStorage.getItem("patientForm") || "{}");
  all[stepName] = data;
  localStorage.setItem("patientForm", JSON.stringify(all));
};

export const loadAll = () => {
  return JSON.parse(localStorage.getItem("patientForm") || "{}");
};

export const clearAll = () => {
  localStorage.removeItem("patientForm");
};
