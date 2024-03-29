import { useState, useEffect } from "react";
import { getAllMedicines } from "../../apis/Interceptor";
import Chip from "@mui/material/Chip";
import "./MedicineForm.css";

export default function MedicineForm({ isOpen, onClose, selectedPrescription }) {
  console.log(selectedPrescription);
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    age: "",
    address: "",
    contact: "",
    date: "",
    description: "",
    medicineDetails: {
      name: "",
      dosage: "",
      frequency: "",
    },
    suggestedMedicines: [],
    selectedMedicines: [],
  });

  useEffect(() => {
    if (selectedPrescription) {
      setPatientDetails({
        name: selectedPrescription.prescription_details.name || "",
        age: selectedPrescription.prescription_details.age || "",
        address: selectedPrescription.prescription_details.address || "",
        contact:
          selectedPrescription.prescription_details.contact_details || "",
        date: selectedPrescription.prescription_details.date || "",
        description:
          selectedPrescription.prescription_details.description || "",
        medicineDetails: {
          name: "",
          dosage: "",
          frequency: "",
        },
        suggestedMedicines: [],
        selectedMedicines: [],
      });

      // Wrap the API call in a try-catch block for error handling
      const fetchData = async () => {
        try {
          const data = await getAllMedicines(
            selectedPrescription.prescription_details.name.trim()
          );
          console.log("API response:", data.significantLink);
          setPatientDetails((prevDetails) => ({
            ...prevDetails,
            suggestedMedicines: data.significantLink || [],
          }));
        } catch (error) {
          console.error("Error fetching suggested medicines:", error.message);
        }
      };

      fetchData();
    }
  }, [selectedPrescription]);

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleMedicineChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails((prevDetails) => ({
      ...prevDetails,
      medicineDetails: {
        ...prevDetails.medicineDetails,
        [name]: value,
      },
    }));

    if (name === "name" && value.trim() !== "") {
      console.log("Calling getAllMedicines with value:", value.trim());
      getAllMedicines(value.trim())
        .then((data) => {
          console.log("API response:", data.significantLink);
          setPatientDetails((prevDetails) => ({
            ...prevDetails,
            suggestedMedicines: data.significantLink || [],
          }));
        })
        .catch((error) => {
          console.error("Error fetching suggested medicines:", error.message);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", patientDetails);
    onClose();
  };

  const handleConfirmOrder = () => {
    // Handle confirmation logic
  };

  const handleSelectedMedicineChange = (e) => {
    const selectedMedicineName = e.target.value;
    setPatientDetails((prevDetails) => ({
      ...prevDetails,
      medicineDetails: {
        ...prevDetails.medicineDetails,
        name: selectedMedicineName,
      },
    }));
  };

  const handleDeleteMedicine = (index) => {
    setPatientDetails((prevDetails) => {
      const newSelectedMedicines = [...prevDetails.selectedMedicines];
      newSelectedMedicines.splice(index, 1);
      return {
        ...prevDetails,
        selectedMedicines: newSelectedMedicines,
      };
    });
  };

  const handleAddMedicine = () => {
    const { name, dosage, frequency } = patientDetails.medicineDetails;
    if (name.trim() !== "") {
      setPatientDetails((prevDetails) => ({
        ...prevDetails,
        selectedMedicines: [
          ...prevDetails.selectedMedicines,
          { name, dosage, frequency },
        ],
        medicineDetails: {
          name: "",
          dosage: "",
          frequency: "",
        },
      }));
    }
  };

  return (
    <div className={`medicine-form-${isOpen ? "open" : ""}`}>
      <div className="form-content">
        {selectedPrescription && (
          <>
            <form onSubmit={handleSubmit} className="form-inputs">
              <div className="patient-info">
                <label className="label">
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={patientDetails.name}
                    onChange={handlePatientChange}
                    className="input-field"
                  />
                </label>
                <label className="label">
                  Age:
                  <input
                    type="text"
                    name="age"
                    value={patientDetails.age}
                    onChange={handlePatientChange}
                    className="input-field"
                  />
                </label>
                <label className="label">
                  Address:
                  <input
                    type="text"
                    name="address"
                    value={patientDetails.address}
                    onChange={handlePatientChange}
                    className="input-field"
                  />
                </label>
                <label className="label">
                  Contact:
                  <input
                    type="text"
                    name="contact"
                    value={patientDetails.contact}
                    onChange={handlePatientChange}
                    className="input-field"
                  />
                </label>
                <label className="label">
                  Date:
                  <input
                    type="text"
                    name="date"
                    value={patientDetails.date}
                    onChange={handlePatientChange}
                    className="input-field"
                  />
                </label>
                <label className="label">
                  Description:
                  <textarea
                    name="description"
                    value={patientDetails.description}
                    onChange={handlePatientChange}
                    className="textarea-field"
                  />
                </label>
              </div>
              <div className="medicine-info">
                <label className="label">
                  Medicine Name:
                  <input
                    type="text"
                    name="name"
                    value={patientDetails.medicineDetails.name}
                    onChange={handleMedicineChange}
                    className="input-field"
                  />
                  {patientDetails.suggestedMedicines.length > 0 && (
                    <div className="suggested-meds-container">
                      <label htmlFor="selectedMedicine">Select Medicine:</label>
                      <select
                        id="selectedMedicine"
                        name="selectedMedicine"
                        value={patientDetails.medicineDetails.name}
                        onChange={(e) => handleSelectedMedicineChange(e)}
                        className="input-field"
                      >
                        <option value="">Select a medicine</option>
                        {patientDetails.suggestedMedicines.map((medicine) => (
                          <option key={medicine.id} value={medicine.name}>
                            {medicine.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button type="button" onClick={handleAddMedicine} className="button">
                    Add Medicine
                  </button>
                  {patientDetails.selectedMedicines.length > 0 && (
                    <div className="added-medicines">
                      {patientDetails.selectedMedicines.map((medicine, index) => (
                        <Chip
                          key={index}
                          label={medicine.name}
                          onDelete={() => handleDeleteMedicine(index)}
                          className="chip"
                        />
                      ))}
                    </div>
                  )}
                </label>
                <label className="label">
                  Dosage:
                  <input
                    type="text"
                    name="dosage"
                    value={patientDetails.medicineDetails.dosage}
                    onChange={handleMedicineChange}
                    className="input-field"
                  />
                </label>
                <label className="label">
                  Frequency:
                  <input
                    type="text"
                    name="frequency"
                    value={patientDetails.medicineDetails.frequency}
                    onChange={handleMedicineChange}
                    className="input-field"
                  />
                </label>
              </div>
              <div className="order-btns">
                <button type="submit" onClick={handleConfirmOrder} className="button">
                  Confirm Order
                </button>
                <div style={{ marginTop: '10px' }}></div>
                <button type="reject" className="button" style={{ backgroundColor: '#dc3545' }}>Reject Order</button>
              </div>
            </form>
          </>
        )}
      </div>
      {selectedPrescription && (
        <img
          src={`data:image/png;base64,${selectedPrescription.prescription_details.image}`}
          alt="prescription"
          className="prescription-image"
        />
      )}
    </div>
  );
}
