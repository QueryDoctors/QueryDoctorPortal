import { apiClient } from '@/lib/api-client'
import type {
  RawRecommendation,
  Recommendation,
} from '../types/recommendation.types'

const SEVERITY_MAP: Record<RawRecommendation['severity'], Recommendation['severity']> = {
  high: 'critical',
  medium: 'warning',
  low: 'info',
}

function stableId(raw: RawRecommendation, index: number): string {
  if (raw.id) return raw.id
  // Stable fallback: hash from content so detail panel cache lookups work correctly
  return `rec-${raw.severity}-${index}-${raw.problem.slice(0, 20).replace(/\s+/g, '-')}`
}

function mapRecommendation(raw: RawRecommendation, index: number): Recommendation {
  return {
    id: stableId(raw, index),
    problem: raw.problem,
    impact: raw.impact,
    suggestion: raw.suggestion,
    severity: SEVERITY_MAP[raw.severity],
  }
}

interface RawRecommendationsResponse {
  recommendations: RawRecommendation[]
}

export async function getRecommendations(dbId: string): Promise<Recommendation[]> {
  const data = await apiClient.get<RawRecommendationsResponse>(`/recommendations/${dbId}`)
  return data.recommendations.map(mapRecommendation)
}
