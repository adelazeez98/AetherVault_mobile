"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Loader2, RotateCcw, Zap, Copy, ShieldCheck, ShieldAlert } from "lucide-react";


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  number: z.coerce.number({ invalid_type_error: "Must be a number."}).int("Must be an integer."),
  modulus: z.coerce.number({ invalid_type_error: "Must be a number."}).int("Must be an integer.").optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Result = { success: boolean; message: string; output: string; } | null;


export function ModularInverse() {
  const [result, setResult] = useState<Result>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: undefined,
      modulus: 26,
    }
  });

  const { watch, handleSubmit, formState, reset } = form;
  const watchedValues = watch();

  useEffect(() => {
    if (result) setResult(null);
  }, [watchedValues.number, watchedValues.modulus]);


  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };
  
  const modInverse = (a_in: number, m_in: number): number | string => {
      let a = a_in;
      let m = m_in;
      if (gcd(a, m) !== 1) {
          return `Inverse does not exist because gcd(${a}, ${m}) is not 1.`;
      }

      const m0 = m;
      let y = 0, x = 1;
      
      if (m === 1) return 0;
      
      while (a > 1) {
          const q = Math.floor(a / m);
          [a, m] = [m, a % m];
          [x, y] = [y, x - q * y];
      }

      if (x < 0) x += m0;
      
      return x;
  };

  function onSubmit(values: FormValues) {
    try {
      const modulus = values.modulus || 26;
      const number = values.number;

      const result = modInverse(number, modulus);

      if (typeof result === 'string') {
        setResult({ success: false, message: result, output: "" });
      } else {
        setResult({ success: true, message: `The inverse of ${number} mod ${modulus} is ${result}.`, output: String(result) });
      }
    } catch (e: any) {
      setResult({ success: false, message: e.message || "An unexpected error occurred.", output: "" });
    }
  }

  function handleReset() {
    reset({ number: undefined, modulus: 26 });
    setResult(null);
  }

  const handleCopy = () => {
    if (result?.output) {
      navigator.clipboard.writeText(result.output);
      toast({
        title: "Copied to clipboard!",
      });
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number (a)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 7" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="modulus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modulus (m)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 26" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center gap-2">
            <Button 
                type="submit" 
                className="w-full h-14 text-lg font-extrabold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all flex items-center justify-center gap-3"
                disabled={formState.isSubmitting}
            >
                {formState.isSubmitting ? <Loader2 className="animate-spin" /> : <Zap/>}
                Execute
            </Button>
            <Button
                type="button"
                variant="destructive"
                className="h-14 shrink-0 px-6 text-lg"
                onClick={handleReset}
                aria-label="Reset form"
            >
                <RotateCcw />
                Reset
            </Button>
        </div>

        {result && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <Alert variant={result.success ? "default" : "destructive"}>
              <div className="flex">
                  <div className="flex-shrink-0">
                  {result.success ? <ShieldCheck className="h-5 w-5 text-green-500" /> : <ShieldAlert className="h-5 w-5" />}
                  </div>
                  <div className="ml-3 w-0 flex-1">
                  <AlertTitle>{result.success ? "Processing Complete" : "Error Occurred"}</AlertTitle>
                  <AlertDescription className="mt-1">
                      {result.message}
                  </AlertDescription>
                  </div>
              </div>
            </Alert>
            
            {result.success && result.output && (
              <div className="relative p-6 bg-background rounded-lg shadow-inner border overflow-x-auto">
                  <div className="flex justify-between items-center mb-2">
                      <p className="text-xs uppercase text-muted-foreground font-bold tracking-widest">Output (x)</p>
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
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
