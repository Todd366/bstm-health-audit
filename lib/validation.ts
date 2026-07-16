export function validateAuditPayload(body: any): boolean {
  return !!(body && body.business && body.answers);
}
