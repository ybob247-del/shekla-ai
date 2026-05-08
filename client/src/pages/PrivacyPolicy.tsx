export default function PrivacyPolicy() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: January 2025</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Shekla AI collects minimal information to provide our services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Assessment data:</strong> Answers to the Money Reset Score assessment are processed
                locally in your browser and are not stored on our servers.
              </li>
              <li>
                <strong>Calculator inputs:</strong> All calculator data is processed locally and not stored.
              </li>
              <li>
                <strong>Analytics:</strong> We use privacy-respecting analytics to understand how users
                interact with the site (page views, general usage patterns).
              </li>
              <li>
                <strong>Purchase data:</strong> Toolkit purchases are handled by Stan Store. We receive
                confirmation of purchases but not payment details.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We use the information we collect to improve the Service, understand usage patterns,
              and fulfill toolkit purchases. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use essential cookies to ensure the website functions properly. We may also use
              analytics cookies to understand how users interact with our content. You can disable
              cookies in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
              <li><strong>Stan Store:</strong> For processing toolkit purchases</li>
              <li><strong>Vercel:</strong> For website hosting</li>
              <li><strong>Cloudflare:</strong> For CDN and security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your information.
              However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Shekla AI is not directed to children under 13. We do not knowingly collect personal
              information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              You have the right to access, correct, or delete any personal information we hold about you.
              To exercise these rights, contact us at privacy@shekla.ai.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new policy on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at privacy@shekla.ai.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
