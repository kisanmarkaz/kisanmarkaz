import React from 'react';
import Layout from '@/components/Layout';

const ShippingPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Shipping & Delivery Information</h1>

        <div className="max-w-3xl mx-auto prose prose-lg">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <p className="text-yellow-700">
              <strong>Important Notice:</strong> Kisan Markaz is a classified marketplace platform that connects buyers and sellers. We do not handle shipping or delivery of any products listed on our platform.
            </p>
          </div>

          <h2>1. Platform Role</h2>
          <p>
            Kisan Markaz operates as:
          </p>
          <ul>
            <li>A classified advertising platform for the agricultural sector</li>
            <li>A connection point between buyers and sellers</li>
            <li>An information-sharing platform for agricultural products and services</li>
            <li>We do not participate in shipping, delivery, or product handling</li>
          </ul>

          <h2>2. Shipping Arrangements</h2>
          <p>
            Please note that:
          </p>
          <ul>
            <li>All shipping and delivery arrangements must be made directly between buyers and sellers</li>
            <li>We do not provide shipping services or coordinate deliveries</li>
            <li>Shipping costs and methods are determined by individual sellers</li>
            <li>We are not responsible for any shipping-related issues or delays</li>
          </ul>

          <h2>3. User Responsibility</h2>
          <p>
            Users should:
          </p>
          <ul>
            <li>Discuss shipping arrangements with sellers before making a purchase</li>
            <li>Clearly agree on shipping costs and delivery timeframes</li>
            <li>Verify seller's shipping methods and reliability</li>
            <li>Document all shipping-related communications</li>
            <li>Consider local pickup when possible for large or valuable items</li>
          </ul>

          <h2>4. Safety Guidelines</h2>
          <p>
            For safe transactions:
          </p>
          <ul>
            <li>Meet in safe, public locations for local pickups</li>
            <li>Use trusted shipping services for distance transactions</li>
            <li>Document item condition before shipping</li>
            <li>Consider insurance for valuable items</li>
            <li>Keep tracking information and shipping receipts</li>
          </ul>

          <h2>5. Delivery Verification</h2>
          <p>
            We recommend:
          </p>
          <ul>
            <li>Inspecting items upon delivery before accepting them</li>
            <li>Documenting any damage or discrepancies immediately</li>
            <li>Communicating issues promptly with the seller</li>
            <li>Keeping proof of delivery and condition</li>
          </ul>

          <h2>6. Limitation of Liability</h2>
          <p>
            Please understand that:
          </p>
          <ul>
            <li>Kisan Markaz is not responsible for any shipping or delivery arrangements</li>
            <li>We do not guarantee delivery times or shipping costs quoted by sellers</li>
            <li>We are not liable for lost, damaged, or delayed shipments</li>
            <li>All shipping arrangements are made at users' own risk</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
            <p className="text-blue-700">
              <strong>Contact Information:</strong><br />
              For platform-related inquiries only (not shipping issues), contact us at:<br />
              Email: support@kisanmarkaz.pk<br />
              Hours: Monday to Friday, 9:00 AM - 5:00 PM PKT
            </p>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mt-8">
            <p className="text-gray-700">
              <strong>Reminder:</strong> Kisan Markaz is a platform for connecting buyers and sellers. We do not participate in or guarantee any shipping arrangements between users. Always exercise caution and verify all details before proceeding with any transaction.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingPolicy; 