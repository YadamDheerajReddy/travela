import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const CompleteProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    phoneNumber: '',
    dateOfBirth: '',
    nationality: '',
    preferredLanguage: 'English',
    travelPreferences: {
      adventure: false,
      culture: false,
      relaxation: false,
      food: false,
      shopping: false,
      nature: false,
    },
    dietaryRestrictions: {
      vegetarian: false,
      vegan: false,
      halal: false,
      kosher: false,
      none: true,
    },
    preferredAccommodation: [],
    budgetRange: 'medium',
    specialRequirements: '',
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (step === 3) {
      return formData.fullName && 
             formData.phoneNumber && 
             formData.dateOfBirth && 
             formData.nationality &&
             Object.values(formData.travelPreferences).some(v => v) && // At least one travel preference
             formData.preferredAccommodation.length > 0; // At least one accommodation
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (category, item) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category][item]
      }
    }));
  };

  const handleAccommodationChange = (type) => {
    setFormData(prev => ({
      ...prev,
      preferredAccommodation: prev.preferredAccommodation.includes(type)
        ? prev.preferredAccommodation.filter(t => t !== type)
        : [...prev.preferredAccommodation, type]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...formData,
        profileCompleted: true,
        updatedAt: new Date()
      });

      toast.success('Profile completed successfully!');
      navigate('/app');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-accent-night">Personal Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-accent-night">Travel Preferences</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What interests you while traveling?</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(formData.travelPreferences).map((pref) => (
              <label key={pref} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.travelPreferences[pref]}
                  onChange={() => handleCheckboxChange('travelPreferences', pref)}
                  className="rounded text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm capitalize">{pref}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Accommodation Types</label>
          <div className="grid grid-cols-2 gap-3">
            {['Hotel', 'Resort', 'Hostel', 'Apartment', 'Boutique Hotel', 'Homestay'].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.preferredAccommodation.includes(type)}
                  onChange={() => handleAccommodationChange(type)}
                  className="rounded text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
          <select
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="budget">Budget</option>
            <option value="medium">Medium</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-accent-night">Additional Preferences</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(formData.dietaryRestrictions).map((diet) => (
              <label key={diet} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.dietaryRestrictions[diet]}
                  onChange={() => handleCheckboxChange('dietaryRestrictions', diet)}
                  className="rounded text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm capitalize">{diet}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements or Notes</label>
          <textarea
            name="specialRequirements"
            value={formData.specialRequirements}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Any special requirements or preferences we should know about..."
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-4xl shadow-soft p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-accent-night">Complete Your Profile</h1>
            <p className="mt-2 text-secondary-600">Help us personalize your travel experiences</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-1/3 h-2 rounded-full ${
                    stepNumber <= step ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-primary-500 text-primary-500 rounded-xl hover:bg-primary-50 transition-colors duration-200"
                >
                  Previous
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="ml-auto px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!validateForm() || isSubmitting}
                  className={`ml-auto px-6 py-2 text-white rounded-xl transition-colors duration-200 ${
                    validateForm() && !isSubmitting ? 'bg-accent-sunset hover:bg-accent-sunset/90' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Completing...' : 'Complete Profile'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;