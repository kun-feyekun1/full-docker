
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Star } from "lucide-react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Homepage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // GSAP Animations
  useEffect(() => {
    // Hero text animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll(".hero-text"),
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
        }
      );
    }

    // Features animation
    if (featuresRef.current) {
      const features = featuresRef.current.querySelectorAll(".feature-item");

      gsap.fromTo(
        features,
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
        const duration = 2;

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
  }, []);

  const features = [
    {
      title: "Lightning Fast",
      description: "Optimized for speed with global CDN and advanced caching.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Enterprise Security",
      description:
        "Bank-level security with end-to-end encryption and compliance.",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Smart Analytics",
      description: "Real-time insights and predictive analytics dashboard.",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Cloud Native",
      description: "Built on scalable cloud infrastructure with 99.9% uptime.",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Developer First",
      description: "Comprehensive APIs, SDKs, and extensive documentation.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Mobile Ready",
      description: "Fully responsive with native mobile app experience.",
      color: "from-teal-500 to-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        {!user && (
          <div className="relative bg-amber-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div ref={heroRef}>
              {/* Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-8"
              >
                <Star className="w-4 h-4 mr-2 fill-current" />
                Trusted by All Ethiopians
              </motion.div>

              <motion.h1 className="hero-text text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6">
                Build The Future{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                  Faster
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p className="hero-text text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                The all-in-one platform that helps teams build, launch, and
                scale amazing products with unprecedented speed and efficiency.
              </motion.p>

              {/* Sign Up / Sign In Buttons */}
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
          </div>
        )}
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help you build better products
              faster, with less effort.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-item group"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 h-full border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
