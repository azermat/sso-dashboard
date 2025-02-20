'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AddSSOModal } from '@/components/add-sso-modal';
import { DeleteSSODialog } from '@/components/delete-sso-dialog';

import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import type { SSOApp } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { LogIn, Plus, Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<SSOApp | null>(null);
  const [apps, setApps] = useState<SSOApp[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'ssoApps'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps: SSOApp[] = [];
      snapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() } as SSOApp);
      });
      setApps(apps);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  //generated by AI, please test and improve the solution
  const handleLogin = async (app: SSOApp) => {
    if (!app.url || !app.clientId || !app.clientSecret) {
      toast({
        title: 'Fehler!',
        description: 'Keine gültigen Login-Daten gefunden.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // window is not a good practice, its best to replace it with solid logic
      const loginWindow = window.open(app.url, '_blank');

      if (!loginWindow) {
        toast({
          title: 'Popup blockiert!',
          description:
            'Erlaube Popups für diese Seite, um automatisch anzumelden.',
          variant: 'destructive',
        });
        return;
      }

      // Wait for the new tab to load before injecting script
      const interval = setInterval(() => {
        if (!loginWindow || loginWindow.closed) {
          clearInterval(interval);
          return;
        }

        try {
          const doc = loginWindow.document;

          const emailInput = doc.querySelector(
            'input[type="email"], input[name="email"], input[name="username"]'
          ) as HTMLInputElement | null;
          const passwordInput = doc.querySelector(
            'input[type="password"], input[name="password"]'
          ) as HTMLInputElement | null;
          const submitButton = doc.querySelector(
            'button[type="submit"], input[type="submit"]'
          ) as HTMLButtonElement | null;

          if (emailInput && passwordInput && submitButton) {
            emailInput.value = app.clientId;
            passwordInput.value = app.clientSecret;

            // Trigger input events to ensure auto-filled values are detected
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

            // Click the login button
            submitButton.click();

            clearInterval(interval);
          }
        } catch (error) {
          console.error('Fehler beim automatischen Login:', error);
        }
      }, 1000); // Check every second until inputs are found

      toast({
        title: 'Automatisches Login gestartet!',
        description: `Du wirst automatisch in ${app.name} angemeldet.`,
      });
    } catch (error) {
      toast({
        title: 'Fehler!',
        description: 'Automatisches Login fehlgeschlagen.',
        variant: 'destructive',
      });
      console.error('Login Error:', error);
    }
  };

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>SSO Super Dashboard</h1>
          <p className='text-muted-foreground mt-1'>
            Hier hast du den Überblick!
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Hinzufügen
        </Button>
      </div>

      {loading ? (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3].map((i) => (
            <Card key={i} className='animate-pulse'>
              <CardHeader className='h-20 bg-muted rounded-t-lg' />
              <CardContent className='p-4'>
                <div className='h-4 bg-muted rounded w-3/4 mb-4' />
                <div className='h-4 bg-muted rounded w-1/2' />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'
        >
          {apps.map((app) => (
            <motion.div key={app.id} variants={itemVariants}>
              <Card className='group hover:shadow-lg transition-all'>
                <CardHeader className='relative'>
                  <CardTitle className='flex items-center justify-between'>
                    <span className='flex items-center gap-2'>
                      {app.provider === 'google' && (
                        <Image
                          src={
                            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png'
                          }
                          alt='github'
                          width={1000}
                          height={1000}
                          className='h-4 w-4'
                        />
                      )}
                      {app.provider === 'github' && (
                        <Image
                          src={
                            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/640px-Octicons-mark-github.svg.png'
                          }
                          alt='github'
                          width={1000}
                          height={1000}
                          className='h-4 w-4'
                        />
                      )}
                      {app.name}
                    </span>
                    <Badge
                      variant={
                        app.status === 'active' ? 'default' : 'secondary'
                      }
                    >
                      {app.status}
                    </Badge>
                  </CardTitle>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity'
                    onClick={() => {
                      setSelectedApp(app);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground mb-4'>
                    {app.url}
                  </p>
                  {app.lastUsed && (
                    <p className='text-xs text-muted-foreground'>
                      Zuletzt: {new Date(app.lastUsed).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className='w-full' onClick={() => handleLogin(app)}>
                    <LogIn className='mr-2 h-4 w-4' />
                    Anmelden
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AddSSOModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

      {selectedApp && (
        <DeleteSSODialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          appId={selectedApp.id}
          appName={selectedApp.name}
        />
      )}
    </div>
  );
}
