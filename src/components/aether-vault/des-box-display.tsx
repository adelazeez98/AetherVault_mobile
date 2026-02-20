
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Check, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface DesBoxDisplayProps {
  title: string;
  description: string;
  java: string;
  python: string;
  cpp: string;
  examples: {
    java: string;
    python: string;
    cpp: string;
  };
}

type Language = 'java' | 'python' | 'cpp';

export function DesBoxDisplay({ title, description, java, python, cpp, examples }: DesBoxDisplayProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Language>('java');
  const [copied, setCopied] = useState(false);

  const codeMap = { java, python, cpp };
  const exampleMap = { java: examples.java, python: examples.python, cpp: examples.cpp };


  const handleCopy = () => {
    const codeToCopy = codeMap[activeTab];
    const fullCode = activeTab === 'cpp' ? '#include <vector>\n\n' + codeToCopy : codeToCopy;
    navigator.clipboard.writeText(fullCode).then(() => {
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
                <code className="language-cpp">
                  <span className="text-muted-foreground">#include &lt;vector&gt;</span>
                  <br />
                  <br />
                  {cpp}
                </code>
              </pre>
            </TabsContent>
          </div>
        </Tabs>

        <Accordion type="single" collapsible className="w-full mt-4">
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-sm hover:no-underline">
                    <div className="flex items-center gap-2 font-semibold text-muted-foreground">
                        <Info className="h-4 w-4" />
                        Usage Example
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                        <code className={`language-${activeTab}`}>{exampleMap[activeTab]}</code>
                    </pre>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

      </CardContent>
    </Card>
  );
}
