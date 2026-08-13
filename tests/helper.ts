export function getTestCaseId(index: number, firstCaseNumber: number = 1): string {
  return `TC-AUTH-${String(index + firstCaseNumber).padStart(3, '0')}`;
}
