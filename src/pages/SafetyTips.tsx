import React from 'react';
import { Shield, AlertTriangle, Eye, UserCheck, CreditCard, MessageSquare } from 'lucide-react';
import Layout from '@/components/Layout';

const SafetyTips = () => {
  const safetyCategories = [
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Account Security",
      tips: [
        "Use a strong, unique password",
        "Enable two-factor authentication if available",
        "Never share your login credentials",
        "Log out when using shared devices"
      ]
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-yellow-600" />,
      title: "Meeting Safety",
      tips: [
        "Meet in public, well-lit places",
        "Bring a friend or family member",
        "Share your meeting location with someone",
        "Trust your instincts"
      ]
    },
    {
      icon: <Eye className="w-8 h-8 text-blue-600" />,
      title: "Product Verification",
      tips: [
        "Inspect products thoroughly before purchase",
        "Request detailed photos and documentation",
        "Verify product certifications",
        "Ask for product history and maintenance records"
      ]
    },
    {
      icon: <UserCheck className="w-8 h-8 text-purple-600" />,
      title: "Seller Verification",
      tips: [
        "Check seller ratings and reviews",
        "Verify business credentials",
        "Look for complete profile information",
        "Be wary of new accounts with no history"
      ]
    },
    {
      icon: <CreditCard className="w-8 h-8 text-red-600" />,
      title: "Payment Safety",
      tips: [
        "Never send money before seeing the product",
        "Use secure payment methods",
        "Keep payment receipts",
        "Be cautious of unusual payment requests"
      ]
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-indigo-600" />,
      title: "Communication Safety",
      tips: [
        "Keep communication within the platform",
        "Don't share personal financial information",
        "Be wary of urgent pressure tactics",
        "Report suspicious behavior"
      ]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Safety Tips</h1>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 text-center mb-8">
            Your safety is our top priority. Follow these guidelines to ensure a secure trading experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {safetyCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  {category.icon}
                  <h2 className="text-xl font-semibold ml-3">{category.title}</h2>
                </div>
                <ul className="space-y-2">
                  {category.tips.map((tip, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                      <span className="text-gray-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-green-50 p-6 rounded-lg mt-8">
            <div className="flex items-center mb-4">
              <MessageSquare className="w-8 h-8 text-green-600" />
              <h2 className="text-xl font-semibold ml-3">Need Help?</h2>
            </div>
            <p className="text-gray-600 mb-4">
              If you encounter any suspicious activity or need assistance, our support team is here to help.
            </p>
            <div className="text-gray-600">
              <p>Email: support@farmx.pk</p>
              <p>Phone: +92 300 1234567</p>
              <p>Available: 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SafetyTips; 