import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getFootprints, getFootprintSummary, reset } from '../features/footprint/footprintSlice';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showRecommendations, setShowRecommendations] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { footprints, summary, isLoading, isError, message } = useSelector(
    (state) => state.footprints
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate('/login');
    } else {
      dispatch(getFootprints());
      dispatch(getFootprintSummary());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  const categoryChartData = {
    labels: summary?.byCategory?.length > 0 
      ? summary.byCategory.map((cat) => cat._id) 
      : ['transportation', 'waste', 'energy', 'food', 'shopping'],
    datasets: [
      {
        label: 'Carbon Emissions (kg CO2e)',
        data: summary?.byCategory?.length > 0 
          ? summary.byCategory.map((cat) => cat.total) 
          : [2.5, 1.8, 3.2, 1.5, 0.9],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartData = {
    labels: summary?.byMonth?.length > 0 
      ? summary.byMonth.map((month) => month._id) 
      : ['2025-08', '2025-07', '2025-06', '2025-05', '2025-04', '2025-03'],
    datasets: [
      {
        label: 'Monthly Carbon Emissions (kg CO2e)',
        data: summary?.byMonth?.length > 0 
          ? summary.byMonth.map((month) => month.total) 
          : [2.68, 3.1, 2.4, 1.9, 2.2, 2.5],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <section className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.16 4.16l1.42 1.42A6.99 6.99 0 0010 18a7 7 0 005.84-10.84l1.42-1.42a9 9 0 11-13.1 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Total Carbon Footprint</h3>
              </div>
              {summary?.total ? (
                <div className="mt-2">
                  <div className="flex items-baseline">
                    <div className="text-4xl font-bold text-teal-700">
                      {summary.total.toFixed(2)}
                    </div>
                    <span className="text-sm font-medium text-gray-500 ml-2">kg CO2e</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Your total emissions across all categories
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg mt-4">
                  <svg className="w-12 h-12 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="text-gray-500">No data available</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mr-4">
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Entries Recorded</h3>
              </div>
              {footprints && footprints.length > 0 ? (
                <div className="mt-2">
                  <div className="flex items-baseline">
                    <div className="text-4xl font-bold text-emerald-700">
                      {footprints.length}
                    </div>
                    <span className="text-sm font-medium text-gray-500 ml-2">entries</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Last entry: {new Date(footprints[0].date).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg mt-4">
                  <svg className="w-12 h-12 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="text-gray-500">No entries yet</div>
                  <p className="mt-3 text-gray-500 text-sm">No data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Carbon Goal</h3>
              </div>
              {user?.carbonGoal ? (
                <div className="mt-2">
                  <div className="flex items-baseline">
                    <div className="text-4xl font-bold text-teal-700">
                      {user.carbonGoal.toFixed(2)}
                    </div>
                    <span className="text-sm font-medium text-gray-500 ml-2">kg CO2e</span>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${summary && summary.total <= user.carbonGoal ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: summary ? `${Math.min(100, (summary.total / user.carbonGoal) * 100)}%` : '0%' }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {summary ? 
                        (summary.total <= user.carbonGoal ? 
                          `${((user.carbonGoal - summary.total) / user.carbonGoal * 100).toFixed(1)}% below your goal` : 
                          `${((summary.total - user.carbonGoal) / user.carbonGoal * 100).toFixed(1)}% above your goal`) : 
                        'Add entries to track progress'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg mt-4">
                  <svg className="w-12 h-12 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-gray-500">No goal set</div>
                  <Link to="/app/profile" className="mt-3 text-teal-600 hover:text-teal-700 font-medium text-sm">
                    Set a goal in your profile
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Emissions by Category</h3>
              </div>
              <div className="h-80 flex items-center justify-center">
                {true ? (
                  <Pie
                    data={categoryChartData}
                    options={{
                      maintainAspectRatio: false,
                      cutout: '60%',
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            boxWidth: 12,
                            padding: 15,
                            font: {
                              size: 12,
                              family: "'Inter', sans-serif"
                            },
                            usePointStyle: true,
                            pointStyle: 'circle'
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          titleColor: '#1f2937',
                          bodyColor: '#4b5563',
                          borderColor: '#e5e7eb',
                          borderWidth: 1,
                          padding: 12,
                          cornerRadius: 8,
                          titleFont: {
                            family: "'Inter', sans-serif",
                            size: 14,
                            weight: 'bold'
                          },
                          bodyFont: {
                            family: "'Inter', sans-serif",
                            size: 13
                          },
                          callbacks: {
                            label: function(context) {
                              const value = context.raw;
                              const total = context.chart.getDatasetMeta(0).total;
                              const percentage = ((value / total) * 100).toFixed(1);
                              return `${context.label}: ${value.toFixed(2)} kg (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg w-full">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    <p className="text-gray-500 mb-3 text-center">No category data available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mr-4">
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Monthly Emissions</h3>
              </div>
              <div className="h-80 flex items-center justify-center">
                {true ? (
                  <Bar
                    data={monthlyChartData}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.03)',
                            drawBorder: false
                          },
                          border: {
                            display: false
                          },
                          ticks: {
                            padding: 10,
                            font: {
                              size: 11,
                              family: "'Inter', sans-serif"
                            },
                            color: '#6b7280',
                            callback: function(value) {
                              return value + ' kg';
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          border: {
                            display: false
                          },
                          ticks: {
                            padding: 10,
                            font: {
                              size: 11,
                              family: "'Inter', sans-serif"
                            },
                            color: '#6b7280'
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          titleColor: '#1f2937',
                          bodyColor: '#4b5563',
                          borderColor: '#e5e7eb',
                          borderWidth: 1,
                          padding: 12,
                          cornerRadius: 8,
                          titleFont: {
                            family: "'Inter', sans-serif",
                            size: 14,
                            weight: 'bold'
                          },
                          bodyFont: {
                            family: "'Inter', sans-serif",
                            size: 13
                          },
                          callbacks: {
                            label: function(context) {
                              return `${context.raw.toFixed(2)} kg CO2e`;
                            }
                          }
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg w-full">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 01-2-2H5a2 2 0 01-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 mb-3 text-center">No monthly data available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Entries</h2>
        </div>

        {footprints && footprints.length > 0 ? (
          <div className="overflow-hidden shadow-lg rounded-2xl border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Emissions</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {footprints.slice(0, 5).map((footprint) => (
                    <tr key={footprint._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(footprint.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize bg-teal-100 text-teal-800">
                          {footprint.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{footprint.activity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        <span className={footprint.carbonEmission > 10 ? 'text-red-600' : 'text-green-600'}>
                          {footprint.carbonEmission.toFixed(2)} {footprint.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/app/edit-footprint/${footprint._id}`}
                          className="text-teal-600 hover:text-teal-800 inline-flex items-center transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-lg">
            <svg className="w-20 h-20 mx-auto text-gray-300 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No entries yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">You haven't recorded any carbon footprint data yet.</p>
          </div>
        )}
      </section>

      <button
        onClick={() => setShowRecommendations(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-teal-300"
        aria-label="Open AI Carbon Coach"
      >
        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>

      {showRecommendations && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-800">AI Carbon Coach</h4>
              <button 
                onClick={() => setShowRecommendations(false)} 
                className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-gray-600">
                <div className="font-medium text-teal-600 mb-1">💡 Quick Tip</div>
                <p>Try using public transport instead of driving to reduce your carbon footprint by up to 30%!</p>
              </div>
              <div className="text-xs text-gray-600">
                <div className="font-medium text-teal-600 mb-1">🎯 Goal Progress</div>
                <p>You're {user?.carbonGoal && summary?.total ? (summary.total <= user.carbonGoal ? 'on track' : `${((summary.total - user.carbonGoal) / user.carbonGoal * 100).toFixed(0)}% above`) : 'setting up'} your carbon goal</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;