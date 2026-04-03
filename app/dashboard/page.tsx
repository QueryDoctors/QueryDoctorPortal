import { redirect } from 'next/navigation'

// /dashboard without a db_id → send back to connect
export default function DashboardIndexPage() {
  redirect('/connect')
}
