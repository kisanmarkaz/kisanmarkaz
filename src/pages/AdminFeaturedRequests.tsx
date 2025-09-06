import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface FeaturedPaymentRequest {
  id: string;
  created_at: string;
  user_id: string;
  listing_id: string;
  plan: 'day' | 'week' | 'month';
  proof_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  user_email?: string | null;
}

const AdminFeaturedRequests: React.FC = () => {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<FeaturedPaymentRequest[]>({
    queryKey: ['featured_payment_requests', 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_payment_requests')
        .select(`
          *,
          listing:listings(title, price)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any;
    },
  });

  const approve = useMutation({
    mutationFn: async (req: FeaturedPaymentRequest) => {
      // compute featured_from/until based on plan
      const now = new Date();
      const from = now.toISOString();
      const until = new Date(now);
      if (req.plan === 'day') until.setDate(until.getDate() + 1);
      if (req.plan === 'week') until.setDate(until.getDate() + 7);
      if (req.plan === 'month') until.setDate(until.getDate() + 30);

      // 1) mark request approved
      const { error: updErr } = await supabase
        .from('featured_payment_requests')
        .update({ status: 'approved', featured_from: from, featured_until: until.toISOString() })
        .eq('id', req.id);
      if (updErr) throw updErr;

      // 2) insert into featured_listings for activation
      const price = req.plan === 'day' ? 3 : req.plan === 'week' ? 15 : 30;
      const { error: flErr } = await supabase.from('featured_listings').insert({
        listing_id: req.listing_id,
        user_id: req.user_id,
        featured_from: from,
        featured_until: until.toISOString(),
        duration_type: req.plan,
        price,
        status: 'active',
      });
      if (flErr) throw flErr;

      // 3) send email
      if (req.user_email) {
        await fetch('/functions/v1/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: req.user_email,
            subject: 'Your listing has been featured',
            html: `<p>Congratulations! Your listing has been featured for ${req.plan}.</p>`
          })
        });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['featured_payment_requests', 'admin'] }),
  });

  const reject = useMutation({
    mutationFn: async (req: FeaturedPaymentRequest) => {
      const { error } = await supabase
        .from('featured_payment_requests')
        .update({ status: 'rejected' })
        .eq('id', req.id);
      if (error) throw error;

      if (req.user_email) {
        await fetch('/functions/v1/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: req.user_email,
            subject: 'Payment verification failed',
            html: `<p>Your payment verification failed. Please upload a valid payment proof.</p>`
          })
        });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['featured_payment_requests', 'admin'] }),
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Featured Listings - Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading...</div>
            ) : data && data.length > 0 ? (
              <div className="space-y-4">
                {data.map((req: any) => (
                  <div key={req.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{req.listing?.title || 'Unknown Listing'}</div>
                      <div className="text-sm text-gray-600">User ID: {req.user_id}</div>
                      <div className="text-sm">Plan: {req.plan} - ${req.plan === 'day' ? '3' : req.plan === 'week' ? '15' : '30'}</div>
                      <div className="text-sm text-gray-600">Email: {req.user_email || 'No email'}</div>
                      <div className="text-sm text-gray-600">Created: {format(new Date(req.created_at), 'PPpp')}</div>
                      {req.proof_url && (
                        <a className="text-green-700 underline" href={req.proof_url} target="_blank" rel="noreferrer">View Proof</a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => reject.mutate(req)} disabled={approve.isPending || reject.isPending}>
                        {reject.isPending ? 'Rejecting...' : 'Reject'}
                      </Button>
                      <Button onClick={() => approve.mutate(req)} disabled={approve.isPending || reject.isPending}>
                        {approve.isPending ? 'Approving...' : 'Approve'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No pending requests.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminFeaturedRequests;


