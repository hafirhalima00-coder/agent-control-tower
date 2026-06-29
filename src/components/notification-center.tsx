'use client';

import { useEffect, useState, useCallback } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { formatDate, getSeverityColor } from '@/lib/utils';
import { Alert } from '@/types';

export function NotificationCenter() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [open, setOpen] = useState(false);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts?acknowledged=false&limit=20');
      const data = await res.json();
      if (data.success) {
        setAlerts(data.data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const acknowledgeAlert = async (id: string) => {
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          acknowledged: true,
          acknowledgedBy: 'admin@company.com',
        }),
      });
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {alerts.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {alerts.length > 99 ? '99+' : alerts.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b p-3">
          <h4 className="font-medium">Notifications</h4>
          <p className="text-xs text-muted-foreground">
            {alerts.length} unread notification{alerts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <ScrollArea className="h-80">
          {alerts.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          ) : (
            <div className="divide-y">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors"
                >
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(alert.createdAt)}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1 py-0 ${getSeverityColor(alert.severity)} text-white`}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    onClick={() => acknowledgeAlert(alert.id)}
                    aria-label={`Acknowledge ${alert.title}`}
                  >
                    <CheckCircle className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
