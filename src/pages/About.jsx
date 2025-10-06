import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">

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

export default About
