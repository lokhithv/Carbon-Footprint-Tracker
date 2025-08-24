import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getRecommendations,
  generateRecommendations,
  updateRecommendation,
  reset,
} from '../features/recommendations/recommendationSlice';
import Spinner from '../components/Spinner';

function Recommendations() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { recommendations, isLoading, isError, message } = useSelector(
    (state) => state.recommendations
  );

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getRecommendations());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  const handleGenerateRecommendations = () => {
    dispatch(generateRecommendations());
    toast.info('Generating new recommendations...');
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateRecommendation({ id, recommendationData: { implementationStatus: status } }));
    toast.success('Recommendation status updated');
  };

  const filteredRecommendations = recommendations.filter((rec) => {
    if (filter === 'all') return true;
    if (filter === 'not-started') return rec.implementationStatus === 'not-started';
    if (filter === 'in-progress') return rec.implementationStatus === 'in-progress';
    if (filter === 'completed') return rec.implementationStatus === 'completed';
    if (filter === 'transportation') return rec.category === 'transportation';
    if (filter === 'energy') return rec.category === 'energy';
    if (filter === 'food') return rec.category === 'food';
    if (filter === 'shopping') return rec.category === 'shopping';
    if (filter === 'waste') return rec.category === 'waste';
    return true;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-200 text-gray-800';
      case 'in-progress':
        return 'bg-blue-200 text-blue-800';
      case 'completed':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'transportation':
        return 'bg-purple-200 text-purple-800';
      case 'energy':
        return 'bg-yellow-200 text-yellow-800';
      case 'food':
        return 'bg-green-200 text-green-800';
      case 'shopping':
        return 'bg-blue-200 text-blue-800';
      case 'waste':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getDifficultyBadgeClass = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-200 text-green-800';
      case 'medium':
        return 'bg-yellow-200 text-yellow-800';
      case 'hard':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Personalized Recommendations</h1>
          <button
            onClick={handleGenerateRecommendations}
            className="btn btn-primary"
            disabled={isLoading}
          >
            Generate New Recommendations
          </button>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'not-started' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('not-started')}
            >
              Not Started
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('in-progress')}
            >
              In Progress
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'transportation' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('transportation')}
            >
              Transportation
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'energy' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('energy')}
            >
              Energy
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'food' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('food')}
            >
              Food
            </button>
          </div>
        </div>

        {filteredRecommendations.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-lg mb-4">
              No recommendations found. Generate new recommendations to get started.
            </p>
            <button
              onClick={handleGenerateRecommendations}
              className="btn btn-primary"
              disabled={isLoading}
            >
              Generate Recommendations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRecommendations.map((recommendation) => (
              <div key={recommendation._id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeClass(recommendation.category)}`}
                  >
                    {recommendation.category.charAt(0).toUpperCase() + recommendation.category.slice(1)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadgeClass(recommendation.difficulty)}`}
                  >
                    {recommendation.difficulty.charAt(0).toUpperCase() + recommendation.difficulty.slice(1)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{recommendation.title}</h2>
                <p className="text-gray-700 mb-4">{recommendation.description}</p>
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600">Potential Impact:</span>
                  <p className="text-gray-700">{recommendation.potentialImpact}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(recommendation.implementationStatus)}`}
                    >
                      {recommendation.implementationStatus === 'not-started'
                        ? 'Not Started'
                        : recommendation.implementationStatus === 'in-progress'
                        ? 'In Progress'
                        : 'Completed'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(recommendation._id, 'not-started')}
                      className={`px-2 py-1 rounded text-xs ${recommendation.implementationStatus === 'not-started' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                      Not Started
                    </button>
                    <button
                      onClick={() => handleStatusChange(recommendation._id, 'in-progress')}
                      className={`px-2 py-1 rounded text-xs ${recommendation.implementationStatus === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange(recommendation._id, 'completed')}
                      className={`px-2 py-1 rounded text-xs ${recommendation.implementationStatus === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;