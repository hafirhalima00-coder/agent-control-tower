'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Shield, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface TrustMetrics {
  overallTrustScore: number;
  systemIntegrity: number;
  complianceScore: number;
  riskAdjustedScore: number;
  lastAuditAt: string;
  pendingReviews: number;
  violationsThisWeek: number;
  trend: 'up' | 'down' | 'stable';
}

const MOCK_TRUST: TrustMetrics = {
  overallTrustScore: 91,
  systemIntegrity: 97,
  complianceScore: 94,
  riskAdjustedScore: 88,
  lastAuditAt: new Date(Date.now() - 3600000).toISOString(),
  pendingReviews: 3,
  violationsThisWeek: 2,
  trend: 'up',
};

function getScoreColor(score: number) {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
}

function getScoreLabel(score: number) {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Fair';
  return 'Poor';
}

export function TrustScoreVisualization() {
  const trust = MOCK_TRUST;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Trust & Compliance
          </span>
          <div className="flex items-center gap-1">
            {trust.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
            {trust.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
            <Badge variant={trust.trend === 'up' ? 'success' : trust.trend === 'down' ? 'destructive' : 'secondary'}>
              {trust.trend === 'up' ? 'Improving' : trust.trend === 'down' ? 'Declining' : 'Stable'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Main Trust Score */}
        <div className="text-center mb-6">
          <div className={cn('text-5xl font-bold', getScoreColor(trust.overallTrustScore))}>
            {trust.overallTrustScore}%
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Overall Trust Score - {getScoreLabel(trust.overallTrustScore)}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>System Integrity</span>
              <span className={cn('font-medium', getScoreColor(trust.systemIntegrity))}>
                {trust.systemIntegrity}%
              </span>
            </div>
            <Progress value={trust.systemIntegrity} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Compliance Score</span>
              <span className={cn('font-medium', getScoreColor(trust.complianceScore))}>
                {trust.complianceScore}%
              </span>
            </div>
            <Progress value={trust.complianceScore} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Risk-Adjusted Score</span>
              <span className={cn('font-medium', getScoreColor(trust.riskAdjustedScore))}>
                {trust.riskAdjustedScore}%
              </span>
            </div>
            <Progress value={trust.riskAdjustedScore} className="h-2" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{trust.pendingReviews}</p>
            <p className="text-xs text-muted-foreground">Pending Reviews</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className={cn('text-2xl font-bold', trust.violationsThisWeek > 0 ? 'text-red-600' : 'text-green-600')}>
              {trust.violationsThisWeek}
            </p>
            <p className="text-xs text-muted-foreground">Violations This Week</p>
          </div>
        </div>

        {/* Last Audit */}
        <div className="mt-4 p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-muted-foreground">Last audit:</span>
            <span>{new Date(trust.lastAuditAt).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
