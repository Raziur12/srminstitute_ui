import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import "../../../../Styles/CreateUser/scenariocontent.css";
import axiosInstance from "../../../../interceptor/axiosInstance";
import Select from 'react-select';

const ScenarioContent = () => {
  const [roles, setRoles] = useState([]);
  const [competencyList, setCompetencyList] = useState([]);
  const [errors, setErrors] = useState({ expert: '' });
  const [formData, setFormData] = useState({
    item_name: '',
    item_description: '',
    category: '',
    item_gender: '',
    competencys: [], // Updated to array for multi-select
    role: '',
    level: '',
    thumbnail: null,
    expert: null,
    item_video: null,
    item_background: null,
    isApproved: false,
    isLive: false,
  });

  // Fetch roles on component mount
  useEffect(() => {
    axiosInstance
      .get('/orgss/role/')
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setRoles(response.data.data);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching roles:', error);
        setRoles([]);
      });
  }, []);

  // Fetch competency list
  useEffect(() => {
    axiosInstance
      .get('competency/')
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setCompetencyList(res.data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching competencies:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  
    // Validate URL
    if (name === 'expert') {
      if (!isValidUrl(value) && value.trim() !== '') {
        setErrors({ ...errors, [name]: 'Invalid URL. Please enter a valid link.' });
      } else {
        setErrors({ ...errors, [name]: '' });
      }
    }
  };

  const isValidUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };
  

  const handleCompetencyChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((option) => option.value);
    setFormData({ ...formData, competencys: selectedIds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'competencys') {
        dataToSend.append(key, value.join(',')); // Convert array to comma-separated string
      } else {
        dataToSend.append(key, value);
      }
    });

    try {
      await axiosInstance.post('sean/item/', dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire('Success', 'Your data has been submitted successfully!', 'success');
    } catch (error) {
      Swal.fire('Error', 'There was an issue submitting your data.', 'error');
    }
  };

  return (
    <form className="scenariocontaent-main-form" onSubmit={handleSubmit}>
      <div className="scenariocontaent-two-divs">
        <label className="scenariocontaent-one-input">
          Item Name:
          <input
            name="item_name"
            value={formData.item_name}
            onChange={handleInputChange}
            placeholder="Item Name"
          />
        </label>

        <label className="scenariocontaent-one-input">
          Item Description:
          <textarea
            name="item_description"
            value={formData.item_description}
            onChange={handleInputChange}
            placeholder="Item Description"
          />
        </label>
      </div>

      <div className="scenariocontaent-two-divs">
        <label className="scenariocontaent-one-input">
          Competency:
          <Select
            isMulti
            name="competencys"
            value={competencyList
              .filter((c) => formData.competencys.includes(c.id))
              .map((c) => ({ value: c.id, label: c.competency_name }))}
            options={competencyList.map((c) => ({
              value: c.id,
              label: c.competency_name,
            }))}
            onChange={handleCompetencyChange}
          />
        </label>

        <label className="scenariocontaent-one-input">
          Role:
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="">Select a role</option>
            {Array.isArray(roles) &&
              roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
          </select>
        </label>
      </div>

      <div className="scenariocontaent-two-divs">
        <label className="scenariocontaent-one-input">
          Category:
          <input
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Category"
          />
        </label>

        <label className="scenariocontaent-one-input">
          Gender:
          <select
            name="item_gender"
            value={formData.item_gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="all">All</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </label>
      </div>

      <div className="scenariocontaent-two-divs">
        <label className="scenariocontaent-one-input">
          Level:
          <select
            name="level"
            value={formData.level}
            onChange={handleInputChange}
          >
            <option value="">Select Level</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
          </select>
        </label>

        <label className="scenariocontaent-one-input">
          Thumbnail (Image):
          <input
            type="file"
            name="thumbnail"
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div className="scenariocontaent-two-divs">
      <label className="scenariocontaent-one-input">
        Expert (Video URL):
        <textarea
          name="expert"
          value={formData.expert}
          onChange={handleInputChange}
          // placeholder="Expert Video URL"
        />
      </label>
      {errors.expert && <p style={{ color: 'red' }}>{errors.expert}</p>}


        <label className="scenariocontaent-one-input">
          Item Video:
          <input
            type="file"
            name="item_video"
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div className="scenariocontaent-two-divs">
        <label className="scenariocontaent-one-input">
          Item Background (Video):
          <input
            type="file"
            name="item_background"
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div className="scenariocontaent-two-divs">
        <label className="scenariocontaent-one-input">
          Is Approved:
          <input
            type="checkbox"
            name="isApproved"
            checked={formData.isApproved}
            onChange={handleInputChange}
          />
        </label>
        
        <label className="scenariocontaent-one-input">
          Is Live:
          <input
            type="checkbox"
            name="isLive"
            checked={formData.isLive}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ScenarioContent;
