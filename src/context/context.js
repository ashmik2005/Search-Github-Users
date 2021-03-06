import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

// Provider, Consumer - GithubContext.Provider

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  // request limit, loading
  const [request, setRequest] = useState(0);
  const [loading, setIsLoading] = useState(false);
  // error
  const [error, setError] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => { 
    toggleError() 
    // setLoading(true)  
    const response = await axios(`${rootUrl}/users/${user}`).catch(err => console.log(err))
    console.log(response); 
    if (response) { 
      setGithubUser(response.data) 
      // working with user data
    } else { 
      toggleError(true,'there is no user with that username')
    }
  };

  // check rate limit
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequest(remaining);
        if (remaining === 0) {
          // throw an error
          toggleError(
            true,
            "Sorry, you have exceeded your hourly usage limit :("
          );
        }
      })
      .catch((err) => console.log(err));
  };

  function toggleError(show = true, msg = "") {
    setError({ show, msg });
  }

  // error
  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider
      value={{ githubUser, repos, followers, request, error, searchGithubUser }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
