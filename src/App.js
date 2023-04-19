import { useEffect, useState } from "react";
import "./App.css";
import logo from "./mlh-prep.png";
import AutoCity from "./components/AutoCity";
import Forecast from './Forecast';
import React  from 'react';


function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("");
  const [results, setResults] = useState(null);

  const basename = process.env.NODE_ENV === "development" ?
		   'http://0.0.0.0:8888' :
		   'https://deploy-preview-25--mlh-prep-23-apr-prep-1-project.netlify.app';
  const uri = basename + '/api/weather?q=' + city 
  
  const handleSelect = (suggestion) => {
    setCity(suggestion.name);
  };

  useEffect(() => {
    if (city) {
      fetch(uri)
        .then((res) => res.json())
        .then(
          (result) => {
            if (result["cod"] !== 200) {
              setIsLoaded(false);
            } else {
              setIsLoaded(true);
              setResults(result);
            }
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
  }, [city]);
  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <>
        <img className="logo" src={logo} alt="MLH Prep Logo"></img>
        <div>
	  <h2>Enter a city below <span role="img" aria-label="emoji">👇</span></h2>
	  <AutoCity onSelect={handleSelect} />
	  <div className="Results">
	    {!isLoaded && <h2>Loading...</h2>}
	    {isLoaded && results && (
	      <>
                <h3>{results.weather[0].main}</h3>
                <p>Feels like {results.main.feels_like}°C</p>
                <i>
		  <p>
		    {results.name}, {results.sys.country}
		  </p>
                </i>
		<Forecast city={city} />
	      </>
	    )}
	  </div>
        </div>
      </>
    );
  }
}

export default App;

