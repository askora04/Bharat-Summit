// Bharat Summit 2025 media coverage, from the agency's consolidated report (Online and
// Broadcast / YouTube coverages) and the syndication report. Headlines are the outlets' own.

// YouTube videos play in place (see MediaCoverage.jsx); `embed: false` marks ones whose channel blocks playing
// them on other sites, and `x` items are clips posted on X: both open in a new tab instead.
// Channels alternate so look-alike thumbnails (the two TV9 streams) never sit side by side.
// An `x` item needs an `img` poster (in public/assets), since X gives no thumbnail.
export const VIDEOS = [
  { id: 'rr47j69YQhM', channel: 'Zee Telugu News', date: '2025-04-25', title: 'Bharat Summit 2025 opens in Hyderabad' },
  { id: 'EYOAl9NeWg8', embed: false, channel: 'ETV Telangana', date: '2025-04-25', title: 'All set for Bharat Summit 2025' },
  { id: 'IvKhl_NUU2o', channel: 'India Today', date: '2025-04-26', title: 'Rahul Gandhi and Revanth Reddy at the summit' },
  { id: '0rSiQDhVq1Q', channel: 'TV9 Telugu', date: '2025-04-26', title: 'Plenary session at HICC, live' },
  { id: 'inWwsL0tai8', channel: 'ANI', date: '2025-04-26', title: 'Rahul Gandhi’s remarks at Bharat Summit 2025' },
  { id: 'IOnmtiSlw-4', channel: 'TV9 Telugu', date: '2025-04-26', title: 'Sridhar Babu: justice for all is the summit’s aim' },
  { id: 'KvR7N9H2zL4', embed: false, channel: 'ETV Telangana', date: '2025-04-26', title: 'Day two at HICC with Rahul Gandhi' },
  { id: 'bpZe-EAg7xY', channel: 'ANI', date: '2025-04-26', title: 'Rahul Gandhi arrives in Hyderabad' },
  { id: 'I1whyF3wcf0', channel: 'TV9 Telugu', date: '2025-04-26', title: 'Plenary session at HICC, live (part 2)' },
  { id: 'wEQoo34nWRY', channel: 'Zee Telugu News', date: '2025-04-26', title: 'Rahul Gandhi addresses the summit' },
]

// The same press release, carried by international outlets
export const SYNDICATED = {
  date: '2025-05-29',
  title: 'Bharat Summit brings 450+ delegates from 100 nations to Telangana to rethink global justice',
  outlets: [
    ['AP News', 'https://apnews.com/press-release/marketersmedia/rahul-gandhi-india-argentina-india-government-wayne-swan-33d51b36ccfe9b19438fd1cfcd326ae1'],
    ['Benzinga', 'https://www.benzinga.com/pressreleases/25/05/45669056/bharat-summit-brings-450-delegates-from-100-nations-to-telangana-to-rethink-global-justice-opens-with-a-candlelight-vigil-condemning-the-pahalgam-attack'],
    ['The Manila Times', 'https://www.manilatimes.net/2025/05/29/tmt-newswire/plentisoft/bharat-summit-brings-450-delegates-from-100-nations-to-telangana-to-rethink-global-justice-opens-with-a-candlelight-vigil-condemning-the-pahalgam-attack/2123478'],
  ],
}

