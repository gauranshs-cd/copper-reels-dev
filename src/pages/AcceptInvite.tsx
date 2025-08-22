import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeamStore } from '@/store/useTeamStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Users, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AcceptInvite() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { acceptInvitation } = useTeamStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid invitation link');
      return;
    }

    acceptInvitation(token)
      .then(() => {
        setStatus('success');
        setMessage('Successfully joined the team!');
        toast.success('Welcome to the team!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      })
      .catch((error) => {
        setStatus('error');
        setMessage(error.message || 'Failed to accept invitation');
        toast.error(error.message || 'Failed to accept invitation');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
              <h2 className="text-xl font-semibold mb-2">Accepting Invitation</h2>
              <p className="text-muted-foreground">
                Please wait while we add you to the team...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h2 className="text-xl font-semibold mb-2">Welcome to the Team!</h2>
              <p className="text-muted-foreground mb-6">{message}</p>
              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2">Invitation Error</h2>
              <p className="text-muted-foreground mb-6">{message}</p>
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}