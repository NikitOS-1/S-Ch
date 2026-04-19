export function getRtkQueryErrorMessage(error: unknown): string | null {
  if (typeof error !== "object" || error === null) {
    return null;
  }
  if ("data" in error) {
    const data = (error as { data: unknown }).data;
    if (
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
    ) {
      return (data as { error: string }).error;
    }
  }
  if ("status" in error && typeof (error as { status: unknown }).status === "number") {
    return `Request failed with status ${(error as { status: number }).status}`;
  }
  return null;
}
