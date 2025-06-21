export const gender = { L: "L", P: "P" };

export const religion = {
  islam: "Islam",
  kristen: "Kristen",
  katolik: "Katolik",
  hinduBudha: "Hindu/Budha",
  konghucu: "Konghucu",
};

export const role = {
  admin: "admin",
  teacher: "teacher",
  parent: "parent",
};

export const classroomTypes = {
  class: "class",
  lab: "lab",
};

export const eventTypes = {
  class: "class",
  school: "school",
};

export const financeTypes = {
  income: "income",
  expense: "expense",
};

export function dateToString(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Januari = 0
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function stringToDate(str) {
  const [day, month, year] = str.split("-").map(Number);
  return new Date(year, month - 1, day); // Bulan dimulai dari 0
}
