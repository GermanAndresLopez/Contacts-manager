export function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleDateString(
    "es-CO",
    options ?? { year: "numeric", month: "short", day: "numeric" },
  );
}
