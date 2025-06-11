import React, { useState } from 'react';
import { Search, ChevronDown, MessageSquare, Phone, Mail, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

interface FAQ {
  question: string;
  answer: string;
}

type FAQCategories = {
  [key: string]: FAQ[];
};

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const faqs: FAQCategories = {
    'Account & Profile': [
      {
        question: "How do I create an account?",
        answer: "Click on the 'Sign Up' button, fill in your details including name, email, and phone number. Verify your email address, and complete your profile with relevant farming information."
      },
      {
        question: "How can I reset my password?",
        answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email to create a new password."
      },
      {
        question: "How do I update my profile?",
        answer: "Log in to your account, go to Profile Settings, and click 'Edit Profile'. You can update your information, add photos, and save your changes."
      }
    ],
    'Buying & Selling': [
      {
        question: "How do I create a listing?",
        answer: "Click 'Post Ad' button, select a category, fill in product details including photos, price, and description. Review and publish your listing."
      },
      {
        question: "How do I contact a seller?",
        answer: "Click the 'Contact Seller' button on any listing to send a message. You can discuss details, price, and arrange the transaction through our messaging system."
      },
      {
        question: "What payment methods are supported?",
        answer: "Kisan Markaz supports various payment methods including bank transfers, cash on delivery, and digital payments. Specific payment terms are agreed between buyers and sellers."
      }
    ],
    'Safety & Security': [
      {
        question: "How do I report a suspicious listing?",
        answer: "Click the 'Report' button on the listing page, select the reason for reporting, and provide additional details. Our team will review and take appropriate action."
      },
      {
        question: "How does Kisan Markaz protect my information?",
        answer: "We use industry-standard security measures to protect your personal and business information. All transactions and communications are encrypted, and we never share your data with unauthorized parties."
      },
      {
        question: "What should I do if I encounter a scam?",
        answer: "Immediately report suspicious activity to our support team. Do not send money or share personal information with suspicious users."
      }
    ],
    'Technical Support': [
      {
        question: "The app isn't working properly. What should I do?",
        answer: "Try clearing your browser cache and cookies, or try using a different browser. If the problem persists, contact our technical support team."
      },
      {
        question: "How do I upload photos to my listing?",
        answer: "Click 'Add Photos' when creating a listing, select images from your device. Photos should be clear and accurately represent your product."
      },
      {
        question: "Why can't I access certain features?",
        answer: "Some features may require account verification or may not be available in your region. Contact support for specific feature inquiries."
      }
    ]
  };

  const filteredFaqs: FAQCategories = searchQuery
    ? Object.fromEntries(
      Object.entries(faqs).map(([category, questions]) => [
        category,
        questions.filter(
          q =>
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ]).filter(([_, questions]) => questions.length > 0)
    )
    : faqs;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Help Center</h1>
        <p className="text-xl text-gray-600 text-center mb-8">
          How can we help you today?
        </p>

        {/* Search */}
        <div className="relative mb-12">
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full px-12 py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/contact" className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Contact Support</h3>
            <p className="text-sm text-gray-600">Get help from our team</p>
          </Link>
          <Link to="/safety-tips" className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Safety Guide</h3>
            <p className="text-sm text-gray-600">Learn about safe trading</p>
          </Link>
          <Link to="/how-it-works" className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">How It Works</h3>
            <p className="text-sm text-gray-600">Platform guide</p>
          </Link>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>

          {Object.entries(filteredFaqs).map(([category, questions]) => (
            questions.length > 0 && (
              <div key={category} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left font-semibold flex justify-between items-center"
                  onClick={() => setOpenSection(openSection === category ? null : category)}
                >
                  {category}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${openSection === category ? 'transform rotate-180' : ''
                      }`}
                  />
                </button>

                {openSection === category && (
                  <div className="px-6 pb-4">
                    <div className="space-y-4">
                      {questions.map((faq, index) => (
                        <div key={index} className="border-t pt-4">
                          <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is available to assist you with any questions or concerns.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <Mail className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <div className="font-medium">Email Support</div>
                <div className="text-gray-600">support@kisanmarkaz.pk</div>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <div className="font-medium">Phone Support</div>
                <div className="text-gray-600">+92 300 1234567</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help; 