export const DB_ID_COOKIE = 'pg_advisor_db_id'
export const AUTH_COOKIE = 'pg_advisor_authed'

const SEVEN_DAYS = 60 * 60 * 24 * 7

export function setDbIdCookie(dbId: string) {
  document.cookie = `${DB_ID_COOKIE}=${dbId}; path=/; max-age=${SEVEN_DAYS}; SameSite=Lax`
}

export function clearDbIdCookie() {
  document.cookie = `${DB_ID_COOKIE}=; path=/; max-age=0`
}

/** Non-sensitive indicator cookie — lets Next.js middleware know a session exists.
 *  The actual security is enforced by the backend JWT validation.
 */
export function setAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${SEVEN_DAYS}; SameSite=Lax`
}

export function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`
}
