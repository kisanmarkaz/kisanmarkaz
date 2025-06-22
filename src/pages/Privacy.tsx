import React from 'react';
import Layout from '@/components/Layout';

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>

        <div className="max-w-3xl mx-auto prose prose-lg">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <p className="text-yellow-700">
              <strong>Important Notice:</strong> Kisan Markaz is a classified marketplace platform that connects agricultural buyers and sellers. This privacy policy explains how we handle information on our platform.
            </p>
          </div>

          <h2>1. Information We Collect</h2>
          <p>
            We collect the following types of information:
          </p>
          <ul>
            <li>Account Information: Name, email, phone number, and location for account creation</li>
            <li>Listing Information: Details about agricultural products and services that users post</li>
            <li>Communication Data: Messages between users through our platform</li>
            <li>Usage Information: How you interact with our platform and services</li>
            <li>Device Information: Browser type, IP address, and device identifiers</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use collected information to:
          </p>
          <ul>
            <li>Maintain and operate our marketplace platform</li>
            <li>Enable communication between buyers and sellers</li>
            <li>Improve our platform's functionality and user experience</li>
            <li>Prevent fraud and ensure platform security</li>
            <li>Send important updates about our services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We may share information in these circumstances:
          </p>
          <ul>
            <li>Between buyers and sellers to facilitate marketplace transactions</li>
            <li>With service providers who help operate our platform</li>
            <li>When required by law or to protect legal rights</li>
            <li>To prevent fraud or ensure platform safety</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
            <p className="text-blue-700">
              <strong>Marketplace Disclaimer:</strong> As a classified marketplace platform, user profiles and listings are publicly visible. Exercise caution when sharing personal information in listings or with other users.
            </p>
          </div>

          <h2>4. User Communications</h2>
          <p>
            Regarding platform communications:
          </p>
          <ul>
            <li>Messages between users are stored for security and support purposes</li>
            <li>We do not monitor or moderate all communications between users</li>
            <li>Users are responsible for the information they share in messages</li>
            <li>Report suspicious or inappropriate communications to our support team</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We protect your data through:
          </p>
          <ul>
            <li>Industry-standard encryption and security measures</li>
            <li>Regular security assessments and updates</li>
            <li>Restricted access to personal information</li>
            <li>Secure data storage and transmission protocols</li>
          </ul>

          <h2>6. User Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Access your personal information</li>
            <li>Update or correct your account information</li>
            <li>Delete your account and associated data</li>
            <li>Opt-out of marketing communications</li>
            <li>Request data portability where applicable</li>
          </ul>

          <h2>7. Third-Party Services</h2>
          <p>
            Please note:
          </p>
          <ul>
            <li>Our platform may contain links to third-party websites</li>
            <li>We are not responsible for third-party privacy practices</li>
            <li>Users should review privacy policies of linked services</li>
            <li>Third-party payment processors have separate privacy policies</li>
          </ul>

          <h2>8. Data Retention</h2>
          <p>
            Our data retention practices:
          </p>
          <ul>
            <li>Account information is retained while your account is active</li>
            <li>Listing data is stored as long as listings are active</li>
            <li>Message history is retained for security purposes</li>
            <li>You can request data deletion at any time</li>
          </ul>

          <h2>9. Changes to Privacy Policy</h2>
          <p>
            We may update this policy:
          </p>
          <ul>
            <li>Changes will be posted on this page</li>
            <li>Significant changes will be notified via email</li>
            <li>Continued use constitutes acceptance of changes</li>
            <li>Previous versions available upon request</li>
          </ul>

          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mt-8">
            <p className="text-gray-700">
              <strong>Contact Information:</strong><br />
              For privacy-related inquiries:<br />
              Email: privacy@kisanmarkaz.pk<br />
              Hours: Monday to Friday, 9:00 AM - 5:00 PM PKT
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
            <p className="text-red-700">
              <strong>Important:</strong> Kisan Markaz is a marketplace platform. While we protect information stored on our platform, we are not responsible for how users handle information shared directly between them. Exercise caution when sharing personal information with other users.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy; 