import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:8000'

export const handlers = [
  // POST /connect-db
  http.post(`${BASE}/connect-db`, () =>
    HttpResponse.json({ db_id: 'test-db-id', status: 'connected' }),
  ),

  // GET /metrics/:db_id — success
  http.get(`${BASE}/metrics/:db_id`, () =>
    HttpResponse.json({
      active_connections: 12,
      qps: 45.5,
      avg_query_time_ms: 18.3,
      total_queries: 9823,
    }),
  ),

  // GET /queries/:db_id — success
  http.get(`${BASE}/queries/:db_id`, () =>
    HttpResponse.json({
      slow_queries: [
        { query: 'SELECT * FROM orders WHERE ...', mean_time: 320.5, calls: 150, total_time: 48075, rows: 200 },
      ],
      frequent_queries: [
        { query: 'SELECT id FROM users', mean_time: 2.1, calls: 9800, total_time: 20580, rows: 1 },
      ],
      heaviest_queries: [
        { query: 'SELECT * FROM logs WHERE created_at > ...', mean_time: 120.0, calls: 500, total_time: 60000, rows: 10000 },
      ],
    }),
  ),

  // GET /recommendations/:db_id — with alerts
  http.get(`${BASE}/recommendations/:db_id`, () =>
    HttpResponse.json([
      {
        problem: 'Connection pool near limit',
        impact: 'New connections may be rejected',
        suggestion: 'Increase max_connections or use PgBouncer',
        severity: 'high',
      },
      {
        problem: 'Slow query detected',
        impact: 'High latency for users',
        suggestion: 'Add index on orders.created_at',
        severity: 'medium',
      },
    ]),
  ),

  // GET /saved-connections
  http.get(`${BASE}/saved-connections`, () =>
    HttpResponse.json({
      connections: [
        {
          id: 'conn-1',
          name: 'Local Dev',
          host: 'localhost',
          port: 5432,
          database: 'postgres',
          user: 'postgres',
          created_at: '2026-04-01T10:00:00Z',
          last_used: '2026-04-03T08:00:00Z',
        },
      ],
    }),
  ),

  // POST /saved-connections
  http.post(`${BASE}/saved-connections`, () =>
    HttpResponse.json(
      {
        id: 'conn-new',
        name: 'New Connection',
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        created_at: '2026-04-03T10:00:00Z',
        last_used: null,
      },
      { status: 201 },
    ),
  ),

  // DELETE /saved-connections/:id
  http.delete(`${BASE}/saved-connections/:id`, () =>
    new HttpResponse(null, { status: 204 }),
  ),

  // POST /snapshots/:db_id
  http.post(`${BASE}/snapshots/:db_id`, () =>
    HttpResponse.json(
      {
        id: 'snap-1',
        connection_id: 'conn-1',
        captured_at: '2026-04-03T10:00:00Z',
        active_connections: 12,
        qps: 45.5,
        avg_query_time_ms: 18.3,
        total_queries: 9823,
        queries: [],
        recommendations: [],
      },
      { status: 201 },
    ),
  ),

  // GET /snapshots
  http.get(`${BASE}/snapshots`, () =>
    HttpResponse.json({ snapshots: [] }),
  ),

  // GET /snapshots/:id
  http.get(`${BASE}/snapshots/:id`, () =>
    HttpResponse.json({
      id: 'snap-1',
      connection_id: 'conn-1',
      captured_at: '2026-04-03T10:00:00Z',
      active_connections: 12,
      qps: 45.5,
      avg_query_time_ms: 18.3,
      total_queries: 9823,
      queries: [],
      recommendations: [],
    }),
  ),
]
