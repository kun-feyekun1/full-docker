
import { motion } from "framer-motion";

const Footer = () => {
  const linker = [
    { label: "Privacy", path: "/privacy" },
    { label: "Terms", path: "/terms" },
    { label: "Cookies", path: "/cookies" },
  ];
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold">Agrico</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Building the future of work!
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Product",
              links: ["Features", "Solutions"],
            },
            {
              title: "Company",
              links: ["About", "Contact"],
            },
            {
              title: "Resources",
              links: ["Documentation"],
            },
          ].map((section, index) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-6">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5, color: "#60a5fa" }}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2025 Agrico. All rights reserved.
          </div>

          <div className="flex space-x-6 mt-4 md:mt-0">
            {linker.map(({ label, path }) => (
              <motion.a
                key={label}
                onClick={() => navigate(path)}
                whileHover={{ color: "#60a5fa" }}
                className="cursor-pointer text-gray-400 hover:text-blue-400 text-sm transition-colors"
              >
                {label}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
