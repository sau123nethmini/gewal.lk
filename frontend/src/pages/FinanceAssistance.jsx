import React, { useState, useEffect } from "react";
import { createFinance } from "../services/finance";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  FileText,
  Building,
  DollarSign,
  Clipboard,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
// import backgroundImage from "../assets/fi.jpg";

const banks = [
  {
    id: "BOC",
    name: "Bank of Ceylon",
    info: "Interest rate around 8.5% with low processing fee",
  },
  {
    id: "CommBank",
    name: "Commercial Bank",
    info: "Interest rate around 9% with fast approval process",
  },
  {
    id: "Sampath",
    name: "Sampath Bank",
    info: "Interest rate around 8.8% with flexible repayment options",
  },
];

// Fixed additional costs
const additionalCosts = {
  propertyTaxes: 25000,
  homeInsurance: 15000,
  valuationFees: 10000,
  legalFees: 30000,
};

const FinanceAssistance = () => {
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: "",
    email: "",
    phone: "",
    propertyPrice: 0,
    // Step 2: Loan Details
    downPaymentPercent: 0, 
    loanTerm: 5, 
    interestRate: 8, 
    loanType: "fixed", 
    paymentFrequency: "monthly", 
    // Step 3: Bank Selection
    bank: "",
    // Step 4: Additional Costs - now using fixed values
    propertyTaxes: additionalCosts.propertyTaxes,
    homeInsurance: additionalCosts.homeInsurance,
    valuationFees: additionalCosts.valuationFees,
    legalFees: additionalCosts.legalFees,
  });

  // Add validation errors state
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    propertyPrice: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const steps = [
    { id: 1, name: "Personal Info", icon: <User className="h-5 w-5" /> },
    { id: 2, name: "Loan Details", icon: <FileText className="h-5 w-5" /> },
    { id: 3, name: "Bank Selection", icon: <Building className="h-5 w-5" /> },
    {
      id: 4,
      name: "Additional Costs",
      icon: <DollarSign className="h-5 w-5" />,
    },
    { id: 5, name: "Review & Submit", icon: <Clipboard className="h-5 w-5" /> },
  ];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/properties/${id}`);
        if (response.data.success) {
          const propertyData = response.data.property;
          setProperty(propertyData);
          // Update formData with property price
          setFormData(prev => ({
            ...prev,
            propertyPrice: propertyData.price || 0
          }));
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Error fetching property details");
      }
    };

    fetchProperty();
  }, [id]);

  // Validate full name - no numbers, max 50 chars
  const validateFullName = (value) => {
    let error = "";
    if (!value.trim()) {
      error = "Full name is required";
    } else if (value.length > 50) {
      error = "Full name cannot exceed 30 characters";
    } else if (/\d/.test(value)) {
      error = "Full name cannot contain numbers";
    }
    return error;
  };

  // Validate email format
  const validateEmail = (value) => {
    let error = "";
    if (!value.trim()) {
      error = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Invalid email format";
    }
    return error;
  };

  // Validate phone - exactly 10 digits
  const validatePhone = (value) => {
    let error = "";
    if (!value.trim()) {
      error = "Phone number is required";
    } else if (!/^\d{10}$/.test(value)) {
      error = "Phone number must be exactly 10 digits";
    }
    return error;
  };

  // Validate property price
  const validatePropertyPrice = (value) => {
    let error = "";
    if (!value || value <= 0) {
      error = "Property price must be greater than 0";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For full name, prevent numbers
    if (name === "fullName" && /\d/.test(value)) {
      return; // Don't update state if numbers are entered
    }

    // For phone, prevent non-digits and limit to 10 digits
    if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: digits,
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validation
    if (name === "fullName") {
      setErrors((prev) => ({ ...prev, fullName: validateFullName(value) }));
    } else if (name === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (name === "phone") {
      setErrors((prev) => ({ ...prev, phone: validatePhone(value) }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    setFormData((prev) => {
      const updatedData = {
      ...prev,
        [name]: numericValue,
      };

      // If property price changes, recalculate all related values
      if (name === "propertyPrice") {
        const downPaymentAmount = numericValue * (prev.downPaymentPercent / 100);
        const loanAmount = numericValue - downPaymentAmount;
        const monthlyRate = prev.interestRate / 100 / 12;
        const payments = prev.loanTerm * 12;
        const monthlyPayment = (monthlyRate * loanAmount) / (1 - Math.pow(1 + monthlyRate, -payments));
        const totalInterest = monthlyPayment * payments - loanAmount;
        const totalAdditionalCosts = 
          Number(prev.propertyTaxes) +
          Number(prev.homeInsurance) +
          Number(prev.valuationFees) +
          Number(prev.legalFees);
        const totalCost = loanAmount + totalInterest + totalAdditionalCosts;
        const ltv = (loanAmount / numericValue) * 100;

        return {
          ...updatedData,
          loanAmount,
          downPayment: downPaymentAmount,
          monthlyPayment,
          totalInterest,
          totalCost,
          ltv: ltv.toFixed(2),
        };
      }

      // If down payment percentage changes, recalculate related values
      if (name === "downPaymentPercent") {
        const downPaymentAmount = prev.propertyPrice * (numericValue / 100);
        const loanAmount = prev.propertyPrice - downPaymentAmount;
        const monthlyRate = prev.interestRate / 100 / 12;
        const payments = prev.loanTerm * 12;
        const monthlyPayment = (monthlyRate * loanAmount) / (1 - Math.pow(1 + monthlyRate, -payments));
        const totalInterest = monthlyPayment * payments - loanAmount;
        const totalAdditionalCosts = 
          Number(prev.propertyTaxes) +
          Number(prev.homeInsurance) +
          Number(prev.valuationFees) +
          Number(prev.legalFees);
        const totalCost = loanAmount + totalInterest + totalAdditionalCosts;
        const ltv = (loanAmount / prev.propertyPrice) * 100;

        return {
          ...updatedData,
          loanAmount,
          downPayment: downPaymentAmount,
          monthlyPayment,
          totalInterest,
          totalCost,
          ltv: ltv.toFixed(2),
        };
      }

      // If interest rate or loan term changes, recalculate monthly payment and related values
      if (name === "interestRate" || name === "loanTerm") {
        const downPaymentAmount = prev.propertyPrice * (prev.downPaymentPercent / 100);
        const loanAmount = prev.propertyPrice - downPaymentAmount;
        const monthlyRate = (name === "interestRate" ? numericValue : prev.interestRate) / 100 / 12;
        const payments = (name === "loanTerm" ? numericValue : prev.loanTerm) * 12;
        const monthlyPayment = (monthlyRate * loanAmount) / (1 - Math.pow(1 + monthlyRate, -payments));
        const totalInterest = monthlyPayment * payments - loanAmount;
        const totalAdditionalCosts = 
          Number(prev.propertyTaxes) +
          Number(prev.homeInsurance) +
          Number(prev.valuationFees) +
          Number(prev.legalFees);
        const totalCost = loanAmount + totalInterest + totalAdditionalCosts;
        const ltv = (loanAmount / prev.propertyPrice) * 100;

        return {
          ...updatedData,
          loanAmount,
          downPayment: downPaymentAmount,
          monthlyPayment,
          totalInterest,
          totalCost,
          ltv: ltv.toFixed(2),
        };
      }

      return updatedData;
    });

    if (name === "propertyPrice") {
      setErrors((prev) => ({
        ...prev,
        propertyPrice: validatePropertyPrice(numericValue),
      }));
    }
  };

  const validateStep1 = () => {
    const fullNameError = validateFullName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    const propertyPriceError = validatePropertyPrice(formData.propertyPrice);

    setErrors({
      fullName: fullNameError,
      email: emailError,
      phone: phoneError,
      propertyPrice: propertyPriceError,
    });

    return !fullNameError && !emailError && !phoneError && !propertyPriceError;
  };

  const nextStep = () => {
    if (step === 1) {
      // Validate step 1 before proceeding
      if (!validateStep1()) {
        return; // Don't advance if validation fails
      }
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      propertyPrice: 0,
      downPaymentPercent: 0,
      loanTerm: 5,
      interestRate: 8,
      loanType: "fixed",
      paymentFrequency: "monthly",
      bank: "",
      propertyTaxes: additionalCosts.propertyTaxes,
      homeInsurance: additionalCosts.homeInsurance,
      valuationFees: additionalCosts.valuationFees,
      legalFees: additionalCosts.legalFees,
    });
    setErrors({
      fullName: "",
      email: "",
      phone: "",
      propertyPrice: "",
    });
    setStep(1);
  };

  const calculateMonthlyPayment = (loanAmount, annualInterestRate, loanTermYears) => {
    const monthlyRate = annualInterestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;
    return (monthlyRate * loanAmount) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.phone) {
        throw new Error("Please fill in all required fields");
      }

      // Calculate financial values
      const propertyPrice = parseFloat(formData.propertyPrice) || 0;
      const downPaymentPercent = parseFloat(formData.downPaymentPercent) || 20;
      const downPayment = (propertyPrice * downPaymentPercent) / 100;
      const loanAmount = propertyPrice - downPayment;

      const monthlyPayment = calculateMonthlyPayment(
        loanAmount,
        parseFloat(formData.interestRate) || 8,
        parseFloat(formData.loanTerm) || 5
      );
      const totalInterest = monthlyPayment * (parseFloat(formData.loanTerm) || 5) * 12 - loanAmount;
      const totalCost = propertyPrice + totalInterest;
      const ltv = ((loanAmount / propertyPrice) * 100).toFixed(2);

      // Prepare payload
    const payload = {
        property: id, // Use the property ID from URL params
      userName: formData.fullName,
      userEmail: formData.email,
        userPhone: formData.phone,
      selectedBank: formData.bank,
      loanAmount,
        downPayment,
        interestRate: parseFloat(formData.interestRate) || 8,
        loanTerm: parseFloat(formData.loanTerm) || 5,
        propertyTaxes: parseFloat(formData.propertyTaxes) || 0,
        homeInsurance: parseFloat(formData.homeInsurance) || 0,
        valuationFees: parseFloat(formData.valuationFees) || 0,
        legalFees: parseFloat(formData.legalFees) || 0,
        loanType: formData.loanType || "fixed",
        paymentFrequency: formData.paymentFrequency || "monthly",
      monthlyPayment,
      totalInterest,
      totalCost,
        ltv
    };

      console.log("Submitting payload:", payload); // Debug log

      const response = await createFinance(payload);
      console.log("Submission response:", response); // Debug log

      if (response.success) {
        toast.success("Finance application submitted successfully!");
      setShowSuccessModal(true);
      } else {
        throw new Error(response.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message);
      toast.error(error.message || "There was an error submitting the form");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-800 flex items-center">
              <User className="mr-2 h-6 w-6 text-blue-600" />
              Personal Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  maxLength={30}
                  className={`w-full px-4 py-2 border ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Price (LKR)
                </label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <p className="text-gray-900 font-medium">
                    LKR {property?.price?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-800 flex items-center">
              <FileText className="mr-2 h-6 w-6 text-blue-600" />
              Loan Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Down Payment (% of property price)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    name="downPaymentPercent"
                    min="0"
                    max="50"
                    value={formData.downPaymentPercent}
                    onChange={handleNumberChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                        formData.downPaymentPercent * 2
                      }%, #e5e7eb ${
                        formData.downPaymentPercent * 2
                      }%, #e5e7eb 100%)`,
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700 min-w-[50px]">
                    {formData.downPaymentPercent}%
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Down Payment Amount: LKR{" "}
                  {(
                    formData.propertyPrice *
                    (formData.downPaymentPercent / 100)
                  ).toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Term (Years)
                </label>
                <select
                  name="loanTerm"
                  value={formData.loanTerm}
                  onChange={handleNumberChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {[5, 10, 15, 20, 25, 30].map((term) => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (%)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    name="interestRate"
                    min="8"
                    max="20"
                    value={formData.interestRate}
                    onChange={handleNumberChange}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                        (formData.interestRate - 8) * 8.33
                      }%, #e5e7eb ${
                        (formData.interestRate - 8) * 8.33
                      }%, #e5e7eb 100%)`,
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700 min-w-[50px]">
                    {formData.interestRate}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Type
                </label>
                <select
                  name="loanType"
                  value={formData.loanType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="fixed">Fixed</option>
                  <option value="floating">Floating</option>
                  
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Frequency
                </label>
                <select
                  name="paymentFrequency"
                  value={formData.paymentFrequency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-800 flex items-center">
              <Building className="mr-2 h-6 w-6 text-blue-600" />
              Bank Selection
            </h2>

            <div className="space-y-4">
              {banks.map((bank) => (
                <div
                  key={bank.id}
                  className={`flex items-start p-4 border ${
                    formData.bank === bank.name
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  } rounded-lg hover:bg-blue-50 transition-colors duration-200`}
                >
                  <input
                    type="radio"
                    id={bank.id}
                    name="bank"
                    value={bank.name}
                    checked={formData.bank === bank.name}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={bank.id}
                    className="ml-3 cursor-pointer block w-full"
                  >
                    <span className="block text-sm font-medium text-gray-900">
                      {bank.name}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {bank.info}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-800 flex items-center">
              <DollarSign className="mr-2 h-6 w-6 text-blue-600" />
              Additional Costs
            </h2>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-4">
                  Standard Processing Fees
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Property Taxes</span>
                    <span className="font-medium">
                      LKR {additionalCosts.propertyTaxes.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Home Insurance</span>
                    <span className="font-medium">
                      LKR {additionalCosts.homeInsurance.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Valuation Fees</span>
                    <span className="font-medium">
                      LKR {additionalCosts.valuationFees.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">Legal Fees</span>
                    <span className="font-medium">
                      LKR {additionalCosts.legalFees.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-800">
                  Total Additional Costs
                </span>
                <span className="font-bold text-blue-800">
                  LKR{" "}
                  {(
                    additionalCosts.propertyTaxes +
                    additionalCosts.homeInsurance +
                    additionalCosts.valuationFees +
                    additionalCosts.legalFees
                  ).toLocaleString()}
                </span>
              </div>


            </div>
          </div>
        );
      case 5: {
        const downPaymentAmount =
          formData.propertyPrice * (formData.downPaymentPercent / 100);
        const loanAmount = formData.propertyPrice - downPaymentAmount;
        const monthlyRate = formData.interestRate / 100 / 12;
        const payments = formData.loanTerm * 12;
        const monthlyPayment =
          (monthlyRate * loanAmount) /
          (1 - Math.pow(1 + monthlyRate, -payments));
        const totalInterest = monthlyPayment * payments - loanAmount;
        const totalAdditionalCosts =
          Number(formData.propertyTaxes) +
          Number(formData.homeInsurance) +
          Number(formData.valuationFees) +
          Number(formData.legalFees);
        const totalCost = loanAmount + totalInterest + totalAdditionalCosts;

        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-800 flex items-center">
              <Clipboard className="mr-2 h-6 w-6 text-blue-600" />
              Review and Submit
            </h2>

            <div className="bg-blue-100 rounded-lg border border-blue-500 overflow-hidden shadow">
              <div className="px-6 py-4 bg-blue-300 border-b border-blue-600">
                <h3 className="text-lg font-medium text-blue-800">
                  Loan Summary
                </h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 uppercase tracking-wider mb-3">
                        Personal Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Name:</span>
                          <span className="text-sm font-medium">
                            {formData.fullName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Email:</span>
                          <span className="text-sm font-medium">
                            {formData.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Phone:</span>
                          <span className="text-sm font-medium">
                            {formData.phone}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Selected Bank:
                          </span>
                          <span className="text-sm font-medium">
                            {formData.bank}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-blue-800 uppercase tracking-wider mb-3">
                        Property and Loan Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Property Price:
                          </span>
                          <span className="text-sm font-medium">
                            LKR {formData.propertyPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Down Payment:
                          </span>
                          <span className="text-sm font-medium">
                            LKR {downPaymentAmount.toLocaleString()} (
                            {formData.downPaymentPercent}%)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Loan Amount:
                          </span>
                          <span className="text-sm font-medium">
                            LKR {loanAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Loan Term:
                          </span>
                          <span className="text-sm font-medium">
                            {formData.loanTerm} years
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Interest Rate:
                          </span>
                          <span className="text-sm font-medium">
                            {formData.interestRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 uppercase tracking-wider mb-3">
                        Payment Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Loan Type:
                          </span>
                          <span className="text-sm font-medium capitalize">
                            {formData.loanType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Payment Frequency:
                          </span>
                          <span className="text-sm font-medium capitalize">
                            {formData.paymentFrequency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Monthly Payment:
                          </span>
                          <span className="text-sm font-medium">
                            LKR{" "}
                            {monthlyPayment.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Total Interest:
                          </span>
                          <span className="text-sm font-medium">
                            LKR{" "}
                            {totalInterest.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-blue-800 uppercase tracking-wider mb-3">
                        Additional Costs
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Property Taxes:
                          </span>
                          <span className="text-sm font-medium">
                            LKR {formData.propertyTaxes.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Home Insurance:
                          </span>
                          <span className="text-sm font-medium">
                            LKR {formData.homeInsurance.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Valuation & Legal:
                          </span>
                          <span className="text-sm font-medium">
                            LKR{" "}
                            {(
                              formData.valuationFees + formData.legalFees
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium text-blue-800">
                          <span>Total Additional Costs:</span>
                          <span>
                            LKR {totalAdditionalCosts.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-blue-800">
                      Total Cost of Financing:
                    </span>
                    <span className="text-lg font-bold text-blue-800">
                      LKR{" "}
                      {totalCost.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
                <p className="text-sm text-gray-700">
                  By submitting this application, you agree to our terms and
                  conditions. Your application will be reviewed by our finance
                  team and the selected bank.
                </p>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    // <div style={{ backgroundImage: `url(${backgroundImage})` }}>
    <div >
      <div className="max-w-4xl mx-auto p-6 bg-blue-100 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">
          Finance Application
        </h1>
        <div className="mb-8 w-full max-w-4xl mx-auto">
          <div className="relative flex items-center justify-between">
            {/* Connection Lines */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(100 * (step - 1)) / (steps.length - 1)}%` }}
            ></div>

            {/* Step Indicators */}
            {steps.map((stepItem, index) => (
              <div
                key={stepItem.id}
                className="relative flex flex-col items-center z-10"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-medium transition-all duration-300 ${
                    step > stepItem.id
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-600 text-white"
                      : step === stepItem.id
                      ? "bg-white border-blue-500 text-blue-600 ring-4 ring-blue-100"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  <span>{stepItem.icon}</span>
                </div>

                <div
                  className={`mt-2 text-sm font-medium whitespace-nowrap ${
                    step >= stepItem.id ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {stepItem.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg border border-blue-200 mb-6 shadow">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="ml-auto inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              Submit Application
              <Check className="ml-2 h-4 w-4" />
            </button>
          )}
        </div>
        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 fill-white bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-lg font-medium to-blue-800 ">
                  Application Submitted!
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Your finance application has been successfully submitted. An
                    email has been sent to your selected bank ({formData.bank}).
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuccessModal(false);
                      resetForm();
                    }}
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceAssistance;
