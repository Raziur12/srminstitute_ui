import React from 'react'

const assessment = [
    {
      name: "Assessment 1",
      scenario: "Lorem ipsum dolor sit amet",
      itemNumber: 12345,
      keywords: ["keyword1", "keyword2", "keyword3"],
    },
    {
      name: "Assessment 2",
      scenario: "Consectetur adipiscing elit",
      itemNumber: 54321,
      keywords: ["keyword4", "keyword5", "keyword6"],
    },
    // Add more scenarios as needed
  ];


const AssessmentTable = () => {

    const handleEditbtn = () => {
    }

    return (
        <div className="scenario-main-table">
          <table className="scenario-table">
            <thead className="scenario-table-thead">
              <tr>
                <th>Name</th>
                <th>Assessment</th>
                <th>Item Number</th>
                <th>Keywords</th>
                <th>Edit</th>
              </tr>
            </thead>
    
            <tbody>
              {assessment.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.scenario}</td>
                  <td>{item.itemNumber}</td>
                  <td>
                    {item.keywords.join(", ")}
                  </td>
                  <td> 
                  <button 
                  className='scenario-table-edt-btn'
                  onClick={handleEditbtn}
                  >Edit
                  </button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

export default AssessmentTable
