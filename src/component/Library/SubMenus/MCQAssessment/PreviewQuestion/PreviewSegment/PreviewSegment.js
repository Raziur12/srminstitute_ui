import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../../../../../../Styles/PreviewTest/PreviewTest.css";
import BackButton from '../../../../../BackButton';
import axiosInstance from '../../../../../../interceptor/axiosInstance';
import image from "../../../../../../Assets/preview.png";

const PreviewSegment = () => {
    const location = useLocation();
    const { testData } = location.state || {};
    const navigate = useNavigate();
    const [segments, setSegments] = useState([]);
    const [loading, setLoading] = useState(true); // Loader state

    useEffect(() => {
        if (testData) {
            setLoading(true);
            axiosInstance.get(`assessments/tests/${testData}/`)
                .then(response => {
                    setSegments(response.data.data?.segments || []);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching segments:", error);
                    setLoading(false);
                });
        }
    }, [testData]);

    const handleClick = (test) => {
        navigate(`/preview-question`, { state: { testId: test.id } });
    };

    return (
        <div className="user-preview-test-container">
            <BackButton />
            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div> {/* You can style this in your CSS */}
                    <p>Loading...</p>
                </div>
            ) : (
                <div className="user-test-grid">
                    {segments.length > 0 ? (
                        segments.map((test) => (
                            <div 
                                key={test.id} 
                                className="user-test-card"
                                onClick={() => handleClick(test)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img 
                                    src={test.thumbnail && test.thumbnail.trim() !== "" ? test.thumbnail : image} 
                                    alt={test.name} 
                                    className="user-test-thumbnail"
                                />
                                <h2 className="user-test-title">{test.name}</h2>
                            </div>
                        ))
                    ) : (
                        <p>No segments available</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PreviewSegment;
