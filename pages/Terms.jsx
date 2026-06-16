import React from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="app-container max-w-4xl mx-auto py-8"
        >
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>

            <div className="prose prose-gray max-w-none space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                    <p className="text-gray-700 leading-relaxed">
                        By accessing or using Sakny, you agree to be bound by these Terms of Service.
                        If you do not agree, please do not use our platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">2. Eligibility</h2>
                    <p className="text-gray-700 leading-relaxed">
                        You must be at least 18 years old to use Sakny. By creating an account, you represent that
                        you are of legal age and have the capacity to enter into a binding agreement.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">3. Account Responsibilities</h2>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>You are responsible for maintaining the security of your account credentials</li>
                        <li>You must provide accurate and truthful information in your profile</li>
                        <li>You may not create multiple accounts or impersonate others</li>
                        <li>You are responsible for all activity that occurs under your account</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
                    <p className="text-gray-700 leading-relaxed mb-3">You agree NOT to:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Harass, threaten, or intimidate other users</li>
                        <li>Post false, misleading, or fraudulent information</li>
                        <li>Use the platform for commercial advertising or solicitation</li>
                        <li>Attempt to access other users' accounts or private data</li>
                        <li>Use automated systems (bots, scrapers) to interact with the platform</li>
                        <li>Discriminate against other users based on protected characteristics</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">5. Matching & Recommendations</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Our matching algorithm provides suggestions based on stated preferences and compatibility factors.
                        We do not guarantee the accuracy of match scores or the suitability of any roommate pairing.
                        Users are responsible for conducting their own due diligence before entering into any living arrangement.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">6. Safety & Reporting</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We provide tools to block and report users who violate these terms. We review reports and
                        may suspend or terminate accounts that violate our policies. However, we cannot guarantee
                        the safety of in-person meetings. Always meet in public places first.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">7. Content Ownership</h2>
                    <p className="text-gray-700 leading-relaxed">
                        You retain ownership of content you post (photos, bio, messages). By posting content,
                        you grant Sakny a limited license to display it to other users as part of the service.
                        This license ends when you delete the content or your account.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">8. Termination</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We may suspend or terminate your account for violations of these terms. You may delete
                        your account at any time through Account Settings. Upon termination, your data will be
                        handled according to our Privacy Policy.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Sakny is provided "as is" without warranties. We are not liable for any disputes between
                        users, rental agreements, or outcomes of roommate arrangements facilitated through our platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
                    <p className="text-gray-700 leading-relaxed">
                        For questions about these terms, contact us at legal@sakny.app.
                    </p>
                </section>
            </div>
        </motion.div>
    );
};

export default Terms;
