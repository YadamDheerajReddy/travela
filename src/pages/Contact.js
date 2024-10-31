import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Convert coordinates from DMS to decimal degrees
  const coordinates = {
    lat: 14.416545, // 14° 24' 59.562'' N
    lng: 79.978128  // 79° 58' 41.2608'' E
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900">
      <Navbar />

      {/* Hero Section */}
      <motion.section 
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Have questions? We'd love to hear from you.
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Form and Map Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20"
            >
              <h2 className="text-3xl font-bold text-white mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-sunset"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-sunset"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-sunset"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-sunset"
                    required
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-accent-sunset to-accent-forest text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                  type="submit"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            {/* Map and Contact Info */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map */}
              <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20">
                <iframe
                  title="Location Map"
                  width="100%"
                  height="400"
                  frameBorder="0"
                  style={{ border: 0, borderRadius: '1rem' }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng-0.01}%2C${coordinates.lat-0.01}%2C${coordinates.lng+0.01}%2C${coordinates.lat+0.01}&layer=mapnik&marker=${coordinates.lat}%2C${coordinates.lng}`}
                ></iframe>
              </div>

              {/* Contact Info */}
              <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">📍</div>
                    <div>
                      <p className="text-white">14° 24' 59.562'' N, 79° 58' 41.2608'' E</p>
                      <p className="text-gray-300">Nellore, Andhra Pradesh, India</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">📧</div>
                    <div>
                      <p className="text-white">contact@travela.com</p>
                      <p className="text-gray-300">Email us for any questions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">📱</div>
                    <div>
                      <p className="text-white">+91 123 456 7890</p>
                      <p className="text-gray-300">Mon-Fri from 9am to 6pm</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;