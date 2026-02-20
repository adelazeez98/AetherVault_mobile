'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, BookOpen, Home, Menu, Wrench, Code, Download, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function Navbar() {
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="w-full bg-card border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Lock className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">AetherVault</h1>
        </Link>
        <div>
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-2">
                    <Link href="/" passHref onClick={() => setSheetOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg p-6">
                            <Home className="mr-4 h-5 w-5" />
                            Toolkit
                        </Button>
                    </Link>
                    <Link href="/aes-boxes" passHref onClick={() => setSheetOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg p-6">
                            <BookOpen className="mr-4 h-5 w-5" />
                            AES Constants
                        </Button>
                    </Link>
                    <Link href="/des-boxes" passHref onClick={() => setSheetOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg p-6">
                            <BookOpen className="mr-4 h-5 w-5" />
                            DES Constants
                        </Button>
                    </Link>
                    <Link href="/helper-functions" passHref onClick={() => setSheetOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg p-6">
                            <Wrench className="mr-4 h-5 w-5" />
                            Helper Functions
                        </Button>
                    </Link>
                    <Link href="/how-to-code" passHref onClick={() => setSheetOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg p-6">
                            <Code className="mr-4 h-5 w-5" />
                            How to Code
                        </Button>
                    </Link>
                    <Link href="/about" passHref onClick={() => setSheetOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg p-6">
                            <User className="mr-4 h-5 w-5" />
                            About
                        </Button>
                    </Link>
                    <a href="/aethervault-static-site.zip" download onClick={() => setSheetOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg p-6">
                            <Download className="mr-4 h-5 w-5" />
                            Download Site
                        </Button>
                    </a>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
