import React from 'react';
import Layout from '@/components/Layout';

const RefundPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Refund & Return Policy</h1>

        <div className="max-w-3xl mx-auto prose prose-lg">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <p className="text-yellow-700">
              <strong>Important Notice:</strong> Kisan Markaz is a classified marketplace platform that connects buyers and sellers. We do not sell products directly and are not responsible for individual transactions between users.
            </p>
          </div>

          <h2>1. Platform Role</h2>
          <p>
            Kisan Markaz operates solely as a platform that:
          </p>
          <ul>
            <li>Facilitates connections between buyers and sellers in the agricultural sector</li>
            <li>Provides listing services for farmers, suppliers, and individuals</li>
            <li>Does not participate in any direct sales, purchases, or product handling</li>
            <li>Has no control over the quality, safety, or legality of listed items</li>
          </ul>

          <h2>2. No Direct Refund Policy</h2>
          <p>
            As a marketplace platform:
          </p>
          <ul>
            <li>We do not process or handle any refunds for transactions between users</li>
            <li>All refund arrangements must be made directly between buyers and sellers</li>
            <li>We do not guarantee any refunds or returns for purchases made through our platform</li>
            <li>Platform fees, if any, are non-refundable as they are for listing services rendered</li>
          </ul>

          <h2>3. User Responsibility</h2>
          <p>
            Users are advised to:
          </p>
          <ul>
            <li>Thoroughly verify products and sellers before making any purchases</li>
            <li>Clearly discuss refund and return terms with sellers before transaction</li>
            <li>Document all transaction details and communications</li>
            <li>Meet in safe, public locations for transactions when possible</li>
            <li>Use secure payment methods</li>
          </ul>

          <h2>4. Dispute Resolution</h2>
          <p>
            In case of transaction disputes:
          </p>
          <ul>
            <li>Buyers and sellers should first attempt to resolve issues directly between themselves</li>
            <li>While we cannot intervene in refund disputes, we may investigate reported fraudulent activity</li>
            <li>Users should maintain respectful communication when resolving disputes</li>
            <li>Consider local consumer protection laws and regulations</li>
          </ul>

          <h2>5. Safety Recommendations</h2>
          <p>
            For safe transactions:
          </p>
          <ul>
            <li>Never send money in advance without verifying the seller and product</li>
            <li>Keep detailed records of all communications and transactions</li>
            <li>Report suspicious activities to our support team</li>
            <li>Consider using secure escrow services for high-value transactions</li>
          </ul>

          <h2>6. Limitation of Liability</h2>
          <p>
            Please note that:
          </p>
          <ul>
            <li>Kisan Markaz is not liable for any losses or damages arising from transactions between users</li>
            <li>We do not guarantee the accuracy of listings or the reliability of users</li>
            <li>All transactions are conducted at users' own risk</li>
            <li>We are not responsible for any misrepresentations by sellers or payment issues</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
            <p className="text-blue-700">
              <strong>Contact Information:</strong><br />
              For platform-related inquiries only (not transaction disputes), contact us at:<br />
              Email: support@kisanmarkaz.pk<br />
              Hours: Monday to Friday, 9:00 AM - 5:00 PM PKT
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RefundPolicy; 