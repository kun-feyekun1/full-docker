import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Users,
  Target,
  Award,
  TrendingUp,
  Globe,
  HeartHandshake,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("mission");
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const teamRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // GSAP Animations
  useEffect(() => {
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
          onUpdate: function () {
            stat.innerText = Math.ceil(this.targets()[0].innerText);
          },
        });
      });
    }

    // Team cards animation
    if (teamRef.current) {
      const teamCards = teamRef.current.querySelectorAll(".team-card");

      gsap.fromTo(
        teamCards,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  const values = [
    {
      icon: Target,
      title: "Innovation",
      description:
        "We constantly push boundaries and embrace new technologies to deliver cutting-edge solutions.",
    },
    {
      icon: HeartHandshake,
      title: "Collaboration",
      description:
        "We believe in the power of teamwork and building strong partnerships with our clients.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We strive for perfection in everything we do, from code quality to customer service.",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              About Our{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-600 to-green-600">
                Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
              We're a passionate team dedicated to building innovative solutions
              that make a difference in people's lives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section ref={sectionRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Purpose
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Driving innovation forward with purpose and passion
            </p>
          </motion.div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Tabs Section */}
              <div className="p-8 lg:p-12">
                <div className="flex space-x-4 mb-8">
                  {[
                    { id: "mission", label: "Our Mission" },
                    { id: "vision", label: "Our Vision" },
                    { id: "values", label: "Our Values" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        activeTab === tab.id
                          ? "bg-linear-to-r from-green-600 to-dark-600 text-white shadow-sm"
                          : "text-gray-600 hover:text-white hover:bg-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {activeTab === "mission" && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Driving Digital Transformation
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        Our mission is to empower businesses with cutting-edge
                        technology solutions that drive growth, enhance
                        efficiency, and create meaningful impact in the digital
                        landscape.
                      </p>
                      <ul className="space-y-3">
                        {[
                          "Innovative Solutions",
                          "Client Success",
                          "Sustainable Growth",
                          "Community Impact",
                        ].map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center text-gray-700"
                          >
                            <ChevronRight className="w-5 h-5 text-blue-600 mr-3" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === "vision" && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Shaping the Future of Technology
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        We envision a world where technology seamlessly enhances
                        human potential, where innovation knows no bounds, and
                        where every business can thrive in the digital age.
                      </p>
                    </div>
                  )}

                  {activeTab === "values" && (
                    <div className="space-y-6">
                      {values.map((value, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4"
                        >
                          <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink:0">
                            <value.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {value.title}
                            </h4>
                            <p className="text-gray-600">{value.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
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

export default AboutUs;
