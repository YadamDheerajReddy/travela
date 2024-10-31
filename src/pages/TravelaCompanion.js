import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GEMINI_API_KEY, UNSPLASH_ACCESS_KEY } from '../config/api';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Initial state for travel data
const initialTravelData = {
  history: "",
  trivia: [],
  places: [],
  hotels: [],
  cuisine: [],
  tips: []
};

const TravelaCompanion = () => {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [travelData, setTravelData] = useState(null);
  const [images, setImages] = useState([]);

  const fetchImages = async (query) => {
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: {
          query: `${query} tourist attractions`,
          per_page: 6
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });
      return response.data.results.map(img => img.urls.regular);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images. Please try again.');
      return [];
    }
  };

  const generateTravelInfo = async () => {
    if (!location.trim()) {
      toast.error('Please enter a location');
      return;
    }

    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Create a comprehensive travel guide for ${location} with the following details:
      1. A brief history of the location (2-3 sentences)
      2. Three interesting facts about the place
      3. Two must-visit places with brief descriptions
      4. Two recommended hotels with price ranges
      5. Two local dishes with brief descriptions
      6. Three important travel tips

      Please provide the response in this exact JSON format:
      {
        "history": "string",
        "trivia": ["fact1", "fact2", "fact3"],
        "places": [{"name": "string", "description": "string"}, {"name": "string", "description": "string"}],
        "hotels": [{"name": "string", "priceRange": "string"}, {"name": "string", "priceRange": "string"}],
        "cuisine": [{"dish": "string", "description": "string"}, {"dish": "string", "description": "string"}],
        "tips": ["tip1", "tip2", "tip3"]
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        const jsonStr = jsonMatch[0];
        const data = JSON.parse(jsonStr);

        // Add booking links to hotels
        data.hotels = data.hotels.map(hotel => ({
          ...hotel,
          bookingLink: "https://booking.com"
        }));

        const locationImages = await fetchImages(location);
        
        setTravelData(data);
        setImages(locationImages);
      } catch (error) {
        console.error('Error processing response:', error);
        toast.error('Failed to process travel information. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate travel information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900">
      <Navbar />

      {/* Search Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Discover Your Next Destination
          </motion.h1>
          
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex gap-4">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter a location..."
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-sunset"
              />
              <button
                onClick={generateTravelInfo}
                disabled={loading}
                className="px-8 py-4 bg-accent-sunset text-white rounded-xl hover:bg-accent-sunset/90 transition-all disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Explore'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      {travelData && (
        <motion.section 
          className="py-16 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="max-w-7xl mx-auto">
            {/* History Section */}
            {travelData.history && (
              <motion.div 
                className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">History</h2>
                <p className="text-gray-300 whitespace-pre-line">{travelData.history}</p>
              </motion.div>
            )}

            {/* Trivia Section */}
            {travelData.trivia && travelData.trivia.length > 0 && (
              <motion.div 
                className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">Interesting Trivia</h2>
                <ul className="list-disc list-inside space-y-2">
                  {travelData.trivia.map((item, index) => (
                    <li key={index} className="text-gray-300">{item}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Places Section */}
            {travelData.places && travelData.places.length > 0 && (
              <motion.div 
                className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">Must-Visit Places</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {travelData.places.map((place, index) => (
                    <div key={index} className="bg-white/5 p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-white mb-2">{place.name}</h3>
                      <p className="text-gray-300">{place.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Hotels Section */}
            {travelData.hotels && travelData.hotels.length > 0 && (
              <motion.div 
                className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">Best Hotels</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {travelData.hotels.map((hotel, index) => (
                    <div key={index} className="bg-white/5 p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-white mb-2">{hotel.name}</h3>
                      <p className="text-gray-300 mb-2">Price Range: {hotel.priceRange}</p>
                      <a 
                        href={hotel.bookingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-sunset hover:text-accent-sunset/80"
                      >
                        Book Now →
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Cuisine Section */}
            {travelData.cuisine && travelData.cuisine.length > 0 && (
              <motion.div 
                className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">Local Cuisine</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {travelData.cuisine.map((item, index) => (
                    <div key={index} className="bg-white/5 p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-white mb-2">{item.dish}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tips Section */}
            {travelData.tips && travelData.tips.length > 0 && (
              <motion.div 
                className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">Travel Tips</h2>
                <ul className="list-disc list-inside space-y-2">
                  {travelData.tips.map((tip, index) => (
                    <li key={index} className="text-gray-300">{tip}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Images Grid */}
            {images && images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {images.map((img, index) => (
                  <motion.div
                    key={index}
                    className="rounded-2xl overflow-hidden h-64"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <img 
                      src={img} 
                      alt={`${location} attraction`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default TravelaCompanion;