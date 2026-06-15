import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import { Brain, ShieldCheck, Lock, UserPlus, Users, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

const Landing = () => {
    const [scrollY, setScrollY] = useState(0);
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
    const imageRotate = useTransform(scrollYProgress, [0, 0.5], [0, 2]);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Enhanced container variants with spring physics
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
            },
        },
    };

    // Text reveal animation
    const textRevealVariants = {
        hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.9,
                ease: [0.25, 0.4, 0.25, 1],
            },
        },
    };

    // Slide up animation
    const slideUpVariants = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    // Scale fade animation
    const scaleFadeVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.7,
                ease: [0.25, 0.4, 0.25, 1],
            },
        },
    };

    // Floating animation for decorative elements
    const floatingAnimation = {
        y: [0, -15, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
        },
    };

    // Pulse animation
    const pulseAnimation = {
        scale: [1, 1.05, 1],
        opacity: [0.5, 0.8, 0.5],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    };

    // Original item variants for backward compatibility
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    return (<div className="bg-white relative">
      {/* Hero Section */}
      <section className="px-6 lg:px-12 py-12 lg:py-24 relative">
        <motion.div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-center" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div className="flex flex-col gap-8" variants={itemVariants}>
            {/* Badge with enhanced animation */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit cursor-pointer group"
              variants={scaleFadeVariants}
              whileHover={{ scale: 1.05, borderColor: 'rgba(0,0,0,0.3)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <motion.span
                className="relative flex h-2.5 w-2.5"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </motion.span>
              <span className="group-hover:text-black transition-colors">Next-Gen Living</span>
              <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            {/* Heading with text reveal animation */}
            <div className="overflow-hidden">
              <motion.h1
                className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-textDark"
                variants={textRevealVariants}
              >
                Find your perfect space,
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight"
                variants={textRevealVariants}
              >
                <span className="text-muted">with the perfect person.</span>
              </motion.h1>
            </div>

            {/* Subheading with fade in */}
            <motion.p
              className="text-lg lg:text-xl text-muted leading-relaxed max-w-[540px]"
              variants={slideUpVariants}
              transition={{ delay: 0.4 }}
            >
              Experience <motion.span className="text-textDark font-semibold" whileHover={{ color: '#000' }}>AI-driven compatibility</motion.span> combined with premium urban living. We match you based on lifestyle, habits, and shared values.
            </motion.p>

            {/* CTA Buttons with enhanced hover effects - Responsive */}
            <motion.div className="flex flex-row gap-4" variants={slideUpVariants} transition={{ delay: 0.5 }}>
              <Link to="/signup">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Button size="lg" variant="primary" className="bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all flex items-center justify-center gap-2 group whitespace-nowrap px-6">
                    <span className="whitespace-nowrap">Start Matching</span>
                    <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/search">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Button size="lg" variant="outline" className="flex items-center justify-center gap-2 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 group whitespace-nowrap px-6">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs group-hover:bg-white group-hover:text-black transition-all flex-shrink-0">
                      ▶
                    </span>
                    <span className="whitespace-nowrap">See How it works</span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Floating decorative elements */}
            <motion.div
              className="absolute -left-8 top-20 w-20 h-20 rounded-full bg-primary/10 blur-xl"
              animate={floatingAnimation}
            />
            <motion.div
              className="absolute right-10 top-40 w-32 h-32 rounded-full bg-primary/5 blur-2xl"
              animate={{
                y: [0, 20, 0],
                x: [0, 10, 0],
                transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          </motion.div>

          {/* Hero Image with parallax and float */}
          <motion.div
            className="relative"
            variants={scaleFadeVariants}
            style={{ y: heroY, opacity: heroOpacity }}
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-[3rem] blur-3xl"
              animate={pulseAnimation}
            />

            <motion.div
              className="relative border border-borderLight rounded-3xl overflow-hidden shadow-2xl"
              style={{ scale: imageScale, rotate: imageRotate }}
              whileHover={{ y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <img alt="Modern apartment living room" className="w-full h-[550px] object-cover" src="../image/Home 2.jpg"/>

              {/* Enhanced Overlay Card */}
              <motion.div
                className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm border border-borderLight rounded-2xl p-4 shadow-2xl"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="size-12 rounded-full border-2 border-primary p-0.5"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <img alt="User profile" className="w-full h-full object-cover rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"/>
                    </motion.div>
                    <div>
                      <p className="font-bold text-textDark text-sm">Sarah Ahmed</p>
                      <p className="text-xs text-muted">UX Designer • Cairo</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <motion.p
                      className="text-2xl font-black text-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
                    >
                      98%
                    </motion.p>
                    <p className="text-xs text-muted uppercase font-bold tracking-wider">Match</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating match indicator */}
              <motion.div
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs font-semibold text-textDark">Online</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section with Enhanced 3D Animations */}
      <section className="px-6 lg:px-12 py-24 bg-card border-y border-borderLight" id="features">
        <motion.div className="max-w-[1200px] mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants}>
          <motion.div className="text-center mb-16 space-y-4" variants={textRevealVariants}>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 text-xs font-bold uppercase tracking-wider mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Sparkles className="w-3 h-3" />
              Why Choose Sakny
            </motion.div>
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-textDark">
              Built for trust.
              <span className="text-muted"> Designed for life.</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto text-lg">
              Our platform is designed for the modern urbanite who values security and long-term compatibility.
            </p>
          </motion.div>

          <motion.div className="grid md:grid-cols-3 gap-8" variants={containerVariants}>
            {[{
                Icon: Brain,
                title: 'AI Matching',
                description: 'Proprietary algorithm based on lifestyle, social habits, and cleaning preferences.',
                gradient: 'from-purple-500/20 to-blue-500/20',
            }, {
                Icon: ShieldCheck,
                title: 'Verified Profiles',
                description: 'Every member is identity-verified with background checks for complete peace of mind.',
                gradient: 'from-green-500/20 to-emerald-500/20',
            }, {
                Icon: Lock,
                title: 'Secure Chat',
                description: 'End-to-end encrypted messaging to discuss your future home safely on our platform.',
                gradient: 'from-orange-500/20 to-red-500/20',
            }].map((feature, i) => (
              <motion.div
                key={i}
                className="group relative p-8 rounded-2xl bg-white border border-borderLight hover:border-black transition-all duration-500 cursor-pointer overflow-hidden"
                variants={slideUpVariants}
                whileHover={{
                  y: -10,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                  transition: { duration: 0.3 }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                {/* Animated gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  initial={false}
                />

                <div className="relative z-10">
                  <motion.div
                    className="size-16 rounded-2xl bg-black/5 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                  >
                    <feature.Icon className="w-8 h-8 text-black group-hover:text-white transition-colors" strokeWidth={1.5}/>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-textDark group-hover:text-black transition-colors">{feature.title}</h3>
                  <p className="text-muted leading-relaxed group-hover:text-gray-700 transition-colors">{feature.description}</p>

                  <motion.div
                    className="mt-6 flex items-center gap-2 text-sm font-semibold text-black opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section with Animated Timeline */}
      <section className="px-6 lg:px-12 py-24 bg-white" id="how-it-works">
        <motion.div className="max-w-[960px] mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants}>
          <motion.div className="text-center mb-16" variants={textRevealVariants}>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 text-xs font-bold uppercase tracking-wider mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
              Simple Process
            </motion.div>
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-textDark mb-4">
              Your journey to <span className="text-muted">better living</span>
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Three simple steps to find your perfect roommate match
            </p>
          </motion.div>

          <motion.div className="space-y-0 relative" variants={containerVariants}>
            {/* Animated vertical line */}
            <motion.div
              className="absolute left-[39px] top-0 w-1 bg-black/10 rounded-full origin-top"
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            />

            {[{
                step: 1,
                Icon: UserPlus,
                title: 'Create Your Profile',
                description: "Tell us about your lifestyle, budget, and what makes you a great roommate. Our deep-profile system captures the nuances that matter.",
                color: 'from-blue-500 to-cyan-500',
            }, {
                step: 2,
                Icon: Users,
                title: 'AI Matching',
                description: 'Browse curated profiles with high-compatibility scores. We rank matches based on 50+ data points to ensure long-term harmony.',
                color: 'from-purple-500 to-pink-500',
            }, {
                step: 3,
                Icon: MessageCircle,
                title: 'Secure Connection',
                description: "Start conversations within our secure environment. Schedule video calls or tours without sharing personal contact info until you're ready.",
                color: 'from-green-500 to-emerald-500',
            }].map((item, i) => (
              <motion.div
                key={i}
                className="grid grid-cols-[80px_1fr] gap-x-8 pb-16 relative"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6, type: 'spring', stiffness: 100 }}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`size-14 rounded-2xl flex items-center justify-center z-10 bg-gradient-to-br ${item.color} text-white shadow-lg`}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    custom={i}
                  >
                    <item.Icon size={24} strokeWidth={2}/>
                  </motion.div>
                  {/* Step number badge */}
                  <motion.div
                    className="mt-2 w-8 h-8 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: i * 0.2 + 0.3, type: 'spring', stiffness: 300 }}
                  >
                    {item.step}
                  </motion.div>
                </div>
                <motion.div
                  className={`pt-4 ${i < 2 ? 'pb-8' : ''}`}
                  whileHover={{ x: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <h4 className="text-2xl font-bold mb-3 text-textDark">{item.title}</h4>
                  <p className="text-muted text-lg leading-relaxed max-w-lg">{item.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section with Enhanced Animations */}
      <section className="px-6 lg:px-12 py-24 bg-card border-t border-borderLight" id="testimonials">
        <motion.div className="max-w-[1200px] mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants}>
          <motion.div className="text-center mb-16 space-y-4" variants={textRevealVariants}>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 text-xs font-bold uppercase tracking-wider"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <span className="text-yellow-500">★</span>
              5-Star Reviews
            </motion.div>
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-textDark">
              Loved by urban professionals.
            </h2>
            <p className="text-muted text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
              Over 5,000 successful matches helping people find their perfect living situation.
            </p>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants}>
            {[{
                name: 'Mohamed Sallam',
                role: 'Architect',
                text: '“Sakny matched me with the perfect roommate aligned with my lifestyle, my habits, and my daily rhythm. A total game changer.”',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
                gradient: 'from-blue-500/10 to-cyan-500/10',
            }, {
                name: 'Layla Ahmed',
                role: 'Marketing Lead',
                text: '"The verification process made me feel so much safer than Craigslist. I found my best friend and roommate here."',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
                gradient: 'from-pink-500/10 to-rose-500/10',
            }, {
                name: 'Omar Hassan',
                role: 'Software Engineer',
                text: '"Clean, intuitive, and the AI really works. It matched me with someone who has the exact same cleaning schedule as me."',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
                gradient: 'from-green-500/10 to-emerald-500/10',
            }].map((testimonial, i) => (
              <motion.div
                key={i}
                className={`group relative bg-white p-8 rounded-2xl border border-borderLight flex flex-col gap-6 shadow-sm hover:border-black transition-all duration-500 overflow-hidden`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, type: 'spring', stiffness: 100 }}
                whileHover={{
                  y: -10,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                  transition: { duration: 0.3 }
                }}
              >
                {/* Gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  {/* Animated stars */}
                  <motion.div
                    className="flex text-yellow-500 mb-2"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15 + 0.2, type: 'spring', stiffness: 300 }}
                  >
                    {[...Array(5)].map((_, starI) => (
                      <motion.span
                        key={starI}
                        className="text-lg"
                        initial={{ opacity: 0, rotate: -180 }}
                        whileInView={{ opacity: 1, rotate: 0 }}
                        transition={{ delay: i * 0.15 + 0.2 + starI * 0.05 }}
                        whileHover={{ scale: 1.3, rotate: 15 }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </motion.div>

                  <motion.p
                    className="text-lg leading-relaxed italic text-muted mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.15 + 0.3 }}
                  >
                    "{testimonial.text}"
                  </motion.p>

                  <motion.div
                    className="flex items-center gap-4 pt-4 border-t border-borderLight"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 + 0.4 }}
                  >
                    <motion.img
                      alt={testimonial.name}
                      className="size-12 rounded-full object-cover border-2 border-borderLight group-hover:border-black transition-colors"
                      src={testimonial.image}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                    <div>
                      <h5 className="font-bold text-textDark">{testimonial.name}</h5>
                      <p className="text-xs text-muted uppercase font-bold tracking-widest">
                        {testimonial.role}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section - Keep Primary Black for High Impact */}
      <section className="px-6 lg:px-12 py-24">
        <motion.div className="max-w-[1200px] mx-auto bg-primary rounded-[2rem] p-12 lg:p-24 text-center overflow-hidden relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
          <motion.div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] -mr-32 -mt-32 rounded-full" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }}></motion.div>

          <motion.div className="relative z-10" variants={containerVariants}>
            <motion.h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tight" variants={itemVariants}>
              Ready to find your <br className="hidden lg:block"/>
              next great roommate?
            </motion.h2>

            <motion.p className="text-white/80 text-lg lg:text-xl max-w-2xl mx-auto mb-12" variants={itemVariants}>
              Join thousands of others who found their perfect living situation through Sakny.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={containerVariants}>
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
    </div>);
};
export default Landing;
