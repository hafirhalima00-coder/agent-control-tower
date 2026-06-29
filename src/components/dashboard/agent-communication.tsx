'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/utils';
import { MessageSquare, Send, ArrowRight } from 'lucide-react';

interface AgentMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  type: 'request' | 'response' | 'notification' | 'error';
  timestamp: string;
}

const MOCK_MESSAGES: AgentMessage[] = [
  {
    id: '1',
    from: 'Customer Support Agent',
    to: 'CRM Agent',
    message: 'Need customer record lookup for ticket #TKT-4521. Priority: High.',
    type: 'request',
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: '2',
    from: 'CRM Agent',
    to: 'Customer Support Agent',
    message: 'Customer record retrieved. Account: Premium, 2 years, no previous complaints.',
    type: 'response',
    timestamp: new Date(Date.now() - 240000).toISOString(),
  },
  {
    id: '3',
    from: 'Sales Agent',
    to: 'Email Agent',
    message: 'Generate follow-up email for lead Acme Corp. Proposal attached.',
    type: 'request',
    timestamp: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: '4',
    from: 'Email Agent',
    to: 'Sales Agent',
    message: 'Email draft generated and queued for review. Awaiting approval.',
    type: 'response',
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: '5',
    from: 'Scheduling Agent',
    to: 'Sales Agent',
    message: 'Demo meeting scheduled for 2024-01-15 at 14:00 UTC. 3 attendees confirmed.',
    type: 'notification',
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: '6',
    from: 'WhatsApp Agent',
    to: 'Customer Support Agent',
    message: 'Escalation: Customer #CUST-789 reporting order not received. Urgent.',
    type: 'error',
    timestamp: new Date().toISOString(),
  },
];

export function AgentCommunicationView() {
  const [messages] = useState<AgentMessage[]>(MOCK_MESSAGES);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'request':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'response':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'notification':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'request':
        return <Send className="h-3 w-3" />;
      case 'response':
        return <ArrowRight className="h-3 w-3" />;
      case 'notification':
        return <MessageSquare className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="h-4 w-4" />
          Agent Communication
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-lg border p-3 ${getTypeColor(msg.type)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    {getTypeIcon(msg.type)}
                    <span>{msg.from}</span>
                    <ArrowRight className="h-3 w-3 opacity-50" />
                    <span>{msg.to}</span>
                  </div>
                  <span className="text-[10px] opacity-70">
                    {formatDate(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
