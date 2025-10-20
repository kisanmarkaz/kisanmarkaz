import React from 'react';
import { Calendar, User, Clock, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AdBanner160x300 from '@/components/AdBanner160x300';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Complete Guide to Smart Farming Technologies in Pakistan 2024",
      excerpt: "Discover how IoT, AI, and precision agriculture are revolutionizing farming practices in Pakistan. Learn about affordable smart farming solutions for small to medium-scale farmers...",
      image: "/blogs/smart-farming.jpg",
      category: "Technology",
      author: "Dr. Ali Ahmed",
      date: "March 20, 2024",
      readTime: "12 min read"
    },
    {
      id: 2,
      title: "Organic Farming Methods: Boost Your Crop Yield Naturally",
      excerpt: "Step-by-step guide to implementing organic farming techniques, including natural pest control, crop rotation, and soil health management for maximum productivity...",
      image: "/blogs/organic-farming.jpg",
      category: "Farming Techniques",
      author: "Fatima Khan",
      date: "March 18, 2024",
      readTime: "10 min read"
    },
    {
      id: 3,
      title: "Climate-Smart Agriculture: Adapting to Weather Changes in Pakistan",
      excerpt: "Learn effective strategies to protect your crops from extreme weather conditions and implement climate-resilient farming practices...",
      image: "/blogs/climate-smart.jpg",
      category: "Sustainability",
      author: "Hassan Malik",
      date: "March 16, 2024",
      readTime: "8 min read"
    },
    {
      id: 4,
      title: "Agricultural Finance: Complete Guide to Loans and Subsidies in Pakistan",
      excerpt: "Comprehensive overview of agricultural financing options, government schemes, and private lending opportunities for farmers in Pakistan...",
      image: "/blogs/agri-finance.jpg",
      category: "Financial Guide",
      author: "Zainab Ali",
      date: "March 14, 2024",
      readTime: "15 min read"
    },
    {
      id: 5,
      title: "Modern Irrigation Systems: Water Management Solutions for Pakistani Farmers",
      excerpt: "Explore efficient irrigation technologies and water conservation methods to reduce costs and improve crop yield in water-scarce regions...",
      image: "/blogs/irrigation-systems.jpg",
      category: "Technology",
      author: "Muhammad Usman",
      date: "March 12, 2024",
      readTime: "9 min read"
    },
    {
      id: 6,
      title: "High-Value Crops: Top 10 Most Profitable Crops to Grow in Pakistan",
      excerpt: "Analysis of the most lucrative crops suitable for Pakistani climate, including market demand, cultivation tips, and profit margins...",
      image: "/blogs/profitable-crops.jpg",
      category: "Market Insights",
      author: "Dr. Sarah Khan",
      date: "March 10, 2024",
      readTime: "11 min read"
    },
    {
      id: 7,
      title: "Livestock Management: Modern Practices for Dairy and Poultry Farming",
      excerpt: "Expert guidelines on efficient livestock management, including health care, feed optimization, and breeding techniques...",
      image: "/blogs/livestock-management.jpg",
      category: "Livestock",
      author: "Dr. Imran Shah",
      date: "March 8, 2024",
      readTime: "13 min read"
    },
    {
      id: 8,
      title: "Post-Harvest Technology: Reducing Crop Losses and Maximizing Profits",
      excerpt: "Learn about modern storage techniques, processing methods, and marketing strategies to minimize post-harvest losses...",
      image: "/blogs/post-harvest.jpg",
      category: "Technology",
      author: "Asma Mahmood",
      date: "March 6, 2024",
      readTime: "10 min read"
    },
    {
      id: 9,
      title: "Sustainable Pest Management: Integrated Approaches for Better Yield",
      excerpt: "Comprehensive guide to implementing IPM strategies, biological control methods, and eco-friendly pest management solutions...",
      image: "/blogs/pest-management.jpg",
      category: "Farming Techniques",
      author: "Dr. Khalid Ahmed",
      date: "March 4, 2024",
      readTime: "9 min read"
    },
    {
      id: 10,
      title: "Success Story: How Small Farmers Are Using Digital Marketing in Pakistan",
      excerpt: "Real-life examples of small-scale farmers leveraging digital platforms and e-commerce to increase their market reach and profits...",
      image: "/blogs/digital-marketing.jpg",
      category: "Success Stories",
      author: "Nabeel Hassan",
      date: "March 2, 2024",
      readTime: "7 min read"
    }
  ];

  const categories = [
    "Farming Techniques",
    "Market Insights",
    "Financial Guide",
    "Sustainability",
    "Livestock",
    "Technology",
    "Success Stories",
    "Industry News"
  ];

  return (
    <Layout>
      <Helmet>
        <title>Agricultural Blog - Expert Farming Tips & Insights | KisanMarkaz</title>
        <meta name="description" content="Discover expert farming tips, agricultural innovations, and market insights for Pakistani farmers. Learn about smart farming, organic techniques, and profitable crops." />
        <meta name="keywords" content="farming blog Pakistan, agricultural tips, smart farming, organic farming, agricultural technology, farmer success stories" />
        <meta property="og:title" content="Agricultural Blog - Expert Farming Tips & Insights | KisanMarkaz" />
        <meta property="og:description" content="Expert farming tips, agricultural innovations, and market insights for Pakistani farmers" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Agricultural Knowledge Hub</h1>
        
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <button
                key={index}
                className="px-4 py-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="text-sm text-green-600 mb-2">{post.category}</div>
                  <h2 className="text-xl font-semibold mb-2 hover:text-green-600 transition-colors duration-200">
                    <Link to={`/blog/${post.id}`} className="hover:text-green-600">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {post.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                    <Link to={`/blog/${post.id}`} className="flex items-center text-green-600 hover:text-green-700">
                      Read more
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
              {/* Add banner after every 6 posts */}
              {(index + 1) % 6 === 0 && index !== blogPosts.length - 1 && (
                <div className="hidden lg:block">
                  <AdBanner160x300 />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Blog; 