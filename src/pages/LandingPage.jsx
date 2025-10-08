import React from 'react'

const LandingPage = ({ onNavigateToExplore }) => {
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
    <div className="min-h-screen bg-white flex flex-col">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Connect with Students.<br />
            Build Together.
          </h1>
          <div className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto text-center">
            <p>Discover initiatives across all majors.</p>
            <p>Or find the perfect teammates to make your vision come to life.</p>
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
