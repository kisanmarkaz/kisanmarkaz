import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserListings } from '@/hooks/useListings';
import ListingCard from '@/components/ListingCard';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '@/lib/animations';
import Layout from '@/components/Layout';

const MyListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: listings, isLoading, error } = useUserListings(user?.id);

  // Redirect to auth page if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <Layout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="container mx-auto px-4 py-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => navigate('/sell')}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Listing
            </Button>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-4">
            Error loading listings. Please try again later.
          </div>
        ) : listings?.length === 0 ? (
          <motion.div
            variants={slideUp}
            className="text-center py-12"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              You haven't created any listings yet
            </h2>
            <p className="text-gray-600 mb-8">
              Start selling your agricultural products by creating your first listing
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/sell')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Listing
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings?.map((listing) => (
              <motion.div
                key={listing.id}
                variants={fadeIn}
                whileHover={{ scale: 1.02 }}
                className="transform transition-all duration-200"
              >
                <ListingCard listing={listing} showEditButton />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default MyListings; 