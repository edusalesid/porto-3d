export type AnalyticsEventName =
  | 'portfolio_view'
  | 'scene_ready'
  | 'fallback_activated'
  | 'room_selected'
  | 'project_opened'
  | 'case_study_viewed'
  | 'cv_downloaded'
  | 'contact_clicked'
  | 'external_link_opened'
  | 'camera_mode_changed';

export interface AnalyticsEventRecord {
  event: AnalyticsEventName;
  params?: Record<string, string | number | boolean>;
  timestamp: string;
}

const STORAGE_KEY = 'rizal_os_analytics_events';

export function trackPortfolioEvent(
  event: AnalyticsEventName,
  params?: Record<string, string | number | boolean>
): AnalyticsEventRecord {
  const record: AnalyticsEventRecord = {
    event,
    params,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const existingRaw = window.sessionStorage.getItem(STORAGE_KEY);
      const existing: AnalyticsEventRecord[] = existingRaw
        ? JSON.parse(existingRaw)
        : [];
      const next = [...existing.slice(-49), record];
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(
        new CustomEvent('rizal-os-analytics', { detail: record })
      );
    } catch {
      // Ignore storage quota or private mode restrictions
    }
  }

  return record;
}

export function getTrackedEvents(): AnalyticsEventRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
