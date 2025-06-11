import React from 'react';
import { UserPlus, Search, MessageSquare, ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlus className="w-12 h-12 text-green-600" />,
      title: "Create an Account",
      description: "Sign up for free and complete your profile with relevant information about your farming business.",
      details: [
        "Fill in your basic information",
        "Verify your contact details",
        "Add your location and farming details"
      ]
    },
    {
      icon: <Search className="w-12 h-12 text-green-600" />,
      title: "Browse or List Products",
      description: "Search for agricultural products or create listings for your own produce and equipment.",
      details: [
        "Browse categories",
        "Use filters to find specific items",
        "Create detailed listings with photos"
      ]
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-green-600" />,
      title: "Connect and Negotiate",
      description: "Communicate directly with buyers or sellers to discuss prices and arrangements.",
      details: [
        "Chat in real-time",
        "Discuss prices and quantities",
        "Arrange delivery details"
      ]
    },
    {
      icon: <ShoppingCart className="w-12 h-12 text-green-600" />,
      title: "Complete Transaction",
      description: "Finalize the deal and arrange for payment and delivery of products.",
      details: [
        "Agree on final terms",
        "Arrange secure payment",
        "Coordinate delivery"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">How Kisan Markaz Works</h1>

          <p className="text-xl text-gray-600 text-center mb-12">
            Your one-stop platform for buying and selling agricultural products in Pakistan
          </p>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="bg-green-50 p-4 rounded-full">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2">{step.title}</h2>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-500">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-green-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              Join thousands of farmers and buyers already using Kisan Markaz to grow their agricultural business.
            </p>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Create Your Account
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks; 