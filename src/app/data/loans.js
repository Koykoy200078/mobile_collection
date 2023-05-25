export const loanData = [
  {
    id: 1,
    name: 'Serafeim Oliver',
    data: [
      {
        regular: [
          {
            description: 'Regular Loan', // (Math.random() * 250 + 250).toFixed(2)
            principal: 500.0,
            interest: 500.0,
            penalty: 500.0,
          },
        ],
        emergency: [
          {
            description: 'Emergency Loan',
            principal: 200.0,
            interest: 200.0,
            penalty: 200.0,
          },
        ],
        saving: [
          {
            totalAmount: 100.0,
          },
        ],
        share: [
          {
            totalAmount: 150.0,
          },
        ],
      },
    ],
  },

  {
    id: 2,
    name: 'Christ',
    data: [
      {
        regular: [
          {
            description: 'Regular Loan',
            principal: (Math.random() * 250 + 250).toFixed(2),
            interest: (Math.random() * 250 + 250).toFixed(2),
            penalty: (Math.random() * 250 + 250).toFixed(2),
          },
        ],
        emergency: [
          {
            description: 'Emergency Loan',
            principal: (Math.random() * 250 + 250).toFixed(2),
            interest: (Math.random() * 250 + 250).toFixed(2),
            penalty: (Math.random() * 250 + 250).toFixed(2),
          },
        ],
        saving: [
          {
            totalAmount: 100.0,
          },
        ],
        share: [
          {
            totalAmount: 150.0,
          },
        ],
      },
    ],
  },
];
