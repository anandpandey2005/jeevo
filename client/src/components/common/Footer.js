import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";

const supportEmail = "anandpandey20005@gmail.com";
const createMailto = (subject) =>
  `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}`;

const footerSections = [
  {
    title: "Explore",
    links: [
      { name: "About Jeevo", path: "/about" },
      { name: "How Matching Works", path: "/how-it-works" },
      { name: "Find Hospitals and Blood Banks", path: "/hospitals" },
      { name: "Upcoming Blood Drives", path: "/schedules" },
      { name: "Community Impact Board", path: "/leaderboard" },
    ],
  },
  {
    title: "Learn",
    links: [
      { name: "Blood Compatibility Guide", path: "/resources/blood-types" },
      { name: "Donation Eligibility Guide", path: "/resources/eligibility" },
      { name: "Donation Step-by-Step", path: "/resources/donation-process" },
      { name: "Common Questions", path: "/faqs" },
      { name: "Updates and Insights", path: "/blog" },
    ],
  },
  {
    title: "Trust",
    links: [
      { name: "Privacy and Data Use", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Cookie Use", path: "/cookies" },
      { name: "Data Protection", path: "/data-protection" },
    ],
  },
  {
    title: "Support",
    links: [
      {
        name: "Help and Troubleshooting",
        href: createMailto("Jeevo Help Request"),
      },
      { name: "Contact Jeevo", href: createMailto("Connect With Jeevo") },
      {
        name: "Report a Bug or Safety Issue",
        href: createMailto("Jeevo Feedback / Bug Report"),
      },
      {
        name: "Partner for Blood Drives",
        href: createMailto("Jeevo Partnership Inquiry"),
      },
    ],
  },
];

const socialLinks = [
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    url: "https://www.linkedin.com/in/anandpandey2005/",
  },
  {
    name: "GitHub",
    icon: FaGithub,
    url: "https://github.com/anandpandey2005/jeevo",
  },
];

const supportActions = [
  {
    title: "Need help now?",
    description:
      "Use the support center for login, request visibility, and workflow help.",
    href: createMailto("Jeevo Help Request"),
    cta: "Open Help Center",
  },
  {
    title: "Found a problem?",
    description:
      "Report bugs, misuse, or broken flows so Jeevo stays safe and dependable.",
    href: createMailto("Jeevo Feedback / Bug Report"),
    cta: "Report an Issue",
  },
  {
    title: "Want to collaborate?",
    description:
      "Connect with us for hospital onboarding, blood drives, or local campaigns.",
    href: createMailto("Jeevo Partnership Inquiry"),
    cta: "Partner With Us",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black opacity-95 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2">
              <Link to="/" className="flex items-center mb-4">
                <span className="text-xl font-semibold text-white jeevo-wordmark">
                  Jeevo
                </span>
              </Link>
            <p className="text-gray-400 mb-2 leading-relaxed">
              A blood coordination platform built to reduce delay between urgent
              need, donor response, and hospital action.
            </p>
            <p className="text-gray-200 font-semibold mb-4">
              Founder Anand Pandey
            </p>

            <div className="space-y-3">
              <a
                href="mailto:anandpandey20005@gmail.com"
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <HiMail className="h-5 w-5 mr-3 text-primary-500" />
                anandpandey20005@gmail.com
              </a>
              <a
                href="tel:8750309712"
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <HiPhone className="h-5 w-5 mr-3 text-primary-500" />
                8750309712
              </a>
              <p className="flex items-center text-gray-400">
                <HiLocationMarker className="h-5 w-5 mr-3 text-primary-500" />
                N/A
              </p>
            </div>

            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.href ? (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors leading-relaxed"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white transition-colors leading-relaxed"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-4">
            {supportActions.map((action) => (
              <div
                key={action.title}
                className="rounded-2xl border border-gray-800 bg-gray-950/40 p-5"
              >
                <h3 className="text-white font-semibold">{action.title}</h3>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {action.description}
                </p>
                <a
                  href={action.href}
                  className="inline-flex items-center mt-4 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {action.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              (c) {currentYear} Jeevo. All rights reserved.
            </p>

            <div className="flex items-center space-x-4 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
