'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

import { auth, db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import type { UserSettings } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/providers/theme-provider';

// ----------------------------------------------------------------------

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const user = auth.currentUser;
  const { setTheme } = useTheme();

  const [settings, setSettings] = useState<UserSettings>({
    theme: 'system',
    emailNotifications: true,
    twoFactorEnabled: false,
  });

  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await updateProfile(user, {
        displayName: formData.displayName,
      });

      await updateDoc(doc(db, 'users', user.uid), {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
      });

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await updateDoc(doc(db, 'users', user.uid), {
        settings,
      });

      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings',
        variant: 'destructive',
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='container mx-auto py-8 space-y-8'
    >
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Einstellungen</h1>
      </div>

      <div className='grid gap-8 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Profil Informationen</CardTitle>
            <CardDescription>
              Hier kannst du deine Profilinformationen bearbeiten Boss
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' value={formData.email} disabled />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='phone'>Handynummer</Label>
              <Input
                id='phone'
                type='tel'
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleUpdateProfile}
              disabled={loading}
              className='ml-auto'
            >
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Speichert...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Präferenzen</CardTitle>
            <CardDescription>
              Hier kannst du deine Präferenzen bearbeiten
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Erscheinungsbild</Label>
                <p className='text-sm text-muted-foreground'>
                  Wie haben Sie es am liebsten?
                </p>
              </div>
              <div className='flex items-center space-x-2'>
                <Button
                  variant={settings.theme === 'light' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setTheme('light')}
                >
                  Hell
                </Button>
                <Button
                  variant={settings.theme === 'dark' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setTheme('dark')}
                >
                  Dunkel
                </Button>
                <Button
                  variant={settings.theme === 'system' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setTheme('system')}
                >
                  System
                </Button>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Email Benachrichtigungen</Label>
                <p className='text-sm text-muted-foreground'>
                  Receive email notifications for important updates
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>2-Faktor Authentifikation</Label>
                <p className='text-sm text-muted-foreground'>
                  Füge einen zusätzlichen Schutz hinzu
                </p>
              </div>
              <Switch
                checked={settings.twoFactorEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, twoFactorEnabled: checked })
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleUpdateSettings}
              disabled={loading}
              className='ml-auto'
            >
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Speichert...
                </>
              ) : (
                'Save Preferences'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
