'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, Play, Pause, CheckCircle, Ban, Zap, Eye } from 'lucide-react';

interface RogueStage {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  badgeVariant: 'destructive' | 'secondary' | 'outline' | 'warning';
}

const stages: RogueStage[] = [
  {
    id: 0,
    title: 'Rogue Detected',
    description: 'Sales Agent attempting bulk refund of $12,500 — exceeds $500 limit by 25x. Confidence: 34%. Policy FIN-004 violated.',
    icon: <AlertTriangle className="h-5 w-5" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
    badgeVariant: 'destructive',
  },
  {
    id: 1,
    title: 'Tower Alert Triggered',
    description: 'Permission violation alert generated. Action blocked by boundary enforcement. Agent flagged for review.',
    icon: <Shield className="h-5 w-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
    badgeVariant: 'warning',
  },
  {
    id: 2,
    title: 'Human Intervention',
    description: 'Kill switch activated. Agent paused by admin@company.com. All pending actions cancelled. Audit entry created.',
    icon: <Ban className="h-5 w-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    badgeVariant: 'secondary',
  },
  {
    id: 3,
    title: 'Contained',
    description: 'Agent fully contained. Trust score dropped from 87% to 23%. Recovery plan: manual review, boundary restriction, re-enable with approval flow.',
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    badgeVariant: 'outline',
  },
];

export function RogueAgentDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);

  const startScenario = () => {
    setIsRunning(true);
    setCurrentStage(0);
    setIsComplete(false);
    
    let stage = 0;
    const advanceStage = () => {
      stage++;
      if (stage < stages.length) {
        setCurrentStage(stage);
        setTimeout(advanceStage, 2500);
      } else {
        setIsComplete(true);
        setIsRunning(false);
      }
    };
    setTimeout(advanceStage, 2500);
  };

  const reset = () => {
    setIsRunning(false);
    setCurrentStage(-1);
    setIsComplete(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          Rogue Agent Containment Demo
          {!isRunning && currentStage === -1 && (
            <Badge variant="outline" className="ml-auto text-xs">Ready</Badge>
          )}
          {isRunning && (
            <Badge variant="destructive" className="ml-auto text-xs animate-pulse">Simulating</Badge>
          )}
          {isComplete && (
            <Badge variant="secondary" className="ml-auto text-xs text-green-600">Contained</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stage progress */}
        <div className="flex items-center gap-1">
          {stages.map((stage, i) => (
            <div key={stage.id} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full h-1.5 rounded-full transition-all duration-500 ${
                i <= currentStage ? 'bg-red-500' : 'bg-muted'
              }`} />
            </div>
          ))}
        </div>

        {/* Current stage */}
        <div className="min-h-[120px]">
          {currentStage === -1 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Click &ldquo;Trigger Rogue Agent&rdquo; to see how the tower catches and contains a misbehaving agent.</p>
            </div>
          ) : (
            <div className={`rounded-lg border p-4 space-y-2 transition-all duration-500 ${stages[currentStage].bgColor}`}>
              <div className="flex items-center gap-2">
                <span className={stages[currentStage].color}>
                  {stages[currentStage].icon}
                </span>
                <span className="font-medium text-sm">{stages[currentStage].title}</span>
                <Badge variant={stages[currentStage].badgeVariant} className="ml-auto text-[10px]">
                  Stage {currentStage + 1}/4
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{stages[currentStage].description}</p>
              
              {currentStage === 2 && (
                <div className="pt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <Ban className="h-3 w-3 text-blue-500" />
                    <span className="font-medium">Kill switch activated</span>
                  </div>
                  <Progress value={100} className="h-1 bg-blue-200" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!isRunning && currentStage === -1 && (
            <Button onClick={startScenario} className="flex-1" variant="destructive">
              <Play className="h-4 w-4 mr-2" />
              Trigger Rogue Agent
            </Button>
          )}
          {isRunning && (
            <Button disabled className="flex-1">
              <Pause className="h-4 w-4 mr-2" />
              Simulating...
            </Button>
          )}
          {isComplete && (
            <Button onClick={reset} className="flex-1" variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Run Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}