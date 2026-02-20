'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock, Unlock, ShieldCheck, ShieldAlert, Zap, Layers, Grid3x3, Copy } from 'lucide-react';
import { processCipher, CipherResponse } from '@/lib/cipher-actions';
import { DESVisualizer } from './des-visualizer';
import { AESVisualizer } from './aes-visualizer';
import { useToast } from "@/hooks/use-toast";

interface CipherFormProps {
  type: string;
  name: string;
  description: string;
}

type CipherInputs = Record<string, Record<string, string>>;

export function CipherForm({ type, name, description }: CipherFormProps) {
  const [result, setResult] = useState<CipherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cipherInputs, setCipherInputs] = useState<CipherInputs>({});
  const [showVisualizer, setShowVisualizer] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setResult(null);
    setShowVisualizer(false);
  }, [type]);

  useEffect(() => {
    if (result && resultRef.current && !showVisualizer) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result, showVisualizer]);

  useEffect(() => {
    if (showVisualizer && visualizerRef.current) {
      visualizerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showVisualizer]);

  const handleCopy = () => {
    if (result?.output) {
      navigator.clipboard.writeText(result.output);
      toast({
        title: "Copied to clipboard!",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCipherInputs(prev => ({
      ...prev,
      [type]: {
        ...(prev[type] || {}),
        [name]: value
      }
    }));
  };

  const getInputValue = (fieldName: string, defaultValue: string = '') => {
    return cipherInputs[type]?.[fieldName] ?? defaultValue;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await processCipher(formData);
    setResult(res);
    setIsLoading(false);
  }

  const isModern = type === 'aes128' || type === 'des';
  const isAdfgvx = type === 'adfgvx';
  const targetLength = type === 'aes128' ? 32 : (type === 'des' ? 16 : 0);
  const currentText = getInputValue('text');
  const currentAction = getInputValue('action', 'encrypt');

  if (showVisualizer && type === 'des') {
    return (
      <div ref={visualizerRef}>
        <DESVisualizer 
          text={currentText} 
          cipherKey={getInputValue('key')} 
          action={currentAction as 'encrypt' | 'decrypt'} 
          onBack={() => setShowVisualizer(false)}
        />
      </div>
    );
  }

  if (showVisualizer && type === 'aes128') {
    return (
      <div ref={visualizerRef}>
        <AESVisualizer 
          text={currentText} 
          cipherKey={getInputValue('key')}
          action={currentAction.startsWith('encrypt') ? 'encrypt' : 'decrypt'}
          onBack={() => setShowVisualizer(false)}
        />
      </div>
    );
  }

  const renderAdfgvxMatrix = () => {
    if (!result?.metadata?.fullSquare) return null;
    const matrix = result.metadata.fullSquare.split('');
    const headers = "ADFGVX".split('');

    return (
      <div className="mt-4 p-4 bg-secondary/20 border rounded-lg animate-in fade-in duration-700">
        <div className="flex items-center gap-2 mb-3">
          <Grid3x3 className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Final 6x6 Matrix Used</span>
        </div>
        <div className="grid grid-cols-7 gap-1 max-w-[300px] mx-auto text-center font-mono">
          <div className="bg-transparent"></div>
          {headers.map(h => (
            <div key={h} className="bg-accent/10 text-accent font-black p-1 rounded text-sm">{h}</div>
          ))}
          {headers.map((h, r) => (
            <React.Fragment key={h}>
              <div className="bg-accent/10 text-accent font-black p-1 rounded text-sm flex items-center justify-center">{h}</div>
              {matrix.slice(r * 6, (r + 1) * 6).map((char, c) => (
                <div key={c} className="bg-background border p-1 rounded text-sm font-bold shadow-sm">{char}</div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 text-center italic">
          The matrix was completed using the remaining characters from A-Z and 0-9.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-lg">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-2xl font-headline text-primary">{name}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="type" value={type} />
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="text" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Input {isModern ? 'Hex ' : ''}Text
                </Label>
                {isModern && (
                  <span className={`text-xs font-mono ${currentText.length !== targetLength ? 'text-destructive' : 'text-green-600'}`}>
                    {currentText.length} / {targetLength}
                  </span>
                )}
              </div>
              <div className="relative">
                <Textarea
                  id="text"
                  name="text"
                  value={currentText}
                  onChange={handleInputChange}
                  placeholder={isModern ? `Enter exactly ${targetLength} hex characters...` : "Enter message..."}
                  className={`min-h-[120px] bg-background border-2 focus:ring-accent ${isModern ? 'font-mono' : ''}`}
                  required
                  maxLength={isModern ? targetLength : undefined}
                />
                {isModern && (
                  <p className="text-[10px] text-muted-foreground mt-1 italic">
                    * For {name}, input must be a hexadecimal string of exactly {targetLength} characters.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Cipher Parameters
              </Label>
              <div className="p-4 bg-background rounded-lg border">
                {renderSpecificInputs(type, getInputValue, handleInputChange)}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Select Operation
              </Label>
              {isAdfgvx ? (
                <RadioGroup 
                    defaultValue="encrypt-no-padding" 
                    name="action" 
                    className="grid grid-cols-1 md:grid-cols-3 gap-2"
                    value={getInputValue('action', 'encrypt-no-padding')}
                    onValueChange={(val) => {
                      handleInputChange({ target: { name: 'action', value: val } } as any);
                    }}
                  >
                    <div className="flex items-center space-x-2 bg-background p-3 rounded-md border-2 cursor-pointer hover:border-accent transition-colors">
                      <RadioGroupItem value="encrypt-no-padding" id="encrypt-no-padding" />
                      <Label htmlFor="encrypt-no-padding" className="flex-1 cursor-pointer flex items-center gap-2 font-semibold">
                        <Lock className="w-4 h-4 text-primary" /> Encrypt (No Padding)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-background p-3 rounded-md border-2 cursor-pointer hover:border-accent transition-colors">
                      <RadioGroupItem value="encrypt-with-padding" id="encrypt-with-padding" />
                      <Label htmlFor="encrypt-with-padding" className="flex-1 cursor-pointer flex items-center gap-2 font-semibold">
                        <Lock className="w-4 h-4 text-primary" /> Encrypt (Pad)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-background p-3 rounded-md border-2 cursor-pointer hover:border-accent transition-colors">
                      <RadioGroupItem value="decrypt" id="decrypt" />
                      <Label htmlFor="decrypt" className="flex-1 cursor-pointer flex items-center gap-2 font-semibold">
                        <Unlock className="w-4 h-4 text-primary" /> Decrypt
                      </Label>
                    </div>
                  </RadioGroup>
              ) : (
                <RadioGroup 
                  defaultValue="encrypt" 
                  name="action" 
                  className="grid grid-cols-2 gap-4"
                  value={currentAction}
                  onValueChange={(val) => {
                    handleInputChange({ target: { name: 'action', value: val } } as any);
                  }}
                >
                  <div className="flex items-center space-x-2 bg-background p-3 rounded-md border-2 cursor-pointer hover:border-accent transition-colors">
                    <RadioGroupItem value="encrypt" id="encrypt" />
                    <Label htmlFor="encrypt" className="flex-1 cursor-pointer flex items-center gap-2 font-semibold">
                      <Lock className="w-4 h-4 text-primary" /> Encrypt
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-background p-3 rounded-md border-2 cursor-pointer hover:border-accent transition-colors">
                    <RadioGroupItem value="decrypt" id="decrypt" />
                    <Label htmlFor="decrypt" className="flex-1 cursor-pointer flex items-center gap-2 font-semibold">
                      <Unlock className="w-4 h-4 text-primary" /> Decrypt
                    </Label>
                  </div>
                </RadioGroup>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-extrabold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all flex items-center justify-center gap-3"
              disabled={isLoading}
            >
              {isLoading ? <Zap className="animate-spin" /> : "Execute Algorithm"}
            </Button>
          </form>

          {result && (
            <div ref={resultRef} className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <Alert variant={result.success ? "default" : "destructive"} className={result.success ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : ""}>
                <div className="flex items-center gap-2">
                  {result.success ? <ShieldCheck className="w-5 h-5 text-green-600" /> : <ShieldAlert className="w-5 h-5" />}
                  <AlertTitle className={result.success ? "text-green-800 dark:text-green-100 font-bold" : "font-bold"}>
                    {result.success ? "Processing Complete" : "Error Occurred"}
                  </AlertTitle>
                </div>
                <AlertDescription className={result.success ? "text-green-700 dark:text-green-300" : ""}>
                  {result.message}
                </AlertDescription>
              </Alert>
              
              {result.success && result.output && (
                <div className="space-y-4">
                  <div className="relative p-6 bg-background rounded-lg shadow-inner border overflow-x-auto">
                      <div className="flex justify-between items-center mb-2">
                          <p className="text-xs uppercase text-muted-foreground font-bold tracking-widest">Output</p>
                          <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                              onClick={handleCopy}
                              aria-label="Copy output"
                          >
                              <Copy className="w-4 h-4" />
                          </Button>
                      </div>
                      <code className="text-lg font-mono break-all text-foreground selection:bg-accent selection:text-accent-foreground">
                          {result.output}
                      </code>
                  </div>

                  {type === 'adfgvx' && renderAdfgvxMatrix()}

                  {(type === 'des' || type === 'aes128') && (
                    <Button 
                      variant="outline" 
                      className="w-full h-12 border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all gap-2"
                      onClick={() => setShowVisualizer(true)}
                    >
                      <Layers className="w-4 h-4" /> View Detailed Step-by-Step Logic
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function renderSpecificInputs(
  type: string, 
  getVal: (f: string, d?: string) => string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
) {
  switch (type) {
    case 'additive':
    case 'multiplicative':
      return (
        <div className="flex flex-col gap-2">
          <Label htmlFor="key" className="text-xs">Numeric Shift Key</Label>
          <Input 
            id="key" 
            type="number" 
            name="key" 
            value={getVal('key')} 
            onChange={onChange}
            placeholder="Enter number between 0-25" 
            min="0"
            max="25"
            required 
            className="bg-background" 
          />
        </div>
      );
    case 'affine':
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="keyA" className="text-xs">Key A (Coprime to 26)</Label>
            <Input 
              id="keyA" 
              type="number" 
              name="keyA" 
              value={getVal('keyA')} 
              onChange={onChange}
              placeholder="0-25" 
              min="0"
              max="25"
              required 
              className="bg-background" 
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="keyB" className="text-xs">Key B (Shift)</Label>
            <Input 
              id="keyB" 
              type="number" 
              name="keyB" 
              value={getVal('keyB')} 
              onChange={onChange}
              placeholder="0-25" 
              min="0"
              max="25"
              required 
              className="bg-background" 
            />
          </div>
        </div>
      );
    case 'vigenere':
    case 'autokey':
      return (
        <div className="flex flex-col gap-2">
          <Label htmlFor="key" className="text-xs">Secret Keyword / Key String</Label>
          <Input 
            id="key" 
            type="text" 
            name="key" 
            value={getVal('key')} 
            onChange={onChange}
            placeholder="Enter text key (letters only)..." 
            pattern="[a-zA-Z]+"
            title="Key must only contain letters."
            required 
            className="bg-background" 
          />
        </div>
      );
    case 'playfair':
      return (
        <div className="flex flex-col gap-2">
          <Label htmlFor="key" className="text-xs">Secret Keyword / Key String</Label>
          <Input 
            id="key" 
            type="text" 
            name="key" 
            value={getVal('key')} 
            onChange={onChange}
            placeholder="Enter text key (letters only)..." 
            pattern="[a-zA-Z]*"
            title="Key must only contain letters."
            required 
            className="bg-background" 
          />
        </div>
      );
    case 'aes128':
      return (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="key" className="text-xs">AES-128 Hex Key (32 chars)</Label>
            <span className={`text-[10px] font-mono ${getVal('key').length !== 32 ? 'text-destructive' : 'text-green-600'}`}>{getVal('key').length}/32</span>
          </div>
          <Input 
            id="key" 
            type="text" 
            name="key" 
            value={getVal('key')} 
            onChange={onChange}
            placeholder="e.g. 0123456789abcdef..." 
            required 
            maxLength={32}
            className="bg-background font-mono" 
          />
        </div>
      );
    case 'des':
      return (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="key" className="text-xs">DES Hex Key (16 chars)</Label>
            <span className={`text-[10px] font-mono ${getVal('key').length !== 16 ? 'text-destructive' : 'text-green-600'}`}>{getVal('key').length}/16</span>
          </div>
          <Input 
            id="key" 
            type="text" 
            name="key" 
            value={getVal('key')} 
            onChange={onChange}
            placeholder="e.g. 0123456789abcdef" 
            required 
            maxLength={16}
            className="bg-background font-mono" 
          />
        </div>
      );
    case 'hill': {
      const matrixSize = parseInt(getVal('matrixSize', '2'), 10) || 2;
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Matrix Size (n x n)</Label>
            <Input 
              type="number" 
              name="matrixSize" 
              value={getVal('matrixSize', '2')} 
              onChange={onChange} 
              min="2" 
              max="5" 
              className="bg-background w-24" 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Mode</Label>
            <RadioGroup 
              name="hillMode" 
              value={getVal('hillMode', 'standard')} 
              onValueChange={val => onChange({ target: { name: 'hillMode', value: val } } as any)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="hill-std" />
                <Label htmlFor="hill-std">Standard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="book" id="hill-book" />
                <Label htmlFor="hill-book">As in Book</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">{matrixSize}x{matrixSize} Matrix Keys (numbers 0-25)</Label>
            <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${matrixSize}, minmax(0, 1fr))` }}>
              {Array.from({ length: matrixSize * matrixSize }).map((_, i) => {
                const row = Math.floor(i / matrixSize);
                const col = i % matrixSize;
                const name = `m-${row}-${col}`;
                return (
                  <Input 
                    key={name}
                    type="number" 
                    name={name} 
                    value={getVal(name, '')} 
                    onChange={onChange} 
                    placeholder={`K${row+1}${col+1}`} 
                    required 
                    className="bg-background text-center" 
                    min="0"
                    max="25"
                  />
                )
              })}
            </div>
          </div>
        </div>
      );
    }
    case 'adfgvx':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="square" className="text-xs">36 Char Square (Optional)</Label>
            <Input 
              id="square" 
              type="text" 
              name="square" 
              value={getVal('square')} 
              onChange={onChange}
              placeholder="Default: A-Z, 0-9" 
              maxLength={36} 
              pattern="[a-zA-Z0-9]*"
              title="Square must only contain letters and numbers."
              className="bg-background font-mono" 
            />
            <p className="text-[9px] text-muted-foreground italic leading-tight">If partial or empty, it will be completed with remaining A-Z0-9.</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="transKey" className="text-xs">Transposition Key</Label>
            <Input 
              id="transKey" 
              type="text" 
              name="transKey" 
              value={getVal('transKey')} 
              onChange={onChange}
              placeholder="e.g. GERMAN" 
              required 
              className="bg-background" 
            />
          </div>
        </div>
      );
    default:
      return <p className="text-sm text-muted-foreground">No specific settings required.</p>;
  }
}
