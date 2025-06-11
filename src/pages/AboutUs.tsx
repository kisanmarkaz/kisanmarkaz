import React from 'react';
import Layout from '@/components/Layout';

const AboutUs = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">About Kisan Markaz</h1>

        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <p className="mb-6">
              At Kisan Markaz, we're dedicated to revolutionizing Pakistan's agricultural marketplace by connecting farmers, buyers, and agricultural businesses on a single platform. Our mission is to empower farmers with technology and market access to help them grow their businesses and improve their livelihoods.
            </p>

            <p className="mb-6">
              Founded with a vision to bridge the gap between farmers and markets, Kisan Markaz has grown to become Pakistan's leading agricultural marketplace. We understand the challenges faced by farmers in reaching potential buyers and getting fair prices for their produce. Our platform provides a transparent, efficient, and secure environment for agricultural trade.
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-green-600">Transparency</h3>
                  <p className="text-gray-600">We believe in complete transparency in all transactions and communications.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-green-600">Innovation</h3>
                  <p className="text-gray-600">We continuously innovate to make farming more efficient and profitable.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-green-600">Community</h3>
                  <p className="text-gray-600">We foster a strong community of farmers and agricultural professionals.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-green-600">Sustainability</h3>
                  <p className="text-gray-600">We promote sustainable farming practices for a better future.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Impact</h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
                  <div className="text-gray-600">Active Farmers</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-2">50,000+</div>
                  <div className="text-gray-600">Listings Posted</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-2">100+</div>
                  <div className="text-gray-600">Cities Covered</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs; 