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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const hexRegex = /^[0-9a-fA-F]{1,2}$/;

const formSchema = z.object({
  hexValue: z.string().min(1, "Hex value is required.").regex(hexRegex, "Must be a 1 or 2-digit hex value."),
  multiplier: z.enum(["02", "03", "09", "0b", "0d", "0e"]),
});

type FormValues = z.infer<typeof formSchema>;
type Result = { success: boolean; message: string; output: string; } | null;

const multiplyInGF = (stra: string, strb: string): string => {
    let a = parseInt(stra, 16);
    let b = parseInt(strb, 16);
    let result = 0;
    for (let i = 0; i < 8; i++) {
        if ((b & 1) !== 0) {
            result ^= a;
        }
        const highBitSet = (a & 0x80) !== 0;
        a <<= 1;
        if (highBitSet) {
            a ^= 0x1B; // Irreducible polynomial for AES (x^8 + x^4 + x^3 + x + 1)
        }
        b >>= 1;
    }
    return (result & 0xFF).toString(16).toUpperCase().padStart(2, '0');
};


export function Gf28Multiplication() {
  const [result, setResult] = useState<Result>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hexValue: "",
      multiplier: "02",
    },
  });

  const { watch, handleSubmit, formState, reset } = form;
  const watchedValues = watch();

  useEffect(() => {
    if (result) setResult(null);
  }, [watchedValues.hexValue, watchedValues.multiplier]);


  function onSubmit(values: FormValues) {
    try {
      const resultHex = multiplyInGF(values.hexValue, values.multiplier);
      setResult({
        success: true,
        message: `Successfully multiplied {${values.hexValue}} by {${values.multiplier}}.`,
        output: resultHex,
      });
    } catch (e: any) {
        setResult({
            success: false,
            message: e.message || "An unexpected error occurred.",
            output: "",
        });
    }
  }

  function handleReset() {
    reset();
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
              name="hexValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hexadecimal Number (1-2 digits)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 57" {...field} className="font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="multiplier"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Multiply by</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-x-4 gap-y-2"
                    >
                      {["02", "03", "09", "0b", "0d", "0e"].map(val => (
                          <FormItem key={val} className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value={val} /></FormControl>
                            <FormLabel className="font-normal font-mono">{`{${val}}`}</FormLabel>
                          </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
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
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
