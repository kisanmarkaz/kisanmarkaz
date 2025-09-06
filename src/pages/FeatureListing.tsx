import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { FEATURED_PRICING, type FeaturedDuration } from '@/constants/featuredListing';
import { supabase } from '@/integrations/supabase/client';

const BANK_DETAILS = {
  accountName: 'KisanMarkaz',
  accountNumber: '0001-23456789',
  bankName: 'HBL Pakistan',
  iban: 'PK00HABB0000000000000000',
};

const FeatureListing: React.FC = () => {
  const { id: listingId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const planParam = (searchParams.get('plan') || 'day') as FeaturedDuration;
  const plan: FeaturedDuration = ['day', 'week', 'month'].includes(planParam) ? planParam : 'day';
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const planInfo = useMemo(() => FEATURED_PRICING[plan], [plan]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!listingId) return;
    try {
      setSubmitting(true);

      let proofUrl: string | null = null;
      if (file) {
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${listingId}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('listings').upload(`payment-proofs/${path}`, file);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from('listings').getPublicUrl(`payment-proofs/${path}`);
        proofUrl = urlData.publicUrl;
      }

      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();

      const { error: insertErr } = await supabase
        .from('featured_payment_requests')
        .insert({
          user_id: user.id,
          listing_id: listingId,
          plan: plan,
          proof_url: proofUrl,
          status: 'pending',
          user_email: user.email,
        });
      if (insertErr) throw insertErr;

      // Send email notification to admin
      try {
        console.log('Attempting to send admin notification...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session:', session ? 'Found' : 'Not found');
        
        const { data: listingData } = await supabase
          .from('listings')
          .select('title')
          .eq('id', listingId)
          .single();
        console.log('Listing data:', listingData);

        const emailPayload = {
          to: 'kulibre@gmail.com', // Change this to your admin email
          subject: 'New Featured Listing Request',
          html: `
            <h3>New Featured Listing Request</h3>
            <p><strong>Listing:</strong> ${listingData?.title || 'Unknown'}</p>
            <p><strong>User:</strong> ${user.email}</p>
            <p><strong>Plan:</strong> ${plan} - $${planInfo.price}</p>
            <p><strong>Request ID:</strong> Request submitted</p>
            <p>Please review the request at: <a href="${window.location.origin}/admin/featured-requests">Admin Panel</a></p>
          `
        };
        
        console.log('Sending email to:', emailPayload.to);
        console.log('Email payload:', emailPayload);

        const response = await fetch(`${supabase.supabaseUrl}/functions/v1/send-email`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || ''}`
          },
          body: JSON.stringify(emailPayload)
        });
        
        console.log('Email response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Email sending failed:', errorText);
        } else {
          const result = await response.json();
          console.log('Admin notification sent successfully:', result);
        }
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
        // Don't fail the whole request if email fails
      }

      toast({ title: 'Request submitted', description: 'You will be notified once verified.' });
      navigate(`/listing/${listingId}`);
    } catch (e: any) {
      toast({ title: 'Submission failed', description: e.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Feature Listing - Payment Instructions</CardTitle>
            <CardDescription>
              Selected plan: {planInfo.label} — ${planInfo.price} USD
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Bank Transfer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500">Account Name</div>
                  <div className="font-medium">{BANK_DETAILS.accountName}</div>
                </div>
                <div>
                  <div className="text-gray-500">Account Number</div>
                  <div className="font-medium">{BANK_DETAILS.accountNumber}</div>
                </div>
                <div>
                  <div className="text-gray-500">Bank</div>
                  <div className="font-medium">{BANK_DETAILS.bankName}</div>
                </div>
                <div>
                  <div className="text-gray-500">IBAN</div>
                  <div className="font-medium">{BANK_DETAILS.iban}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proof">Upload Payment Proof</Label>
              <Input id="proof" type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
              <p className="text-xs text-gray-500">Attach a screenshot or receipt of your transfer.</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
                Cancel
              </Button>
            </div>

            <p className="text-sm text-gray-600">
              Your request has been submitted. You will be notified via email once your payment is verified and your listing is featured.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FeatureListing;


