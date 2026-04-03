// Raw API response — severity uses backend values
export interface RawRecommendation {
  id?: string
  problem: string
  impact: string
  suggestion: string
  severity: 'high' | 'medium' | 'low'
}

// Domain model — severity uses FE values
export interface Recommendation {
  id: string
  problem: string
  impact: string
  suggestion: string
  severity: 'critical' | 'warning' | 'info'
}

// Filters for the recommendation feed
export interface AlertFilters {
  severity?: Recommendation['severity']
  search?: string
  timeRange?: '5m' | '1h' | '24h'
}
