import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative py-20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            className="text-7xl font-bold text-white leading-tight"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore the World
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-sunset to-accent-forest"
              whileHover={{ scale: 1.05 }}
            >
              With AI Magic
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="mt-8 text-2xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Your next adventure awaits, powered by cutting-edge AI technology.
          </motion.p>

          <motion.div 
            className="mt-12 flex gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button 
              className="btn-primary text-lg group relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-sunset to-accent-forest opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-32 relative">
        <motion.div 
          className="max-w-6xl mx-auto px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-center text-white mb-20">
            The Future of Travel Planning
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Itineraries",
                description: "Personalized travel plans that adapt to your preferences in real-time",
                icon: "✨"
              },
              {
                title: "Local Secrets",
                description: "Discover hidden gems and authentic experiences curated by locals",
                icon: "🗺️"
              },
              {
                title: "Smart Predictions",
                description: "Get intelligent recommendations based on weather, crowds, and events",
                icon: "🎯"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <motion.section 
        className="py-32 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center text-white mb-20">
            Traveler Stories
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                quote: "The AI recommendations were spot-on! Found amazing places I never would have discovered otherwise.",
                author: "Elena Rodriguez",
                role: "Adventure Seeker"
              },
              {
                quote: "This platform revolutionized how I plan my business trips. Saves time and finds perfect spots for meetings.",
                author: "Michael Chang",
                role: "Business Traveler"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.3 }}
                className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20"
              >
                <p className="text-xl text-white mb-6">"{testimonial.quote}"</p>
                <div className="border-l-4 border-accent-sunset pl-4">
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-gray-300">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-7xl font-bold bg-gradient-to-r from-accent-sunset to-accent-forest bg-clip-text text-transparent mb-4">
              50,000+
            </div>
            <p className="text-2xl text-gray-300">Adventures Created</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Landing;