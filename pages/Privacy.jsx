import React from 'react';
import { motion } from 'framer-motion';

const Privacy = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="app-container max-w-4xl mx-auto py-8"
        >
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>

            <div className="prose prose-gray max-w-none space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We collect information you provide directly: name, email, phone number, profile details
                        (age, gender, occupation, lifestyle preferences), photos, and messages sent through our platform.
                        We also collect usage data including pages viewed, features used, and interaction patterns to improve our matching algorithm.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>To create and maintain your account</li>
                        <li>To match you with compatible roommates using our algorithm</li>
                        <li>To facilitate communication between matched users</li>
                        <li>To send notifications about new matches and messages</li>
                        <li>To improve our matching algorithm and service quality</li>
                        <li>To verify user identity and prevent fraud</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">3. Data Sharing</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We do not sell your personal data. Your profile information is visible to other registered users
                        for matching purposes. We may share data with service providers who assist in operating our platform
                        (hosting, email delivery, identity verification) under strict confidentiality agreements.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We implement industry-standard security measures including encrypted data transmission (TLS),
                        hashed passwords, JWT token authentication with refresh rotation, and rate limiting.
                        Profile photos and documents are stored in encrypted object storage.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li><strong>Access:</strong> You can export all your data from Account Settings</li>
                        <li><strong>Correction:</strong> You can update your profile information at any time</li>
                        <li><strong>Deletion:</strong> You can permanently delete your account and all associated data</li>
                        <li><strong>Blocking:</strong> You can block any user to prevent them from contacting you or viewing your profile</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We retain your data as long as your account is active. Upon account deletion, all personal data
                        is permanently removed within 30 days. Anonymized usage statistics may be retained for service improvement.
                        Messages are deleted when either participant deletes their account.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">7. Cookies & Local Storage</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We use browser local storage to maintain your login session. We do not use third-party tracking cookies.
                        Essential session data is stored locally on your device and cleared when you log out.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
                    <p className="text-gray-700 leading-relaxed">
                        For privacy-related inquiries, contact us at privacy@sakny.app.
                    </p>
                </section>
            </div>
        </motion.div>
    );
};

export default Privacy;