// [publication, date, headline, url]
const ROWS = [
  ['The Times of India', '2025-04-25', 'Bharat Summit focuses on social justice, global peace amid Pahalgam attack', 'https://timesofindia.indiatimes.com/city/hyderabad/bharat-summit-focuses-on-social-justice-global-peace-amid-pahalgam-attack/articleshow/120626045.cms'],
  ['The Hindu', '2025-04-25', 'Talk on ‘Gender Justice and Feminist Future’ at Bharat Summit in Hyderabad', 'https://www.thehindu.com/news/national/telangana/talk-on-gender-justice-and-feminist-future-at-bharat-summit-in-hyderabad/article69490909.ece/amp/'],
  ['Deccan Chronicle', '2025-04-25', 'Bharat Summit – Fake Content Weopanization a Cause for Concern', 'https://www.deccanchronicle.com/amp/southern-states/telangana/bharat-summit-fake-content-weopanization-a-cause-for-concern-1875119'],
  ['The New Indian Express', '2025-04-25', 'Digvijaya Singh slams tech companies for controlling narratives; spreading disinformation at Bharat Summit 2025', 'https://www.newindianexpress.com/states/telangana/2025/Apr/26/digvijaya-singh-slams-tech-companies-for-controlling-narratives-spreading-disinformation-at-bharat-summit-2025'],
  ['The New Indian Express', '2025-04-15', 'Telangana to host Bharat Summit-2025 on April 25', 'https://www.newindianexpress.com/states/telangana/2025/Apr/15/telangana-to-host-bharat-summit-2025-on-april-25'],
  ['The New Indian Express', '2025-04-25', 'Hyderabad to host Bharat Summit 2025 with global leaders; focus on peace, climate challenge, gender equity', 'https://www.newindianexpress.com/states/telangana/2025/Apr/25/hyderabad-to-host-bharat-summit-2025-with-global-leaders-focus-on-peace-climate-challenge-gender-equity'],
  ['Hindustan', '2025-04-25', 'गांव से ग्लोबल तक महिला की भूमिका होगी सशक्त: दीपिका', 'https://www.livehindustan.com/jharkhand/ranchi/story-india-summit-2025-empowering-women-leadership-and-inclusivity-in-telangana-201745596100849.html'],
  ['Deccan Herald', '2025-04-25', 'In the era of rampant misinformation, leaders call for strong cyber laws at Bharat Summit', 'https://www.deccanherald.com/india/telangana/in-the-era-of-rampant-misinformation-leaders-call-for-strong-cyber-laws-at-bharat-summit-3511068'],
  // listed as Eenadu in the report, but its link is this Sakshi photo gallery
  ['Sakshi', '2025-04-26', 'Bharat Summit 2025 begins in Hyderabad (photos)', 'https://www.sakshi.com/photos/news/bharat-summit-2025-begins-hyderabad-photos-2434135'],
  ['South First', '2025-04-24', '450 delegates, 100 Countries; Hyderabad to host Bharat Summit 2025 with focus on justice and pluralism', 'https://thesouthfirst.com/politics/450-delegates-100-countries-hyderabad-to-host-bharat-summit-2025-with-focus-on-justice-and-pluralism/'],
  ['Outlook India', '2025-04-24', 'Bharat Summit 2025 A Defining Moment For Telangana: CM Revanth', 'https://www.outlookindia.com/announcements/bharat-summit-2025-a-defining-moment-for-telangana-cm-revanth'],
  ['Siasat.com', '2025-04-15', 'Telangana govt announces Bharat Summit 2025 in Hyderabad', 'https://www.siasat.com/telangana-govt-announces-bharat-summit-2025-in-hyderabad-3207486/'],
  ['Telugu360', '2025-04-25', 'Bharat Summit 2025 All Set to Begin in Hyderabad', 'https://www.telugu360.com/bharat-summit-2025-all-set-to-begin-in-hyderabad/'],
  ['India Today', '2025-04-26', 'Some years ago, we in Congress party felt completely trapped...: Rahul Gandhi', 'https://www.indiatoday.in/india/story/rahul-gandhi-congress-party-felt-completely-trapped-bharat-summit-2715598-2025-04-26'],
  ['The Times of India', '2025-04-27', 'Uttam warns against assault on liberal values at Bharat Summit', 'https://timesofindia.indiatimes.com/city/hyderabad/uttam-warns-against-assault-on-liberal-values-at-bharat-summit/articleshow/120652504.cms'],
  ['Hindustan Times', '2025-04-26', 'Democratic politics have fundamentally changed globally, says Rahul Gandhi', 'https://www.hindustantimes.com/india-news/democratic-politics-have-fundamentally-changed-globally-says-rahul-gandhi-101745673737277.html'],
  ['CNBC-TV18', '2025-04-26', 'Bharat Summit passes Hyderabad resolution on global issues', 'https://www.cnbctv18.com/india/bharat-summit-passes-hyderabad-resolution-on-global-issues-19595044.htm'],
  ['ABP Live', '2025-04-26', 'Congress Felt ‘Trapped And Isolated’: Rahul Gandhi Recalls Shift To ‘New Aggressive Politics’', 'https://news.abplive.com/news/india/congress-felt-trapped-and-isolated-rahul-gandhi-recalls-shift-to-new-aggressive-politics-video-1768146'],
  ['South First', '2025-04-27', '‘The opponents have a monopoly over money, media, hate, anger’: Rahul Gandhi cautions at Bharat Summit 2025', 'https://thesouthfirst.com/news/the-opponents-have-a-monopoly-over-money-media-hate-anger-rahul-gandhi-cautions-at-bharat-summit-2025/'],
  ['South First', '2025-04-26', 'From New Zealand to Telangana: Young leaders call for youth in politics at Bharat Summit 2025', 'https://thesouthfirst.com/telangana/from-new-zealand-to-telangana-young-leaders-call-for-youth-in-politics-at-bharat-summit-2025/'],
  ['South First', '2025-04-26', 'Bharat Summit-2025: Digvijaya Singh warns of eroding democracy in digital disinformation age', 'https://thesouthfirst.com/news/bharat-summit-2025-digvijaya-singh-warns-of-eroding-democracy-in-digital-disinformation-age/'],
  ['South First', '2025-04-27', 'Challenges in funding and transition: Global leaders talk climate justice at Bharat Summit 2025', 'https://thesouthfirst.com/telangana/challenges-in-funding-and-transition-global-leaders-talk-climate-justice-at-bharat-summit-2025/'],
  ['South First', '2025-04-26', 'Different countries, same fight: Global leaders demand change at Bharat Summit 2025', 'https://thesouthfirst.com/telangana/different-countries-same-fight-global-leaders-demand-change-at-bharat-summit-2025/'],
  ['The New Indian Express', '2025-04-27', 'Old politics is dead, a new one must be constructed, says Rahul Gandhi at Bharat Summit', 'https://www.newindianexpress.com/nation/2025/Apr/26/democratic-politics-have-fundamentally-changed-globally-says-rahul-gandhi-2'],
  ['The New Indian Express', '2025-04-27', 'Bharat Summit 2025 stresses pluralism, diversity, respect to counter polarisation', 'https://www.newindianexpress.com/states/telangana/2025/Apr/27/bharat-summit-2025-stresses-pluralism-diversity-respect-to-counter-polarisation'],
  ['Hindustan Times', '2025-04-27', 'Democratic politics have changed globally: Rahul Gandhi', 'https://www.hindustantimes.com/india-news/democratic-politics-have-changed-globally-rahul-gandhi-101745692981456.html'],
  ['Onmanorama', '2025-04-27', 'Democratic politics have undergone global shift, says Rahul Gandhi', 'https://www.onmanorama.com/news/india/2025/04/26/rahul-gandhi-bharat-summit-2025.html'],
  ['PressReader', '2025-04-27', 'Be ambassadors of Telangana’s greatness: CM at Bharat Summit', 'https://www.pressreader.com/india/the-hindu-hyderabad-9WW7/20250427/281672555805636'],
  ['Andhra Jyothy', '2025-04-27', 'Bharat Summit 2025: ఉగ్రవాదం ఏ రూపంలో ఉన్నా ఖండిస్తాం', 'https://www.andhrajyothy.com/2025/telangana/bharat-summit-2025-condemns-terrorism-and-advocates-peace-democracy-and-justice-1397749.html'],
  ['PTI', '2025-04-26', 'Democratic politics have fundamentally changed globally, says Rahul Gandhi', 'https://www.ptinews.com/story/national/democratic-politics-have-fundamentally-changed-globally-says-rahul-gandhi/2501401'],
  ['Sakshi', '2025-04-27', 'కొత్త నాయకత్వం కావాలి: రాహుల్ గాంధీ', 'https://www.sakshi.com/telugu-news/politics/congress-party-leader-rahul-gandhi-bharat-summit-2025-2434950'],
  ['News18 Telugu', '2025-04-27', 'భారత్ సమ్మిట్‌లో రాహుల్ గాంధీ', 'https://telugu.news18.com/videos/national-international/rahul-gandhi-2778120.html'],
]

// Newest first
export const ARTICLES = ROWS
  .map(([publication, date, title, url]) => ({ publication, date, title, url }))
  .sort((a, b) => b.date.localeCompare(a.date))
