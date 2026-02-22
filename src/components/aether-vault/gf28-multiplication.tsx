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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const hexRegex = /^[0-9a-fA-F]{1,2}$/;

const formSchema = z.object({
  hexValue: z.string().min(1, "Hex value is required.").regex(hexRegex, "Must be a 1 or 2-digit hex value."),
  multiplier: z.enum(["02", "03", "09", "0b", "0d", "0e"]),
});

// This function implements multiplication in the Galois Field GF(2^8)
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
  const [output, setOutput] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hexValue: "",
      multiplier: "02",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setOutput("");
    const resultHex = multiplyInGF(values.hexValue, values.multiplier);
    setOutput(resultHex);
  }

  function handleReset() {
    form.reset();
    setOutput("");
  }

  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle>Interactive Multiplication in GF(2^8)</CardTitle>
        <CardDescription>Perform multiplication in the Galois Field used in AES MixColumns.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
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
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="02" /></FormControl>
                            <FormLabel className="font-normal font-mono">{'{02}'}</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="03" /></FormControl>
                            <FormLabel className="font-normal font-mono">{'{03}'}</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="09" /></FormControl>
                            <FormLabel className="font-normal font-mono">{'{09}'}</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="0b" /></FormControl>
                            <FormLabel className="font-normal font-mono">{'{0b}'}</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="0d" /></FormControl>
                            <FormLabel className="font-normal font-mono">{'{0d}'}</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="0e" /></FormControl>
                            <FormLabel className="font-normal font-mono">{'{0e}'}</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
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
                <Label>Result</Label>
                <Input readOnly value={output} placeholder="Result will be shown here" className="font-mono bg-muted" />
              </div>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
