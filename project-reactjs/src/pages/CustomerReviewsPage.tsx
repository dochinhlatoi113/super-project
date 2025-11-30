import StatsGrid from '../components/StatsGrid';

export default function CustomerReviewsPage() {
  const reviews = [
    { id: 1, customer: 'John Doe', product: 'Laptop Pro 15"', rating: 5, comment: 'Excellent product! Very satisfied with the purchase.', date: '2024-11-28', status: 'approved' },
    { id: 2, customer: 'Jane Smith', product: 'Wireless Mouse', rating: 4, comment: 'Good quality, but delivery was a bit slow.', date: '2024-11-27', status: 'approved' },
    { id: 3, customer: 'Bob Johnson', product: 'USB-C Cable', rating: 3, comment: 'Average quality, expected better for the price.', date: '2024-11-26', status: 'pending' },
    { id: 4, customer: 'Alice Brown', product: 'Monitor 27"', rating: 5, comment: 'Amazing display quality! Highly recommend.', date: '2024-11-25', status: 'approved' },
  ];

  const stats = {
    totalReviews: 1234,
    avgRating: 4.6,
    pending: 23,
    approved: 1156,
    rejected: 55
  };

  const statsData = [
    { label: 'Total Reviews', value: stats.totalReviews },
    { label: 'Average Rating', value: stats.avgRating, color: 'text-yellow-500' },
    { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
    { label: 'Approved', value: stats.approved, color: 'text-green-600' },
    { label: 'Rejected', value: stats.rejected, color: 'text-red-600' },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Reviews</h1>
          <p className="text-gray-500 mt-1">Manage and respond to customer feedback</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Export Reviews
          </button>
        </div>
      </div>

      <StatsGrid stats={statsData} columns={5} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>All Reviews</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>All Ratings</option>
              <option>5 Stars</option>
              <option>4 Stars</option>
              <option>3 Stars</option>
              <option>2 Stars</option>
              <option>1 Star</option>
            </select>
          </div>
        </div>

        <div className="divide-y">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">{review.customer.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.customer}</h4>
                    <p className="text-sm text-gray-500">{review.product}</p>
                    <div className="mt-2">{renderStars(review.rating)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    review.status === 'approved' ? 'bg-green-100 text-green-700' :
                    review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {review.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-2">{review.date}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              <div className="flex space-x-3">
                {review.status === 'pending' && (
                  <>
                    <button className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                      Reject
                    </button>
                  </>
                )}
                <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
