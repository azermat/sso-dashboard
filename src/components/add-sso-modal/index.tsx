'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SSOApp } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

// ----------------------------------------------------------------------

const steps = [
  { id: 1, title: 'Authentifizierung' },
  { id: 2, title: 'Konfigurieren' },
  { id: 3, title: 'Verifizieren' },
];

//optional for framer motion
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export function AddSSOModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    provider: 'google' as SSOApp['provider'],
    clientId: '',
    clientSecret: '',
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  //replace this with a better form handling
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await addDoc(collection(db, 'ssoApps'), {
        ...formData,
        status: 'active',
        createdAt: new Date(),
      });
      toast({
        title: 'Erfolgreich!',
        description: 'SSO Login wurde hinzugefügt mein Sohn',
      });
      onOpenChange(false);
      setStep(1);
      setFormData({
        name: '',
        url: '',
        provider: 'google',
        clientId: '',
        clientSecret: '',
      });
    } catch (error) {
      toast({
        title: 'Ooopps!',
        description: 'Fehlgeschlagen, ich konnte die SSO App nicht hinzufügen',
        variant: 'destructive',
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex flex-col min-w-[700px] px-10'>
        <DialogHeader>
          <DialogTitle>Neuer Login</DialogTitle>
          <DialogDescription>
            Verbinde eine beliebige SSO-App mit deinem Konto in nur 3 simplen
            Schritten
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className='relative mb-8'>
          <div className='absolute top-4 w-full h-0.5 bg-muted' />
          <ol className='relative z-10 flex justify-between'>
            {steps.map((s) => (
              <li key={s.id} className='flex items-center'>
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor:
                      step >= s.id
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--muted))',
                  }}
                  className='w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium'
                >
                  {s.id}

                  <span className='absolute -bottom-6 text-xs font-medium text-foreground'>
                    {s.title}
                  </span>
                </motion.div>
              </li>
            ))}
          </ol>
        </div>

        {/* Form Steps */}
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={step}
            variants={slideVariants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {step === 1 && (
              <div className='space-y-4 mt-4'>
                <RadioGroup
                  value={formData.provider}
                  onValueChange={(value: SSOApp['provider']) =>
                    setFormData({ ...formData, provider: value })
                  }
                  className='grid grid-cols-2 gap-4'
                >
                  {[
                    {
                      value: 'google',
                      label: 'Google',
                      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png',
                    },
                    {
                      value: 'github',
                      label: 'GitHub',
                      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/640px-Octicons-mark-github.svg.png',
                    },
                  ].map(({ value, label, icon: Icon }) => (
                    <div key={value}>
                      <RadioGroupItem
                        value={value}
                        id={value}
                        className='peer sr-only'
                      />
                      <Label
                        htmlFor={value}
                        className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
                      >
                        <Image
                          src={Icon}
                          alt='Icon'
                          width={1000}
                          height={1000}
                          className='mb-3 h-6 w-6'
                        />
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {step === 2 && (
              <div className='space-y-4'>
                <div className='grid gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='name'>App Name</Label>
                    <Input
                      id='name'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='url'>Login URL</Label>
                    <Input
                      id='url'
                      type='url'
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className='space-y-4'>
                <div className='grid gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='clientId'>Benutzername oder Email</Label>
                    <Input
                      id='clientId'
                      value={formData.clientId}
                      onChange={(e) =>
                        setFormData({ ...formData, clientId: e.target.value })
                      }
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='clientSecret'>Dein Secret Passwort</Label>
                    <Input
                      id='clientSecret'
                      type='password'
                      value={formData.clientSecret}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          clientSecret: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className='flex justify-between mt-8'>
          <Button variant='outline' onClick={handleBack} disabled={step === 1}>
            Zurück
          </Button>
          <Button
            onClick={step === 3 ? handleSubmit : handleNext}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Bitte Warte...
              </>
            ) : step === 3 ? (
              'Abschließen'
            ) : (
              'Weiter'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
