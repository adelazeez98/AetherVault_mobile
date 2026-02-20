
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HelperFunctionDisplayProps {
  title: string;
  description: string;
  java: string;
  python: string;
  cpp: string;
}

type Language = 'java' | 'python' | 'cpp';

export function HelperFunctionDisplay({ title, description, java, python, cpp }: HelperFunctionDisplayProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Language>('java');
  const [copied, setCopied] = useState(false);

  const codeMap = { java, python, cpp };

  const handleCopy = () => {
    const codeToCopy = codeMap[activeTab];
    navigator.clipboard.writeText(codeToCopy).then(() => {
      setCopied(true);
      toast({ title: 'Copied to clipboard!' });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Language)} className="w-full">
          <div className="flex justify-between items-center mb-2">
            <TabsList>
              <TabsTrigger value="java">Java</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="cpp">C++</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy code">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="relative">
            <TabsContent value="java">
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto"><code className="language-java">{java}</code></pre>
            </TabsContent>
            <TabsContent value="python">
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto"><code className="language-python">{python}</code></pre>
            </TabsContent>
            <TabsContent value="cpp">
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                <code className="language-cpp">{cpp}</code>
              </pre>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
