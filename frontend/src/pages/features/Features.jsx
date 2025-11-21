import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const demoRef = useRef(null);
  const { user } = useAuth();
  const isInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  // GSAP Animations
  useEffect(() => {
    // Features grid animation
    if (featuresRef.current) {
      const featureCards =
        featuresRef.current.querySelectorAll(".feature-card");

      gsap.fromTo(
        featureCards,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Stats counter animation
    if (statsRef.current) {
      const stats = statsRef.current.querySelectorAll(".stat-number");

      stats.forEach((stat) => {
        const target = parseInt(stat.getAttribute("data-target"));
        const duration = 2.5;

        gsap.to(stat, {
          scrollTrigger: {
            trigger: stat,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
          innerText: target,
          duration: duration,
          snap: { innerText: 1 },
          ease: "power2.out",
          onUpdate: function () {
            stat.innerText = Math.ceil(this.targets()[0].innerText);
          },
        });
      });
    }

    // Demo section animation
    if (demoRef.current) {
      const demoElements = demoRef.current.querySelectorAll(".demo-element");

      gsap.fromTo(
        demoElements,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.3,
          scrollTrigger: {
            trigger: demoRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  const categories = [
    { id: "all", label: "All Features" },
    { id: "security", label: "Security" },
    { id: "performance", label: "Performance" },
    { id: "analytics", label: "Analytics" },
    { id: "collaboration", label: "Collaboration" },
    { id: "development", label: "Development" },
  ];

  const features = [
    {
      id: 1,
      title: "Advanced Security",
      description:
        "Enterprise-grade security with end-to-end encryption and multi-factor authentication.",
      category: "security",
      color: "from-green-500 to-emerald-600",
      highlights: [
        "256-bit Encryption",
        "Multi-factor Auth",
        "SOC 2 Compliant",
        "Real-time Monitoring",
      ],
    },
    {
      id: 2,
      title: "Lightning Performance",
      description: "Optimized for speed and advanced caching mechanisms.",
      category: "performance",
      color: "from-blue-500 to-cyan-600",
      highlights: [
        "Global CDN",
        "Edge Computing",
        "Smart Caching",
        "<100ms Response",
      ],
    },
    {
      id: 3,
      title: "Real-time Analytics",
      description:
        "Comprehensive analytics dashboard with real-time data visualization and insights.",
      category: "analytics",
      color: "from-purple-500 to-pink-600",
      highlights: [
        "Live Dashboards",
        "Custom Reports",
        "Predictive Analytics",
        "API Integration",
      ],
    },
    {
      id: 4,
      title: "Team Collaboration",
      description:
        "Seamless team collaboration tools with real-time editing and commenting.",
      category: "collaboration",
      color: "from-orange-500 to-red-500",
      highlights: [
        "Real-time Editing",
        "Team Workspaces",
        "Comment System",
        "Version History",
      ],
    },
    {
      id: 6,
      title: "Mobile Experience",
      description: "Fully responsive design with native mobile app experience.",
      category: "performance",
      color: "from-teal-500 to-green-500",
      highlights: [
        "Progressive Web App",
        "Native Mobile Apps",
        "Offline Support",
        "Push Notifications",
      ],
    },
    {
      id: 8,
      title: "Data Management",
      description:
        "Advanced data management with intelligent storage and retrieval systems.",
      category: "development",
      color: "from-amber-500 to-orange-500",
      highlights: [
        "Smart Storage",
        "Data Export",
        "API Access",
        "Automated Backups",
      ],
    },
  ];

  const filteredFeatures =
    activeCategory === "all"
      ? features
      : features.filter((feature) => feature.category === activeCategory);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50/30">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-600/5 to-purple-600/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6"
            >
              <Zap className="w-4 h-4 mr-2" />
              Powerful Features Released
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Discover Our{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Powerful
              </span>{" "}
              Features
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
              Everything you need to build, scale, and succeed with our
              comprehensive platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore Our Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed to help you work smarter, faster, and more efficiently
            </p>
          </motion.div>

          <div
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="feature-card group"
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full overflow-hidden border border-gray-100">
                  {/* Icon Header */}
                  <div
                    className={`p-6 bg-linear-to-r ${feature.color} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/10 transform group-hover:scale-110 transition-transform duration-500" />
                    <div className="relative z-10">
                      <motion.div
                        animate={{
                          rotate: hoveredFeature === feature.id ? 360 : 0,
                          scale: hoveredFeature === feature.id ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                        className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm"
                      ></motion.div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {feature.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="space-y-3">
                      {feature.highlights.map((highlight, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          className="flex items-center text-sm text-gray-700"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink:0" />
                          {highlight}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-linear-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to Transform Your Workflow?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-blue-100 mb-8"
            >
              Join thousands of teams already using our platform to work smarter
              and achieve more.
            </motion.p>
            <motion.div className="hero-text flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {/* Sign In Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                onClick={() => navigate("/Auths")}
              >
                Sign In
              </motion.button>
              {/* Sign Up Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                onClick={() => navigate("/Auths")}
              >
                Sign Up <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Features;
