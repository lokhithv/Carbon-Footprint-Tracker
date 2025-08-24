import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  addFootprint,
  updateFootprint,
  getFootprints,
  clearFootprint,
  reset,
} from '../features/footprint/footprintSlice';
import Spinner from '../components/Spinner';


function FootprintForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { footprints, isLoading, isError, message } = useSelector(
    (state) => state.footprints
  );

  const [formData, setFormData] = useState({
    category: 'transportation',
    activity: '',
    date: new Date().toISOString().split('T')[0],
    carbonEmission: '',
    details: {},
  });

  const [activityDetails, setActivityDetails] = useState({});

  const { category, activity, date, carbonEmission } = formData;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getFootprints());

    return () => {
      dispatch(clearFootprint());
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch, id]);

  useEffect(() => {
    if (id && footprints.length > 0) {
      console.log('Editing footprint with ID:', id);
      console.log('Available footprints:', footprints);
      
      const footprintToEdit = footprints.find((fp) => {
        console.log('Comparing:', fp._id, id, String(fp._id) === String(id));
        return String(fp._id) === String(id);
      });
      
      if (footprintToEdit) {
        console.log('Found footprint to edit:', footprintToEdit);
        setFormData({
          category: footprintToEdit.category,
          activity: footprintToEdit.activity,
          date: new Date(footprintToEdit.date).toISOString().split('T')[0],
          carbonEmission: footprintToEdit.carbonEmission,
          details: footprintToEdit.details || {},
        });
        setActivityDetails(footprintToEdit.details || {});
      } else {
        console.log('Footprint not found in the loaded footprints');
        toast.error('Could not find the footprint to edit');
      }
    }
  }, [id, footprints]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const calculatedEmission = calculateCarbonEmission(category, activityDetails);
    if (calculatedEmission > 0) {
      setFormData((prev) => ({
        ...prev,
        carbonEmission: calculatedEmission.toFixed(2),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        carbonEmission: '',
      }));
    }
  }, [category, activityDetails]);

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    const newDetails = {
      ...activityDetails,
      [name]: value,
    };
    setActivityDetails(newDetails);
    
    const calculatedEmission = calculateCarbonEmission(category, newDetails);
    if (calculatedEmission > 0) {
      setFormData((prev) => ({
        ...prev,
        carbonEmission: calculatedEmission.toFixed(2),
      }));
    }
  };

  const calculateCarbonEmission = (category, details) => {
    let emission = 0;
    
    switch (category) {
      case 'transportation':
        const distance = parseFloat(details.distance) || 0;
        const transportType = details.type;
        
        const transportFactors = {
          car: 0.170,       
          bus: 0.100,      
          train: 0.035,     
          flight: 0.246,  
          bike: 0.021,
          cycle: 0,
          walk: 0,          
        };
        
        emission = distance * (transportFactors[transportType] || 0);
        break;
        
      case 'energy':
        const kwh = parseFloat(details.kwh) || 0;
        const energyType = details.type;
        
        const energyFactors = {
          electricity: 0.394, 
          natural_gas: 0.202, 
          heating_oil: 0.268, 
          propane: 0.227,  
        };
        
        emission = kwh * (energyFactors[energyType] || 0);
        break;
        
      case 'food':
        const quantity = parseFloat(details.quantity) || 0;
        const foodType = details.type;
        
        const foodFactors = {
          meat: 27.0,       
          dairy: 3.2,      
          vegetable: 0.5,   
          fruit: 0.7,       
          grain: 1.4,      
          processed: 3.1,   
        };
        
        emission = quantity * (foodFactors[foodType] || 0);
        break;
        
      case 'shopping':
        const weight = parseFloat(details.weight) || 0;
        const itemType = details.itemType;
        
        const shoppingFactors = {
          electronics: 18.7,  
          clothing: 12.5,    
          furniture: 3.2,    
          books: 1.5,        
          groceries: 2.1,   
          other: 3.5,
        };
        
        emission = weight * (shoppingFactors[itemType] || 0);
        break;
        
      case 'waste':
        const wasteWeight = parseFloat(details.weight) || 0;
        const wasteType = details.wasteType;
        
        const wasteFactors = {
          plastic: 3.1,      
          paper: 1.1,      
          organic: 0.85,   
          electronic: 9.2,  
          hazardous: 4.5,  
          other: 2.0,
        };
        
        emission = wasteWeight * (wasteFactors[wasteType] || 0);
        break;
        
      default:
        emission = 0;
    }
    
    return Math.max(0, emission);
  };

  const getEmissionComparison = (emission) => {
    const emissionNum = parseFloat(emission);
    if (emissionNum <= 0) return "no significant emissions";
    
    if (emissionNum < 1) return "less than a typical car trip";
    if (emissionNum < 5) return "about the same as a short car trip";
    if (emissionNum < 20) return "similar to a long car journey";
    if (emissionNum < 50) return "equivalent to a domestic flight";
    return "a significant carbon footprint";
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!category || !activity || !carbonEmission) {
      toast.error('Please fill in all required fields');
      return;
    }

    const footprintData = {
      category,
      activity,
      date,
      carbonEmission: parseFloat(carbonEmission),
      details: activityDetails,
    };

    if (id) {
      dispatch(updateFootprint({ id, footprintData }));
      toast.success('Footprint updated successfully');
    } else {
      dispatch(addFootprint(footprintData));
      toast.success('Footprint added successfully');
    }

    navigate('/app');
  };

  const renderCategoryFields = () => {
    switch (category) {
      case 'transportation':
        return (
          <>

            <div className="form-group mb-4">
              <label htmlFor="type" className="form-label flex items-center text-gray-700 font-medium mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Transportation Type
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-black"
                id="type"
                name="type"
                value={activityDetails.type || ''}
                onChange={handleDetailsChange}
              >
                <option value="">Select type</option>
                <option value="car">Car</option>
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="flight">Flight</option>
                <option value="bike">Bike</option>
                <option value="walk">Walk</option>
              </select>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="distance" className="form-label flex items-center text-gray-700 font-medium mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Distance (km)
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-black placeholder-gray-500"
                id="distance"
                name="distance"
                value={activityDetails.distance || ''}
                onChange={handleDetailsChange}
                placeholder="Enter distance in kilometers"
              />
            </div>
          </>
        );
      case 'energy':
        return (
          <>
            <div className="form-group mb-4">
              <label htmlFor="type" className="form-label flex items-center text-gray-700 font-medium mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Energy Type
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-black"
                id="type"
                name="type"
                value={activityDetails.type || ''}
                onChange={handleDetailsChange}
              >
                <option value="">Select type</option>
                <option value="electricity">Electricity</option>
                <option value="natural_gas">Natural Gas</option>
                <option value="heating_oil">Heating Oil</option>
                <option value="propane">Propane</option>
              </select>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="kwh" className="form-label flex items-center text-gray-700 font-medium mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Amount (kWh or units)
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-black placeholder-gray-500"
                id="kwh"
                name="kwh"
                value={activityDetails.kwh || ''}
                onChange={handleDetailsChange}
                placeholder="Enter amount in kWh or units"
              />
            </div>
          </>
        );
      case 'food':
        return (
          <>
            <div className="form-group mb-4">
              <label htmlFor="type" className="form-label flex items-center text-gray-700 font-medium mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Food Type
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-black"
                id="type"
                name="type"
                value={activityDetails.type || ''}
                onChange={handleDetailsChange}
              >
                <option value="">Select type</option>
                <option value="meat">Meat</option>
                <option value="dairy">Dairy</option>
                <option value="vegetable">Vegetables</option>
                <option value="fruit">Fruits</option>
                <option value="grain">Grains</option>
                <option value="processed">Processed Foods</option>
              </select>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="quantity" className="form-label flex items-center text-gray-700 font-medium mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                Quantity (kg)
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-black placeholder-gray-500"
                id="quantity"
                name="quantity"
                value={activityDetails.quantity || ''}
                onChange={handleDetailsChange}
                placeholder="Enter quantity in kilograms"
              />
            </div>
          </>
        );
      case 'shopping':
        return (
          <>
            <div className="form-group mb-4">
              <label htmlFor="itemType" className="form-label flex items-center text-gray-700 font-medium mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Item Type
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-black"
                id="itemType"
                name="itemType"
                value={activityDetails.itemType || ''}
                onChange={handleDetailsChange}
              >
                <option value="">Select type</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="furniture">Furniture</option>
                <option value="books">Books</option>
                <option value="groceries">Groceries</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="weight" className="form-label flex items-center text-gray-700 font-medium mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-black placeholder-gray-500"
                id="weight"
                name="weight"
                value={activityDetails.weight || ''}
                onChange={handleDetailsChange}
                placeholder="Enter item weight in kilograms"
              />
            </div>
          </>
        );
      case 'waste':
        return (
          <>
            <div className="form-group mb-4">
              <label htmlFor="wasteType" className="form-label flex items-center text-gray-700 font-medium mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Waste Type
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-black"
                id="wasteType"
                name="wasteType"
                value={activityDetails.wasteType || ''}
                onChange={handleDetailsChange}
              >
                <option value="">Select type</option>
                <option value="plastic">Plastic</option>
                <option value="paper">Paper</option>
                <option value="organic">Organic</option>
                <option value="electronic">Electronic</option>
                <option value="hazardous">Hazardous</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="wasteWeight" className="form-label flex items-center text-gray-700 font-medium mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-black placeholder-gray-500"
                id="wasteWeight"
                name="wasteWeight"
                value={activityDetails.wasteWeight || ''}
                onChange={handleDetailsChange}
                placeholder="Enter waste weight in kilograms"
              />
            </div>
          </>
        );
      default:
        return (
          <div className="col-span-2 text-center py-6 text-gray-500 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto text-teal-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">No additional details available for this category.</p>
            <p className="text-sm mt-2 text-gray-400">You can still calculate emissions based on your activity description.</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  const getCategoryIcon = () => {
    switch (category) {
      case 'transportation':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        );
      case 'energy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'food':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'shopping':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'waste':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
    }
  };

  return (
    <div className="py-8 px-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {id ? 'Edit Carbon Footprint' : 'Add Carbon Footprint Entry'}
          </h1>
          <p className="text-gray-600 text-lg">Track your environmental impact by recording your activities</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6 text-white flex items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            <div className="bg-white/20 p-3 rounded-full mr-4 relative z-10">
              {getCategoryIcon()}
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold">{id ? 'Update Entry Details' : 'Enter Activity Details'}</h2>
              <p className="text-white/80">All fields marked with * are required</p>
            </div>
          </div>
          
          <div className="p-8">
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group mb-4 md:col-span-2">
                  <label htmlFor="category" className="form-label flex items-center text-gray-700 font-medium mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Category *
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 outline-none text-gray-800"
                    id="category"
                    name="category"
                    value={category}
                    onChange={onChange}
                  >
                    <option value="transportation">Transportation</option>
                    <option value="energy">Energy</option>
                    <option value="food">Food</option>
                    <option value="shopping">Shopping</option>
                    <option value="waste">Waste</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group mb-4 md:col-span-2">
                  <label htmlFor="activity" className="form-label flex items-center text-gray-700 font-medium mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Activity Description *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 outline-none text-gray-800"
                    id="activity"
                    name="activity"
                    value={activity}
                    onChange={onChange}
                    placeholder="Describe the activity (e.g., 'Daily commute to work')"
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="date" className="form-label flex items-center text-gray-700 font-medium mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Date *
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 outline-none text-gray-800"
                    id="date"
                    name="date"
                    value={date}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="carbonEmission" className="form-label flex items-center text-gray-700 font-medium mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Carbon Emission (kg CO2e) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 pr-24 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 outline-none text-gray-800"
                      id="carbonEmission"
                      name="carbonEmission"
                      value={carbonEmission}
                      onChange={onChange}
                      placeholder="Auto-calculated"
                      required
                    />
                    {carbonEmission > 0 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-teal-600 font-medium">
                        kg CO2e
                      </div>
                    )}
                  </div>
                  {carbonEmission > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Estimated impact:</span> This is equivalent to {getEmissionComparison(carbonEmission)}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-2xl mt-8 mb-8 border-2 border-teal-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    Additional Details
                  </span>
                  <span className="ml-2 bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Required for Calculation</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-teal-100">
                  {renderCategoryFields()}
                </div>
                
                {carbonEmission > 0 && (
                  <div className="mt-8 space-y-6">
                    <div className="p-6 bg-white rounded-xl border-2 border-teal-300 shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          Carbon Impact
                        </span>
                        <span className="text-2xl font-bold text-teal-600 bg-teal-100 px-3 py-1 rounded-lg">{carbonEmission} kg CO2e</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 h-3 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${Math.min(100, (carbonEmission / 50) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="mt-3 text-sm text-gray-600 font-medium">
                        Scale: 0-50 kg CO2e range • {carbonEmission < 10 ? 'Low Impact' : carbonEmission < 25 ? 'Medium Impact' : 'High Impact'}
                      </div>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 shadow-md">
                      <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Data Summary
                      </h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="font-semibold">Category:</span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">{category}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="font-semibold">Activity:</span>
                          <span className="text-gray-600">{activity || 'Not specified'}</span>
                        </div>
                        {Object.entries(activityDetails).map(([key, value]) => (
                          value && (
                            <div key={key} className="flex justify-between items-center py-2 border-b border-teal-200">
                              <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                              <span className="text-gray-600">{value}</span>
                            </div>
                          )
                        ))}
                        <div className="flex justify-between items-center py-3 bg-teal-100 rounded-lg px-3 mt-3">
                          <span className="font-bold text-teal-800">Total Emissions:</span>
                          <span className="font-bold text-teal-600 text-lg">{carbonEmission} kg CO2e</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group mb-0 flex items-center justify-between mt-8">
                <button 
                  type="button" 
                  onClick={() => navigate(-1)} 
                  className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Cancel
                </button>
                <button type="submit" className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {id ? 'Update' : 'Save'} Footprint
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
        </div>
      );
}

export default FootprintForm;
