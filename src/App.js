import React from "react";
import classnames from "classnames";
import Header from "./Header/Header";
import "./App.css";
import Card from "./components/Card";
import requestAuthors from "./api/authorsApi";
import requestPaintings from "./api/paintingsApi";
import requestLocations from "./api/locationsApi";
import { Input, Pagination, Select } from "fwt-internship-uikit";
import normalizeName from "./api/utils/normalizeName";

function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [elements, setElements] = React.useState([]);
  const [params, setParams] = React.useState({
    _page: 1,
    _limit: 12,
    q: "",
  });
  const [authors, setAuthors] = React.useState([]);
  const [selectedAuthor, setSelectedAuthor] = React.useState(null);
  const [locations, setLocations] = React.useState([]);
  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const wrapperClass = classnames({ wrapper: true, wrapper_dark: isDarkTheme });
  const paintingsErrorClass = classnames({
    paintingsError: true,
    paintingsError_dark: isDarkTheme,
  });
  const loadingPaintingsClass = classnames({
    loadingPaintings: true,
    loadingPaintings_dark: isDarkTheme,
  });
  const emptyArrayPaintingsClass = classnames({
    emptyArrayPaintings: true,
    emptyArrayPaintings_dark: isDarkTheme,
  });

  const getPaintings = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await requestPaintings({
        ...params,
        authorId: selectedAuthor?.id,
        locationId: selectedLocation?.id,
        created: "",
      });
      setElements(response.data);
      setIsLoading(false);
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      } else if (error.request) {
        console.log(error.request);
      }
      setIsError(true);
      console.log("Error:", error.message);
    }
  }, [params, selectedLocation, selectedAuthor]);

  const getAuthors = React.useCallback(async () => {
    try {
      const response = await requestAuthors();
      setAuthors(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getLocations = React.useCallback(async () => {
    try {
      const response = await requestLocations();
      setLocations(
        response.data.map((item) => ({ name: item.location, id: item.id }))
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  React.useEffect(() => {
    getPaintings();
    getAuthors();
    getLocations();
  }, [getPaintings, getAuthors, getLocations]);

  const handleSearchChange = (q) => {
    setParams({ ...params, q });
  };

  const handleSelectedAuthorChange = (name) => {
    const findAuthor = authors.find((item) => item.name === name);
    setSelectedAuthor(findAuthor);
    setParams({ ...params, _page: 1 });
    console.log(findAuthor);
  };

  const handleSelectedLocationChange = (location) => {
    const findLocation = locations.find((item) => item.name === location);
    setSelectedLocation(findLocation);
    setParams({ ...params, _page: 1 });
    console.log(findLocation);
  };

  const handleSwitchTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={wrapperClass}>
      <div className="Container">
        <Header onClick={handleSwitchTheme} isDarkTheme={isDarkTheme} />
        <div className="Content">
          <Input
            className="Input"
            isDarkTheme={isDarkTheme}
            placeholder="Name"
            onChange={(event) => handleSearchChange(event.target.value)}
          />
          <Select
            className="Select_author"
            isDarkTheme={isDarkTheme}
            options={authors}
            value={
              selectedAuthor ? (
                <option>{selectedAuthor.name}</option>
              ) : (
                <option>Author</option>
              )
            }
            onChange={handleSelectedAuthorChange}
          />
          <Select
            className="Select_location"
            isDarkTheme={isDarkTheme}
            options={locations}
            value={
              selectedLocation ? (
                <option>{normalizeName(selectedLocation, 33)}</option>
              ) : (
                <option>Location</option>
              )
            }
            onChange={handleSelectedLocationChange}
          />
        </div>
        {isLoading ? (
          isError ? (
            <div className="Error">
              <p className={paintingsErrorClass}>Error 404</p>
            </div>
          ) : (
            <p className={loadingPaintingsClass}>Loading...</p>
          )
        ) : (
          <div className="card__wrapper">
            {elements.map((item, index) => (
              <Card key={index} card={item} />
            ))}
          </div>
        )}
        <div className="Empty">
          {!isLoading && !isError && elements.length === 0 && (
            <p className={emptyArrayPaintingsClass}>Not found</p>
          )}
        </div>
        {!isLoading && !isError && elements.length !== 0 && (
          <Pagination
            className="Pagination"
            isDarkTheme={isDarkTheme}
            currentPage={params._page}
            pagesAmount={
              elements.length === 12 ? params._page + 2 : params._page
            }
            onChange={(page) =>
              setParams((prevParams) => ({ ...prevParams, _page: page }))
            }
          />
        )}
      </div>
    </div>
  );
}

export default App;
