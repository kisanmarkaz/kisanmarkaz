import React from 'react';
import { Calendar, User, Clock, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Modern Farming Techniques for Better Yield",
      excerpt: "Learn about the latest farming techniques that can help increase your crop yield while maintaining sustainability...",
      image: "/blog/modern-farming.jpg",
      category: "Farming Techniques",
      author: "Dr. Ali Ahmed",
      date: "March 15, 2024",
      readTime: "8 min read"
    },
    {
      id: 2,
      title: "Understanding Crop Insurance in Pakistan",
      excerpt: "A comprehensive guide to agricultural insurance options available to farmers in Pakistan and how to choose the right coverage...",
      image: "/blog/crop-insurance.jpg",
      category: "Financial Guide",
      author: "Fatima Khan",
      date: "March 12, 2024",
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "Best Practices for Livestock Management",
      excerpt: "Expert tips on maintaining healthy livestock, disease prevention, and maximizing productivity in your cattle farm...",
      image: "/blog/livestock.jpg",
      category: "Livestock",
      author: "Hassan Malik",
      date: "March 10, 2024",
      readTime: "10 min read"
    },
    {
      id: 4,
      title: "Sustainable Water Management for Agriculture",
      excerpt: "Discover efficient irrigation techniques and water conservation methods to make your farm more sustainable...",
      image: "/blog/irrigation.jpg",
      category: "Sustainability",
      author: "Zainab Ali",
      date: "March 8, 2024",
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Blog</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="text-sm text-green-600 mb-2">{post.category}</div>
                <h2 className="text-xl font-semibold mb-2 hover:text-green-600 transition-colors duration-200">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
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
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Blog; 