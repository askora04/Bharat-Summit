// Agenda & Schedule, from the agenda tab of the "Bharat Summit 2026" content document (Google Docs).
// Generated from the document; internal working notes in it are left out. Each session's kind sets its
// colours, the document's own (KINDS); "place" is the line under the agenda name, e.g. the panel's letter.

// The four kinds of session and their colours in the document: the agenda cell and the rest of the row
export const KINDS = {
  panel: { label: 'Panel discussions', agenda: '#d6e3f5', row: '#eef3fa' },
  plenary: { label: 'Plenary / Valedictory', agenda: '#e1daee', row: '#f1eef7' },
  expo: { label: 'Expo & field visit', agenda: '#f8d9c8', row: '#fcefe8' },
  telangana: { label: 'Telangana Rising (national panels)', agenda: '#f8c79a', row: '#fdf0e3' },
}
export const LEGEND = ["panel","plenary","expo","telangana"]

export const DAYS = [
  {
    id: "day-0",
    tab: "Day 0",
    short: "Thu 12 Nov",
    date: "Thursday, 12 November 2026",
    sessions: [
      {
        no: 1,
        kind: "expo",
        agenda: "Field visit",
        title: "Optional – Departure for Field Visits",
        parts: [
          {
            text: "Hosted by the Telangana government, this organised field visit takes guests to sites of historical and political importance (State Assembly, NREGA work-site etc.)."
          }
        ],
        time: "01:00 pm – 06:00 pm"
      }
    ]
  },
  {
    id: "day-1",
    tab: "Day 1",
    short: "Fri 13 Nov",
    date: "Friday, 13 November 2026",
    sessions: [
      {
        no: 2,
        kind: "plenary",
        agenda: "Discussion 1",
        title: "Plenary Session: Navigating the New World Order — View from India",
        parts: [
          {
            label: "Speakers",
            items: [
              "Salman Khurshid"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Pushparaj Deshpande"
            ]
          }
        ],
        time: "10:30 am – 11:30 am"
      },
      {
        no: 3,
        kind: "telangana",
        agenda: "Telangana Rising Panel",
        place: "Panel A",
        title: "Panel A: Future City & Urbanisation",
        parts: [
          {
            label: "Panelists",
            items: [
              "D. Sridhar Babu (Minister of IT, Govt of Telangana)",
              "Tikendar Singh Panwar (Former Mayor, Shimla & Urban Expert)",
              "Vijay Mahajan (CEO, Rajiv Gandhi Foundation)",
              "Shaikh Salauddin (Indian Federation of App-Based Transport Workers)",
              "Sajjad Shahid (Historian)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Divya Spandana (Former MP, Lok Sabha)"
            ]
          }
        ],
        time: "11:00 am – 12:30 pm"
      },
      {
        no: 4,
        kind: "telangana",
        agenda: "Telangana Rising Panel",
        place: "Panel B",
        title: "Panel B: Telangana Rising – Economic Justice",
        parts: [
          {
            label: "Panelists",
            items: [
              "B. Mahesh Kumar Goud (President, TPCC)",
              "Dr Venkat Balmoor (MLC, Telangana & Whip, Telangana Legislative Council)",
              "Dr Rathin Roy (Former Member, EAC to PM & Former Director, NIPFP)",
              "Prof. Himanshu (Professor, JNU)",
              "Prof. Santosh Mehrotra (Former Professor, JNU)",
              "Dr Kadiyam Kavya (MP, Lok Sabha)",
              "Prof. Amirullah Khan (Professor, MCRHRDI, Govt of Telangana)"
            ]
          }
        ],
        time: "11:00 am – 12:30 pm"
      },
      {
        no: 5,
        kind: "expo",
        agenda: "Opening of Expo",
        title: "India and the World",
        parts: [
          {
            items: [
              "Exhibition: 140 years of INC",
              "India and the world maps",
              "Interactive booths (screen-printing Constitution, caricature artists, bangle workshops etc.)",
              "Booths + explainers on Rights-Based Programmes (RTI, NREGA, RTE etc.)",
              "Booths + explainers on INC state governments' flagship programmes (3)"
            ]
          }
        ],
        time: "11:30 am – 12:30 pm"
      },
      {
        no: 6,
        kind: "panel",
        agenda: "Panel Discussion 1",
        place: "Plenary Hall",
        title: "Panel 1: AI, Cloud Capitalism & the New World Order",
        parts: [
          {
            label: "Speakers",
            items: [
              "Jeese Marks (Rihla Research & Advisory, Australia)",
              "Francesco Lapenta (Founding Director, Institute of Future and Innovation Studies)",
              "Sridhar Babu (Minister for IT, Telangana)",
              "Frédéric Zgainski (Former MP, Democratic Movement, France)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Supriya Shrinate (Chairperson, INC Social Media Department)"
            ]
          }
        ],
        time: "01:30 pm – 02:30 pm"
      },
      {
        no: 7,
        kind: "panel",
        agenda: "Panel Discussion 2",
        title: "Panel 2: A New Economic Deal for the World",
        parts: [
          {
            label: "Speakers",
            items: [
              "Ebrahim Patel (Former Minister, South Africa)",
              "Prof Jayati Ghosh (UN High-level Advisory Board on Economic and Social Affairs)",
              "Prof Thomas Piketty (online)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Deepender Hooda (MP)"
            ]
          }
        ],
        time: "01:30 pm – 02:30 pm"
      },
      {
        no: 8,
        kind: "panel",
        agenda: "Panel Discussion 3",
        title: "Panel 3: Youth & Politics of Tomorrow",
        parts: [
          {
            label: "Speakers",
            items: [
              "Jessali Zarazúa (Secretary General, IUSY, Mexico)",
              "Eduardo Zanatta (Councillor, PT, Brazil)",
              "Alice Bernard-Montini (EDP)",
              "Yves Bunkulu (Youth Minister, Democratic Republic of the Congo)",
              "Dariana Polo (Coordinator, International Secretariat, Cambiemos Movement, Venezuela)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Krishna Allavaru (AICC In-charge, Bihar)"
            ]
          }
        ],
        time: "01:30 pm – 02:30 pm"
      },
      {
        no: 9,
        kind: "telangana",
        agenda: "Telangana Rising Panel",
        place: "Panel C",
        title: "Panel C: Telangana Rising – Social Justice",
        parts: [
          {
            label: "Panelists",
            items: [
              "Ponnam Prabhakar Goud (Minister of Transport, Govt of Telangana)",
              "Danasari Seethakka (Minister of Women and Child Welfare, Govt of Telangana)",
              "Prof. Kancha Ilaiah Shepherd (Former Director, CSSEIP, MANUU, Hyderabad)",
              "Prof. Sujatha Surepally (Professor, Satavahana University)",
              "Alka Lamba (President, All India Mahila Congress)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Prof. Bhangya Bhukya (Professor, University of Hyderabad)"
            ]
          }
        ],
        time: "02:00 pm – 03:30 pm"
      },
      {
        no: 10,
        kind: "telangana",
        agenda: "Telangana Rising Panel",
        place: "Panel D",
        title: "Panel D: Telangana Rising – Welfare Policies",
        parts: [
          {
            label: "Panelists",
            items: [
              "Adluri Laxman Kumar (MLA, Telangana)",
              "Dr P. Vinay Kumar (Gastroenterological Surgeon & Social Activist)",
              "Prof. Shantha Sinha (Child Rights Activist)",
              "Ram Murthy Sunkari (Senior Journalist)",
              "K. Raju (AICC In-charge, Jharkhand & National Coordinator, SC, ST, OBC and Minorities Dept.)",
              "Dr Kota Neelima (Vice President, TPCC)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Dr Arathi Krishna (MLC, Karnataka)"
            ]
          }
        ],
        time: "02:00 pm – 03:30 pm"
      },
      {
        no: 11,
        kind: "panel",
        agenda: "Panel Discussion 4",
        title: "Panel 4: South–South Cooperation in a New World Order",
        parts: [
          {
            label: "Speakers",
            items: [
              "Anies Baswedan (Former Education Minister, Indonesia)",
              "Machris Cabreros (Global Coordinator, Progressive Alliance)",
              "Karol Cariola (Speaker of Assembly, Chile)",
              "Josh Osih (President, Social Democratic Front, Cameroon, and Member of Parliament)",
              "Maria Jose Pizarro (Former Senator, representing the Instituto de Pensamiento Progresista (IPP))",
              "Gurdeep Sappal (Admin In-charge, AICC)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Saptagiri Sankar Ulaka (MP; Chairperson, Parliamentary Standing Committee on Rural Development and Panchayati Raj)"
            ]
          }
        ],
        time: "03:00 pm – 04:00 pm"
      },
      {
        no: 12,
        kind: "panel",
        agenda: "Panel Discussion 5",
        title: "Panel 5: Climate Change",
        parts: [
          {
            label: "Speakers",
            items: [
              "Jo Leinen (Former Member of the European Parliament)",
              "Gautam Narasimhan (Global Lead for Climate, Energy and Environment, UNICEF)",
              "Javier Monge-Matamoros (Senior Analyst, Climate Lead Group, Costa Rica)",
              "Kasthuriraani Patto (Former Member of Parliament, Malaysia)",
              "Akiko Kamei (Former Member of the House of Representatives, Japan)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Prof Rajeev Gowda (Former MP)"
            ]
          }
        ],
        time: "03:00 pm – 04:00 pm"
      },
      {
        no: 13,
        kind: "panel",
        agenda: "Panel Discussion 6",
        title: "Panel 6: Reform of Multilateral Institutions",
        parts: [
          {
            label: "Speakers",
            items: [
              "Bert Koenders (Former Foreign Minister, Netherlands)",
              "Salil Shetty (Former Amnesty International Secretary-General)",
              "Amb. Oh Song (ICAPP)",
              "Paolo Guerrieri (Senator, Italy)",
              "Allison McManus (Managing Director for National Security, CAP)",
              "Dr Maria João Rodrigues (Former FEPS President & Former Portuguese Minister)",
              "Anand Sharma (MP, Rajya Sabha & Former Union Cabinet Minister, GoI)"
            ]
          },
          {
            label: "Moderator from INC",
            items: [
              "Gaurav Gogoi (Deputy Leader of the Opposition, Lok Sabha)"
            ]
          }
        ],
        time: "04:00 pm – 05:15 pm"
      },
      {
        no: 14,
        kind: "panel",
        agenda: "Panel Discussion 7",
        title: "Panel 7: Gender Justice & a Feminist Future",
        parts: [
          {
            label: "Speakers",
            items: [
              "Catherine Arnold (National Executive, Labour Party UK)",
              "Renuka Chaudhary (INC MP & Former Union Minister, India)",
              "Hella Ben Youssef (Former Minister, Tunisia)",
              "Nurima Alkatiri (Member of Parliament and Deputy Leader, Timor-Leste)",
              "Ntombikayise Sibhidla (NEC member, ANC Women's League)"
            ]
          },
          {
            label: "Moderator from INC",
            items: [
              "Jothimani Sennimalai (MP, INC)"
            ]
          }
        ],
        time: "04:00 pm – 05:15 pm"
      },
      {
        no: 16,
        kind: "telangana",
        agenda: "Telangana Rising Plenary",
        place: "Plenary 1",
        title: "Plenary 1: Interactive Session with Leaders",
        parts: [
          {
            label: "Speakers",
            items: [
              "Mallu Bhatti Vikramarka (Deputy Chief Minister, Govt of Telangana)",
              "D. Sridhar Babu (Minister of IT, Govt of Telangana)",
              "N. Uttam Kumar Reddy (Minister of Irrigation, Food & Civil Supplies, Govt of Telangana)"
            ]
          }
        ],
        time: "04:00 pm – 05:30 pm"
      }
    ]
  },
  {
    id: "day-2",
    tab: "Day 2",
    short: "Sat 14 Nov",
    date: "Saturday, 14 November 2026",
    sessions: [
      {
        no: 17,
        kind: "telangana",
        agenda: "Telangana Rising Panel",
        place: "Panel E",
        title: "Panel E: Telangana Rising – Cooperative Federalism",
        parts: [
          {
            label: "Panelists",
            items: [
              "N. Uttam Kumar Reddy (Minister of Irrigation, Food & Civil Supplies, Govt of Telangana)",
              "Chamala Kiran Kumar Reddy (MP, Lok Sabha)",
              "Prof. Ganesh Devy (Author & Linguist)",
              "Aditi Mehta (Former IAS)",
              "Shilpi Neha Tirkey (Minister of Agriculture, Animal Husbandry & Co-operative, Govt of Jharkhand)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Madhu Y. Goud (Chairperson, AIPC)"
            ]
          }
        ],
        time: "10:00 am – 11:30 am"
      },
      {
        no: 18,
        kind: "telangana",
        agenda: "Telangana Rising Panel",
        place: "Panel F",
        title: "Panel F: Telangana Rising – Culture & Society",
        parts: [
          {
            label: "Panelists",
            items: [
              "Prof. M. Kodandaram (Chairperson, Telangana Joint Action Committee)",
              "Dr Alekhya Punjala (Classical Dancer)",
              "Prof. Ajay Gudavarthy (Professor, JNU)",
              "Sandeep Dikshit (Chairperson, Rachnatmak Congress)",
              "Krishna Rao (Cultural Minister)",
              "Prof. Apoorvanand (Delhi University)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Seema Chishti (Chief Editor, The Wire)"
            ]
          }
        ],
        time: "10:00 am – 11:30 am"
      },
      {
        no: 19,
        kind: "panel",
        agenda: "Panel Discussion 8",
        title: "Panel 8: Progressivism & Accountability",
        parts: [
          {
            label: "Speakers",
            items: [
              "Antton Rönnholm (Former Vice President, Social Democratic Party, Finland)",
              "Prof Pablo Oribe (Secretary General, Socialist Party, Uruguay)",
              "Peangpanor Boonklum (Advisor to the Leader of the Opposition, People's Party)",
              "Dr Mario Aguja (Akbayan Executive Committee Member)"
            ]
          },
          {
            label: "Moderator from INC",
            items: [
              "Amitabh Dubey (Head, Communication Research, INC)"
            ]
          }
        ],
        time: "10:30 am – 11:30 am"
      },
      {
        no: 20,
        kind: "panel",
        agenda: "Panel Discussion 9",
        title: "Panel 9: Innovative Ideas for Progressives",
        parts: [
          {
            label: "Speakers",
            items: [
              "Nika Kovač (D-Hub, Slovenia)",
              "Johan Hassel (Center for American Progress, USA)",
              "Kunthida Rungruengkiat (Former MP, People's Party, Thailand)",
              "Øyvind Wenensland (Head of Strategy, Norwegian Labour Party)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Praveen Chakravarty (MP, INC)"
            ]
          }
        ],
        time: "10:30 am – 11:30 am"
      },
      {
        no: 21,
        kind: "telangana",
        agenda: "Telangana Rising Panel",
        place: "Panel G",
        title: "Panel G: Telangana Rising – Youth & Sports",
        parts: [
          {
            label: "Panelists",
            items: [
              "Vakiti Srihari (MLA, Telangana)",
              "Mohammad Azharuddin (Minister for Minority Welfare and Public Enterprises, Govt of Telangana)",
              "Vamsi Krishna Gaddam (MP, Lok Sabha)",
              "Vinesh Phogat (MLA, Haryana)",
              "Brijendra Singh (Vice Chairman, AICC Foreign Affairs)",
              "Anil Kumar Yadav (MP)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Manish Sharma (In-charge, IYC)"
            ]
          }
        ],
        time: "12:00 pm – 01:30 pm"
      },
      {
        no: 22,
        kind: "telangana",
        agenda: "Telangana Rising Panel",
        place: "Panel H",
        title: "Panel H: Electoral Integrity, Telangana & India",
        parts: [
          {
            label: "Panelists",
            items: [
              "Anjali Bhardwaj (Transparency Rights Activist)",
              "Tara Rao (Eddelu, Karnataka)",
              "Dr Sirivella Prasad (AICC In-charge, Maharashtra)",
              "Dr Parnika Reddy (MLA)",
              "Prof. Mukulika Banerjee (Professor, London School of Economics)",
              "Sashikant Senthil (MP, Lok Sabha)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Nikhil Dey (Founder Member, MKSS)"
            ]
          }
        ],
        time: "12:00 pm – 01:30 pm"
      },
      {
        no: 23,
        kind: "panel",
        agenda: "Panel Discussion 10",
        title: "Panel 10: The New World Order",
        parts: [
          {
            label: "Speakers",
            items: [
              "Nancy Okail (Centre for International Policy)",
              "Jonas Kalambayi (Senator, Democratic Republic of the Congo)",
              "Kent Härstedt (Vice President of the OSCE Parliamentary Assembly)",
              "Dan Herman (Senior Director for National Security, Accountability, and Reform)",
              "Giuseppe Provenzano (Former Minister for the South & Territorial Cohesion & MP, Italy)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Sachin Pilot (Former Deputy Chief Minister of Rajasthan & Former Union Minister)"
            ]
          }
        ],
        time: "01:00 pm – 02:00 pm"
      },
      {
        no: 24,
        kind: "panel",
        agenda: "Panel Discussion 11",
        title: "Panel 11: Peace in the New World Order",
        parts: [
          {
            label: "Speakers",
            items: [
              "Priyank Kharge (Home Minister, Karnataka)",
              "Basem Kamel (Senator, Egypt)",
              "Guillaume Long (Former Minister of Foreign Affairs and Human Mobility of Ecuador)",
              "Clara Lopez Obregon (Former Minister of Labour, Colombia)"
            ]
          },
          {
            label: "Moderator from INC",
            items: [
              "Manish Tewari (MP, INC)"
            ]
          }
        ],
        time: "01:00 pm – 02:00 pm"
      },
      {
        no: 25,
        kind: "panel",
        agenda: "Panel Discussion 12",
        title: "Panel 12: The Future of Media",
        parts: [
          {
            label: "Speakers",
            items: [
              "Helle Lyng (Journalist, Norway)",
              "Leonard Novy (Director, Institute for Media & Communications, Germany)",
              "Sangeeta Baruah Pisharoty (President, Press Club of India)",
              "Dr Mustafa Hamarneh (President, Jordanian Academy for Government Administration & Former Chairperson, Jordan Radio & TV)"
            ]
          },
          {
            label: "Moderator",
            items: [
              "Pawan Khera (MP, INC & Chairperson of INC Communications)"
            ]
          }
        ],
        time: "01:00 pm – 02:00 pm"
      },
      {
        no: 26,
        kind: "plenary",
        agenda: "Valedictory session",
        title: "Valedictory Session: Delivering Global Justice",
        parts: [
          {
            label: "Welcome remarks",
            items: [
              "A. Revanth Reddy (Chief Minister of Telangana)",
              "Mallu Bhatti Vikramarka (Deputy Chief Minister of Telangana)"
            ]
          },
          {
            label: "Keynote Addresses",
            items: [
              "Mallikarjun Kharge (President, Indian National Congress)",
              "Rahul Gandhi (Leader of the Opposition, Lok Sabha)"
            ]
          },
          {
            label: "Speeches",
            items: [
              "Patrick Gaspard (USA)",
              "Thanathorn Juangroongruangkit (Chairperson, Progressive Movement Foundation & Former Leader, Future Forward Party, Thailand)",
              "Junya Ogawa (President, Democratic Reform Party, Japan)",
              "Elly Schlein (Member of the Chamber of Deputies of Italy)",
              "Giacomo Filibeck (Secretary General, PES)"
            ]
          },
          {
            label: "Launch of Our World Institute & Resolution",
            items: [
              "Dr Maria João Rodrigues (Former FEPS President & Former Portuguese Minister)",
              "Salman Khurshid (INC)"
            ]
          },
          {
            text: "Photo Op for the Press and Family Photo"
          }
        ],
        time: "03:00 pm – 05:00 pm"
      }
    ]
  }
]
