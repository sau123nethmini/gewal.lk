import mongoose from "mongoose";
const { Schema } = mongoose;

const financeSchema = new Schema(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
      required: true,
    },
    selectedBank: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    loanAmount: {
      type: Number,
      required: true,
      min: 100000,
    },
    downPayment: {
      type: Number,
      required: true,
      min: 0,
    },
    interestRate: {
      type: Number,
      required: true,
      min: 8,
      max: 20,
    },
    loanTerm: {
      type: Number,
      required: true,
      enum: [5, 10, 15, 20, 25, 30],
    },
    propertyTaxes: {
      type: Number,
      default: 0,
    },
    homeInsurance: {
      type: Number,
      default: 0,
    },
    valuationFees: {
      type: Number,
      default: 0,
    },
    legalFees: {
      type: Number,
      default: 0,
    },
    loanType: {
      type: String,
      enum: ["fixed", "floating"],
      default: "fixed",
    },
    paymentFrequency: {
      type: String,
      enum: ["monthly", "quarterly"],
      default: "monthly",
    },
    monthlyPayment: {
      type: Number,
      required: true,
    },
    totalInterest: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    ltv: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

financeSchema.virtual("downPaymentPercentage").get(function () {
  return (
    (this.downPayment / (this.loanAmount + this.downPayment)) *
    100
  ).toFixed(2);
});

financeSchema.pre("save", function (next) {
  const monthlyRate = this.interestRate / 100 / 12;
  const payments = this.loanTerm * 12;

  this.monthlyPayment =
    (monthlyRate * this.loanAmount) /
    (1 - Math.pow(1 + monthlyRate, -payments));

  const totalInterest = this.monthlyPayment * payments - this.loanAmount;
  const totalAdditionalCosts =
    this.propertyTaxes +
    this.homeInsurance +
    this.valuationFees +
    this.legalFees;

  this.totalInterest = totalInterest;
  this.totalCost = this.loanAmount + totalInterest + totalAdditionalCosts;
  this.amortizationSchedule = this.generateAmortizationSchedule();

  next();
});

financeSchema.methods.generateAmortizationSchedule = function () {
  const schedule = [];
  let balance = this.loanAmount;
  const monthlyPayment = this.monthlyPayment;
  const monthlyRate = this.interestRate / 100 / 12;

  for (let month = 1; month <= this.loanTerm * 12; month++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;

    schedule.push({
      date: new Date(new Date().setMonth(new Date().getMonth() + month)),
      principal: Number(principal.toFixed(2)),
      interest: Number(interest.toFixed(2)),
      remainingBalance: Number((balance - principal).toFixed(2)),
    });

    balance -= principal;
  }

  return schedule;
};

// Default export
const Finance = mongoose.model("Finance", financeSchema);
export default Finance;
