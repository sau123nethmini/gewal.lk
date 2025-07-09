import React, { useState, useEffect } from "react";
import {
  getAllFinances,
  deleteFinance,
  approveFinance,
} from "../services/finance";
import { FaTrash, FaCheck, FaTimes } from "react-icons/fa";

// Temporary users and banks data
const tempUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    banks: ["Bank of Ceylon", "Commercial Bank"]
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    banks: ["Sampath Bank", "Commercial Bank"]
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    banks: ["Bank of Ceylon", "Sampath Bank"]
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily.brown@example.com",
    banks: ["Commercial Bank"]
  },
  {
  id: 5,
    name: "Sharuka Gengatharan",
    email: "sharukagenga@gmail.com",
    banks: ["Bank of Ceylon"]
  }
];

const AdminFinancePage = () => {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinances();
  }, []);

  const fetchFinances = async () => {
    try {
      setLoading(true);
      const data = await getAllFinances();
      
      // Add temporary user and bank details
      const enrichedFinances = data.map(finance => {
        // Randomly select a user
        const randomUser = tempUsers[Math.floor(Math.random() * tempUsers.length)];
        
        return {
          ...finance,
          userName: randomUser.name,
          userEmail: randomUser.email,
          selectedBank: randomUser.banks[Math.floor(Math.random() * randomUser.banks.length)]
        };
      });

      setFinances(enrichedFinances);
      setError(null);
    } catch (err) {
      setError("Failed to load finances. Please try again later.");
      console.error("Error fetching finances:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to reject this finance application?"
      )
    ) {
      try {
        await deleteFinance(id);
        setFinances(finances.filter((finance) => finance._id !== id));
      } catch (err) {
        setError("Failed to delete finance application. Please try again.");
        console.error("Error deleting finance:", err);
      }
    }
  };

  const handleApprove = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to approve this finance application?"
      )
    ) {
      try {
        const response = await approveFinance(id);
        
        setFinances(
          finances.map((finance) =>
            finance._id === id ? { ...finance, status: 'approved' } : finance
          )
        );
      } catch (err) {
        setError("Failed to approve finance application. Please try again.");
        console.error("Error approving finance:", err);
      }
    }
  };


  const handleReject = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to reject this finance application?"
      )
    ) {
      try {
       
        const response = await approveFinance(id, 'rejected'); 
        
        
        setFinances(
          finances.map((finance) =>
            finance._id === id ? { ...finance, status: 'rejected' } : finance
          )
        );
      } catch (err) {
        setError("Failed to reject finance application. Please try again.");
        console.error("Error rejecting finance:", err);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("si-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadgeClasses = (status) => {
    if (status === "approved") {
      return "px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800";
    } else if (status === "rejected") {
      return "px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800";
    }
    return "px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800";
  };

  if (loading)
    return (
      <div className="text-center p-6">Loading finance applications...</div>
    );
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">
        Finance Applications
      </h1>

      {finances.length === 0 ? (
        <p>No finance applications found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-blue-300 shadow-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-blue-50 text-blue-700 uppercase text-sm border-b border-blue-200">
                <th className="py-3 px-4 text-left font-semibold">
                  Applicant Details
                </th>
                <th className="py-3 px-4 text-left font-semibold">Amount</th>
                <th className="py-3 px-4 text-left font-semibold">Terms</th>
                <th className="py-3 px-4 text-left font-semibold">Payment</th>
                <th className="py-3 px-4 text-left font-semibold">Status</th>
                <th className="py-3 px-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {finances.map((finance) => (
                <tr
                  key={finance._id}
                  className="border-b border-blue-100 hover:bg-blue-50"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-blue-800">
                      {finance.userName || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {finance.userEmail || "No email provided"}
                    </div>
                    <div className="text-sm text-gray-500">
                      Bank:{" "}
                      <span className="font-medium">
                        {finance.selectedBank || "Not specified"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Created:{" "}
                      {new Date(finance.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <span className="font-medium">Loan: </span>
                      {formatCurrency(finance.loanAmount)}
                    </div>
                    <div>
                      <span className="font-medium">Down: </span>
                      {formatCurrency(finance.downPayment)}
                    </div>
                    <div className="text-sm text-gray-500">
                      LTV: {finance.ltv}%
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <span className="font-medium">Term: </span>
                      {finance.loanTerm} years
                    </div>
                    <div>
                      <span className="font-medium">Rate: </span>
                      {finance.interestRate}%
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {finance.paymentFrequency} payments
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium">
                      {formatCurrency(finance.monthlyPayment)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Total Interest: {formatCurrency(finance.totalInterest)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Total Cost: {formatCurrency(finance.totalCost)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={getStatusBadgeClasses(finance.status)}>
                      {finance.status === "approved" 
                        ? "Approved" 
                        : finance.status === "rejected" 
                        ? "Rejected" 
                        : "Pending"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex justify-center space-x-3">
                      {finance.status !== "approved" && finance.status !== "rejected" && (
                        <>
                          <button
                            onClick={() => handleApprove(finance._id)}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition duration-200"
                            title="Approve Application"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleReject(finance._id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition duration-200"
                            title="Reject Application"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(finance._id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full transition duration-200"
                        title="Remove Application"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminFinancePage;