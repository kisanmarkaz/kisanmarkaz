import React from 'react';
import Layout from '@/components/Layout';

const Privacy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal Information: Name, email address, phone number, and location when you create an account",
        "Profile Information: Farm details, business information, and profile pictures that you choose to share",
        "Transaction Data: Information about your listings, purchases, and communications on the platform",
        "Usage Data: How you interact with our platform, including browsing patterns and device information"
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our services",
        "To process your transactions and communications",
        "To improve our platform and user experience",
        "To send you updates and marketing communications (with your consent)",
        "To ensure platform security and prevent fraud"
      ]
    },
    {
      title: "Information Sharing",
      content: [
        "With other users as necessary for transactions",
        "With service providers who assist in our operations",
        "When required by law or to protect our rights",
        "With your consent for specific purposes"
      ]
    },
    {
      title: "Data Security",
      content: [
        "We implement industry-standard security measures",
        "Regular security audits and updates",
        "Encrypted data transmission",
        "Secure data storage practices"
      ]
    },
    {
      title: "Your Rights",
      content: [
        "Access your personal information",
        "Correct inaccurate data",
        "Request deletion of your data",
        "Opt-out of marketing communications",
        "Control your privacy settings"
      ]
    },
    {
      title: "Cookies and Tracking",
      content: [
        "We use cookies to improve user experience",
        "Track platform usage and performance",
        "Remember your preferences",
        "You can control cookie settings in your browser"
      ]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>

        <div className="max-w-3xl mx-auto prose prose-lg">
          <p>
            At Kisan Markaz, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            When you use Kisan Markaz, we collect information that you provide directly to us, including:
          </p>
          <ul>
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Listing information</li>
            <li>Transaction data</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide and improve Kisan Markaz services</li>
            <li>Process your transactions</li>
            <li>Communicate with you about your account</li>
            <li>Send you updates and marketing communications</li>
          </ul>

          <h2>3. Information Security</h2>
          <p>
            Kisan Markaz implements appropriate security measures to protect your personal information from unauthorized access or disclosure.
          </p>

          <h2>4. Contact Us</h2>
          <p>
            If you have any questions about our Privacy Policy, please contact us at privacy@kisanmarkaz.pk
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy; 