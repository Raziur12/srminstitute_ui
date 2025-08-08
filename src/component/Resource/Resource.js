import React, { useEffect, useState } from 'react';
import "../../Styles/Resource/Resource.css";
import axiosInstance from '../../interceptor/axiosInstance';
import Modal from "./ResourceModel";

const Resource = () => {
  const [videoResources, setVideoResources] = useState([]); // State to hold video resources
  const [textResources, setTextResources] = useState([]); // State to hold text resources
  const [selectedResource, setSelectedResource] = useState(null); // State to hold the clicked resource
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  const [isVideoMode, setIsVideoMode] = useState(true); // State to switch between Video and Text mode
  const [expandedResourceId, setExpandedResourceId] = useState(null); // State to track the currently expanded resource
  const [currentVideoPage, setCurrentVideoPage] = useState(1); // Current video page state
  const [nextVideoPage, setNextVideoPage] = useState(null); // Next video page URL
  const [previousVideoPage, setPreviousVideoPage] = useState(null); // Previous video page URL
  const [currentTextPage, setCurrentTextPage] = useState(1); // Current text page state
  const [nextTextPage, setNextTextPage] = useState(null); // Next text page URL
  const [previousTextPage, setPreviousTextPage] = useState(null); // Previous text page URL
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch video resources
  const fetchVideoResources = async (page = 1) => {
    setIsLoading(true); // Start loading
    try {
      const response = await axiosInstance.get(`api/resources/?page=${page}`);
      setVideoResources(response.data.results);
      setNextVideoPage(response.data.next);
      setPreviousVideoPage(response.data.previous);
    } catch (error) {
      console.error('Error fetching video resources:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Fetch text resources
  const fetchTextResources = async (page = 1) => {
    setIsLoading(true); // Start loading
    try {
      const response = await axiosInstance.get(`api/text-resources/?page=${page}`);
      setTextResources(response.data.results);
      setNextTextPage(response.data.next);
      setPreviousTextPage(response.data.previous);
    } catch (error) {
      console.error('Error fetching text resources:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchVideoResources(currentVideoPage); // Fetch video resources with the current page
    fetchTextResources(currentTextPage); // Fetch text resources with the current page
  }, [currentVideoPage, currentTextPage]);

  const handleResourceClick = async (resource) => {
    try {
      await axiosInstance.get('api/resources/', {
        params: {
          description: resource.description,
          id: resource.id,
          name: resource.name,
          thumbnail: resource.thumbnail,
          youtube_link: resource.youtube_link,
        },
      });

      setSelectedResource(resource);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error clicking resource:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleVideoMode = () => {
    setIsVideoMode(true);
    setExpandedResourceId(null); // Reset expanded resource when switching modes
  };

  const toggleTextMode = () => {
    setIsVideoMode(false);
    setExpandedResourceId(null); // Reset expanded resource when switching modes
  };

  const toggleReadMore = (id) => {
    if (expandedResourceId === id) {
      setExpandedResourceId(null); // Close if the same resource is clicked
    } else {
      setExpandedResourceId(id); // Open the new resource and close the previous one
    }
  };

  const handleNextVideoPage = () => {
    if (nextVideoPage) {
      const nextPageNumber = new URL(nextVideoPage).searchParams.get('page');
      setCurrentVideoPage(parseInt(nextPageNumber));
    }
  };

  const handlePreviousVideoPage = () => {
    if (previousVideoPage) {
      const previousPageNumber = new URL(previousVideoPage).searchParams.get('page');
      setCurrentVideoPage(parseInt(previousPageNumber));
    }
  };

  const handleNextTextPage = () => {
    if (nextTextPage) {
      const nextPageNumber = new URL(nextTextPage).searchParams.get('page');
      setCurrentTextPage(parseInt(nextPageNumber));
    }
  };

  const handlePreviousTextPage = () => {
    if (previousTextPage) {
      const previousPageNumber = new URL(previousTextPage).searchParams.get('page');
      setCurrentTextPage(parseInt(previousPageNumber));
    }
  };

  return (
    <div>
      {/* Buttons to toggle content */}
      <div className="resource-buttons">
        <button 
          className={`toggle-button ${isVideoMode ? 'active' : ''}`}
          onClick={toggleVideoMode}
        >
          Videos
        </button>
        <button 
          className={`toggle-button ${!isVideoMode ? 'active' : ''}`}
          onClick={toggleTextMode}
        >
          Text
        </button>
      </div>

      <div className="resource-container">
        <h2 className="resource-top">Resource</h2>

        <div className='user-tit-top'>
          <h2>In this section, we will list out all the points for you to get the maximum benefit from the Bodhiguru platform.</h2>
          <h2>You can either see it in the Video Section or Text Section. In case your query is not listed, please reach out to us by clicking on the Contact button and writing your query. We will get back to you in 48 hours.</h2>
        </div>

        {isLoading ? ( // Display loading indicator while fetching data
          <div className="loader">Loading...</div>
        ) : isVideoMode ? (
          // Video Mode
          videoResources.map((resource) => (
            <div 
              key={resource.id} 
              className="resource-box"
              onClick={() => handleResourceClick(resource)}
            >
              <img src={resource.thumbnail} alt={resource.description} className="resource-thumbnail" />
              <div className="resource-description">{resource.description}</div>
            </div>
          ))
        ) : (
          // Text Mode
          textResources.map((resource) => (
            <div key={resource.id} className="resource-box">
              <h3>{resource.name}</h3>
              <p className='text-p'>
                {expandedResourceId === resource.id 
                  ? resource.description.split(',').map((part, index) => (
                      <span key={index} className="description-part">
                        {part.trim()}
                        {index < resource.description.split(',').length - 1 && <br />}
                      </span>
                    ))
                  : `${resource.description.split(',').map(part => part.trim()).join(', ').substring(0, 100)}...`}
              </p>
              <div className='text-box-btn'>
                <button className="read-more-button" onClick={() => toggleReadMore(resource.id)}>
                  {expandedResourceId === resource.id ? 'Read Less' : 'Read More'}
                </button>
              </div>
            </div>
          ))
        )}

        {isModalOpen && selectedResource && isVideoMode && (
          <Modal onClose={closeModal}>
            <iframe
              width="560"
              height="315"
              src={selectedResource.youtube_link.replace('watch?v=', 'embed/')}
              title={selectedResource.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Modal>
        )}

        {/* Video Pagination Controls */}
        {isVideoMode && (
          <div className="pagination">
            <button 
              onClick={handlePreviousVideoPage} 
              disabled={!previousVideoPage} 
              className={`pagination-button ${!previousVideoPage ? 'disabled' : ''}`}
            >
              Previous
            </button>
            <span>Page {currentVideoPage}</span>
            <button 
              onClick={handleNextVideoPage} 
              disabled={!nextVideoPage} 
              className={`pagination-button ${!nextVideoPage ? 'disabled' : ''}`}
            >
              Next
            </button>
          </div>
        )}

        {/* Text Pagination Controls */}
        {!isVideoMode && (
          <div className="pagination">
            <button 
              onClick={handlePreviousTextPage} 
              disabled={!previousTextPage} 
              className={`pagination-button ${!previousTextPage ? 'disabled' : ''}`}
            >
              Previous
            </button>
            <span>Page {currentTextPage}</span>
            <button 
              onClick={handleNextTextPage} 
              disabled={!nextTextPage} 
              className={`pagination-button ${!nextTextPage ? 'disabled' : ''}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resource;
