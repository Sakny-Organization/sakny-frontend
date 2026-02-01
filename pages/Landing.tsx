import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Landing: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
              Find your perfect Egyptian roommate with Sakny
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with compatible roommates in Egypt who share your lifestyle, values, and preferences. Our smart matching makes finding the right fit easy.
            </p>
            <div className="flex gap-4">
              <Link to="/signup">
                <Button size="lg" variant="primary">Get started</Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="outline">Browse roommates</Button>
              </Link>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Egyptian cityscape"
              className="rounded-xl shadow-lg w-full object-cover"
              style={{ height: '500px' }}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">How Sakny works ?</h2>
            <p className="text-gray-500 text-base">Three simple steps to move into your next shared flat in Egypt</p>
          </div>

          {/* Three Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-black mb-3">1. Create your profile</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Add your lifestyle, budget in EGP, and preferred Egyptian areas like Nasr City or Mohandessin.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-black mb-3">2. Tell us your preferences</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Choose whether you prefer same-gender roommates only or if you are open to mixed-gender stays.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-black mb-3">3. Chat and move in</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Message potential roommates, agree on rent, and Move into a place that fits your lifestyle.
              </p>
            </div>
          </div>

          {/* Target Audience Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* For Students */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-black mb-3">For Students</h3>
              <p className="text-gray-500 text-sm mb-4">
                Perfect for AUC, Cairo University, Ain Shams, and private university students.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Filter by campus proximity and shared rooms.</li>
                <li>Match with other students with similar study schedules.</li>
                <li>Affordable rooms from 1,500 EGP/month</li>
              </ul>
            </div>

            {/* For Young Professionals */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-black mb-3">For Young Professionals</h3>
              <p className="text-gray-500 text-sm mb-4">
                Ideal for fresh graduates and working professionals in Cairo, Giza, Alexandria.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Choose neighborhoods like New Cairo, Zamalek, or Sheikh Zayed.</li>
                <li>Filter by quiet, non-smoking, or work-from-home friendly flats.</li>
                <li>Transparent rents in EGP with clear bills split.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Landing;
