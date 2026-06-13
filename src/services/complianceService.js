export function calculateCompliance(requirements) {
  const passed = requirements.filter((item) => item.status === "Pass").length;
  return Math.round((passed / requirements.length) * 100);
}
