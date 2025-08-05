export function getPaginationParams(url: string) {
  const { searchParams } = new URL(url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  return { page, limit };
}
