'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import type React from 'react';
import Image from 'next/image';
import { ModeToggle } from '@/components/mode-toggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
        variant: 'default',
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Ooooppss!',
        description:
          'Falsches Passwort. Ich hoffe du bist kein Eindringling. 🤨',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: 'Trete ein mein Sohn!',
        description: 'Google Login war erfolgreich!',
        variant: 'default',
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Oooppsss!',
        description: 'Google Login fehlgeschlagen. Versuche es erneut. 🤨',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='relative min-h-screen overflow-hidden bg-background transition-all duration-1000'>
      <div className='fixed right-3 top-3 z-50'>
        <ModeToggle />
      </div>
      <div className='absolute inset-0 z-0 transition-all duration-100'>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute rounded-full bg-primary/5 transition-all duration-300'
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: [
                '#5E3AEE', // Deep Purple
                '#2C2E80', // Night Blue
                '#7A2048', // Wine Red
                '#663399', // Muted Violet
                '#1B1F3B', // Dark Sapphire
                '#5B2333', // Bordeaux Red
              ][Math.floor(Math.random() * 6)],
            }}
            variants={{
              initial: { y: 0 },
              animate: {
                y: [-12, 12, -12],
                x: [-18, 18, -18],
                transition: {
                  duration: 70,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              },
            }}
            initial='initial'
            animate='animate'
            transition={{
              delay: i * 0.3, // Staggered timing for more natural movement
            }}
          />
        ))}
      </div>
      <div className='relative z-10 flex min-h-screen items-center justify-center px-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className='w-full max-w-[400px] backdrop-blur-sm'>
            <CardHeader className='space-y-3 text-center'>
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className='text-2xl font-bold'>
                  Willkommen Sohn!
                </CardTitle>
                <CardDescription className='text-lg'>
                  Logge dich ein um fortzufahren 🫡
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className='space-y-6 pt-6'>
              <form onSubmit={handleEmailLogin} className='space-y-4'>
                <div className='space-y-2'>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
                    <Input
                      type='email'
                      placeholder='Email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='pl-10'
                      required
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Passwort'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='pl-10 pr-10'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-2.5 text-muted-foreground hover:text-foreground'
                    >
                      {showPassword ? (
                        <EyeOff className='h-5 w-5' />
                      ) : (
                        <Eye className='h-5 w-5' />
                      )}
                    </button>
                  </div>
                </div>

                <motion.div
                  className='space-y-3 pt-2'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    type='submit'
                    className='w-full'
                    disabled={loading}
                    size='lg'
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: 'linear',
                        }}
                        className='mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full'
                      />
                    ) : null}
                    {loading ? 'Checke deine Identität...' : 'Anmelden'}
                  </Button>

                  <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                      <div className='w-full border-t' />
                    </div>
                    <div className='relative flex justify-center text-xs uppercase'>
                      <span className='bg-background px-2 text-muted-foreground'>
                        Oder
                      </span>
                    </div>
                  </div>

                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={handleGoogleLogin}
                    type='button'
                  >
                    <Image
                      alt='Google Logo'
                      className='mr-2 h-4 w-4'
                      width={1000}
                      height={1000}
                      src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png'
                    />
                    Mit Google fortfahren
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className='flex justify-center text-sm text-muted-foreground'>
              <a href='#' className='hover:text-primary hover:underline'>
                Passwort vergessen?
              </a>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
