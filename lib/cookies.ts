export const DB_ID_COOKIE = 'pg_advisor_db_id'

const SEVEN_DAYS = 60 * 60 * 24 * 7

export function setDbIdCookie(dbId: string) {
  document.cookie = `${DB_ID_COOKIE}=${dbId}; path=/; max-age=${SEVEN_DAYS}; SameSite=Lax`
}

export function clearDbIdCookie() {
  document.cookie = `${DB_ID_COOKIE}=; path=/; max-age=0`
}
