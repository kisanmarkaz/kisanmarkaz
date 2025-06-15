import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Helmet } from 'react-helmet';
import { Calendar, User, Clock } from 'lucide-react';

// This would typically come from an API or database
const getBlogPost = (id: string) => {
  const blogPosts = [
    {
      id: 1,
      title: "Complete Guide to Smart Farming Technologies in Pakistan 2024",
      content: `
        Smart farming is revolutionizing agriculture in Pakistan, making it more efficient and productive than ever before. This comprehensive guide explores how farmers can leverage modern technology to improve their yields and reduce costs.

        ## What is Smart Farming?
        Smart farming combines modern technology with traditional agricultural practices to optimize crop production. It includes:
        - IoT sensors for soil monitoring
        - Automated irrigation systems
        - Drone technology for crop surveillance
        - AI-powered yield prediction
        
        ## Benefits for Pakistani Farmers
        - Reduced water consumption
        - Better crop health monitoring
        - Increased yield prediction accuracy
        - Lower operational costs
        
        ## Implementation Guide
        1. Start with basic soil sensors
        2. Implement smart irrigation
        3. Use mobile apps for crop monitoring
        4. Gradually adopt advanced technologies

        ## Cost Considerations
        - Initial investment requirements
        - Available government subsidies
        - Return on investment analysis
        
        ## Success Stories
        Several farmers in Punjab and Sindh have successfully implemented smart farming techniques, resulting in:
        - 30% reduction in water usage
        - 25% increase in crop yield
        - 40% decrease in pesticide use
      `,
      excerpt: "Discover how IoT, AI, and precision agriculture are revolutionizing farming practices in Pakistan. Learn about affordable smart farming solutions for small to medium-scale farmers...",
      image: "/blogs/smart-farming.jpg",
      category: "Technology",
      author: "Dr. Ali Ahmed",
      date: "March 20, 2024",
      readTime: "12 min read",
      keywords: "smart farming Pakistan, precision agriculture, IoT farming, agricultural technology"
    },
    {
      id: 2,
      title: "Organic Farming Methods: Boost Your Crop Yield Naturally",
      content: `
        Organic farming is gaining momentum in Pakistan as farmers seek sustainable and environmentally friendly methods to improve their yields. This comprehensive guide will help you transition to organic farming practices.

        ## Understanding Organic Farming
        Organic farming focuses on natural methods of cultivation without synthetic pesticides or fertilizers. Key principles include:
        - Soil health management
        - Natural pest control
        - Crop rotation
        - Composting techniques

        ## Natural Pest Control Methods
        Effective organic pest management includes:
        - Companion planting
        - Beneficial insects
        - Neem-based solutions
        - Trap crops
        
        ## Soil Health Management
        Maintaining healthy soil is crucial for organic farming:
        - Regular composting
        - Cover cropping
        - Mulching techniques
        - Crop rotation planning

        ## Market Opportunities
        The organic produce market offers:
        - Premium pricing
        - Export potential
        - Growing local demand
        - Certification benefits

        ## Success Case Studies
        Local farmers have achieved:
        - 20% higher market prices
        - Reduced input costs
        - Improved soil fertility
        - Better crop resilience
      `,
      excerpt: "Step-by-step guide to implementing organic farming techniques, including natural pest control, crop rotation, and soil health management for maximum productivity...",
      image: "/blogs/organic-farming.jpg",
      category: "Farming Techniques",
      author: "Fatima Khan",
      date: "March 18, 2024",
      readTime: "10 min read",
      keywords: "organic farming, natural pest control, soil health, crop rotation"
    }
  ];

  // Add more blog posts...
  const additionalPosts = [
    {
      id: 3,
      title: "Climate-Smart Agriculture: Adapting to Weather Changes in Pakistan",
      content: `
        Climate change poses significant challenges to Pakistani agriculture. Learn how to adapt your farming practices to changing weather patterns and protect your crops.

        ## Understanding Climate Challenges
        Key climate-related issues affecting Pakistani agriculture:
        - Irregular rainfall patterns
        - Extreme temperature fluctuations
        - Increased frequency of droughts
        - Shifting growing seasons

        ## Adaptation Strategies
        Effective methods to combat climate change:
        - Drought-resistant crop varieties
        - Water conservation techniques
        - Protected cultivation methods
        - Weather monitoring systems

        ## Water Management
        Smart water usage strategies:
        - Drip irrigation systems
        - Rainwater harvesting
        - Soil moisture conservation
        - Efficient water scheduling

        ## Crop Selection
        Climate-resilient farming requires:
        - Heat-tolerant varieties
        - Short-duration crops
        - Mixed cropping systems
        - Alternative crop planning

        ## Technology Integration
        Modern tools for climate adaptation:
        - Weather forecasting apps
        - Soil moisture sensors
        - Temperature monitoring
        - Crop advisory services
      `,
      excerpt: "Learn effective strategies to protect your crops from extreme weather conditions and implement climate-resilient farming practices...",
      image: "/blogs/climate-smart.jpg",
      category: "Sustainability",
      author: "Hassan Malik",
      date: "March 16, 2024",
      readTime: "8 min read",
      keywords: "climate-smart agriculture, weather-resistant farming, sustainable agriculture Pakistan"
    },
    {
      id: 4,
      title: "Agricultural Finance: Complete Guide to Loans and Subsidies in Pakistan",
      content: `
        Understanding and accessing financial resources is crucial for agricultural success. This guide covers all aspects of agricultural finance in Pakistan.

        ## Government Loan Schemes
        Available government programs:
        - Kissan Dost Scheme
        - E-Credit Program
        - Interest-free loans
        - Seasonal financing options

        ## Private Banking Options
        Commercial banking solutions:
        - Equipment financing
        - Crop insurance
        - Working capital loans
        - Land purchase financing

        ## Documentation Requirements
        Essential documents needed:
        - Land ownership papers
        - Crop cultivation history
        - Income statements
        - Credit history records

        ## Application Process
        Step-by-step guide:
        1. Document preparation
        2. Bank selection
        3. Application submission
        4. Follow-up procedures

        ## Risk Management
        Financial protection strategies:
        - Crop insurance options
        - Weather index insurance
        - Revenue protection plans
        - Multi-peril coverage
      `,
      excerpt: "Comprehensive overview of agricultural financing options, government schemes, and private lending opportunities for farmers in Pakistan...",
      image: "/blogs/agri-finance.jpg",
      category: "Financial Guide",
      author: "Zainab Ali",
      date: "March 14, 2024",
      readTime: "15 min read",
      keywords: "agricultural loans Pakistan, farmer subsidies, agri-finance"
    },
    {
      id: 5,
      title: "Modern Irrigation Systems: Water Management Solutions for Pakistani Farmers",
      content: `
        Efficient irrigation is key to successful farming in Pakistan. Discover modern irrigation technologies and methods to optimize water usage.

        ## Modern Irrigation Technologies
        Advanced systems available:
        - Drip irrigation
        - Sprinkler systems
        - Center pivot irrigation
        - Smart irrigation controllers

        ## Water Conservation Methods
        Effective water-saving techniques:
        - Soil moisture monitoring
        - Scheduled irrigation
        - Water recycling
        - Mulching practices

        ## System Selection Guide
        Factors to consider:
        - Crop type requirements
        - Land topography
        - Water availability
        - Cost considerations

        ## Installation Process
        Implementation steps:
        1. Site assessment
        2. System design
        3. Component selection
        4. Installation procedure

        ## Maintenance Tips
        Regular upkeep requirements:
        - Filter cleaning
        - Leak detection
        - Pressure monitoring
        - Seasonal maintenance
      `,
      excerpt: "Explore efficient irrigation technologies and water conservation methods to reduce costs and improve crop yield in water-scarce regions...",
      image: "/blogs/irrigation-systems.jpg",
      category: "Technology",
      author: "Muhammad Usman",
      date: "March 12, 2024",
      readTime: "9 min read",
      keywords: "irrigation systems Pakistan, water management agriculture, drip irrigation"
    },
    {
      id: 6,
      title: "High-Value Crops: Top 10 Most Profitable Crops to Grow in Pakistan",
      content: `
        Maximize your farming profits by focusing on high-value crops suited to Pakistan's climate and market demands.

        ## Top Profitable Crops
        Most lucrative options:
        - Saffron cultivation
        - Olive farming
        - Mushroom growing
        - Organic vegetables
        - Medicinal herbs

        ## Market Analysis
        Understanding demand:
        - Local market trends
        - Export opportunities
        - Price fluctuations
        - Seasonal demand

        ## Cultivation Requirements
        Essential growing conditions:
        - Soil requirements
        - Climate conditions
        - Water needs
        - Technical expertise

        ## Investment Analysis
        Financial considerations:
        - Initial setup costs
        - Operating expenses
        - Expected returns
        - Break-even analysis

        ## Success Strategies
        Best practices for success:
        - Quality control measures
        - Marketing approaches
        - Storage solutions
        - Distribution channels
      `,
      excerpt: "Analysis of the most lucrative crops suitable for Pakistani climate, including market demand, cultivation tips, and profit margins...",
      image: "/blogs/profitable-crops.jpg",
      category: "Market Insights",
      author: "Dr. Sarah Khan",
      date: "March 10, 2024",
      readTime: "11 min read",
      keywords: "profitable crops Pakistan, high-value agriculture, crop market analysis"
    },
    {
      id: 7,
      title: "Livestock Management: Modern Practices for Dairy and Poultry Farming",
      content: `
        Modern livestock management techniques can significantly improve your dairy and poultry farming productivity and profitability.

        ## Dairy Farming Best Practices
        Essential management aspects:
        - Breed selection
        - Nutrition management
        - Health monitoring
        - Milking techniques

        ## Poultry Management
        Key success factors:
        - Housing systems
        - Feed optimization
        - Disease prevention
        - Production planning

        ## Health Management
        Preventive care measures:
        - Vaccination schedules
        - Regular check-ups
        - Disease monitoring
        - Biosecurity measures

        ## Feed Management
        Nutrition optimization:
        - Feed formulation
        - Feeding schedules
        - Quality control
        - Storage practices

        ## Technology Integration
        Modern farming tools:
        - Automated feeding systems
        - Health monitoring devices
        - Climate control
        - Record keeping software
      `,
      excerpt: "Expert guidelines on efficient livestock management, including health care, feed optimization, and breeding techniques...",
      image: "/blogs/livestock-management.jpg",
      category: "Livestock",
      author: "Dr. Imran Shah",
      date: "March 8, 2024",
      readTime: "13 min read",
      keywords: "livestock management Pakistan, dairy farming, poultry farming"
    },
    {
      id: 8,
      title: "Post-Harvest Technology: Reducing Crop Losses and Maximizing Profits",
      content: `
        Proper post-harvest handling is crucial for maintaining crop quality and reducing losses. Learn about modern storage and processing techniques.

        ## Storage Technologies
        Modern storage solutions:
        - Cold storage facilities
        - Controlled atmosphere storage
        - Modified atmosphere packaging
        - Grain storage systems

        ## Quality Maintenance
        Preservation techniques:
        - Temperature control
        - Humidity management
        - Pest prevention
        - Quality monitoring

        ## Processing Methods
        Value addition options:
        - Grading systems
        - Packaging solutions
        - Processing equipment
        - Quality certification

        ## Loss Prevention
        Reducing waste through:
        - Proper handling
        - Transportation methods
        - Storage conditions
        - Market timing

        ## Market Integration
        Connecting with buyers:
        - Direct marketing
        - Online platforms
        - Export channels
        - Local markets
      `,
      excerpt: "Learn about modern storage techniques, processing methods, and marketing strategies to minimize post-harvest losses...",
      image: "/blogs/post-harvest.jpg",
      category: "Technology",
      author: "Asma Mahmood",
      date: "March 6, 2024",
      readTime: "10 min read",
      keywords: "post-harvest technology, crop storage, agricultural marketing"
    },
    {
      id: 9,
      title: "Sustainable Pest Management: Integrated Approaches for Better Yield",
      content: `
        Implement effective and environmentally friendly pest management strategies to protect your crops and increase yields.

        ## IPM Fundamentals
        Core principles include:
        - Prevention methods
        - Monitoring techniques
        - Control strategies
        - Environmental protection

        ## Biological Control
        Natural pest management:
        - Beneficial insects
        - Microbial controls
        - Natural predators
        - Trap crops

        ## Chemical Management
        Responsible use of pesticides:
        - Selection criteria
        - Application timing
        - Safety measures
        - Environmental impact

        ## Prevention Strategies
        Proactive measures:
        - Crop rotation
        - Resistant varieties
        - Cultural practices
        - Sanitation methods

        ## Monitoring Systems
        Early detection through:
        - Regular inspection
        - Pest identification
        - Population tracking
        - Damage assessment
      `,
      excerpt: "Comprehensive guide to implementing IPM strategies, biological control methods, and eco-friendly pest management solutions...",
      image: "/blogs/pest-management.jpg",
      category: "Farming Techniques",
      author: "Dr. Khalid Ahmed",
      date: "March 4, 2024",
      readTime: "9 min read",
      keywords: "integrated pest management, biological control, sustainable farming"
    },
    {
      id: 10,
      title: "Success Story: How Small Farmers Are Using Digital Marketing in Pakistan",
      content: `
        Discover how small-scale farmers are leveraging digital platforms to reach wider markets and increase their profits.

        ## Digital Marketing Basics
        Essential online strategies:
        - Social media presence
        - E-commerce platforms
        - WhatsApp business
        - Online marketplaces

        ## Platform Selection
        Popular channels include:
        - Facebook Marketplace
        - Instagram Shopping
        - Agricultural apps
        - Local e-commerce

        ## Content Creation
        Effective marketing content:
        - Product photography
        - Video demonstrations
        - Customer testimonials
        - Educational content

        ## Customer Engagement
        Building relationships through:
        - Regular updates
        - Customer feedback
        - Direct communication
        - Community building

        ## Success Stories
        Real farmer experiences:
        - Market expansion
        - Price improvements
        - Direct customer access
        - Reduced middlemen
      `,
      excerpt: "Real-life examples of small-scale farmers leveraging digital platforms and e-commerce to increase their market reach and profits...",
      image: "/blogs/digital-marketing.jpg",
      category: "Success Stories",
      author: "Nabeel Hassan",
      date: "March 2, 2024",
      readTime: "7 min read",
      keywords: "digital marketing agriculture, farmer success stories, e-commerce farming"
    }
  ];

  return [...blogPosts, ...additionalPosts].find(post => post.id === parseInt(id));
};

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const post = getBlogPost(id || "");

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-center">Blog post not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{post.title} | KisanMarkaz</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.keywords} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={new Date(post.date).toISOString()} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
      </Helmet>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />

        <div className="mb-8">
          <div className="text-sm text-green-600 mb-2">{post.category}</div>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center space-x-6 text-gray-600 mb-8">
            <span className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {post.author}
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {post.date}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {post.readTime}
            </span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          {post.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('##')) {
              return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('##', '').trim()}</h2>;
            } else if (paragraph.startsWith('-')) {
              return <li key={index} className="ml-4">{paragraph.replace('-', '').trim()}</li>;
            } else if (paragraph.trim().length > 0) {
              return <p key={index} className="mb-4">{paragraph}</p>;
            }
            return null;
          })}
        </div>

        <div className="mt-8 pt-8 border-t">
          <h3 className="text-xl font-semibold mb-4">Share this article</h3>
          <div className="flex space-x-4">
            {/* Add social sharing buttons here */}
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost; 