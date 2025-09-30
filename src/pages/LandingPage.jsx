import React from 'react'

const LandingPage = ({ onNavigateToExplore }) => {
  // Sample project data
  const sampleProjects = [
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
    <div className="min-h-screen bg-white">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">Connectivity</h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Home</a>
              <button 
                onClick={onNavigateToExplore}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Explore Projects
              </button>
              <a href="#share" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Share Your Project</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">About</a>
            </nav>
            
            {/* Login/Sign Up */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Login</button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Connect with Students.<br />
            Build Together.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto">
            Discover projects across all majors or share your own and find the teammates you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onNavigateToExplore}
              className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
            >
              Explore Projects
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-bold py-4 px-8 rounded-lg text-lg transition-colors">
              Share Your Project
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Connectivity?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The platform that brings students together to create amazing projects
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Explore Projects</h3>
              <p className="text-gray-600">
                Browse student-led projects from art to engineering. Find inspiration and discover what your peers are building.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Collaborate Across Majors</h3>
              <p className="text-gray-600">
                Find teammates with different skills and perspectives. Build diverse teams that bring unique strengths to your project.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Showcase Your Work</h3>
              <p className="text-gray-600">
                Share what you're building and attract collaborators. Build your portfolio while making meaningful connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Spotlight Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-600">
              See what students are building together
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleProjects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
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
            Have a project idea? Start sharing today!
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Join thousands of students already building amazing projects together
          </p>
          <button className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg">
            Share Your Project
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Connectivity</h3>
              <p className="text-gray-400 mb-4">
                Connecting students to build amazing projects together.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Links</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#terms" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Community</h4>
              <ul className="space-y-2">
                <li><a href="#explore" className="text-gray-400 hover:text-white transition-colors">Explore Projects</a></li>
                <li><a href="#share" className="text-gray-400 hover:text-white transition-colors">Share Project</a></li>
                <li><a href="#help" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              Built at Hackathon 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
