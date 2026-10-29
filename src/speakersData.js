import { a } from './shared.jsx'

// Bharat Summit 2026: sessions and confirmed speakers, from "Website Content" (speaker list as of
// 26 October 2026). Photos are the document's, background removed (assets-original/speakers/);
// speakers it marks "[photo needed]" show their initials instead.

// Brand colours (from the colour sheet). Each card's background is one of these, in turn.
export const SPEAKER_COLOURS = [
  'linear-gradient(180deg, #fbaa12, #ee870b)', // saffron
  '#13345f', // navy
]

const FRI = 'Friday, 13 November 2026'
const SAT = 'Saturday, 14 November 2026'
const MOD = true // marks a session's moderator

// [name, title, bio, moderator?]
const RAW = [
  {
    part: 'Part I: International Sessions',
    sessions: [
      {
        title: 'Plenary Session: Navigating the New World Order, A View from India', when: `${FRI} | 10:30 am - 11:30 am`,
        about: 'India’s growing economic, political and diplomatic weight gives it an increasingly important role in debates about the future of the international order. This plenary will bring together perspectives on India’s place in a changing world and examine how India can engage with the Global South, major powers and emerging international institutions while pursuing its own interests. This is the India-focused bridge between domestic priorities and the international system. While other panels examine global politics, economics or geopolitics generally, this one asks specifically: where does India fit into all of this, and what role can it play?',
        speakers: [
          ['Salman Khurshid', 'Senior Advocate; Indian National Congress; former Minister of External Affairs of India (2012-2014)', 'Salman Khurshid is a designated senior advocate and a leading member of the Indian National Congress. He served as Minister of External Affairs of India from 28 October 2012 to 25 May 2014 in the government of Prime Minister Manmohan Singh, and was elected to the Lok Sabha from Farrukhabad in 2009. He is also an author and law teacher, and was later appointed to chair the party\'s foreign affairs department.'],
        ],
      },
      {
        title: 'Panel 1: AI, Cloud Capitalism & the New World Order', when: `${FRI} | 1:30 pm - 2:30 pm`,
        about: 'Controlling cloud capitalism, a small number of powerful conglomerates (Big Tech) now shape economies, political power, and even mass consciousness. Along with this, artificial intelligence is beginning to reshape work, markets and state power. This panel will examine who controls the technologies that are becoming essential to modern economies, who benefits from them and what this means for global economic and political power. This is about technology as a source of economic and geopolitical power, and what progressive parties should do about the concentration of digital capital.',
        speakers: [
          ['Christina Wiremu-Brook', 'iTech Policy, Australia', 'Christina Wiremu-Brook works with iTech Policy.'],
          ['Francesco Lapenta', 'Founding Director, Institute of Future and Innovation Studies, John Cabot University, Rome', 'Francesco Lapenta is Founding Director of the Institute of Future and Innovation Studies at John Cabot University in Rome. His work covers emerging technologies, technology governance and future scenario analysis. He has spoken at the ImPACT Coalition session of the UN Summit of the Future in New York and gave a keynote at the Next Generation AI Summit 2025 in Milan.'],
          ['Supriya Shrinate', 'Chairperson, Social Media and Digital Platforms, Indian National Congress; National Spokesperson', 'Supriya Shrinate chairs the Indian National Congress\'s department of social media and digital platforms, a role she has held since June 2022, and is a national spokesperson for the party. A former journalist with around 18 years in print and electronic media, she worked as an anchor and editor before entering politics. She was appointed a member of the Congress Working Committee in 2023.', MOD],
        ],
      },
      {
        title: 'Panel 2: A New Economic Deal for the World', when: `${FRI} | 1:30 pm - 2:30 pm`,
        about: 'The geo-economic norms, rules and institutions of the international world order were unfair to Global South nations, produced massive wealth inequalities and paved the way for the Right (who is now systematically dismantling each of the institutions and norms underpinning the global economy). This panel is to pose the contours of a new economic deal that will lay the groundwork for meaningful jobs, wages, taxation, public investment, welfare and the distribution of wealth and opportunity. This panel is about how wealth and economic power should be organized, and is forward looking.',
        speakers: [
          ['Ebrahim Patel', 'Former Minister of Trade, Industry and Competition, South Africa', 'Ebrahim Patel is a South African politician, former trade unionist and member of the African National Congress. He served as Minister of Trade, Industry and Competition from 2019 to 2024 and, before that, as Minister of Economic Development from 2009 to 2019. Earlier in his career he was secretary-general of the Southern African Clothing and Textile Workers\' Union, from 1993 to 2009. He left the Cabinet after the 2024 general election.'],
          ['Ivan Scalfarotto', 'Member of the Italian Parliament (Italia Viva); former Undersecretary of State', 'Ivan Scalfarotto is an Italian politician and a member of Italia Viva. He has been a member of the Italian Parliament since 2013. He served as Undersecretary of State for Constitutional Reforms and Relations with Parliament in the Renzi government, and later as Undersecretary for Economic Development and for Foreign Affairs. He is a long-standing campaigner for LGBT rights in Italy.'],
          ['Jayati Ghosh', 'Professor of Economics, University of Massachusetts Amherst', 'Jayati Ghosh is Professor of Economics at the University of Massachusetts Amherst, a post she has held since January 2021. She is an Indian development economist who taught at Jawaharlal Nehru University, New Delhi, for nearly 35 years. Her research covers international economics and globalisation, employment in developing countries, macroeconomic policy, and gender and development.'],
          ['Thomas Piketty', 'Professor of Economics, EHESS and Paris School of Economics; Co-Director, World Inequality Lab', 'Thomas Piketty is a French economist and Professor at the School for Advanced Studies in the Social Sciences (EHESS), and associate chair at the Paris School of Economics, where he has taught since 2007. He co-directs the World Inequality Lab and the World Inequality Database, and is a Centennial Professor at the International Inequalities Institute of the London School of Economics. His book Capital in the Twenty-First Century became an international bestseller and reshaped public debate on wealth and inequality.'],
        ],
      },
      {
        title: 'Panel 3: Youth & Politics of Tomorrow', when: `${FRI} | 1:30 pm - 2:30 pm`,
        about: 'Young people are often described as the future of politics, while having relatively little influence over the institutions and political systems that govern their present. This panel will look at how younger generations are changing political participation, organising, campaigning and political culture, and what they expect from progressive politics. It will also be about young people making programmatic demands that create the conditions for a transition of power.',
        speakers: [
          ['Alice Bernard-Montini', 'Secretary General, Young Democrats for Europe', 'Alice Bernard-Montini is Secretary General of Young Democrats for Europe (YDE), the youth organisation of the European Democratic Party. She was elected to the post at the organisation\'s congress in Bilbao in November 2022, having represented the French youth group JDem. Her role as Secretary General is listed on the organisation\'s public profile.'],
          ['Dariana Polo', 'Coordinator, Progressive Alliance Gender Equality Working Group, Venezuela', 'Dariana Polo is Coordinator of the Progressive Alliance Gender Equality Working Group.'],
          ['Eduardo Zanatta', 'City Councillor (Vereador), Balneario Camboriu, Brazil', 'Eduardo Zanatta is a city councillor (vereador) in Balneario Camboriu, Santa Catarina, Brazil. He holds a degree in International Relations and a master\'s degree in Territorial Planning. Public sources differ on his party affiliation, so it is not stated here.'],
          ['Jessali Andrea de Jesus Zarazua Ramirez', 'Secretary General, International Union of Socialist Youth (IUSY)', 'Jessali Zarazua is Secretary General of the International Union of Socialist Youth (IUSY), an international youth organisation with about 136 member organisations. She is a youth leader from Mexico who was elected to lead the union at its congress.'],
          ['María José Pizarro', 'Former Senator, Historic Pact, Colombia', 'María José Pizarro is a Colombian politician who served in the Chamber of Representatives from 2018 to 2022 and as a Senator for the Historic Pact from 2022 until her departure from Congress in 2026. She is the daughter of Carlos Pizarro Leongómez, former leader of the M-19 guerrilla movement, who later stood as a presidential candidate before his assassination in 1990.'],
          ['Yves Bunkulu Zola', 'Member, Union pour la Démocratie et le Progrès Social (UDPS), DR Congo; former Minister of Tourism', 'Yves Bunkulu Zola is a member of the Union pour la Démocratie et le Progrès Social (UDPS) in the Democratic Republic of the Congo and a member of parliament. He was appointed Minister of Tourism in the Ilunga government, which served from September 2019 to April 2021, and is listed as Minister of Youth from 2021.'],
        ],
      },
      {
        title: 'Panel 4: South-South Cooperation in a New World Order', when: `${FRI} | 3:00 pm - 4:00 pm`,
        about: 'Global South nations have been demanding a greater say in how the international system (multilateral institutions, trade systems etc.) is shaped. This panel will look at how Global South countries in Asia, Africa, Latin America can build stronger political partnerships, and collaboratively work to a) forge common ground, and b) further shared interests. Like the Non-Aligned Movement (NAM) once was, this panel is about strengthening relations between Global South, and their collective place in the world.',
        speakers: [
          ['Anies Baswedan', 'Former Governor of Jakarta, Indonesia', 'Anies Baswedan is an Indonesian academic and politician. He served as the 14th Governor of Jakarta from 2017 to 2022 and previously as Minister of Education and Culture. He was a candidate in the 2024 Indonesian presidential election. He founded Indonesia Mengajar, a programme that places university graduates in one-year teaching posts across the country.'],
          ['Humberto Costa', 'Senator for Pernambuco, Brazil (Workers\' Party); former Minister of Health', 'Humberto Costa is a Brazilian medical doctor and politician of the Workers\' Party (PT). He has represented Pernambuco in the Federal Senate since 2011 and was re-elected in October 2026 for a third consecutive term. He served as Minister of Health from 2003 to 2005 under President Luiz Inacio Lula da Silva, where he oversaw programmes including Farmacia Popular and SAMU. He previously served as a federal deputy for Pernambuco.'],
          ['Karol Cariola', 'Senator for Valparaiso Region, Chile', 'Karol Cariola is a Chilean midwife and politician, and Senator for the Valparaiso Region for 2026 to 2034. She represents the Communist Party of Chile and chairs the Senate\'s permanent committee on water resources, desertification and drought. She was elected to the Chamber of Deputies in 2013 and served as its President from 2024 to 2025.'],
          ['Machris Cabreros', 'Progressive Alliance, Philippines', 'Machris Cabreros works with the Progressive Alliance, the global network of social democratic, socialist and labour parties and organisations.'],
          ['Saptagiri Ulaka', 'Member of Parliament, Lok Sabha (Koraput); AICC In-charge, Tripura, Manipur, Nagaland and Sikkim', 'Saptagiri Ulaka is a Member of the Lok Sabha representing Koraput, Odisha, for the Indian National Congress, first elected in 2019 and re-elected in 2024. He chairs the Standing Committee on Rural Development and Panchayati Raj and serves as AICC In-charge for Tripura, Manipur, Nagaland and Sikkim. He previously worked as a Senior Project Manager at Infosys in the United States, and earlier with Ranbaxy and HCL Technologies.', MOD],
        ],
      },
      {
        title: 'Panel 5: Climate Change', when: `${FRI} | 3:00 pm - 4:00 pm`,
        about: 'This panel is being organized when populist-autocrats are not just denying climate change but also accelerating policies and projects that worsen the gains made over the past few decades. For much of the Global South, climate change is not a distant threat but an economic and political reality already affecting livelihoods, food, infrastructure and development. The panel will examine the demands of Annex-II nations on climate finance, technology, adaptation and a transition that does not place the costs of the climate crisis disproportionately on poorer societies. It will also look at the responsibilities of Global North nations.',
        speakers: [
          ['Javier Eduardo Monge Matamoros', 'Energy and Climate Change Consultant, Costa Rica', 'Javier Eduardo Monge Matamoros is a Costa Rican consultant on energy and climate change. He has led national and business plans on these issues in Latin America and the Caribbean. His public candidacy profile promotes a green economy that generates decent employment in Costa Rica\'s regions.'],
          ['Jo Leinen', 'Former Member of the European Parliament, Germany (1999-2019)', 'Jo Leinen is a German politician and a member of the Social Democratic Party (SPD). He served as a Member of the European Parliament from 1999 to 2019, sitting on the Committee on Constitutional Affairs, the Committee on Foreign Affairs and the Committee on the Environment, Public Health and Food Safety. He was a prominent voice on constitutional reform and environmental policy during his time in the Parliament.'],
          ['M.V. Rajeev Gowda', 'Professor, Indian Institute of Management Bangalore; National Spokesperson, Indian National Congress', 'M.V. Rajeev Gowda is a Professor at the Indian Institute of Management Bangalore and a National Spokesperson of the Indian National Congress. He is also an Advisor to Bridge India, a London-based think tank, and Chairman of the Congress Research Department. He served as a Member of the Rajya Sabha for Karnataka from 2014 to 2020, and earlier as a Director on the Central Board of the Reserve Bank of India from 2011 to 2014.', MOD],
        ],
      },
      {
        title: 'Panel 6: Reform of Multilateral Institutions', when: `${FRI} | 4:00 pm - 5:15 pm`,
        about: 'Institutions created for an earlier international order are increasingly being asked to deal with problems and power relationships that have changed dramatically. This panel will examine the case for reforming institutions such as the United Nations and the wider multilateral system, and what a more representative international architecture could look like. This becomes especially pertinent given populist autocrats are withdrawing from security and aid commitments (and destroying institutions designed to further them). This panel is about reshaping the institutions and rules of international governance in light of nations resorting to primordial rules of statecraft.',
        speakers: [
          ['Allison McManus', 'Managing Director, National Security and International Policy, Center for American Progress', 'Allison McManus is Managing Director of National Security and International Policy at the Center for American Progress, where she oversees the department\'s strategic direction. Her work focuses on democracy, human rights and security in U.S. foreign policy, with an emphasis on the Middle East. She previously served as Managing Director of the Freedom Initiative, which advocates for political prisoners in the Middle East and North Africa, and as Research Director of the Tahrir Institute for Middle East Policy from 2014 to 2019.'],
          ['Bert Koenders', 'Professor, Leiden University; Former Minister of Foreign Affairs, Netherlands', 'Bert Koenders is Professor at Leiden University, where he holds the Kooijmans Chair of Peace, Security and Law. He served as Minister of Foreign Affairs of the Netherlands from 2014 to 2017 and as Minister for Development Cooperation. Earlier, he held senior United Nations posts, serving as the Secretary-General\'s Special Representative in Côte d\'Ivoire and leading the UN mission in Mali (MINUSMA). He sat in the Dutch House of Representatives from 1997 to 2007.'],
          ['Oh Song', 'Secretariat, International Conference of Asian Political Parties (ICAPP)', 'Oh Song works with the Secretariat of the International Conference of Asian Political Parties (ICAPP), a forum of political parties from Asia and Oceania launched in Manila in 2000.'],
          ['Paolo Guerrieri', 'Professor of Economics, Sapienza University of Rome; former Senator, Italian Republic', 'Paolo Guerrieri Paleotti is a professor of economics at Sapienza University of Rome, where he graduated in economics in 1970. He was elected to the Italian Senate in 2013 for the Partito Democratico, representing Liguria, and served until 2018, sitting on the Budget and European Policies committees. He has held visiting posts at institutions including the University of California, Berkeley and the College of Europe, and has published widely on international economics and European integration.'],
          ['Salil Shetty', 'Former Secretary General, Amnesty International; Senior Fellow, Carr Center for Human Rights Policy, Harvard University', 'Salil Shetty served as Secretary General of Amnesty International from 2010 to 2018, the organization\'s eighth holder of the post, and oversaw a shift of its operations towards the global South. Before Amnesty he was Chief Executive of ActionAid International and directed the UN Millennium Campaign from 2003 to 2010. He has been a Senior Fellow at the Carr Center for Human Rights Policy at Harvard University since 2018. He studied at the Indian Institute of Management, Ahmedabad and the London School of Economics.'],
          ['Gaurav Gogoi', 'Deputy Leader of the Indian National Congress in the Lok Sabha; Member of Parliament, Jorhat, Assam', 'Gaurav Gogoi is Deputy Leader of the Indian National Congress in the Lok Sabha, a post he has held since July 2024, and Member of Parliament for Jorhat, Assam. He previously represented Kaliabor in the Lok Sabha from 2014 to 2024. In 2025 he was elected President of the Assam Pradesh Congress Committee. As Deputy Leader, he serves alongside Rahul Gandhi, the Leader of the Opposition in the Lok Sabha.', MOD],
        ],
      },
      {
        title: 'Panel 7: Gender Justice & a Feminist Future', when: `${FRI} | 4:00 pm - 5:15 pm`,
        about: 'A genuinely progressive politics has to confront the structures that continue to shape women’s lives, work, safety, representation and economic independence. This panel will examine what a feminist political and economic future could look like, and how gender justice can move from rhetoric into policy and institutions. The focus is gender and power. It should go beyond representation of women in politics and address the broader social, economic and political structures that produce inequality.',
        speakers: [
          ['Gladys Kudzaishe Hlatywayo', 'Member of Parliament, Zimbabwe', 'Gladys Kudzaishe Hlatywayo is a Zimbabwean Member of Parliament.'],
          ['Hella Ben Youssef', 'Deputy Chair, Socialist International Women; former Deputy Minister, Tunisia', 'Hella Ben Youssef is a Tunisian jurist, feminist activist and politician. She served as Deputy Minister for Women, Family and Children. She is Deputy Chair of Socialist International Women, and she has worked on women\'s and human rights in both Tunisia and France.'],
          ['Martha Tagle Martínez', 'Director, Institute for Citizen Training, Movimiento Ciudadano, Mexico', 'Martha Tagle Martínez is Director of the Institute for Citizen Training of Movimiento Ciudadano, Mexico, a party she helped found. She served as a Senator from 2015 to 2018 and as a Federal Deputy from 2018 to 2021. She is a feminist activist and politician, and was the first national leader of the party\'s women\'s group, Mujeres en Movimiento.'],
          ['Nurima Alkatiri', 'Member of Parliament and Deputy Leader, FRETILIN, Timor-Leste', 'Nurima Alkatiri is a Member of Parliament in Timor-Leste and Deputy Leader of FRETILIN, the Revolutionary Front for an Independent East Timor.'],
          ['Jothimani', 'Member of Parliament (Lok Sabha), Karur, Tamil Nadu; Indian National Congress', 'Jothimani (Sennimalai Jothimani) is a Member of Parliament in the Lok Sabha for Karur, Tamil Nadu, representing the Indian National Congress. She was first elected in 2019, defeating AIADMK leader M. Thambidurai, and was re-elected in 2024. A writer and social worker, she has held party roles including Vice President of the Tamil Nadu Youth Congress and General Secretary of the Indian Youth Congress (2009-2012).', MOD],
        ],
      },
      {
        title: 'Panel 8: Progressivism & Accountability', when: `${SAT} | 10:30 am - 11:30 am`,
        about: 'Like it once was, progressive politics needs to be more than just winning elections. It needs to convince ordinary citizens that it is responsive, aspirational and champions peoples’ voices, while speaking truth to power. Only by reaffirming this can progressive politics outmaneuver the Right’s engineered propaganda against establishment parties. This panel will examine how progressive movements and parties can rethink and recalibrate the practice of politics, by sharing best practices and brainstorming on innovative ideas.',
        speakers: [
          ['Antton Rönnholm', 'Secretary General, Social Democratic Party of Finland', 'Antton Rönnholm is Secretary General of the Social Democratic Party of Finland (SDP), a post he has held since 2017. He also chairs the boards of the Association of Higher Education in the Social Sciences and the Kalevi Sorsa Foundation. Earlier, he served as special adviser to the Minister for European Affairs during Finland\'s EU presidency, and he has worked in Brussels for the European Parliament and as a researcher at the CEPS think tank.'],
          ['Febe Potgieter-Gqubule', 'Head of Policy and Research, African National Congress; former Ambassador to Poland', 'Febe Potgieter-Gqubule is Head of Policy and Research of the African National Congress, a post she has held since 2023. She was elected Secretary-General of the ANC Youth League in 1996, the first woman to hold the post. She served as South Africa\'s Ambassador to Poland from 2005 to 2009, and from 2012 to 2017 she worked at the African Union Commission, latterly as Deputy Chief of Staff to the Chairperson.'],
          ['Pablo Daniel Oribe Decuadra', 'Secretary General, Partido Socialista de Uruguay', 'Pablo Daniel Oribe Decuadra is Secretary General of the Partido Socialista de Uruguay, elected in 2025 with 55.9 per cent of the vote. A history teacher, he previously held the territorial development and communication secretariats under his predecessor, Gonzalo Civila. He began his political career in Buenos Aires as political secretary of the Vivian Trías Socialist Centre.'],
          ['Peangpanor Boonklum', 'Senior Executive Vice President and General Counsel, PTT Public Company Limited, Thailand', 'Peangpanor Boonklum is Senior Executive Vice President and General Counsel at PTT Public Company Limited, Thailand\'s state-owned energy group, where she leads the Office of General Counsel and sits on the company\'s Management Committee. She joined PTT in 2017 after a career in private legal practice, including as a partner at White & Case. Her responsibilities include advising senior management on growth and acquisitions and on corporate governance, and she serves on subsidiary boards including IRPC and Thai Oil.'],
          ['Amitabh Dubey', 'In-charge, Research and Monitoring, Communications Department, All India Congress Committee (AICC)', 'Amitabh Dubey is in charge of research and monitoring in the Communications Department of the All India Congress Committee, a role he was given in a June 2022 appointment. He leads the Delhi branch of the All India Professionals Congress and was a member of the party\'s 2024 manifesto committee. He is a childhood friend of Rahul Gandhi and has been part of the party\'s communications operation for several years, including its research and monitoring work.', MOD],
        ],
      },
      {
        title: 'Panel 9: Innovative Ideas for Progressives', when: `${SAT} | 10:30 am - 11:30 am`,
        about: 'Progressive movements need new ways of organising, communicating and building political support in an increasingly undemocratic political environment. This session will bring together ideas, experiments and practical approaches that can help progressive organisations connect with people beyond traditional political structures. It is the ideas and experimentation panel. Rather than focusing on one constituency or issue, it asks what progressives can actually do differently in organising, campaigning and political communication.',
        speakers: [
          ['Johan Hassel', 'Senior Fellow and Director of Global Progress, Center for American Progress, USA', 'Johan Hassel is Senior Fellow and Director of Global Progress at the Center for American Progress, where he leads work on democracy, accountability, inclusive growth and climate, and on a transatlantic progressive partnership. He served as International Secretary of the Swedish Social Democratic Party from 2018 to 2022. He was earlier CEO of the Swedish think tank Global Challenge (Global Utmaning) and Secretary-General of the International Union of Socialist Youth.'],
          ['Kunthida Rungruengkiat', 'Director, Progressive Movement Foundation, Thailand', 'Kunthida Rungruengkiat is Director of the Progressive Movement Foundation in Thailand, which supports pro-democracy initiatives at national and local levels. She is a Thai academic and former politician who served as Deputy Leader of the Future Forward Party and as a member of the House of Representatives. After the party was dissolved in 2020, the Constitutional Court banned her from politics for ten years.'],
          ['Nika Kovač', 'Founder and Director, 8th of March Institute, Slovenia', 'Nika Kovač is a Slovenian anthropologist, sociologist and activist. She founded and directs the 8th of March Institute (Inštitut 8. marec), a civil society organisation working on democratic participation and inequality. She holds a master\'s degree in social and cultural anthropology from the University of Ljubljana. She was named Slovenian Woman of the Year 2021 by the magazine Jana.'],
          ['Oyvind Wenensland', 'Head of Strategy and International Secretary, Norwegian Labour Party', 'Øyvind Grøslie Wennesland is Head of Strategy and International Secretary of the Norwegian Labour Party. In 2026 he served as acting State Secretary in the Office of the Prime Minister of Norway, under Prime Minister Jonas Gahr Støre.'],
          ['Pedro Uczai', 'Federal Deputy for Santa Catarina, Chamber of Deputies, Brazil; member, Workers\' Party (PT)', 'Pedro Uczai is a Federal Deputy in the Chamber of Deputies of Brazil, representing Santa Catarina and serving since 2011. He is a member of the Workers\' Party (PT), which he joined in 1989. He served as mayor of Chapecó from 2002 to 2004 and has sat in the Legislative Assembly of Santa Catarina. He is a university professor by background and was born in Descanso, Santa Catarina.'],
        ],
      },
      {
        title: 'Panel 10: The New World Order', when: `${SAT} | 1:00 pm - 2:00 pm`,
        about: 'The international balance of power is being reshaped by new alliances, economic competition, technological change and the growing influence of countries outside the traditional centres of power. This panel will examine what these shifts mean for global politics and how the emerging international system may be structured. It is a big-picture geopolitics panel, and asks what the emerging global order actually looks like, rather than focusing on one institution, region or conflict.',
        speakers: [
          ['Dan Herman', 'Senior Director, National Security, Accountability and Reform, Center for American Progress', 'Dan Herman is Senior Director for National Security, Accountability and Reform at the Center for American Progress, where he works on democracy and foreign policy issues. From 2018 to 2021 he was Director of Advocacy and Campaigns at National Security Action. He previously served as Senior Adviser for Accountability to the Commissioner of U.S. Customs and Border Protection, and worked at the Department of Defense on counterterrorism and intelligence oversight.'],
          ['Maszlee Malik', 'Member, Johor State Legislative Assembly, Malaysia; Former Minister of Education', 'Dr Maszlee Malik is a Member of the Johor State Legislative Assembly for Puteri Wangsa, a seat he won in the 2026 Johor state election. He served as Minister of Education of Malaysia from 2018 to 2020 under Prime Minister Mahathir Mohamad. He holds a PhD in Political Science from Durham University and was previously an Assistant Professor at the International Islamic University Malaysia.'],
          ['Guillaume Long', 'Senior Diplomatic Advisor, The Hague Group; Senior Fellow, Center for Economic and Policy Research', 'Guillaume Long is Senior Diplomatic Advisor to The Hague Group, a coalition of states committed to upholding international law in relation to Palestine, a role he has held since 2025. He is also a Senior Fellow at the Center for Economic and Policy Research in Washington, D.C. Born in France, he served as Ecuador\'s Minister of Foreign Affairs and Human Mobility from 2016 to 2017 and as its Permanent Representative to the United Nations in Geneva until his resignation in January 2018.'],
          ['Jonas Kalambayi Katshiobo', 'Senator, Parliament of the Democratic Republic of the Congo', 'Jonas Kalambayi Katshiobo is a Senator in the Parliament of the Democratic Republic of the Congo.'],
          ['Nancy Okail', 'President and CEO, Center for International Policy, USA', 'Nancy Okail is President and CEO of the Center for International Policy, United States. She previously served as Executive Director of the Tahrir Institute for Middle East Policy and directed Freedom House\'s Egypt programme. She has worked for more than two decades on human rights, democracy and security in the Middle East and North Africa, and holds a PhD from the University of Sussex.'],
          ['Patrick Gaspard', 'President and CEO, Center for American Progress; former United States Ambassador to South Africa', 'Patrick Gaspard is President and Chief Executive Officer of the Center for American Progress and of the Center for American Progress Action Fund, a position he has held since 2021. He previously served as United States Ambassador to South Africa and led the Open Society Foundations. Earlier he held senior political roles in the White House, including director of political affairs under President Barack Obama. He is a former diplomat and community activist.'],
        ],
      },
      {
        title: 'Panel 11: Peace in the New World Order', when: `${SAT} | 1:00 pm - 2:00 pm`,
        about: 'As geopolitical rivalries deepen and conflicts become increasingly interconnected with questions of resources, technology and power, the foundations of international peace are under pressure. This panel will examine the changing nature of conflict (especially in light of nations led by populist autocrats increasingly willing to resort to the might-is-right doctrine) and the political and diplomatic approaches needed to prevent escalation and build durable peace. This panel focuses specifically on conflict, peace and diplomacy, rather than the broader distribution of global power.',
        speakers: [
          ['Basem Kamel', 'Architect and former Member of Parliament, Egypt', 'Basem Kamel is an Egyptian architect and politician. He is a founding member of the Egyptian Social Democratic Party and a former Member of Parliament. He was active in the political movement that followed the 2011 revolution, working towards democratic elections. He has been described in international press coverage as an architect with his own practice.'],
          ['Chung Eui-yong', 'Former Minister of Foreign Affairs, Republic of Korea', 'Chung Eui-yong is a South Korean diplomat and politician. He served as Director of the National Security Office from 2017 to 2020 under President Moon Jae-in, and took part in the 2018 diplomatic engagement with North Korea. He was elected to the National Assembly in 2004 as a proportional representative of the Uri Party. He served as Minister of Foreign Affairs from 2021 to 2022, and earlier as South Korea\'s Ambassador to the United Nations in Geneva and as Deputy Minister for Trade.'],
          ['Clara López Obregón', 'National Co-Chair, Alianza por la Vida, Colombia', 'Clara López Obregón is a Colombian economist and politician. She served as Acting Mayor of Bogotá from 2011 to 2012 and was president of the Democratic Pole party. She was previously active in the Patriotic Union party. She is National Co-Chair of Alianza por la Vida, Colombia.'],
          ['Damian Murphy', 'Senior Vice President for National Security and International Policy, Center for American Progress, USA', 'Damian Murphy is the senior vice president for National Security and International Policy at American Progress. He is also a lecturer in International Affairs at George Washington University. He has more than 25 years of international affairs experience as a chief policy adviser, program director, analyst, and political party trainer.'],
          ['Manish Tewari', 'Member of Parliament, Lok Sabha (Chandigarh); Indian National Congress', 'Manish Tewari is a Member of the Lok Sabha representing Chandigarh for the Indian National Congress, a seat he has held since 2024. He previously represented Anandpur Sahib from 2019 to 2024 and Ludhiana from 2009 to 2014. He served as Minister of State (Independent Charge) for Information and Broadcasting from 2012 to 2014, and was earlier President of the Indian Youth Congress. He holds degrees in law from the University of Delhi.', MOD],
        ],
      },
      {
        title: 'Panel 12: The Future of Media', when: `${SAT} | 1:00 pm - 2:00 pm`,
        about: 'The way people receive information is changing rapidly as traditional journalism competes with social media, creators, algorithms, podcasts and increasingly AI-generated content. This panel will examine what these changes mean for journalism, public debate, political communication and the ability of citizens to distinguish information from manipulation. It will also look at what the media should do to evolve in light of the concerted attack emanating from the Right on media freedoms and rights.',
        speakers: [
          ['Helle Lyng', 'Journalist and Commentator, Dagsavisen, Norway', 'Helle Lyng (Helle Lyng Svendsen) is a Norwegian journalist and commentator for the Oslo daily Dagsavisen. She has also worked as a freelance journalist for several Norwegian publications and digital platforms. Her commentary covers international affairs, public policy and Norwegian social issues.'],
          ['Leonard Novy', 'Policy Fellow, Das Progressive Zentrum, Germany', 'Leonard Novy is a German political adviser and journalist focusing on democracy and political communication. He is a Policy Fellow at Das Progressive Zentrum and a Senior Advisor at NewsGuard. Until 2025 he directed the Cologne-based Institute for Media and Communication Policy (IfM). He earned his doctorate in international politics at Cambridge, has held research fellowships at Harvard, and teaches at the Hertie School.'],
          ['Rajdeep Sardesai', 'Consulting Editor and Anchor, India Today Group', 'Rajdeep Sardesai is a consulting editor with the India Today Group and anchors a prime-time news show. He joined The Times of India in 1988 and moved to television in 1994 as political editor at NDTV. He was formerly Editor-in-Chief of the TV18 news channels, including CNN-News18 and News18 India. He received the Padma Shri in 2008 and is the author of the bestselling 2014: The Election that Changed India.'],
        ],
      },
      {
        title: 'Valedictory Session: Launch of the Our World Institute', when: `${SAT} | 2:30 pm - 5:30 pm`,
        speakers: [
          ['Maria Joao Rodrigues', 'President, Foundation for European Progressive Studies (FEPS)', 'Dr. Maria João Rodrigues is President of the Foundation for European Progressive Studies (FEPS), a Brussels-based think tank affiliated with the Party of European Socialists, a post she has held since 2017. She was the first woman to lead the foundation. She is a former Member of the European Parliament and former Vice-President of the Socialist and Democratic Group. She also served as Portuguese Minister for Employment.'],
        ],
      },
      {
        title: 'Valedictory Session: Delivering Global Justice', when: `${SAT} | 2:30 pm - 5:30 pm`,
        speakers: [
          ['Edinho Silva', 'President, Workers\' Party (PT), Brazil', 'Edinho Silva has been President of the Workers\' Party (Partido dos Trabalhadores, PT) of Brazil since 2025, when he was elected by party members with the backing of President Lula da Silva. His term runs to 2029. He previously served as mayor of Araraquara and as Secretary of Social Communication in the government of President Dilma Rousseff from 2015 to 2016. He is a long-standing figure in São Paulo state politics.'],
          ['Iván Cepeda', 'Senator, Pacto Historico, Colombia; 2026 presidential candidate', 'Ivan Cepeda Castro is a Colombian politician, human rights activist and philosopher. He has served in the Senate of Colombia since 2014 and is a leading figure of the Pacto Historico (Historic Pact) on the Colombian left. He was the Historic Pact candidate in the 2026 presidential election, finishing second in the runoff. He founded the Manuel Cepeda Foundation, named after his father, who was assassinated in 1994, and previously served in the Chamber of Representatives from 2010 to 2014.'],
          ['Junya Ogawa', 'Japanese Politician; former Secretary-General, Constitutional Democratic Party', 'Junya Ogawa is a Japanese politician who served as Secretary-General of the Constitutional Democratic Party of Japan. In February 2026 he was elected leader of the Centrist Reform Alliance, a party formed by the Constitutional Democratic Party and Komeito ahead of the general election. He won the leadership vote against Takeshi Shina.'],
          ['Thanathorn Juangroongruangkit', 'Chairperson, Progressive Movement, Thailand; co-founder and former leader, Future Forward Party', 'Thanathorn Juangroongruangkit is Chairperson of the Progressive Movement in Thailand, which he co-founded in 2020 after the Future Forward Party was dissolved. He co-founded Future Forward in 2018 and was elected its leader that year, serving until 2020. A Thai businessman and former politician, he holds a joint-honours B.Eng. in mechanical engineering from Thammasat University and the University of Nottingham.'],
        ],
      },
      {
        title: 'Other Confirmed Speakers', when: 'Session to be announced',
        speakers: [
          ['Akiko Kamei', 'Former Member of the House of Representatives, Japan', 'Akiko Kamei is a former Member of the House of Representatives of Japan. She was first elected to the House in 2017, serving until 2021, and returned to the House after winning the Shimane 1st district by-election in 2024. Her term ended in 2026. She is a member of the Constitutional Democratic Party of Japan (CDP), where she has served as Director of the International Department. Her father, Hisaoki Kamei, was also a member of the House of Representatives.'],
        ],
      },
    ],
  },
  {
    part: 'Part II: Telangana Rising Panels',
    sessions: [
      {
        title: 'Telangana Rising: Future City & Urbanisation', when: `${FRI} | 11:00 am - 12:30 pm`,
        speakers: [
          ['Shaik Salauddin', 'National General Secretary, Indian Federation of App Based Transport Workers', 'Shaik Salauddin is the National General Secretary of the Indian Federation of App Based Transport Workers (IFAT), a coalition he helped found in 2019. He also founded the Telangana Four Wheeler Drivers\' Association and is the founder president of the Telangana Gig and Platform Workers Union (TGPWU). He has spoken publicly on fare regulation during nationwide app-based driver strikes.'],
          ['Tikender Singh Panwar', 'Former Deputy Mayor of Shimla; Senior Fellow, IMPRI', 'Tikender Singh Panwar is a Senior Fellow at IMPRI, a New Delhi-based think tank, and a former Deputy Mayor of Shimla. He has been an expert member of a working group of the Ministry of Housing and Urban Affairs drafting a model municipal act. He is the author of Cities in Transition, a collection on urban planning, governance and climate issues in India. He has also spoken at COP21, UN Habitat III and the BRICS conference.'],
        ],
      },
      {
        title: 'Telangana Rising: Economic Justice', when: `${FRI} | 11:00 am - 12:30 pm`,
        speakers: [
          ['Himanshu', 'Associate Professor, Centre for Economic Studies and Planning, Jawaharlal Nehru University', 'Himanshu is an Associate Professor at the Centre for Economic Studies and Planning, Jawaharlal Nehru University, New Delhi. His research covers poverty, inequality, employment, food security and agrarian change. He has served on government bodies including the Expert Group on Measurement of Poverty (Tendulkar Committee) and the National Statistical Commission. He has held visiting fellowships at the London School of Economics and UNU-WIDER, and received the Sanjay Thakur Young Economist Award.'],
        ],
      },
      {
        title: 'Telangana Rising: Social Justice', when: `${FRI} | 2:00 pm - 3:30 pm`,
        speakers: [
          ['Bhangya Bhukya', 'Professor of History, University of Hyderabad', 'Bhangya Bhukya is Professor of History at the University of Hyderabad. He previously taught at the English and Foreign Languages University, Hyderabad, and at Osmania University. His research focuses on the tribal histories of the Deccan, including the Banjara (Lambada) and Gond communities. His books include Subjugated Nomads: The Lambadas under the Rule of the Nizams (2010) and A Cultural History of Telangana (2017). He holds a PhD from the University of Warwick.'],
          ['Kancha Ilaiah Shepherd', 'Political theorist, writer and Dalit rights activist', 'Kancha Ilaiah Shepherd is a political theorist, writer and Dalit rights activist. He was a professor of political science at Osmania University, where he headed the department, and a former Director of the Centre for the Study of Social Exclusion and Inclusive Policy at Maulana Azad National Urdu University. He has served on the National Research Committee of the Ministry of Social Justice and the Indian Council of Social Science Research. He received the Mahatma Jyotirao Phule Award in 2000 and is the author of Why I Am Not a Hindu (1996).'],
        ],
      },
      {
        title: 'Telangana Rising: Welfare Policies', when: `${FRI} | 2:00 pm - 3:30 pm`,
        speakers: [
          ['K. Raju', 'Indian National Congress leader', 'K. Raju is a leader of the Indian National Congress.'],
          ['Shantha Sinha', 'Professor, Hyderabad Central University; Founder, MV Foundation', 'Shantha Sinha is a child rights activist and Professor in the Department of Political Science at Hyderabad Central University. She founded the MV Foundation, an organisation working against child labour. She was the first Chairperson of the National Commission for Protection of Child Rights (NCPCR), serving two consecutive three-year terms from 2007. She received the Ramon Magsaysay Award in 2003 and the Padma Shri.'],
        ],
      },
      {
        title: 'Telangana Rising: Federalism', when: `${SAT} | 10:00 am - 11:30 am`,
        speakers: [
          ['Amir Ullah Khan', 'Economist; Member, Telangana Public Service Commission', 'Amir Ullah Khan is an economist and a Member of the Telangana Public Service Commission. He is also a member of the Government of India\'s Technical Advisory Committee on Prices and Cost of Living, and a visiting professor at the Indian School of Business, the Tata Institute of Social Sciences and NALSAR, Hyderabad. He is co-editor of SAGE\'s Journal of Development Policy and Practice. He was previously Founder-Vice Chancellor of Glocal University and Executive Director and Editor at Encyclopaedia Britannica.'],
          ['Madhu Yaskhi Goud', 'Chairperson, All India Professionals Congress', 'Madhu Yaskhi Goud is Chairperson of the All India Professionals Congress, a post he took up in September 2026. He served as a Member of Parliament in the Lok Sabha for Nizamabad, Telangana, from 2004 to 2014. He has been an official spokesperson of the All India Congress Committee and was an acting AICC secretary from 2007. He contested the L.B. Nagar seat for the Congress in the 2023 Telangana Assembly election.'],
        ],
      },
      {
        title: 'Telangana Rising: Culture & Society', when: `${SAT} | 10:00 am - 11:30 am`,
        speakers: [
          ['Ajay Gudavarthy', 'Associate Professor, Centre for Political Studies, Jawaharlal Nehru University', 'Ajay Gudavarthy is an Associate Professor at the Centre for Political Studies, Jawaharlal Nehru University, New Delhi, where he has taught since 2006. He previously taught at the National Law School of India University, Bangalore, and at the National University of Juridical Sciences, Kolkata. He was a Charles Wallace Visiting Fellow at SOAS, University of London, in 2008, and has held visiting fellowships at Goldsmiths, University of London, and the University of Aberdeen.'],
        ],
      },
      {
        title: 'Telangana Rising: Youth & Sports', when: `${SAT} | 12:00 pm - 1:30 pm`,
        speakers: [
          ['Manish Sharma', 'Indian National Congress leader', 'Manish Sharma is a leader of the Indian National Congress.'],
        ],
      },
      {
        title: 'Electoral Integrity: Telangana & India', when: `${SAT} | 12:00 pm - 1:30 pm`,
        speakers: [
          ['SDJM Prasad', 'Indian National Congress leader', 'SDJM Prasad is a leader of the Indian National Congress.'],
        ],
      },
    ],
  },
]

