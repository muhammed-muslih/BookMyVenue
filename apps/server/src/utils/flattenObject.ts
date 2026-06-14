export const flattenObject = (obj: Record<string, any>, prefix = "") => {
  const result: Record<string, any> = {};

  for (const key in obj) {
    const value = obj[key];

    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
};
