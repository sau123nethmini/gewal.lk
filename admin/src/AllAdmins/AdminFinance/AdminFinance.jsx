import React, { useState, useEffect } from "react";
import {
  getAllFinances,
  deleteFinance,
  approveFinance,
} from "../../../../frontend/src/services/finance";
import { FaTrash, FaCheck, FaTimes, FaFilePdf } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

ChartJS.register(ArcElement, Tooltip, Legend);

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
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

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

      // Calculate statistics
      const stats = {
        total: enrichedFinances.length,
        pending: enrichedFinances.filter(f => f.status === 'pending').length,
        approved: enrichedFinances.filter(f => f.status === 'approved').length,
        rejected: enrichedFinances.filter(f => f.status === 'rejected').length
      };
      setStats(stats);

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

  const chartData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [stats.pending, stats.approved, stats.rejected],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',  // Blue for pending
          'rgba(34, 197, 94, 0.8)',   // Green for approved
          'rgba(239, 68, 68, 0.8)',   // Red for rejected
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const generatePDF = () => {
    try {
      console.log('Starting PDF generation...');
      const doc = new jsPDF();
      console.log('PDF document created');
      
      // Add title
      doc.setFontSize(16);
      doc.text('Finance Applications Report', 20, 20);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      // Add statistics
      doc.setFontSize(12);
      doc.text('Summary Statistics', 20, 40);
      doc.setFontSize(10);
      doc.text(`Total Applications: ${stats.total}`, 20, 50);
      doc.text(`Pending: ${stats.pending}`, 20, 57);
      doc.text(`Approved: ${stats.approved}`, 20, 64);
      doc.text(`Rejected: ${stats.rejected}`, 20, 71);
      
      // Add applications list
      doc.setFontSize(12);
      doc.text('Applications List', 20, 85);
      
      let yPosition = 95;
      finances.forEach((finance, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(10);
        doc.text(`Application ${index + 1}:`, 20, yPosition);
        doc.text(`Name: ${finance.userName || 'N/A'}`, 30, yPosition + 7);
        doc.text(`Email: ${finance.userEmail || 'No email'}`, 30, yPosition + 14);
        doc.text(`Bank: ${finance.selectedBank || 'Not specified'}`, 30, yPosition + 21);
        doc.text(`Loan Amount: LKR ${formatCurrency(finance.loanAmount)}`, 30, yPosition + 28);
        doc.text(`Status: ${finance.status}`, 30, yPosition + 35);
        
        yPosition += 50;
      });
      
      // Save the PDF
      const fileName = `finance-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      console.log('PDF saved successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (loading)
    return (
      <div className="text-center p-6">Loading finance applications...</div>
    );
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">
          Finance Applications
        </h1>
        <button
          onClick={() => {
            console.log('Download button clicked');
            generatePDF();
          }}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <FaFilePdf className="mr-2" />
          Download PDF Report
        </button>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
          <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
          <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-green-200">
          <h3 className="text-sm font-medium text-gray-500">Approved</h3>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-red-200">
          <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-lg shadow border border-blue-200 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">Application Status Distribution</h2>
        <div className="h-64 flex items-center justify-center">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

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