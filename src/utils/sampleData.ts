// Sample data generator for players and finance transactions
export const generateSampleData = () => {
  // Sample players data
  const samplePlayers = [
    {
      id: 'player-001',
      kiliId: 'KILI-001',
      firstName: 'John',
      lastName: 'Anderson',
      email: 'john.anderson@email.com',
      birthDate: new Date('1985-03-15'),
      contactNumber: '744123456',
      countryCode: '+255',
      duprId: 'DUPR-001',
      role: 'Player',
      notes: 'Regular player, prefers morning sessions',
      balance: 0,
      isActive: true
    },
    {
      id: 'player-002',
      kiliId: 'KILI-002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      birthDate: new Date('1990-07-22'),
      contactNumber: '744987654',
      countryCode: '+255',
      duprId: 'DUPR-002',
      role: 'Administrator',
      notes: 'Club administrator and coach',
      balance: 0,
      isActive: true
    },
    {
      id: 'player-003',
      kiliId: 'KILI-003',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@email.com',
      birthDate: new Date('1988-11-08'),
      contactNumber: '744555777',
      countryCode: '+255',
      duprId: 'DUPR-003',
      role: 'Player',
      notes: 'Competitive player, participates in tournaments',
      balance: 0,
      isActive: true
    },
    {
      id: 'player-004',
      kiliId: 'KILI-004',
      firstName: 'Emma',
      lastName: 'Davis',
      email: 'emma.davis@email.com',
      birthDate: new Date('1992-05-30'),
      contactNumber: '744333999',
      countryCode: '+255',
      duprId: 'DUPR-004',
      role: 'Player',
      notes: 'Beginner player, taking lessons',
      balance: 0,
      isActive: false
    },
    {
      id: 'player-005',
      kiliId: 'KILI-005',
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@email.com',
      birthDate: new Date('1983-12-12'),
      contactNumber: '744888444',
      countryCode: '+255',
      duprId: 'DUPR-005',
      role: 'Player',
      notes: 'Experienced player, helps with training',
      balance: 0,
      isActive: true
    }
  ];

  // Sample finance transactions
  const sampleTransactions = [
    // Player payments (positive amounts)
    {
      id: 'txn-001',
      type: 'player' as const,
      playerId: 'player-001',
      playerName: 'John Anderson',
      playerKiliId: 'KILI-001',
      amount: 50000,
      currency: 'TZS',
      notes: 'Monthly membership fee',
      timestamp: new Date('2024-01-15T10:30:00'),
      archived: false
    },
    {
      id: 'txn-002',
      type: 'player' as const,
      playerId: 'player-002',
      playerName: 'Sarah Johnson',
      playerKiliId: 'KILI-002',
      amount: 75000,
      currency: 'TZS',
      notes: 'Premium membership payment',
      timestamp: new Date('2024-01-18T14:20:00'),
      archived: false
    },
    {
      id: 'txn-003',
      type: 'player' as const,
      playerId: 'player-003',
      playerName: 'Michael Brown',
      playerKiliId: 'KILI-003',
      amount: 30000,
      currency: 'TZS',
      notes: 'Session fees',
      timestamp: new Date('2024-01-20T09:15:00'),
      archived: false
    },
    {
      id: 'txn-004',
      type: 'player' as const,
      playerId: 'player-004',
      playerName: 'Emma Davis',
      playerKiliId: 'KILI-004',
      amount: 25000,
      currency: 'TZS',
      notes: 'Beginner course payment',
      timestamp: new Date('2024-01-22T16:45:00'),
      archived: false
    },
    {
      id: 'txn-005',
      type: 'player' as const,
      playerId: 'player-005',
      playerName: 'David Wilson',
      playerKiliId: 'KILI-005',
      amount: 40000,
      currency: 'TZS',
      notes: 'Private coaching fees',
      timestamp: new Date('2024-01-25T11:30:00'),
      archived: false
    },

    // Court charges (negative amounts)
    {
      id: 'txn-006',
      type: 'court' as const,
      amount: -15000,
      currency: 'TZS',
      notes: 'Court lighting maintenance',
      timestamp: new Date('2024-01-16T08:00:00'),
      archived: false
    },
    {
      id: 'txn-007',
      type: 'court' as const,
      amount: -25000,
      currency: 'TZS',
      notes: 'Court surface repair',
      timestamp: new Date('2024-01-19T13:30:00'),
      archived: false
    },
    {
      id: 'txn-008',
      type: 'court' as const,
      amount: -8000,
      currency: 'TZS',
      notes: 'Net replacement',
      timestamp: new Date('2024-01-23T15:20:00'),
      archived: false
    },
    {
      id: 'txn-009',
      type: 'court' as const,
      amount: -20000,
      currency: 'TZS',
      notes: 'Court cleaning service',
      timestamp: new Date('2024-01-26T07:45:00'),
      archived: false
    },
    {
      id: 'txn-010',
      type: 'court' as const,
      amount: -12000,
      currency: 'TZS',
      notes: 'Court marking paint',
      timestamp: new Date('2024-01-28T10:10:00'),
      archived: false
    },

    // Other charges (mixed amounts)
    {
      id: 'txn-011',
      type: 'others' as const,
      amount: -18000,
      currency: 'TZS',
      notes: 'Equipment purchase - rackets',
      timestamp: new Date('2024-01-17T12:00:00'),
      archived: false
    },
    {
      id: 'txn-012',
      type: 'others' as const,
      amount: -5000,
      currency: 'TZS',
      notes: 'Office supplies',
      timestamp: new Date('2024-01-21T14:30:00'),
      archived: false
    },
    {
      id: 'txn-013',
      type: 'others' as const,
      amount: 35000,
      currency: 'TZS',
      notes: 'Equipment rental income',
      timestamp: new Date('2024-01-24T09:45:00'),
      archived: false
    },
    {
      id: 'txn-014',
      type: 'others' as const,
      amount: -22000,
      currency: 'TZS',
      notes: 'Utility bills payment',
      timestamp: new Date('2024-01-27T16:15:00'),
      archived: false
    },
    {
      id: 'txn-015',
      type: 'others' as const,
      amount: 15000,
      currency: 'TZS',
      notes: 'Tournament entry fees',
      timestamp: new Date('2024-01-29T11:20:00'),
      archived: false
    },

    // More player payments
    {
      id: 'txn-016',
      type: 'player' as const,
      playerId: 'player-001',
      playerName: 'John Anderson',
      playerKiliId: 'KILI-001',
      amount: 20000,
      currency: 'TZS',
      notes: 'Additional session fees',
      timestamp: new Date('2024-02-01T10:00:00'),
      archived: false
    },
    {
      id: 'txn-017',
      type: 'player' as const,
      playerId: 'player-002',
      playerName: 'Sarah Johnson',
      playerKiliId: 'KILI-002',
      amount: -10000,
      currency: 'TZS',
      notes: 'Refund for cancelled session',
      timestamp: new Date('2024-02-02T14:25:00'),
      archived: false
    },
    {
      id: 'txn-018',
      type: 'player' as const,
      playerId: 'player-003',
      playerName: 'Michael Brown',
      playerKiliId: 'KILI-003',
      amount: 45000,
      currency: 'TZS',
      notes: 'Tournament registration',
      timestamp: new Date('2024-02-03T09:30:00'),
      archived: false
    },
    {
      id: 'txn-019',
      type: 'player' as const,
      playerId: 'player-004',
      playerName: 'Emma Davis',
      playerKiliId: 'KILI-004',
      amount: 18000,
      currency: 'TZS',
      notes: 'Lesson package payment',
      timestamp: new Date('2024-02-04T15:10:00'),
      archived: false
    },
    {
      id: 'txn-020',
      type: 'player' as const,
      playerId: 'player-005',
      playerName: 'David Wilson',
      playerKiliId: 'KILI-005',
      amount: 60000,
      currency: 'TZS',
      notes: 'Annual membership renewal',
      timestamp: new Date('2024-02-05T12:40:00'),
      archived: false
    },

    // More court charges
    {
      id: 'txn-021',
      type: 'court' as const,
      amount: -30000,
      currency: 'TZS',
      notes: 'Court resurfacing project',
      timestamp: new Date('2024-02-06T08:15:00'),
      archived: false
    },
    {
      id: 'txn-022',
      type: 'court' as const,
      amount: -7500,
      currency: 'TZS',
      notes: 'Court fence repair',
      timestamp: new Date('2024-02-07T13:50:00'),
      archived: false
    },
    {
      id: 'txn-023',
      type: 'court' as const,
      amount: -14000,
      currency: 'TZS',
      notes: 'Drainage system maintenance',
      timestamp: new Date('2024-02-08T10:25:00'),
      archived: false
    },
    {
      id: 'txn-024',
      type: 'court' as const,
      amount: -9000,
      currency: 'TZS',
      notes: 'Court equipment storage',
      timestamp: new Date('2024-02-09T16:30:00'),
      archived: false
    },
    {
      id: 'txn-025',
      type: 'court' as const,
      amount: -11000,
      currency: 'TZS',
      notes: 'Court shade installation',
      timestamp: new Date('2024-02-10T11:45:00'),
      archived: false
    },

    // More other charges
    {
      id: 'txn-026',
      type: 'others' as const,
      amount: -16000,
      currency: 'TZS',
      notes: 'Staff training costs',
      timestamp: new Date('2024-02-11T09:20:00'),
      archived: false
    },
    {
      id: 'txn-027',
      type: 'others' as const,
      amount: 28000,
      currency: 'TZS',
      notes: 'Coaching service income',
      timestamp: new Date('2024-02-12T14:15:00'),
      archived: false
    },
    {
      id: 'txn-028',
      type: 'others' as const,
      amount: -19000,
      currency: 'TZS',
      notes: 'Insurance premium payment',
      timestamp: new Date('2024-02-13T12:30:00'),
      archived: false
    },
    {
      id: 'txn-029',
      type: 'others' as const,
      amount: 12000,
      currency: 'TZS',
      notes: 'Facility rental income',
      timestamp: new Date('2024-02-14T15:40:00'),
      archived: false
    },
    {
      id: 'txn-030',
      type: 'others' as const,
      amount: -8500,
      currency: 'TZS',
      notes: 'Marketing and advertising',
      timestamp: new Date('2024-02-15T10:55:00'),
      archived: false
    },

    // Additional mixed transactions
    {
      id: 'txn-031',
      type: 'player' as const,
      playerId: 'player-001',
      playerName: 'John Anderson',
      playerKiliId: 'KILI-001',
      amount: -5000,
      currency: 'TZS',
      notes: 'Late payment penalty refund',
      timestamp: new Date('2024-02-16T13:25:00'),
      archived: false
    },
    {
      id: 'txn-032',
      type: 'court' as const,
      amount: -23000,
      currency: 'TZS',
      notes: 'LED lighting upgrade',
      timestamp: new Date('2024-02-17T08:40:00'),
      archived: false
    },
    {
      id: 'txn-033',
      type: 'others' as const,
      amount: 45000,
      currency: 'TZS',
      notes: 'Event hosting income',
      timestamp: new Date('2024-02-18T16:20:00'),
      archived: false
    },
    {
      id: 'txn-034',
      type: 'player' as const,
      playerId: 'player-003',
      playerName: 'Michael Brown',
      playerKiliId: 'KILI-003',
      amount: 32000,
      currency: 'TZS',
      notes: 'Guest player fees',
      timestamp: new Date('2024-02-19T11:10:00'),
      archived: false
    },
    {
      id: 'txn-035',
      type: 'court' as const,
      amount: -17000,
      currency: 'TZS',
      notes: 'Court security system',
      timestamp: new Date('2024-02-20T14:50:00'),
      archived: false
    },
    {
      id: 'txn-036',
      type: 'others' as const,
      amount: -13000,
      currency: 'TZS',
      notes: 'Professional services fee',
      timestamp: new Date('2024-02-21T09:35:00'),
      archived: false
    },
    {
      id: 'txn-037',
      type: 'player' as const,
      playerId: 'player-005',
      playerName: 'David Wilson',
      playerKiliId: 'KILI-005',
      amount: 28000,
      currency: 'TZS',
      notes: 'Equipment purchase reimbursement',
      timestamp: new Date('2024-02-22T15:05:00'),
      archived: false
    },
    {
      id: 'txn-038',
      type: 'others' as const,
      amount: 22000,
      currency: 'TZS',
      notes: 'Sponsorship income',
      timestamp: new Date('2024-02-23T12:15:00'),
      archived: false
    },
    {
      id: 'txn-039',
      type: 'court' as const,
      amount: -21000,
      currency: 'TZS',
      notes: 'Water system maintenance',
      timestamp: new Date('2024-02-24T10:30:00'),
      archived: false
    },
    {
      id: 'txn-040',
      type: 'player' as const,
      playerId: 'player-002',
      playerName: 'Sarah Johnson',
      playerKiliId: 'KILI-002',
      amount: 55000,
      currency: 'TZS',
      notes: 'Corporate membership fee',
      timestamp: new Date('2024-02-25T13:45:00'),
      archived: false
    }
  ];

  return { samplePlayers, sampleTransactions };
};

// Function to load sample data into localStorage
export const loadSampleData = () => {
  const { samplePlayers, sampleTransactions } = generateSampleData();
  
  // Calculate player balances based on transactions
  const playersWithBalances = samplePlayers.map(player => {
    const playerTransactions = sampleTransactions.filter(txn => 
      txn.playerId === player.id && !txn.archived
    );
    const balance = playerTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    return { ...player, balance };
  });

  // Save to localStorage
  localStorage.setItem('playersData', JSON.stringify(playersWithBalances));
  localStorage.setItem('financePayments', JSON.stringify(sampleTransactions));
  
  // Dispatch events to notify components of the change
  window.dispatchEvent(new CustomEvent('playersDataChanged'));
  window.dispatchEvent(new CustomEvent('financeDataChanged'));

  return { players: playersWithBalances, transactions: sampleTransactions };
};
