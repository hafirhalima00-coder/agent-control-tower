'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Timer } from 'lucide-react';
import { AuditEntry } from '@/types';

interface ReplayModeProps {
  events: AuditEntry[];
}

export function ReplayMode({ events }: ReplayModeProps) {
  const [isReplaying, setIsReplaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startReplay = useCallback(() => {
    setIsReplaying(true);
  }, []);

  const stopReplay = useCallback(() => {
    setIsReplaying(false);
    clearTimer();
  }, [clearTimer]);

  const resetReplay = useCallback(() => {
    stopReplay();
    setCurrentStep(0);
  }, [stopReplay]);

  const stepForward = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, sortedEvents.length - 1));
  }, [sortedEvents.length]);

  const stepBackward = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    if (!isReplaying) {
      clearTimer();
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= sortedEvents.length - 1) {
          setIsReplaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speed);
    return clearTimer;
  }, [isReplaying, speed, sortedEvents.length, clearTimer]);

  const currentEvent = sortedEvents[currentStep];
  const progress = sortedEvents.length > 0 ? ((currentStep + 1) / sortedEvents.length) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Timer className="h-4 w-4 text-indigo-500" />
          Mission Replay
          <Badge variant="outline" className="ml-auto text-xs">
            {currentStep + 1}/{sortedEvents.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Controls */}
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={resetReplay} title="Reset">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={stepBackward} title="Step back">
            <SkipBack className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={isReplaying ? 'secondary' : 'default'}
            size="sm"
            className="h-8 px-3"
            onClick={isReplaying ? stopReplay : startReplay}
          >
            {isReplaying ? (
              <Pause className="h-3.5 w-3.5 mr-1" />
            ) : (
              <Play className="h-3.5 w-3.5 mr-1" />
            )}
            {isReplaying ? 'Pause' : 'Replay Mission'}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={stepForward} title="Step forward">
            <SkipForward className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Speed:</span>
          {[0.5, 1, 2, 4].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded ${speed === s ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current event display */}
        <div className="min-h-[60px] rounded-lg border p-2.5 bg-muted/30">
          {currentEvent ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] px-1 py-0">
                  Step {currentStep + 1}
                </Badge>
                <Badge
                  variant={currentEvent.result === 'success' ? 'secondary' : 'destructive'}
                  className="text-[10px] px-1 py-0"
                >
                  {currentEvent.result}
                </Badge>
              </div>
              <div className="text-sm font-medium">{currentEvent.action}</div>
              <div className="text-xs text-muted-foreground">
                {currentEvent.agentName} — {new Date(currentEvent.timestamp).toLocaleTimeString()}
              </div>
              {currentEvent.decision && (
                <div className="text-xs text-muted-foreground italic">
                  &ldquo;{currentEvent.decision}&rdquo;
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground text-center py-3">
              Press Play to start replaying the execution timeline
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
