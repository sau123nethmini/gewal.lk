// Existing code
export const createFinance = async (data) => {
  try {
    console.log("Sending finance data:", data); // Debug log

    const response = await fetch("http://localhost:4000/api/finance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log("Server response:", responseData); // Debug log

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to submit finance application");
    }

    if (!responseData.success) {
      throw new Error(responseData.message || "Application submission failed");
    }

    return responseData;
  } catch (error) {
    console.error("Error in createFinance:", error);
    throw error;
  }
};

// New functions for admin finance page

export const getAllFinances = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/finance", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching all finances:", error);
    throw error;
  }
};

export const deleteFinance = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/finance/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error deleting finance:", error);
    throw error;
  }
};

// New function for approving finance applications
export const approveFinance = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:4000/api/finance/${id}/approve`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error approving finance:", error);
    throw error;
  }
};
