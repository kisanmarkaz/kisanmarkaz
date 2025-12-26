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
import { FeaturedListingCardWrapper } from '@/components/FeaturedListingBadge';

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
  featured?: boolean;
  featured_expiry?: string;
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
    active: 'bg-green-500/90',
    sold: 'bg-blue-500/90',
    expired: 'bg-gray-500/90',
    draft: 'bg-yellow-500/90'
  };

  // Check if listing is currently featured
  const isFeatured = Boolean(listing.featured_listings &&
    listing.featured_listings.length > 0 &&
    listing.featured_listings.some((fl: any) =>
      fl.status === 'active' &&
      new Date(fl.featured_from) <= new Date() &&
      new Date(fl.featured_until) >= new Date()
    ));

  // Determine price color/style based on status
  const priceStyle = listing.status === 'sold' ? 'text-gray-500 line-through' : 'text-primary font-bold';

  return (
    <FeaturedListingCardWrapper isFeatured={isFeatured}>
      <motion.div
        className={`group relative bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20 ${isFeatured ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-100/50' : ''
          }`}
        whileHover={{ y: -8 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <motion.img
            src={listing.images?.[0] || "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=400&h=300&fit=crop"}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <motion.span
            className={`absolute top-3 left-3 ${statusColors[listing.status]} text-white px-3 py-1 text-xs font-bold rounded-full backdrop-blur-md shadow-sm`}
            whileHover={{ scale: 1.05 }}
          >
            {listing.status.toUpperCase()}
          </motion.span>

          {listing.category?.name && (
            <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              {listing.category.name}
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className={`text-xl ${priceStyle}`}>
              Rs {listing.price?.toLocaleString()}
            </h3>
            {listing.status === 'sold' && <span className="text-sm font-semibold text-blue-600">SOLD</span>}
          </div>

          <Link to={`/listing/${listing.id}`}>
            <h3 className="font-medium text-lg text-gray-800 mb-3 line-clamp-1 group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
          </Link>

          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1.5 text-primary/70" />
            <span className="truncate">{listing.location_city}, {listing.location_province}</span>
          </div>

          <div className="flex items-center text-xs text-gray-400 mb-4 pb-4 border-b border-gray-100">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            {format(new Date(listing.created_at), 'MMM d, yyyy')}
          </div>

          {showEditButton ? (
            <div className="flex gap-2.5">
              <Link to={`/edit-listing/${listing.id}`} className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
                >
                  <Edit className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">Delete Listing?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your listing.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 rounded-xl"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <Link to={`/listing/${listing.id}`}>
              <div className="flex items-center text-sm font-medium text-primary group-hover:underline decoration-2 underline-offset-4">
                View Details
                <motion.span
                  className="inline-block ml-1"
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                >
                  →
                </motion.span>
              </div>
            </Link>
          )}
        </div>
      </motion.div>
    </FeaturedListingCardWrapper>
  );
};

export default ListingCard;