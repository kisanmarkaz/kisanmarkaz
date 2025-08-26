import React from 'react';
import Layout from '@/components/Layout';
import PaddleDebugger from '@/components/PaddleDebugger';

const PaddleDebug: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <PaddleDebugger />
      </div>
    </Layout>
  );
};

export default PaddleDebug;
