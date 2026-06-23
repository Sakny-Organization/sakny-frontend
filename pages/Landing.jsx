import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import Button from '../components/common/Button';
import { Brain, ShieldCheck, Lock, UserPlus, Users, MessageCircle, ArrowRight, Star } from 'lucide-react';

/* ─── Animated Counter ─────────────────────────────────────────── */
const AnimatedCounter = ({ to, suffix = '', duration = 2 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });
    const count = useMotionValue(0);
    const rounded = useSpring(count, { duration: duration * 1000, bounce: 0 });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (isInView) {
            const ctrl = animate(count, to, { duration, ease: 'easeOut' });
            return ctrl.stop;
        } else {
            const ctrl = animate(count, 0, { duration: 0.3 });
            return ctrl.stop;
        }
    }, [isInView, to, duration, count]);

    useEffect(() => {
        return rounded.on('change', (v) => setDisplay(Math.round(v)));
    }, [rounded]);

    return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
};

/* ─── Floating Orb Background ──────────────────────────────────── */
const FloatingOrb = ({ className, delay = 0 }) => (
    <motion.div
        className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
        animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
);

/* ─── Section Reveal Wrapper ────────────────────────────────────── */
const Reveal = ({ children, delay = 0, direction = 'up', className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: '-80px' });
    const yMap = { up: 60, down: -60, left: 0, right: 0 };
    const xMap = { up: 0, down: 0, left: 80, right: -80 };
    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: yMap[direction], x: xMap[direction] }}
            animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: yMap[direction], x: xMap[direction] }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
};

