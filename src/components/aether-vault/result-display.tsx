'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type ResultDisplayProps = {
  result: string;
  status: 'success' | 'error';
  metadata?: Record<string, any>;
};

export function ResultDisplay({ result, status, metadata }: ResultDisplayProps) {
  return (
    <Card className="w-full animate-in fade-in-0 duration-500">
      <CardHeader>
        <div className="flex items-center gap-3">
            {status === 'success' ? <CheckCircle className="text-green-500" /> : <XCircle className="text-destructive" />}
            <CardTitle>{status === 'success' ? 'Operation Successful' : 'Error'}</CardTitle>
        </div>
        <CardDescription>
            {status === 'success' ? 'Your text has been processed.' : 'An error occurred during the operation.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-md bg-background/50">
            <p className="break-words font-mono text-sm text-foreground">{result}</p>
        </div>
        {metadata && Object.keys(metadata).length > 0 && (
          <Accordion type="single" collapsible className="w-full mt-4">
            <AccordionItem value="item-1">
              <AccordionTrigger>View Metadata</AccordionTrigger>
              <AccordionContent>
                <pre className="p-4 rounded-md bg-background/50 text-xs overflow-auto">
                  {JSON.stringify(metadata, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
