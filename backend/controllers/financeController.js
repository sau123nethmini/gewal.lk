import Finance from "../models/financeModel.js";

// @desc    Create a new finance application
// @route   POST /api/finance
// @access  Public
export const createFinance = async (req, res) => {
  try {
    const {
      property,
      userName,
      userEmail,
      userPhone,
      selectedBank,
      loanAmount,
      downPayment,
      interestRate,
      loanTerm,
      propertyTaxes,
      homeInsurance,
      valuationFees,
      legalFees,
      loanType,
      paymentFrequency,
      monthlyPayment,
      totalInterest,
      totalCost,
      ltv
    } = req.body;

    // Basic validation
    if (!property || !userName || !userEmail || !userPhone) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required personal information" 
      });
    }

    // Create finance object with default values
    const finance = new Finance({
      property: property,
      userName: userName,
      userEmail: userEmail,
      userPhone: userPhone,
      selectedBank: selectedBank || "Not specified",
      loanAmount: loanAmount || 0,
      downPayment: downPayment || 0,
      interestRate: interestRate || 8,
      loanTerm: loanTerm || 5,
      propertyTaxes: propertyTaxes || 0,
      homeInsurance: homeInsurance || 0,
      valuationFees: valuationFees || 0,
      legalFees: legalFees || 0,
      loanType: loanType || "fixed",
      paymentFrequency: paymentFrequency || "monthly",
      monthlyPayment: monthlyPayment || 0,
      totalInterest: totalInterest || 0,
      totalCost: totalCost || 0,
      ltv: ltv || "0",
      status: "pending"
    });

    const createdFinance = await finance.save();
    res.status(201).json({
      success: true,
      message: "Finance application submitted successfully",
      finance: createdFinance
    });
  } catch (error) {
    console.error("Error creating finance:", error);
    res.status(400).json({ 
      success: false,
      message: error.message || "Failed to create finance application"
    });
  }
};

// @desc    Get all finance applications
// @route   GET /api/finance
// @access  Public
export const getAllFinance = async (req, res) => {
  try {
    const finances = await Finance.find({});
    res.status(200).json(finances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single finance application by ID
// @route   GET /api/finance/:id
// @access  Public
export const getFinanceById = async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);

    if (!finance) {
      return res.status(404).json({ message: "Finance application not found" });
    }

    res.status(200).json(finance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a finance application
// @route   PUT /api/finance/:id
// @access  Public
export const updateFinance = async (req, res) => {
  try {
    const {
      property,
      user,
      loanAmount,
      downPayment,
      interestRate,
      loanTerm,
      propertyTaxes,
      homeInsurance,
      valuationFees,
      legalFees,
      loanType,
      paymentFrequency,
    } = req.body;

    const finance = await Finance.findById(req.params.id);

    if (!finance) {
      return res.status(404).json({ message: "Finance application not found" });
    }

    // Update fields
    finance.property = property || finance.property;
    finance.user = user || finance.user;
    finance.loanAmount = loanAmount || finance.loanAmount;
    finance.downPayment = downPayment || finance.downPayment;
    finance.interestRate = interestRate || finance.interestRate;
    finance.loanTerm = loanTerm || finance.loanTerm;
    finance.propertyTaxes = propertyTaxes || finance.propertyTaxes;
    finance.homeInsurance = homeInsurance || finance.homeInsurance;
    finance.valuationFees = valuationFees || finance.valuationFees;
    finance.legalFees = legalFees || finance.legalFees;
    finance.loanType = loanType || finance.loanType;
    finance.paymentFrequency = paymentFrequency || finance.paymentFrequency;

    const updatedFinance = await finance.save();
    res.status(200).json(updatedFinance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a finance application
// @route   DELETE /api/finance/:id
// @access  Public
export const deleteFinance = async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);

    if (!finance) {
      return res.status(404).json({ message: "Finance application not found" });
    }

    await Finance.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Finance application removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a finance application
// @route   PUT /api/finance/:id/approve
// @access  Public (you may want to make this Admin only in your authorization middleware)
export const approveFinance = async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);

    if (!finance) {
      return res.status(404).json({ message: "Finance application not found" });
    }

    // Update status to approved
    finance.status = "approved";

    const approvedFinance = await finance.save();
    res.status(200).json({
      message: "Finance application approved successfully",
      finance: approvedFinance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