const Landing = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const imageY = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const imageRotate = useTransform(scrollYProgress, [0, 1], [0, 3]);

    const features = [
        { Icon: Brain, title: 'AI Matching', description: 'Proprietary algorithm based on lifestyle, social habits, and cleaning preferences.' },
        { Icon: ShieldCheck, title: 'Verified Profiles', description: 'Every member is identity-verified with background checks for complete peace of mind.' },
        { Icon: Lock, title: 'Secure Chat', description: 'End-to-end encrypted messaging to discuss your future home safely on our platform.' },
    ];

    const steps = [
        { step: 1, Icon: UserPlus, title: 'Create Your Profile', description: "Tell us about your lifestyle, budget, and what makes you a great roommate. Our deep-profile system captures the nuances that matter." },
        { step: 2, Icon: Users, title: 'AI Matching', description: 'Browse curated profiles with high-compatibility scores. We rank matches based on 50+ data points to ensure long-term harmony.' },
        { step: 3, Icon: MessageCircle, title: 'Secure Connection', description: "Start conversations within our secure environment. Schedule video calls or tours without sharing personal contact info until you're ready." },
    ];

    const testimonials = [
        { name: 'Mohamed Sallam', role: 'Architect', text: '"Sakny matched me with the perfect roommate aligned with my lifestyle, my habits, and my daily rhythm. A total game changer."', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
        { name: 'Layla Ahmed', role: 'Marketing Lead', text: '"The verification process made me feel so much safer than Craigslist. I found my best friend and roommate here."', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
        { name: 'Omar Hassan', role: 'Software Engineer', text: '"Clean, intuitive, and the AI really works. It matched me with someone who has the exact same cleaning schedule as me."', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    ];

    return (
        <div className="bg-white relative overflow-x-hidden">

            {/* HERO SECTION */}
            <section ref={heroRef} className="relative min-h-screen flex items-center px-6 lg:px-12 py-24 overflow-hidden">

                {/* Background floating orbs */}
                <FloatingOrb className="w-96 h-96 bg-blue-300 top-10 -right-20" delay={0} />
                <FloatingOrb className="w-64 h-64 bg-purple-300 bottom-20 -left-10" delay={2} />
                <FloatingOrb className="w-48 h-48 bg-green-200 top-1/2 left-1/3" delay={4} />

                {/* Animated grid lines background */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }}
                />

                <motion.div
                    className="max-w-[1200px] mx-auto w-full grid lg:grid-cols-2 gap-16 items-center"
                    style={{ y: heroY, opacity: heroOpacity }}
                >
                    {/* Left: Text */}
                    <div className="flex flex-col gap-8 relative z-10">
                        {/* Animated badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 text-black text-xs font-bold uppercase tracking-wider w-fit"
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-50" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
                            </span>
                            Next-Gen Living
                        </motion.div>

                        {/* Heading */}
                        <div className="overflow-hidden">
                            <motion.h1
                                className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-black"
                                initial={{ opacity: 0, y: 80 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            >
                                Find your <br />
                                perfect space,{' '}
                                <motion.span
                                    className="text-gray-400"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                >
                                    with the perfect person.
                                </motion.span>
                            </motion.h1>
                        </div>

                        {/* Subheading */}
                        <motion.p
                            className="text-lg lg:text-xl text-gray-500 leading-relaxed max-w-[540px]"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            Experience AI-driven compatibility combined with premium urban living. We match you based on lifestyle, habits, and shared values.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                        >
                            <Link to="/signup">
                                <motion.button
                                    className="h-14 px-8 bg-black text-white font-bold rounded-xl text-base flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Start Matching
                                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                        <ArrowRight size={18} />
                                    </motion.span>
                                </motion.button>
                            </Link>
                            <Link to="/search">
                                <motion.button
                                    className="h-14 px-8 bg-white border-2 border-gray-200 text-black font-bold rounded-xl text-base flex items-center gap-2 hover:border-black transition-colors"
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <span className="text-gray-400">▶</span>
                                    See How it works
                                </motion.button>
                            </Link>
                        </motion.div>

                    </div>

                    {/* Right: Hero Image with parallax */}
                    <motion.div
                        className="relative"
                        style={{ y: imageY, rotate: imageRotate }}
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Glow behind image */}
                        <motion.div
                            className="absolute -inset-6 bg-gradient-to-br from-blue-100 via-purple-50 to-green-100 rounded-[2.5rem] blur-2xl"
                            animate={{ opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />

                        {/* Image card */}
                        <motion.div
                            className="relative border border-gray-100 rounded-3xl overflow-hidden shadow-2xl"
                            whileHover={{ y: -8, scale: 1.01 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            <img
                                alt="Modern apartment living room"
                                className="w-full h-[520px] object-cover"
                                src="/image/Home 2.jpg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                            {/* Floating match card */}
                            <motion.div
                                className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md border border-white/80 rounded-2xl p-4 shadow-xl"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            className="size-12 rounded-full border-2 border-black p-0.5"
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <img
                                                alt="User profile"
                                                className="w-full h-full object-cover rounded-full"
                                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                                            />
                                        </motion.div>
                                        <div>
                                            <p className="font-bold text-black text-sm">Sarah Ahmed</p>
                                            <p className="text-xs text-gray-400">UX Designer • Cairo</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-black">98%</p>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Match</p>
                                    </div>
                                </div>
                                {/* Animated match progress bar */}
                                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-green-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: '98%' }}
                                        transition={{ delay: 1.3, duration: 1.2, ease: 'easeOut' }}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Floating badge - top left */}
                        <motion.div
                            className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 flex items-center gap-2"
                            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 1.2, duration: 0.6, type: 'spring' }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <ShieldCheck size={16} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-black">Verified</p>
                                <p className="text-[10px] text-gray-400">ID Checked</p>
                            </div>
                        </motion.div>

                        {/* Floating badge - bottom right */}
                        <motion.div
                            className="absolute -bottom-4 -right-4 bg-black text-white rounded-2xl shadow-xl p-3 flex items-center gap-2"
                            initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 1.4, duration: 0.6, type: 'spring' }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Brain size={16} className="text-white" />
                            <div>
                                <p className="text-xs font-bold">AI Powered</p>
                                <p className="text-[10px] text-gray-300">50+ data points</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* FEATURES SECTION */}
            <section className="px-6 lg:px-12 py-28 bg-gray-50 border-y border-gray-100 relative overflow-hidden" id="features">
                <FloatingOrb className="w-80 h-80 bg-blue-200 -top-20 -right-20" delay={1} />

                <div className="max-w-[1200px] mx-auto">
                    <div className="text-center mb-20">
                        <Reveal>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Why Sakny</p>
                            <h2 className="text-4xl lg:text-6xl font-black tracking-tight text-black mb-6">
                                Built for trust.{' '}
                                <span className="text-gray-400">Designed for life.</span>
                            </h2>
                            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                                Our platform is designed for the modern urbanite who values security and long-term compatibility.
                            </p>
                        </Reveal>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <Reveal key={i} delay={i * 0.15} direction="up">
                                <motion.div
                                    className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-black hover:shadow-2xl transition-all duration-500 cursor-default relative overflow-hidden h-full"
                                    whileHover={{ y: -8 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <motion.div
                                        className="size-16 rounded-2xl bg-gray-50 group-hover:bg-black flex items-center justify-center mb-6 transition-colors duration-300"
                                        whileHover={{ rotate: [0, -10, 10, 0] }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <feature.Icon className="w-7 h-7 text-black group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                                    </motion.div>

                                    <h3 className="text-xl font-bold mb-3 text-black">{feature.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{feature.description}</p>

                                    <motion.div
                                        className="mt-6 flex items-center gap-2 text-sm font-bold text-gray-300 group-hover:text-black transition-colors duration-300"
                                    >
                                        Learn more <ArrowRight size={14} />
                                    </motion.div>
                                </motion.div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="px-6 lg:px-12 py-28 bg-white relative overflow-hidden" id="how-it-works">
                <div className="max-w-[1000px] mx-auto">
                    <Reveal>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Process</p>
                        <h2 className="text-4xl lg:text-5xl font-black mb-20 text-black">
                            Your journey to{' '}
                            <span className="text-gray-400">better living</span>
                        </h2>
                    </Reveal>

                    <div className="relative">
                        {/* Static background line */}
                        <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gray-100" />
                        {/* Animated foreground line */}
                        <motion.div
                            className="absolute left-[27px] top-8 w-0.5 bg-black origin-top"
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                            style={{ height: 'calc(100% - 4rem)' }}
                        />

                        <div className="space-y-16">
                            {steps.map((item, i) => (
                                <Reveal key={i} delay={i * 0.2} direction="left">
                                    <div className="flex gap-10 items-start">
                                        <motion.div
                                            className={`relative z-10 size-14 rounded-full flex items-center justify-center flex-shrink-0 border-2 shadow-lg shadow-black/10 ${i === 2 ? 'border-black bg-white' : 'border-black bg-black'}`}
                                            whileInView={{ scale: [0.5, 1.1, 1] }}
                                            viewport={{ once: false }}
                                            transition={{ duration: 0.6, delay: i * 0.2 }}
                                        >
                                            <item.Icon size={22} strokeWidth={1.5} className={i === 2 ? 'text-black' : 'text-white'} />
                                        </motion.div>

                                        <div className="pt-3">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Step {item.step}</span>
                                            </div>
                                            <h4 className="text-2xl font-bold mb-3 text-black">{item.title}</h4>
                                            <p className="text-gray-500 text-lg leading-relaxed max-w-xl">{item.description}</p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="px-6 lg:px-12 py-28 bg-gray-50 border-t border-gray-100 relative overflow-hidden" id="testimonials">
                <FloatingOrb className="w-96 h-96 bg-yellow-100 -bottom-20 -left-20" delay={3} />

                <div className="max-w-[1200px] mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
                        <Reveal>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Testimonials</p>
                            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-black mb-4">
                                Loved by urban professionals.
                            </h2>
                            <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
                                Over{' '}
                                <strong className="text-black">
                                    <AnimatedCounter to={5000} suffix="+" />
                                </strong>{' '}
                                successful matches helping people find their perfect living situation.
                            </p>
                        </Reveal>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <Reveal key={i} delay={i * 0.12}>
                                <motion.div
                                    className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-black hover:shadow-xl transition-all duration-500 flex flex-col gap-6 h-full group cursor-default"
                                    whileHover={{ y: -6 }}
                                >
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, j) => (
                                            <motion.div
                                                key={j}
                                                initial={{ opacity: 0, scale: 0 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: false }}
                                                transition={{ delay: i * 0.1 + j * 0.08 }}
                                            >
                                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                            </motion.div>
                                        ))}
                                    </div>

                                    <p className="text-gray-600 text-base leading-relaxed italic flex-1">{t.text}</p>

                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                        <motion.img
                                            alt={t.name}
                                            className="size-11 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-black transition-all duration-300"
                                            src={t.image}
                                            whileHover={{ scale: 1.1 }}
                                        />
                                        <div>
                                            <h5 className="font-bold text-black text-sm">{t.name}</h5>
                                            <p className="text-xs text-gray-400 uppercase font-semibold tracking-widest mt-0.5">{t.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="px-6 lg:px-12 py-24">
                <Reveal>
                    <motion.div
                        className="max-w-[1200px] mx-auto bg-black rounded-[2.5rem] p-12 lg:p-24 text-center overflow-hidden relative"
                        whileInView={{ scale: [0.97, 1] }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <motion.div className="absolute top-0 right-0 w-80 h-80 bg-white/5 blur-3xl -mr-20 -mt-20 rounded-full" animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 5, repeat: Infinity }} />
                        <motion.div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-3xl -ml-20 -mb-20 rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} />

                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white/30 rounded-full"
                                style={{ top: `${20 + i * 12}%`, left: `${5 + i * 15}%` }}
                                animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
                                transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
                            />
                        ))}

                        <div className="relative z-10">
                            <motion.p
                                className="text-white/50 text-xs font-bold uppercase tracking-[0.4em] mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ delay: 0.2 }}
                            >
                                Get Started Today
                            </motion.p>

                            <motion.h2
                                className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-[1.1]"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                Ready to find your{' '}
                                <br className="hidden lg:block" />
                                next great roommate?
                            </motion.h2>

                            <motion.p
                                className="text-white/60 text-lg lg:text-xl max-w-2xl mx-auto mb-12"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ delay: 0.4 }}
                            >
                                Join thousands of others who found their perfect living situation through Sakny.
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ delay: 0.5 }}
                            >
                                <Link to="/signup">
                                    <motion.button
                                        className="h-16 px-10 bg-white text-black font-black rounded-2xl text-lg hover:shadow-2xl hover:shadow-white/20 transition-all flex items-center gap-2"
                                        whileHover={{ scale: 1.05, y: -3 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        Get Started Now
                                        <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                            <ArrowRight size={20} />
                                        </motion.span>
                                    </motion.button>
                                </Link>
                                <Link to="/search">
                                    <motion.button
                                        className="h-16 px-10 bg-transparent border-2 border-white/20 text-white font-black rounded-2xl text-lg hover:bg-white/10 hover:border-white/40 transition-all"
                                        whileHover={{ scale: 1.05, y: -3 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        Browse Listings
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </Reveal>
            </section>
        </div>
    );
};

export default Landing;
