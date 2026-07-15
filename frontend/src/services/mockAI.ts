export const mockAIResponses = {
  defaultResponses: [
    "I understand you're asking about highway engineering. Let me help you with that.",
    "This is a great question about civil engineering. Based on Indian standards and MORTH specifications, I can provide guidance.",
    "For contract analysis, I specialize in FIDIC conditions and Indian tender documents.",
    "Regarding project management, I can help with PMIS planning and execution strategies.",
  ],

  engineeringTopics: {
    "highway": "Highway engineering involves road design, traffic analysis, and MORTH specifications compliance. I can help with geometric design, pavement design, and IRC code compliance.",
    "bridge": "Bridge engineering requires understanding structural loads, materials, and safety standards. IRC and IS codes provide the framework for Indian bridge design.",
    "geotechnical": "Geotechnical engineering deals with soil mechanics, foundation design, and ground analysis. I can assist with bore hole analysis and soil classification.",
    "traffic": "Traffic engineering involves traffic surveys, capacity analysis, and safety design. IRC codes specify standards for Indian roads.",
    "contract": "Contract management in engineering requires understanding FIDIC clauses, claims management, and risk allocation. I can review tender documents and draft clauses.",
    "estimation": "Quantity estimation (BOQ) requires detailed project understanding and rate analysis. I can help prepare detailed estimates based on specifications.",
    "dpr": "Detailed Project Reports require comprehensive feasibility analysis, cost estimation, and technical specifications. I can guide through DPR preparation.",
    "tender": "Tender document preparation requires compliance with MORTH, IRC, and IS standards. I can help draft technical specifications and bidding requirements.",
    "irc": "IRC (Indian Roads Congress) codes are fundamental for highway design in India. They cover geometric design, pavement design, and safety standards.",
    "is": "IS (Indian Standards) codes apply to civil engineering works. Common ones include IS 1893 (seismic), IS 456 (concrete), and IS 800 (steel).",
    "morth": "MoRTH (Ministry of Road Transport and Highways) specifications govern all highway works in India. They include technical specifications and standard designs.",
    "mix": "Concrete mix design requires calculations based on strength requirements, workability, and durability. I can help with mix design proportioning.",
    "pavement": "Pavement design includes rigid and flexible pavements. IRC code specifies design procedures based on traffic and soil conditions.",
  },

  quickPromptResponses: {
    "Design Flexible Pavement": "To design a flexible pavement, I'll help you with:\n\n1. **Traffic Analysis**: Determine ESAL (Equivalent Standard Axle Load) from traffic surveys\n2. **Soil Characterization**: CBR value of subgrade\n3. **Layer Design**: Using IRC:37-2018 method\n4. **Material Selection**: Base, sub-base, and wearing course\n5. **Thickness Calculation**: Based on traffic and CBR values\n\nWhat's your expected traffic volume and subgrade CBR value?",

    "Estimate Road Project": "For road project estimation, I need:\n\n1. **Project Scope**: Length, width, and work items\n2. **Specifications**: Material types and quality requirements\n3. **Rate Analysis**: Current market rates (varies by location)\n4. **Contingency**: Typically 5-10% of base cost\n5. **Taxes & Levies**: GST and local taxes\n\nPlease provide project details for accurate BOQ preparation.",

    "Explain IRC Code": "IRC (Indian Roads Congress) codes are essential standards:\n\n• **IRC:1**: Classification of roads\n• **IRC:5**: Standards for road marking\n• **IRC:6**: Standards for widths of formation\n• **IRC:37**: Design of flexible pavements\n• **IRC:58**: Guidelines for safety at work zones\n\nWhich IRC code would you like me to explain in detail?",

    "Draft Tender Clause": "I can help draft tender clauses for:\n\n1. **Scope Definition**: Clear project boundaries\n2. **Specifications**: Material and workmanship standards\n3. **Performance Criteria**: Quality and testing requirements\n4. **Timeline**: Project schedule and milestones\n5. **Payment Terms**: MORTH standard conditions\n6. **Penalty Clauses**: For non-compliance\n\nWhat type of clause would you like drafted?",

    "Review BOQ": "For BOQ (Bill of Quantities) review, I check:\n\n1. **Completeness**: All work items included\n2. **Specifications**: Alignment with standards\n3. **Unit Rates**: Competitiveness and market rates\n4. **Quantities**: Accurate measurements\n5. **Lead Distance**: Transportation costs included\n6. **Taxes**: GST and other levies\n\nPlease share your BOQ for detailed review.",

    "Highway Geometric Design": "Highway geometric design covers:\n\n1. **Alignment**: Horizontal and vertical curves\n2. **Cross-section**: Width, shoulders, and drainage\n3. **Sight Distance**: Safety considerations\n4. **Grade Standards**: Maximum gradients by terrain\n5. **Superelevation**: Banking on curves\n6. **Transition Curves**: Safe speed transitions\n\nWhat specific geometric element do you need help with?",

    "Concrete Mix Design": "Concrete mix design procedure:\n\n1. **Target Strength**: M20, M25, M30, etc.\n2. **Slump**: Workability requirement\n3. **Cement Content**: Durability and strength\n4. **W/C Ratio**: Water-cement ratio\n5. **Aggregate Grading**: Fine and coarse proportions\n6. **Testing**: Cube strength verification\n\nProvide your strength requirement for detailed calculations.",

    "Contract Claim Analysis": "For contract claim analysis:\n\n1. **Claim Categories**: Time, cost, or both\n2. **FIDIC Reference**: Applicable clauses\n3. **Documentation**: Supporting evidence\n4. **Causation**: Direct link to delay/loss\n5. **Mitigation**: Steps taken to minimize impact\n6. **Quantum**: Calculation of financial impact\n\nShare claim details for analysis.",
  },
};

export const mockAIResponse = (userMessage: string): string => {
  const messageLower = userMessage.toLowerCase();

  // Check for specific quick prompts
  for (const [key, value] of Object.entries(mockAIResponses.quickPromptResponses)) {
    if (messageLower.includes(key.toLowerCase())) {
      return value;
    }
  }

  // Check for engineering topics
  for (const [topic, response] of Object.entries(mockAIResponses.engineeringTopics)) {
    if (messageLower.includes(topic)) {
      return response;
    }
  }

  // Return generic response
  const randomResponse = mockAIResponses.defaultResponses[
    Math.floor(Math.random() * mockAIResponses.defaultResponses.length)
  ];

  return `${randomResponse}\n\nYour query: "${userMessage}"\n\nThis is a mock response. In production, this would connect to the CEIS AI backend API.`;
};
