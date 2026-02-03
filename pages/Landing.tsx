import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { Brain, ShieldCheck, Lock, UserPlus, Users, MessageCircle } from 'lucide-react';

const Landing: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-white relative">
      {/* Hero Section */}
      <section className="px-6 lg:px-12 py-12 lg:py-24 relative">
        <motion.div
          className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="flex flex-col gap-8" variants={itemVariants}>
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-borderLight text-primary text-xs font-bold uppercase tracking-wider w-fit"
              variants={itemVariants}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Next-Gen Living
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-textDark"
              variants={itemVariants}
            >
              Find your perfect space,
              <span className="text-muted"> with the perfect person.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-lg lg:text-xl text-muted leading-relaxed max-w-[540px]"
              variants={itemVariants}
            >
              Experience AI-driven compatibility combined with premium urban living. We match you based on lifestyle, habits, and shared values.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
              <Link to="/signup">
                <Button size="lg" variant="primary" className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90">
                  Start Matching
                </Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary hover:text-white">
                  <span>▶</span>
                  See How it works
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div className="relative" variants={itemVariants}>
            <motion.div
              className="absolute -inset-4 bg-muted/5 blur-2xl rounded-[2rem]"
              style={{ opacity: scrollY > 100 ? 0.5 : 0.2 }}
            ></motion.div>
            <motion.div
              className="relative border border-borderLight rounded-3xl overflow-hidden shadow-sm"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <img
                alt="Modern living room apartment"
                className="w-full h-[550px] object-cover"
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              />

              {/* Overlay Card - Refined to Clean Light Style */}
              <motion.div
                className="absolute bottom-6 left-6 right-6 bg-white border border-borderLight rounded-2xl p-4 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full border-2 border-primary p-0.5">
                      <img
                        alt="User profile"
                        className="w-full h-full object-cover rounded-full"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-textDark text-sm">Sarah Ahmed</p>
                      <p className="text-xs text-muted">UX Designer • Cairo</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-primary">98%</p>
                    <p className="text-xs text-muted uppercase font-bold">Match</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 lg:px-12 py-24 bg-card border-y border-borderLight" id="features">
        <motion.div
          className="max-w-[1200px] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="text-center mb-16 space-y-4" variants={itemVariants}>
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-textDark">
              Built for trust.
              <span className="text-muted"> Designed for life.</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto text-lg">
              Our platform is designed for the modern urbanite who values security and long-term compatibility.
            </p>
          </motion.div>

          <motion.div className="grid md:grid-cols-3 gap-8" variants={containerVariants}>
            {[
              {
                Icon: Brain,
                title: 'AI Matching',
                description: 'Proprietary algorithm based on lifestyle, social habits, and cleaning preferences.',
              },
              {
                Icon: ShieldCheck,
                title: 'Verified Profiles',
                description: 'Every member is identity-verified with background checks for complete peace of mind.',
              },
              {
                Icon: Lock,
                title: 'Secure Chat',
                description: 'End-to-end encrypted messaging to discuss your future home safely on our platform.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group p-8 rounded-2xl bg-white border border-borderLight hover:border-primary transition-all shadow-sm"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="size-16 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-all"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-textDark">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 lg:px-12 py-24 bg-white" id="how-it-works">
        <motion.div
          className="max-w-[960px] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-3xl font-black mb-12 text-center lg:text-left text-textDark"
            variants={itemVariants}
          >
            Your journey to <span className="text-muted">better living</span>
          </motion.h2>

          <motion.div className="space-y-0" variants={containerVariants}>
            {[
              {
                step: 1,
                Icon: UserPlus,
                title: 'Create Your Profile',
                description: "Tell us about your lifestyle, budget, and what makes you a great roommate. Our deep-profile system captures the nuances that matter.",
              },
              {
                step: 2,
                Icon: Users,
                title: 'AI Matching',
                description: 'Browse curated profiles with high-compatibility scores. We rank matches based on 50+ data points to ensure long-term harmony.',
              },
              {
                step: 3,
                Icon: MessageCircle,
                title: 'Secure Connection',
                description: "Start conversations within our secure environment. Schedule video calls or tours without sharing personal contact info until you're ready.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="grid grid-cols-[80px_1fr] gap-x-8 pb-16"
                variants={itemVariants}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`size-14 rounded-full flex items-center justify-center z-10 ${i < 2
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white border-2 border-primary text-primary'
                      }`}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <item.Icon size={24} strokeWidth={1.5} />
                  </motion.div>
                  {i < 2 && <div className="w-1 bg-borderLight h-full mt-2"></div>}
                </div>
                <div className={`pt-4 ${i < 2 ? 'pb-16' : ''}`}>
                  <h4 className="text-xl font-bold mb-2 text-textDark">{item.title}</h4>
                  <p className="text-muted text-lg leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 lg:px-12 py-24 bg-card border-t border-borderLight" id="testimonials">
        <motion.div
          className="max-w-[1200px] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16" variants={itemVariants}>
            <div className="max-w-xl">
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-textDark mb-6">
                Loved by urban professionals.
              </h2>
              <p className="text-muted text-lg lg:text-xl leading-relaxed">
                Over 5,000 successful matches helping people find their perfect living situation.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[
              {
                name: 'Mohamed Sallam',
                role: 'Architect',
                text: '"Sakny found me a roommate who actually shares my coffee obsession and quiet morning vibes. It’s a total game changer."',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              },
              {
                name: 'Layla Ahmed',
                role: 'Marketing Lead',
                text: '"The verification process made me feel so much safer than Craigslist. I found my best friend and roommate here."',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              },
              {
                name: 'Omar Hassan',
                role: 'Software Engineer',
                text: '"Clean, intuitive, and the AI really works. It matched me with someone who has the exact same cleaning schedule as me."',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                className="bg-white p-8 rounded-2xl border border-borderLight flex flex-col gap-6 shadow-sm hover:border-primary transition-all"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>
                <p className="text-lg leading-relaxed italic text-muted">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-borderLight">
                  <img
                    alt={testimonial.name}
                    className="size-10 rounded-full object-cover"
                    src={testimonial.image}
                  />
                  <div>
                    <h5 className="font-bold text-textDark">{testimonial.name}</h5>
                    <p className="text-xs text-muted uppercase font-bold tracking-widest">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section - Keep Primary Black for High Impact */}
      <section className="px-6 lg:px-12 py-24">
        <motion.div
          className="max-w-[1200px] mx-auto bg-primary rounded-[2rem] p-12 lg:p-24 text-center overflow-hidden relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] -mr-32 -mt-32 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          ></motion.div>

          <motion.div className="relative z-10" variants={containerVariants}>
            <motion.h2
              className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tight"
              variants={itemVariants}
            >
              Ready to find your <br className="hidden lg:block" />
              next great roommate?
            </motion.h2>

            <motion.p
              className="text-white/80 text-lg lg:text-xl max-w-2xl mx-auto mb-12"
              variants={itemVariants}
            >
              Join thousands of others who found their perfect living situation through Sakny.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Link to="/signup">
                  <button className="h-16 px-10 bg-white text-primary font-black rounded-xl text-lg hover:shadow-2xl transition-all shadow-sm">
                    Get Started Now
                  </button>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link to="/search">
                  <button className="h-16 px-10 bg-primary border-2 border-white/20 text-white font-black rounded-xl text-lg hover:bg-white/10 transition-all">
                    Browse Listings
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;