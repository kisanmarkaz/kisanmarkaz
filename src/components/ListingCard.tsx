import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Calendar, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteListing } from '@/hooks/useListings';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface Listing {
  id: string;
  title: string;
  price: number;
  images: string[];
  status: 'active' | 'sold' | 'expired' | 'draft';
  category?: {
    name: string;
  };
  location_city: string;
  location_province: string;
  created_at: string;
}

interface ListingCardProps {
  listing: Listing;
  showEditButton?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, showEditButton = false }) => {
  const deleteListing = useDeleteListing();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteListing.mutateAsync(listing.id);
      toast({
        title: "Listing deleted",
        description: "Your listing has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the listing. Please try again.",
        variant: "destructive"
      });
    }
  };

  const statusColors = {
    active: 'bg-green-500',
    sold: 'bg-blue-500',
    expired: 'bg-gray-500',
    draft: 'bg-yellow-500'
  };

  return (
    <motion.div 
      className="glass-card bg-white/90 rounded-lg overflow-hidden hover-lift"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={listing.images?.[0] || "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=400&h=300&fit=crop"}
          alt={listing.title}
          className="w-full h-48 object-cover transition-transform duration-700"
          whileHover={{ scale: 1.1 }}
        />
        <motion.span 
          className={`absolute top-2 left-2 ${statusColors[listing.status]} text-white px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm shadow-md`}
          whileHover={{ scale: 1.1 }}
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {listing.status.toUpperCase()}
        </motion.span>
      </div>

      <div className="p-4 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-2">
          <motion.span 
            className="text-xs bg-green-100/80 text-green-700 px-2 py-1 rounded-full glass-button"
            whileHover={{ scale: 1.1 }}
          >
            {listing.category?.name}
          </motion.span>
          <motion.span 
            className="text-lg font-bold text-green-600 bg-green-50/50 px-3 py-1 rounded-full glass"
            whileHover={{ scale: 1.05, rotate: 1 }}
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            Rs {listing.price?.toLocaleString()}
          </motion.span>
        </div>

        <Link to={`/listing/${listing.id}`}>
          <motion.h3 
            className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-green-600 transition-colors"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {listing.title}
          </motion.h3>
        </Link>

        <motion.div 
          className="flex items-center text-sm text-gray-500 mb-2"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <MapPin className="h-4 w-4 mr-1 text-green-500" />
          </motion.div>
          {listing.location_city}, {listing.location_province}
        </motion.div>

        <motion.div 
          className="flex items-center text-xs text-gray-400 mb-4"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
          >
            <Calendar className="h-3 w-3 mr-1 text-green-400" />
          </motion.div>
          {format(new Date(listing.created_at), 'MMM d, yyyy')}
        </motion.div>

        {showEditButton && (
          <div className="flex gap-2">
            <Link to={`/edit-listing/${listing.id}`} className="flex-1">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full glass-button bg-green-50/50 border-green-200/50 hover:bg-green-100/50"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <Edit className="h-4 w-4 mr-1 text-green-600" />
                  </motion.div>
                  Edit
                </Button>
              </motion.div>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button
                    variant="outline" 
                    size="sm" 
                    className="w-full glass-button bg-red-50/50 border-red-200/50 hover:bg-red-100/50 text-red-600 hover:text-red-700"
                  >
                    <motion.div
                      animate={{ rotate: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                    </motion.div>
                    Delete
                  </Button>
                </motion.div>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-card border-red-200/50 backdrop-blur-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600">Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your listing.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="glass-button">Cancel</AlertDialogCancel>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 hover-glow"
                    >
                      Delete
                    </AlertDialogAction>
                  </motion.div>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ListingCard; 