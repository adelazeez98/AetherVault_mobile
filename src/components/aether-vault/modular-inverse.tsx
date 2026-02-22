"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";


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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  number: z.coerce.number({ invalid_type_error: "Must be a number."}).int("Must be an integer."),
  modulus: z.coerce.number({ invalid_type_error: "Must be a number."}).int("Must be an integer.").optional(),
});

export function ModularInverse() {
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: undefined,
      modulus: 26,
    }
  });

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    setOutput("");
    setError("");
    try {
      const modulus = values.modulus || 26;
      const number = values.number;

      const result = modInverse(number, modulus);

      if (typeof result === 'string') {
          setError(result);
          setOutput("");
      } else {
          setOutput(String(result));
          setError("");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    }
  }

  function handleReset() {
    form.reset({ number: undefined, modulus: 26 });
    setOutput("");
    setError("");
  }


  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle>Interactive Modular Inverse</CardTitle>
        <CardDescription>Find the modular multiplicative inverse of a number 'a' such that (a * x) mod m = 1.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
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
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleReset} disabled={form.formState.isSubmitting}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)}
                Calculate
              </Button>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Result (x)</Label>
                <Input readOnly value={output} placeholder="Result will be shown here" className="font-mono bg-muted" />
              </div>
              {error && (
                <div className="space-y-2">
                    <Label className="text-destructive">Error</Label>
                    <Input readOnly value={error} placeholder="Errors will be displayed here" className="font-mono bg-muted text-destructive border-destructive/50" />
                </div>
              )}
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
