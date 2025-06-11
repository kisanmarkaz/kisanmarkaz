import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';

const Terms = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: `By accessing or using Kisan Markaz, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.`
    },
    {
      title: "User Registration",
      content: [
        "You must be 18 years or older to use this service",
        "You must provide accurate and complete information when creating an account",
        "You are responsible for maintaining the security of your account",
        "You must notify us immediately of any unauthorized access"
      ]
    },
    {
      title: "Listing Rules",
      content: [
        "All listings must be for agricultural products or services",
        "Listings must include accurate descriptions and images",
        "Prohibited items must not be listed",
        "Prices must be stated clearly in Pakistani Rupees",
        "You must have the right to sell listed items"
      ]
    },
    {
      title: "Transaction Guidelines",
      content: [
        "All transactions should be conducted through the platform",
        "Sellers must accurately represent their products",
        "Buyers must make payments as agreed",
        "Both parties must honor their commitments",
        "Disputes should be resolved through our resolution process"
      ]
    },
    {
      title: "Prohibited Activities",
      content: [
        "Posting false or misleading information",
        "Harassment or abuse of other users",
        "Circumventing platform fees",
        "Creating multiple accounts for deceptive purposes",
        "Violating any applicable laws or regulations"
      ]
    },
    {
      title: "Content Ownership",
      content: [
        "You retain rights to content you post",
        "You grant Kisan Markaz license to use your content",
        "You must not violate others' intellectual property rights",
        "We may remove content that violates these terms"
      ]
    },
    {
      title: "Platform Fees",
      content: [
        "We may charge fees for certain services",
        "Fee structures will be clearly communicated",
        "Fees are non-refundable unless required by law",
        "Payment terms must be followed as specified"
      ]
    },
    {
      title: "Termination",
      content: [
        "We may terminate accounts for violations",
        "Users may delete their accounts at any time",
        "Some obligations survive termination",
        "We reserve the right to refuse service"
      ]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>

        <div className="max-w-3xl mx-auto prose prose-lg">
          <p>
            Welcome to Kisan Markaz. By accessing or using our website and services, you agree to be bound by these Terms of Service.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Kisan Markaz, you accept and agree to be bound by the terms and provisions of this agreement.
          </p>

          <h2>2. User Accounts</h2>
          <p>
            To use certain features of Kisan Markaz, you must register for an account. You agree to provide accurate and complete information when creating your account and to update such information to keep it accurate and current.
          </p>

          <h2>3. Listing Guidelines</h2>
          <p>
            When creating listings on Kisan Markaz, you agree to provide accurate information about your agricultural products or services. All listings must comply with local laws and regulations.
          </p>

          <h2>4. Privacy Policy</h2>
          <p>
            Your use of Kisan Markaz is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices.
          </p>

          <h2>5. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us at legal@kisanmarkaz.pk
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Terms; 