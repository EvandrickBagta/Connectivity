import React, { useState, useEffect } from 'react'

const LandingPage = ({ onNavigateToExplore, currentPage }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Announcement slides data
  const announcementSlides = [
    {
      id: 1,
      title: "Welcome to Connectivity",
      message: "Connect with students across all majors and build amazing projects together",
      bgGradient: "from-blue-500 to-indigo-600",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "500+ Active Projects",
      message: "Join thousands of students collaborating on exciting initiatives",
      bgGradient: "from-purple-500 to-pink-600",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Build Your Portfolio",
      message: "Gain real-world experience and showcase your contributions",
      bgGradient: "from-pink-500 to-orange-500",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Cross-Disciplinary Collaboration",
      message: "Work with students from engineering, business, design, and more",
      bgGradient: "from-green-500 to-teal-600",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ]

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcementSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [announcementSlides.length])

  // Sample activity data
  const sampleActivities = [
    {
      title: "Campus Gardening App",
      description: "A mobile app connecting students interested in sustainable gardening and urban farming.",
      tags: ["CS", "Biology", "Sustainability"],
      id: 1
    },
    {
      title: "Study Buddy Matcher",
      description: "AI-powered platform to match students with compatible study partners based on learning styles.",
      tags: ["AI", "Psychology", "Education"],
      id: 2
    },
    {
      title: "Local Food Network",
      description: "Connecting students with local farmers and food producers for sustainable eating.",
      tags: ["Business", "Agriculture", "Community"],
      id: 3
    },
    {
      title: "Mental Health Tracker",
      description: "Anonymous platform for students to track and improve their mental wellness.",
      tags: ["Health", "Psychology", "Technology"],
      id: 4
    },
    {
      title: "Campus Event Planner",
      description: "Collaborative tool for organizing and promoting student events across campus.",
      tags: ["Event Planning", "Marketing", "Community"],
      id: 5
    },
    {
      title: "Eco-Friendly Transport",
      description: "Ride-sharing app focused on reducing carbon footprint through carpooling.",
      tags: ["Environmental", "Transportation", "Technology"],
      id: 6
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">

      {/* Announcement Banner - DISABLED */}
      {/* <section className="relative overflow-hidden bg-white border-b border-gray-200">
        <div className="relative h-40 md:h-48">
          <div className="relative h-full">
            {announcementSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : index < currentSlide
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className={`h-full bg-gradient-to-r ${slide.bgGradient} flex items-center justify-center`}>
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex items-center justify-center gap-6 md:gap-8 text-white">
                      <div className="flex-shrink-0">
                        {slide.icon}
                      </div>
                      <div className="text-left">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                          {slide.title}
                        </h2>
                        <p className="text-base md:text-lg text-white/90">
                          {slide.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-10">
            {announcementSlides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? 'w-3 h-3 bg-white shadow-lg scale-125'
                    : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + announcementSlides.length) % announcementSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all z-10"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % announcementSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all z-10"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section> */}

      {/* Hero Section */}
      <section className={`relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-20 lg:py-32 ${currentPage === 'landing' ? '' : 'pt-20'} overflow-hidden`}>
        {/* Floating Activity Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top row */}
          <div className="absolute top-8 left-8 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-bounce opacity-0" style={{animationDuration: '3s', animationDelay: '1.2s', animation: 'fadeIn 0.6s ease-out 0.1s forwards, bounce 3s ease-in-out 1.2s infinite'}}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="absolute top-16 right-16 w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0" style={{animation: 'fadeIn 0.6s ease-out 0.3s forwards, bounce 2.5s ease-in-out 1.3s infinite'}}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="absolute top-4 left-1/4 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0" style={{animation: 'fadeIn 0.6s ease-out 0.5s forwards, bounce 3.5s ease-in-out 1.5s infinite'}}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          
          {/* Middle-left icon above text */}
          <div className="absolute top-12 left-1/6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0" style={{animation: 'fadeIn 0.6s ease-out 0.7s forwards, bounce 2.8s ease-in-out 1.7s infinite'}}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          {/* Middle row */}
          <div className="absolute top-2 right-1/4 w-14 h-14 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center opacity-0" style={{animation: 'fadeIn 0.6s ease-out 0.9s forwards, bounce 2.2s ease-in-out 1.9s infinite'}}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="absolute top-6 left-1/3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0" style={{animation: 'fadeIn 0.6s ease-out 0.2s forwards, bounce 3.2s ease-in-out 1.2s infinite'}}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          
          {/* Bottom row */}
          <div className="absolute top-48 left-12 w-16 h-16 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0" style={{animation: 'fadeIn 0.6s ease-out 1.1s forwards, bounce 2.8s ease-in-out 2.1s infinite'}}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="absolute top-56 right-8 w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center opacity-0" style={{animation: 'fadeIn 0.6s ease-out 0.4s forwards, bounce 3.1s ease-in-out 1.4s infinite'}}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="absolute top-8 right-1/3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0" style={{animation: 'fadeIn 0.6s ease-out 0.8s forwards, bounce 2.6s ease-in-out 1.8s infinite'}}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          {/* Bottom left cluster - widely spaced to fill area */}
          <div className="absolute bottom-40 left-4 w-12 h-12 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0" style={{animation: 'fadeIn 0.6s ease-out 0.6s forwards, bounce 2.4s ease-in-out 1.6s infinite'}}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="absolute bottom-16 left-32 w-8 h-8 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0" style={{animation: 'fadeIn 0.6s ease-out 1.0s forwards, bounce 3.3s ease-in-out 2.0s infinite'}}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div className="absolute bottom-28 left-20 w-6 h-6 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0" style={{animation: 'fadeIn 0.6s ease-out 0.3s forwards, bounce 2.9s ease-in-out 1.3s infinite'}}>
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4 relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Connect with Students.<br />
            Build Together.
          </h1>
          <div className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto text-center">
            <p>Discover initiatives across all majors.</p>
            <p>Or recruit the perfect partners to make your vision come to life.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onNavigateToExplore}
              className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
            >
              Explore Activities
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-bold py-4 px-8 rounded-lg text-lg transition-colors">
              Share Your Activity
            </button>
          </div>
        </div>
      </section>


      {/* Activity Spotlight Section */}
      <section className="py-10 relative overflow-hidden">
        {/* Single Looping Gradient Curve Background */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="loopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                <stop offset="25%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#d946ef" stopOpacity="0.4" />
                <stop offset="75%" stopColor="#ec4899" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            
            {/* First swooping line with multiple loops */}
            <path
              d="M 100 100 
                 C 200 50, 300 100, 350 200
                 C 400 300, 350 400, 250 450
                 C 150 500, 100 450, 150 350
                 C 200 250, 300 250, 400 300
                 C 500 350, 600 450, 700 400
                 C 800 350, 850 250, 800 150
                 C 750 50, 650 100, 700 200
                 C 750 300, 850 350, 950 300
                 C 1050 250, 1100 150, 1150 200
                 C 1200 250, 1250 350, 1300 300"
              stroke="url(#loopGradient)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <animate
                attributeName="d"
                dur="20s"
                repeatCount="indefinite"
                values="
                  M 100 100 C 200 50, 300 100, 350 200 C 400 300, 350 400, 250 450 C 150 500, 100 450, 150 350 C 200 250, 300 250, 400 300 C 500 350, 600 450, 700 400 C 800 350, 850 250, 800 150 C 750 50, 650 100, 700 200 C 750 300, 850 350, 950 300 C 1050 250, 1100 150, 1150 200 C 1200 250, 1250 350, 1300 300;
                  M 120 120 C 220 70, 320 120, 370 220 C 420 320, 370 420, 270 470 C 170 520, 120 470, 170 370 C 220 270, 320 270, 420 320 C 520 370, 620 470, 720 420 C 820 370, 870 270, 820 170 C 770 70, 670 120, 720 220 C 770 320, 870 370, 970 320 C 1070 270, 1120 170, 1170 220 C 1220 270, 1270 370, 1320 320;
                  M 100 100 C 200 50, 300 100, 350 200 C 400 300, 350 400, 250 450 C 150 500, 100 450, 150 350 C 200 250, 300 250, 400 300 C 500 350, 600 450, 700 400 C 800 350, 850 250, 800 150 C 750 50, 650 100, 700 200 C 750 300, 850 350, 950 300 C 1050 250, 1100 150, 1150 200 C 1200 250, 1250 350, 1300 300
                "
              />
            </path>
            
            {/* Second swooping line below - offset pattern */}
            <path
              d="M 50 850 
                 C 150 900, 250 850, 300 750
                 C 350 650, 300 550, 400 500
                 C 500 450, 550 500, 600 600
                 C 650 700, 700 800, 800 850
                 C 900 900, 1000 850, 1050 750
                 C 1100 650, 1050 550, 950 500
                 C 850 450, 800 500, 850 600
                 C 900 700, 1000 750, 1100 800
                 C 1200 850, 1250 900, 1350 850"
              stroke="url(#loopGradient)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <animate
                attributeName="d"
                dur="18s"
                repeatCount="indefinite"
                values="
                  M 50 850 C 150 900, 250 850, 300 750 C 350 650, 300 550, 400 500 C 500 450, 550 500, 600 600 C 650 700, 700 800, 800 850 C 900 900, 1000 850, 1050 750 C 1100 650, 1050 550, 950 500 C 850 450, 800 500, 850 600 C 900 700, 1000 750, 1100 800 C 1200 850, 1250 900, 1350 850;
                  M 70 870 C 170 920, 270 870, 320 770 C 370 670, 320 570, 420 520 C 520 470, 570 520, 620 620 C 670 720, 720 820, 820 870 C 920 920, 1020 870, 1070 770 C 1120 670, 1070 570, 970 520 C 870 470, 820 520, 870 620 C 920 720, 1020 770, 1120 820 C 1220 870, 1270 920, 1370 870;
                  M 50 850 C 150 900, 250 850, 300 750 C 350 650, 300 550, 400 500 C 500 450, 550 500, 600 600 C 650 700, 700 800, 800 850 C 900 900, 1000 850, 1050 750 C 1100 650, 1050 550, 950 500 C 850 450, 800 500, 850 600 C 900 700, 1000 750, 1100 800 C 1200 850, 1250 900, 1350 850
                "
              />
            </path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Activities
            </h2>
            <p className="text-xl text-gray-600">
              See what students are building together
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleActivities.map((activity) => (
              <div key={activity.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{activity.title}</h3>
                <p className="text-gray-600 mb-4">{activity.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {activity.tags.map((tag, index) => (
                    <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Have an activity idea? Start sharing today!
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Join thousands of students already building amazing activities together
          </p>
          <button className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg">
            Share Your Activity
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Support & Community</h4>
            <div className="flex justify-center space-x-4">
              <a href="#" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Discord</a>
              <a href="#" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">GitHub</a>
              <a href="#" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Developer Contacts</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
