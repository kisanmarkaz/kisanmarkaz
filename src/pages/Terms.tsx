import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>

        <div className="max-w-3xl mx-auto prose prose-lg">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <p className="text-yellow-700">
              <strong>Important Notice:</strong> Kisan Markaz is a classified marketplace platform that connects agricultural buyers and sellers. We do not sell products directly or participate in transactions between users.
            </p>
          </div>

          <h2>1. Platform Role</h2>
          <p>
            Kisan Markaz:
          </p>
          <ul>
            <li>Is a classified advertising platform for agricultural products and services</li>
            <li>Provides a space for buyers and sellers to connect</li>
            <li>Does not participate in any transactions between users</li>
            <li>Is not responsible for the quality, safety, or legality of listed items</li>
            <li>Does not verify the accuracy of listings or user information</li>
          </ul>

          <h2>2. User Accounts</h2>
          <p>
            Account requirements and responsibilities:
          </p>
          <ul>
            <li>Users must be 18 years or older to create an account</li>
            <li>Provide accurate and current information</li>
            <li>Maintain account security and confidentiality</li>
            <li>One account per user; multiple accounts are prohibited</li>
            <li>Report unauthorized account access immediately</li>
          </ul>

          <h2>3. Listing Rules</h2>
          <p>
            When creating listings, users must:
          </p>
          <ul>
            <li>Provide accurate descriptions of agricultural items or services</li>
            <li>Include clear and accurate pricing information</li>
            <li>Only list items they have the right to sell</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Remove listings when items are no longer available</li>
          </ul>

          <h2>4. Prohibited Content</h2>
          <p>
            The following are not allowed:
          </p>
          <ul>
            <li>Illegal or unauthorized items</li>
            <li>Fraudulent or misleading listings</li>
            <li>Harmful or dangerous materials</li>
            <li>Copyright-infringing content</li>
            <li>Spam or duplicate listings</li>
          </ul>

          <h2>5. Transaction Guidelines</h2>
          <p>
            Users understand that:
          </p>
          <ul>
            <li>All transactions are between buyers and sellers directly</li>
            <li>The platform does not handle payments or shipping</li>
            <li>Users are responsible for their own transaction safety</li>
            <li>The platform is not liable for transaction disputes</li>
            <li>Users should exercise caution and verify before paying</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
            <p className="text-blue-700">
              <strong>Safety Warning:</strong> Never send payment or sensitive information through unsecured channels. Meet in safe, public locations for in-person transactions. Report suspicious activities immediately.
            </p>
          </div>

          <h2>6. User Conduct</h2>
          <p>
            Users agree to:
          </p>
          <ul>
            <li>Interact respectfully with other users</li>
            <li>Not harass or threaten other users</li>
            <li>Not manipulate platform features or listings</li>
            <li>Not use the platform for unauthorized purposes</li>
            <li>Report violations of these terms</li>
          </ul>

          <h2>7. Platform Fees</h2>
          <p>
            Regarding platform usage:
          </p>
          <ul>
            <li>Basic listing services are currently free</li>
            <li>Premium features may incur charges</li>
            <li>Fee structures may change with notice</li>
            <li>All fees are non-refundable</li>
          </ul>

          <h2>8. Intellectual Property</h2>
          <p>
            Rights and restrictions:
          </p>
          <ul>
            <li>Platform content is protected by copyright</li>
            <li>Users retain rights to their content</li>
            <li>Platform may use user content for operation</li>
            <li>Respect others' intellectual property rights</li>
          </ul>

          <h2>9. Limitation of Liability</h2>
          <p>
            The platform:
          </p>
          <ul>
            <li>Is provided "as is" without warranties</li>
            <li>Is not liable for user transactions or disputes</li>
            <li>Does not guarantee listing accuracy or user reliability</li>
            <li>May have service interruptions or changes</li>
          </ul>

          <h2>10. Account Termination</h2>
          <p>
            The platform may:
          </p>
          <ul>
            <li>Terminate accounts for terms violations</li>
            <li>Remove content without notice</li>
            <li>Ban users for fraudulent activity</li>
            <li>Cooperate with law enforcement</li>
          </ul>

          <h2>11. Changes to Terms</h2>
          <p>
            Please note:
          </p>
          <ul>
            <li>Terms may be updated at any time</li>
            <li>Changes effective upon posting</li>
            <li>Continued use implies acceptance</li>
            <li>Users notified of significant changes</li>
          </ul>

          <h2>12. Related Policies</h2>
          <p>
            Additional policies:
          </p>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/refund-policy">Refund Policy</Link></li>
            <li><Link to="/shipping-policy">Shipping Policy</Link></li>
          </ul>

          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mt-8">
            <p className="text-gray-700">
              <strong>Contact Information:</strong><br />
              For terms-related inquiries:<br />
              Email: legal@kisanmarkaz.pk<br />
              Hours: Monday to Friday, 9:00 AM - 5:00 PM PKT
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
            <p className="text-red-700">
              <strong>Disclaimer:</strong> Kisan Markaz is a platform for connecting buyers and sellers only. We do not verify users, guarantee transactions, or participate in any exchanges between users. Use the platform at your own risk and exercise due diligence in all transactions.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms; 