const NO_PHOTO = new Set([])
// cards that keep a set colour instead of taking the next one in turn
const BG = { 'Damian Murphy': SPEAKER_COLOURS[1] } // navy
// "María José Pizarro" -> "maria-jose-pizarro", the photo's file name
const slug = (name) => name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const initials = (name) => name.replace(/^(Dr\.?|M\.V\.)\s*/, '').split(/\s+/).filter((w) => /^\p{Lu}/u.test(w)).slice(0, 2).map((w) => w[0]).join('')
  || name.slice(0, 2).toUpperCase()

let n = 0
// [{ part, sessions: [{ title, when, about, speakers: [speaker] }] }]
export const PARTS = RAW.map(({ part, sessions }) => ({
  part,
  sessions: sessions.map((s) => ({
    ...s,
    speakers: s.speakers.map(([name, role, bio, moderator]) => {
      n += 1
      return { id: n, name, role, bio, moderator: !!moderator, session: s.title, when: s.when, initials: initials(name),
        img: NO_PHOTO.has(name) ? null : a(`speakers/${slug(name)}.webp`),
        bg: BG[name] ?? SPEAKER_COLOURS[(n - 1) % SPEAKER_COLOURS.length] }
    }),
  })),
}))

export const SPEAKERS = PARTS.flatMap((p) => p.sessions.flatMap((s) => s.speakers))
