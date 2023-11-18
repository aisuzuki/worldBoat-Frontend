import { useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { MetaHeader } from '~~/components/MetaHeader';
import {  useScaffoldContractWrite } from '~~/hooks/scaffold-eth';

const Contribute: NextPage = () => {
  const [co2Percentage, setCo2Percentage] = useState(10);


  /*
  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "WBToken",
    functionName: "mint",
    args: ["0x42010e15271F3803884685030C37a3C464b855aD", 100n],
    value: 0,
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  */

  //@TODO how to get my connected wallet address?
  const { writeAsync } = useScaffoldContractWrite({
    contractName: "WorldBoatClimateActions",
    functionName: "safeMint",
    args: ["0x42010e15271F3803884685030C37a3C464b855aD", "hello", 42n, 0,0,1, true, 666n],
    value: 0n,
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });



  const maxCo2Offset = 200; // Assuming 100 as the max value for simplicity
  const commonCo2Offsets = [5, 10, 15, 20, 50, 100]; // Common offsets

  const pricePoints = [
    { value: 2, description: "Local Small Projects, Preserving Forests", icon: "🌱" },
    { value: 5, description: "Community Initiatives", icon: "🏡" },
    { value: 7, description: "Regional Efforts", icon: "🌍" },
    { value: 10, description: "Cutting Edge Co2 Recapturing ", icon: "🔬" }
  ];


   // Function to handle quick selection buttons
   const handleQuickSelect = (amount) => {
    setCo2Percentage(amount);
  };

  const handleCustomInput = (e) => {
    const value = Math.min(Math.max(e.target.value, 5), maxCo2Offset);
    setCo2Percentage(value);
  };


  const [region, setRegion] = useState('Global'); // Default to one of the continents
  const [pricePoint, setPricePoint] = useState(2); // Default to one of the price points
  const [category, setCategory] = useState(''); // No category by default

 // Function to calculate the number of stick figures
 const stickFigures = useMemo(() => {
  const figures = [];
  const figureCount = Math.ceil(co2Percentage / 5); // 5 tons per figure
  for (let i = 0; i < figureCount; i++) {

    if(i % 2 !== 0){

      figures.push(<span key={i} className="stick-figure green-stick-figure">🧍</span>);
    
    }
   

    else{
      figures.push(<span key={i} className="stick-figure green-stick-figure">🧍‍♀️</span>);

    }
  }
  return figures;
}, [co2Percentage]);

const peopleOffsetMessage = `You are offsetting more than ${Math.ceil(co2Percentage / 5)} people's CO2 output globally .`;

  
  const climateChangeCategories = [
    "General Fund Green Energy",
    "Renewable Energy Projects",
    "Reforestation and Afforestation",
    "Ocean Conservation",
    "Wildlife Protection and Biodiversity",
    "Sustainable Agriculture and Food Systems",
    "Urban Greening and Sustainable Cities",
    "Carbon Capture and Storage Technologies",
    "Environmental Education and Awareness",
    "Climate Resilience and Adaptation Projects",
    "Pollution Reduction and Waste Management"
  ];

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const userChoices = {
      co2Percentage,
      region,
      pricePoint,
      category
    };

    console.log("User Choices:", userChoices);

    try {
      const txnResponse =  writeAsync(

      ); // Use writeAsync here



     
      console.log("Transaction Response:", txnResponse);
    } catch (error) {
      console.error("Transaction Error:", error);
    }

    //Contract address for ClimateAction: 
    // 0xfdd6076e296eF65E211A4c894FEfC52880e86935 

    //Contract address for token topup:
    //0x85B815f9B358d90C4338C216B9F346BE47F820fA

    // Process the contribution here 
  };


  const mockSubmit = (e) => {
    e.preventDefault();

    const userChoices = {
      co2Percentage,
      region,
      pricePoint,
      category
    };

    console.log("User Choices:", userChoices);


    //Contract address for ClimateAction: 
    // 0xfdd6076e296eF65E211A4c894FEfC52880e86935 

    //Contract address for token topup:
    //0x85B815f9B358d90C4338C216B9F346BE47F820fA

    // Process the contribution here 
  };

  const handlePricePointSelect = (value) => {
    setPricePoint(value);
  };


  return (
    <>
  <MetaHeader title="Contribute to WorldBoat Protocol" />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl text-center mb-6">Contribute to WorldBoat Protocol</h1>
        <form onSubmit={mockSubmit} className="max-w-lg mx-auto">
          <div className="flex items-center mb-4">
            <div className="flex-1 mr-4">
              <label className="block text-sm font-medium text-gray-700">CO2 Offset in Tons</label>
              <div className="flex flex-wrap justify-between mt-1">
                {commonCo2Offsets.map((amount) => (
                  <button key={amount} onClick={() => handleQuickSelect(amount)} className={`btn btn-xs m-1 ${co2Percentage === amount ? 'btn-active' : ''}`}>{amount}</button>
                ))}
                <input type="number" min="5" max={maxCo2Offset} value={co2Percentage} onChange={handleCustomInput} className="input input-xs w-20 m-1" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm mb-2">{peopleOffsetMessage}</p>
              <div className="flex">{stickFigures}</div>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">Choose a Region</label>
            <select id="region" value={region} onChange={(e) => setRegion(e.target.value)} className="mt-1 block w-full">
            <option value="Global">Global</option>
              <option value="Africa">Africa</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="North America">North America</option>
              <option value="South America">South America</option>
              <option value="Australia">Australia</option>
 
            </select>
          </div>

          <div className="mb-4">
          <label htmlFor="pricePoint" className="block text-sm font-medium text-gray-700">Price Point</label>
          <div className="flex justify-around mt-2">
            {pricePoints.map(({ value, description, icon }) => (
              <button key={value} onClick={() => handlePricePointSelect(value)} className={`flex flex-col items-center p-2 ${pricePoint === value ? 'bg-blue-200' : ''}`}>
                <span className="text-lg">{icon}</span>
                <span className="text-xs mt-1">{description}</span>
                <span className="text-sm font-bold">${value}</span>
              </button>
            ))}
          </div>
        </div>

    <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Choose a Project Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full">
            {climateChangeCategories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

          <div className="flex justify-center">
            <button type="submit" onClick={handleSubmit} className="btn btn-primary">Contribute</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Contribute;
