export enum AnomalySeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum AnomalyStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
}

export enum DetectionMethod {
  Z_SCORE = 'z_score',
  RATE_OF_CHANGE = 'rate_of_change',
  SUSTAINED = 'sustained',
}
