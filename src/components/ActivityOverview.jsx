import React from 'react'

const ActivityOverview = ({ activity }) => {
  return (
    <div className="space-y-8">
      {/* Description Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Activity</h2>
        <p className="text-gray-700 leading-relaxed">
          {activity.description}
        </p>
      </section>

      {/* Details Grid */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Team Size */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Team Size</h3>
          <p className="text-2xl font-bold text-gray-900">
            {activity.teamIds?.length || 1} members
          </p>
        </div>

        {/* Open Positions */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Open Positions</h3>
          <p className="text-2xl font-bold text-gray-900">
            {activity.openings || 0} openings
          </p>
        </div>

        {/* Owner */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Activity Owner</h3>
          <p className="text-lg font-semibold text-gray-900">
            {activity.ownerDisplayName || 'Unknown'}
          </p>
        </div>

        {/* Created Date */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
          <p className="text-lg font-semibold text-gray-900">
            {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : 'Unknown'}
          </p>
        </div>
      </section>

      {/* Links Section */}
      {activity.links && activity.links.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Links</h2>
          <div className="space-y-2">
            {activity.links.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                {link}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Interested in joining?</h3>
        <p className="text-gray-700 mb-4">
          Contact the activity owner to express your interest in joining this team!
        </p>
      </section>
    </div>
  )
}

export default ActivityOverview

