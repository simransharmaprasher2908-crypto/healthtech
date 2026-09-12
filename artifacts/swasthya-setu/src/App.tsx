import { type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Activity,
  Ambulance,
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Cross,
  FileText,
  HeartPulse,
  Hospital,
  Locate,
  LocateFixed,
  LoaderCircle,
  MapPinned,
  MapPin,
  Navigation,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();

type Language = 'hi' | 'en' | 'mr' | 'bn' | 'te' | 'ta';
type Section = 'home' | 'search' | 'hospitals' | 'doctors' | 'profile';

type AppointmentConfirmation = {
  id: string;
  doctor: string;
  facility: string;
  date: string;
  time: string;
  demo: boolean;
};

type Copy = {
  brand: string;
  government: string;
  home: string;
  search: string;
  hospitals: string;
  doctors: string;
  profile: string;
  emergency: string;
  heroTitle: string;
  heroBody: string;
  findCare: string;
  emergencyHelp: string;
  quickServices: string;
  nearby: string;
  nearbyBody: string;
  verified: string;
  verifiedBody: string;
  trusted: string;
  trustedBody: string;
  searchTitle: string;
  searchBody: string;
  askAnything: string;
  askAnythingBody: string;
  askPlaceholder: string;
  ask: string;
  aiAnswer: string;
  aiDisclaimer: string;
  aiUnavailable: string;
  asking: string;
  detectLocation: string;
  detectingLocation: string;
  locationDetected: string;
  locationDenied: string;
  mapTitle: string;
  openMap: string;
  searchPlaceholder: string;
  searchButton: string;
  all: string;
  hospitalsOnly: string;
  doctorsOnly: string;
  hospitalsTitle: string;
  hospitalsBody: string;
  doctorsTitle: string;
  doctorsBody: string;
  profileTitle: string;
  profileBody: string;
  guest: string;
  preferences: string;
  notifications: string;
  notificationsBody: string;
  location: string;
  locationBody: string;
  language: string;
  languageBody: string;
  available: string;
  closed: string;
  openNow: string;
  viewDetails: string;
  directions: string;
  call: string;
  results: string;
  noResults: string;
  noResultsBody: string;
  clearSearch: string;
  emergencyTitle: string;
  emergencyBody: string;
  emergencyNumber: string;
  close: string;
  ambulanceReady: string;
  services: string;
  findHospitals: string;
  findDoctors: string;
  healthDocuments: string;
  healthDocumentsBody: string;
  healthTips: string;
  healthTipsBody: string;
  publicService: string;
  selectLanguage: string;
  enabled: string;
  disabled: string;
};

const copy: Record<Language, Copy> = {
  hi: {
    brand: 'स्वास्थ्य सेतु',
    government: 'सार्वजनिक स्वास्थ्य सेवा',
    home: 'होम',
    search: 'खोजें',
    hospitals: 'अस्पताल',
    doctors: 'डॉक्टर',
    profile: 'प्रोफ़ाइल',
    emergency: 'आपातकालीन सहायता',
    heroTitle: 'आपके स्वास्थ्य की सही जानकारी, एक जगह',
    heroBody: 'अपने पास अस्पताल और डॉक्टर खोजें। सरकारी स्वास्थ्य सेवाओं तक सरल और भरोसेमंद पहुँच।',
    findCare: 'देखभाल खोजें',
    emergencyHelp: 'आपातकालीन सहायता',
    quickServices: 'त्वरित सेवाएँ',
    nearby: 'आपके पास उपलब्ध सेवाएँ',
    nearbyBody: 'स्थान की अनुमति देकर आसपास की स्वास्थ्य सेवाएँ देखें।',
    verified: 'सत्यापित जानकारी',
    verifiedBody: 'अस्पताल और डॉक्टर की जानकारी भरोसेमंद स्रोतों से।',
    trusted: 'सुरक्षित और सरल',
    trustedBody: 'आपकी जानकारी आपके नियंत्रण में है।',
    searchTitle: 'स्वास्थ्य सेवा खोजें',
    searchBody: 'अस्पताल, डॉक्टर या स्वास्थ्य सेवा का नाम खोजें।',
    askAnything: 'स्वास्थ्य से जुड़ा कोई भी सवाल पूछें',
    askAnythingBody: 'सरल भाषा में सवाल लिखें। स्वास्थ्य सहायक उपयोगी जानकारी देगा।',
    askPlaceholder: 'जैसे: बुखार में कब डॉक्टर से मिलना चाहिए?',
    ask: 'सवाल पूछें',
    aiAnswer: 'स्वास्थ्य सहायक का जवाब',
    aiDisclaimer: 'यह सामान्य जानकारी है, डॉक्टर की सलाह का विकल्प नहीं। आपात स्थिति में 112 पर कॉल करें।',
    aiUnavailable: 'अभी जवाब नहीं मिल सका। कृपया थोड़ी देर बाद फिर कोशिश करें।',
    asking: 'जवाब तैयार हो रहा है…',
    detectLocation: 'मेरा स्थान पहचानें',
    detectingLocation: 'स्थान खोजा जा रहा है…',
    locationDetected: 'आपका स्थान दिखाया जा रहा है',
    locationDenied: 'स्थान की अनुमति नहीं मिली। आप ब्राउज़र सेटिंग्स में अनुमति दे सकते हैं।',
    mapTitle: 'OpenStreetMap पर आपके पास की सेवाएँ',
    openMap: 'OpenStreetMap में खोलें',
    searchPlaceholder: 'अस्पताल, डॉक्टर या सेवा खोजें',
    searchButton: 'खोजें',
    all: 'सभी',
    hospitalsOnly: 'अस्पताल',
    doctorsOnly: 'डॉक्टर',
    hospitalsTitle: 'अस्पताल खोजें',
    hospitalsBody: 'सरकारी और मान्यता प्राप्त अस्पतालों की जानकारी।',
    doctorsTitle: 'डॉक्टर खोजें',
    doctorsBody: 'विशेषज्ञता और स्थान के अनुसार डॉक्टर खोजें।',
    profileTitle: 'प्रोफ़ाइल और प्राथमिकताएँ',
    profileBody: 'अपनी भाषा और सेवा प्राथमिकताएँ नियंत्रित करें।',
    guest: 'अतिथि उपयोगकर्ता',
    preferences: 'सेवा प्राथमिकताएँ',
    notifications: 'स्वास्थ्य सूचनाएँ',
    notificationsBody: 'महत्वपूर्ण स्वास्थ्य सेवा अपडेट पाएँ।',
    location: 'स्थान सेवाएँ',
    locationBody: 'आपके पास की सेवाएँ दिखाने में मदद करता है।',
    language: 'भाषा',
    languageBody: 'ऐप की भाषा चुनें।',
    available: 'उपलब्ध',
    closed: 'बंद',
    openNow: 'अभी खुला है',
    viewDetails: 'विवरण देखें',
    directions: 'दिशा',
    call: 'कॉल',
    results: 'परिणाम',
    noResults: 'कोई परिणाम नहीं मिला',
    noResultsBody: 'कोई दूसरा नाम या सेवा खोजकर देखें।',
    clearSearch: 'खोज साफ़ करें',
    emergencyTitle: 'आपातकालीन सहायता',
    emergencyBody: 'यदि यह तुरंत होने वाली आपात स्थिति है, तो राष्ट्रीय आपातकालीन नंबर पर संपर्क करें।',
    emergencyNumber: '112',
    close: 'बंद करें',
    ambulanceReady: 'आपातकालीन सहायता के लिए 112 उपलब्ध है।',
    services: 'सेवाएँ',
    findHospitals: 'अस्पताल खोजें',
    findDoctors: 'डॉक्टर खोजें',
    healthDocuments: 'स्वास्थ्य दस्तावेज़',
    healthDocumentsBody: 'अपनी ज़रूरी स्वास्थ्य जानकारी व्यवस्थित रखें।',
    healthTips: 'स्वास्थ्य जानकारी',
    healthTipsBody: 'विश्वसनीय स्वास्थ्य जानकारी और सरकारी संसाधन।',
    publicService: 'भारत सरकार की सार्वजनिक सेवा',
    selectLanguage: 'भाषा चुनें',
    enabled: 'चालू',
    disabled: 'बंद',
  },
  en: {
    brand: 'Swasthya Setu',
    government: 'Public Health Service',
    home: 'Home',
    search: 'Search',
    hospitals: 'Hospitals',
    doctors: 'Doctors',
    profile: 'Profile',
    emergency: 'Emergency',
    heroTitle: 'The right health information, in one place',
    heroBody: 'Find hospitals and doctors near you. Simple, trusted access to public health services.',
    findCare: 'Find care',
    emergencyHelp: 'Emergency help',
    quickServices: 'Quick services',
    nearby: 'Services near you',
    nearbyBody: 'Allow location access to see health services around you.',
    verified: 'Verified information',
    verifiedBody: 'Hospital and doctor details from trusted sources.',
    trusted: 'Safe and simple',
    trustedBody: 'Your information stays under your control.',
    searchTitle: 'Search health services',
    searchBody: 'Search for a hospital, doctor or health service.',
    askAnything: 'Ask any health question',
    askAnythingBody: 'Write a question in simple language. The health assistant will share useful information.',
    askPlaceholder: 'For example: When should I see a doctor for a fever?',
    ask: 'Ask the assistant',
    aiAnswer: 'Health assistant answer',
    aiDisclaimer: 'General information only, not a substitute for medical advice. Call 112 in an emergency.',
    aiUnavailable: 'The assistant is unavailable right now. Please try again in a moment.',
    asking: 'Preparing an answer…',
    detectLocation: 'Detect my location',
    detectingLocation: 'Finding your location…',
    locationDetected: 'Showing your location',
    locationDenied: 'Location permission was not available. You can allow it in your browser settings.',
    mapTitle: 'Nearby services on OpenStreetMap',
    openMap: 'Open in OpenStreetMap',
    searchPlaceholder: 'Search hospital, doctor or service',
    searchButton: 'Search',
    all: 'All',
    hospitalsOnly: 'Hospitals',
    doctorsOnly: 'Doctors',
    hospitalsTitle: 'Find hospitals',
    hospitalsBody: 'Information for public and accredited hospitals.',
    doctorsTitle: 'Find doctors',
    doctorsBody: 'Find doctors by specialty and location.',
    profileTitle: 'Profile and preferences',
    profileBody: 'Control your language and service preferences.',
    guest: 'Guest user',
    preferences: 'Service preferences',
    notifications: 'Health notifications',
    notificationsBody: 'Receive important public health updates.',
    location: 'Location services',
    locationBody: 'Helps show services near you.',
    language: 'Language',
    languageBody: 'Choose your interface language.',
    available: 'Available',
    closed: 'Closed',
    openNow: 'Open now',
    viewDetails: 'View details',
    directions: 'Directions',
    call: 'Call',
    results: 'results',
    noResults: 'No results found',
    noResultsBody: 'Try searching for another name or service.',
    clearSearch: 'Clear search',
    emergencyTitle: 'Emergency help',
    emergencyBody: 'If this is an immediate emergency, contact the national emergency number.',
    emergencyNumber: '112',
    close: 'Close',
    ambulanceReady: '112 is available for emergency assistance.',
    services: 'Services',
    findHospitals: 'Find hospitals',
    findDoctors: 'Find doctors',
    healthDocuments: 'Health documents',
    healthDocumentsBody: 'Keep your important health information organised.',
    healthTips: 'Health information',
    healthTipsBody: 'Reliable health information and public resources.',
    publicService: 'A Government of India public service',
    selectLanguage: 'Select language',
    enabled: 'On',
    disabled: 'Off',
  },
  mr: {
    brand: 'स्वास्थ्य सेतू',
    government: 'सार्वजनिक आरोग्य सेवा',
    home: 'मुख्यपृष्ठ',
    search: 'शोधा',
    hospitals: 'रुग्णालये',
    doctors: 'डॉक्टर',
    profile: 'प्रोफाइल',
    emergency: 'आपत्कालीन मदत',
    heroTitle: 'तुमच्या आरोग्याची योग्य माहिती, एकाच ठिकाणी',
    heroBody: 'तुमच्या जवळील रुग्णालये आणि डॉक्टर शोधा. सार्वजनिक आरोग्य सेवांपर्यंत सोपा आणि विश्वासार्ह प्रवेश.',
    findCare: 'उपचार शोधा',
    emergencyHelp: 'आपत्कालीन मदत',
    quickServices: 'जलद सेवा',
    nearby: 'तुमच्या जवळील सेवा',
    nearbyBody: 'आजूबाजूच्या आरोग्य सेवा पाहण्यासाठी स्थानाची परवानगी द्या.',
    verified: 'पडताळलेली माहिती',
    verifiedBody: 'रुग्णालये आणि डॉक्टरांची माहिती विश्वासार्ह स्रोतांकडून.',
    trusted: 'सुरक्षित आणि सोपे',
    trustedBody: 'तुमची माहिती तुमच्या नियंत्रणात राहते.',
    searchTitle: 'आरोग्य सेवा शोधा',
    searchBody: 'रुग्णालय, डॉक्टर किंवा आरोग्य सेवेचे नाव शोधा.',
    askAnything: 'आरोग्याशी संबंधित कोणताही प्रश्न विचारा',
    askAnythingBody: 'सोप्या भाषेत प्रश्न लिहा. आरोग्य सहाय्यक उपयुक्त माहिती देईल.',
    askPlaceholder: 'उदा.: ताप असल्यास डॉक्टरांना कधी भेटावे?',
    ask: 'प्रश्न विचारा',
    aiAnswer: 'आरोग्य सहाय्यकाचे उत्तर',
    aiDisclaimer: 'ही सामान्य माहिती आहे, डॉक्टरांच्या सल्ल्याचा पर्याय नाही. आपत्कालीन स्थितीत 112 वर कॉल करा.',
    aiUnavailable: 'आत्ता उत्तर मिळू शकले नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.',
    asking: 'उत्तर तयार होत आहे…',
    detectLocation: 'माझे स्थान ओळखा',
    detectingLocation: 'स्थान शोधत आहे…',
    locationDetected: 'तुमचे स्थान दाखवत आहे',
    locationDenied: 'स्थानाची परवानगी मिळाली नाही. ब्राउझर सेटिंग्जमध्ये परवानगी देऊ शकता.',
    mapTitle: 'OpenStreetMap वर तुमच्या जवळील सेवा',
    openMap: 'OpenStreetMap मध्ये उघडा',
    searchPlaceholder: 'रुग्णालय, डॉक्टर किंवा सेवा शोधा',
    searchButton: 'शोधा',
    all: 'सर्व',
    hospitalsOnly: 'रुग्णालये',
    doctorsOnly: 'डॉक्टर',
    hospitalsTitle: 'रुग्णालये शोधा',
    hospitalsBody: 'सरकारी आणि मान्यताप्राप्त रुग्णालयांची माहिती.',
    doctorsTitle: 'डॉक्टर शोधा',
    doctorsBody: 'तज्ज्ञता आणि ठिकाणानुसार डॉक्टर शोधा.',
    profileTitle: 'प्रोफाइल आणि पसंती',
    profileBody: 'तुमची भाषा आणि सेवा पसंती नियंत्रित करा.',
    guest: 'अतिथी वापरकर्ता',
    preferences: 'सेवा पसंती',
    notifications: 'आरोग्य सूचना',
    notificationsBody: 'महत्त्वाचे सार्वजनिक आरोग्य अपडेट मिळवा.',
    location: 'स्थान सेवा',
    locationBody: 'तुमच्या जवळील सेवा दाखवण्यास मदत करते.',
    language: 'भाषा',
    languageBody: 'इंटरफेसची भाषा निवडा.',
    available: 'उपलब्ध',
    closed: 'बंद',
    openNow: 'आत्ता खुले',
    viewDetails: 'तपशील पहा',
    directions: 'दिशा',
    call: 'कॉल',
    results: 'निकाल',
    noResults: 'कोणताही निकाल सापडला नाही',
    noResultsBody: 'दुसरे नाव किंवा सेवा शोधून पहा.',
    clearSearch: 'शोध पुसा',
    emergencyTitle: 'आपत्कालीन मदत',
    emergencyBody: 'ही तातडीची आपत्कालीन परिस्थिती असल्यास राष्ट्रीय आपत्कालीन क्रमांकावर संपर्क करा.',
    emergencyNumber: '112',
    close: 'बंद करा',
    ambulanceReady: 'आपत्कालीन मदतीसाठी 112 उपलब्ध आहे.',
    services: 'सेवा',
    findHospitals: 'रुग्णालये शोधा',
    findDoctors: 'डॉक्टर शोधा',
    healthDocuments: 'आरोग्य कागदपत्रे',
    healthDocumentsBody: 'तुमची महत्त्वाची आरोग्य माहिती व्यवस्थित ठेवा.',
    healthTips: 'आरोग्य माहिती',
    healthTipsBody: 'विश्वसनीय आरोग्य माहिती आणि सार्वजनिक साधने.',
    publicService: 'भारत सरकारची सार्वजनिक सेवा',
    selectLanguage: 'भाषा निवडा',
    enabled: 'सुरू',
    disabled: 'बंद',
  },
  bn: {
    brand: 'স্বাস্থ্য সেতু',
    government: 'জনস্বাস্থ্য পরিষেবা',
    home: 'হোম',
    search: 'খুঁজুন',
    hospitals: 'হাসপাতাল',
    doctors: 'ডাক্তার',
    profile: 'প্রোফাইল',
    emergency: 'জরুরি সহায়তা',
    heroTitle: 'আপনার স্বাস্থ্যের সঠিক তথ্য, এক জায়গায়',
    heroBody: 'আপনার কাছের হাসপাতাল ও ডাক্তার খুঁজুন। সরকারি স্বাস্থ্য পরিষেবায় সহজ ও বিশ্বস্ত প্রবেশ।',
    findCare: 'চিকিৎসা খুঁজুন',
    emergencyHelp: 'জরুরি সহায়তা',
    quickServices: 'দ্রুত পরিষেবা',
    nearby: 'আপনার কাছের পরিষেবা',
    nearbyBody: 'আশেপাশের স্বাস্থ্য পরিষেবা দেখতে অবস্থানের অনুমতি দিন।',
    verified: 'যাচাই করা তথ্য',
    verifiedBody: 'বিশ্বস্ত উৎস থেকে হাসপাতাল ও ডাক্তারের বিবরণ।',
    trusted: 'নিরাপদ ও সহজ',
    trustedBody: 'আপনার তথ্য আপনার নিয়ন্ত্রণে থাকে।',
    searchTitle: 'স্বাস্থ্য পরিষেবা খুঁজুন',
    searchBody: 'হাসপাতাল, ডাক্তার বা স্বাস্থ্য পরিষেবার নাম খুঁজুন।',
    askAnything: 'যেকোনও স্বাস্থ্য প্রশ্ন জিজ্ঞাসা করুন',
    askAnythingBody: 'সহজ ভাষায় প্রশ্ন লিখুন। স্বাস্থ্য সহায়ক দরকারি তথ্য দেবে।',
    askPlaceholder: 'যেমন: জ্বর হলে কখন ডাক্তারের কাছে যাব?',
    ask: 'সহায়ককে জিজ্ঞাসা করুন',
    aiAnswer: 'স্বাস্থ্য সহায়কের উত্তর',
    aiDisclaimer: 'এটি সাধারণ তথ্য, চিকিৎসকের পরামর্শের বিকল্প নয়। জরুরি অবস্থায় 112-এ কল করুন।',
    aiUnavailable: 'এই মুহূর্তে উত্তর পাওয়া যায়নি। একটু পরে আবার চেষ্টা করুন।',
    asking: 'উত্তর তৈরি হচ্ছে…',
    detectLocation: 'আমার অবস্থান শনাক্ত করুন',
    detectingLocation: 'আপনার অবস্থান খোঁজা হচ্ছে…',
    locationDetected: 'আপনার অবস্থান দেখানো হচ্ছে',
    locationDenied: 'অবস্থানের অনুমতি পাওয়া যায়নি। ব্রাউজার সেটিংসে অনুমতি দিতে পারেন।',
    mapTitle: 'OpenStreetMap-এ আপনার কাছের পরিষেবা',
    openMap: 'OpenStreetMap-এ খুলুন',
    searchPlaceholder: 'হাসপাতাল, ডাক্তার বা পরিষেবা খুঁজুন',
    searchButton: 'খুঁজুন',
    all: 'সব',
    hospitalsOnly: 'হাসপাতাল',
    doctorsOnly: 'ডাক্তার',
    hospitalsTitle: 'হাসপাতাল খুঁজুন',
    hospitalsBody: 'সরকারি ও অনুমোদিত হাসপাতালের তথ্য।',
    doctorsTitle: 'ডাক্তার খুঁজুন',
    doctorsBody: 'বিশেষত্ব ও অবস্থান অনুযায়ী ডাক্তার খুঁজুন।',
    profileTitle: 'প্রোফাইল ও পছন্দ',
    profileBody: 'আপনার ভাষা ও পরিষেবার পছন্দ নিয়ন্ত্রণ করুন।',
    guest: 'অতিথি ব্যবহারকারী',
    preferences: 'পরিষেবার পছন্দ',
    notifications: 'স্বাস্থ্য বিজ্ঞপ্তি',
    notificationsBody: 'গুরুত্বপূর্ণ জনস্বাস্থ্য আপডেট পান।',
    location: 'অবস্থান পরিষেবা',
    locationBody: 'আপনার কাছের পরিষেবা দেখাতে সাহায্য করে।',
    language: 'ভাষা',
    languageBody: 'ইন্টারফেসের ভাষা বেছে নিন।',
    available: 'উপলব্ধ',
    closed: 'বন্ধ',
    openNow: 'এখন খোলা',
    viewDetails: 'বিবরণ দেখুন',
    directions: 'দিকনির্দেশ',
    call: 'কল',
    results: 'ফলাফল',
    noResults: 'কোনও ফলাফল পাওয়া যায়নি',
    noResultsBody: 'অন্য নাম বা পরিষেবা দিয়ে চেষ্টা করুন।',
    clearSearch: 'অনুসন্ধান মুছুন',
    emergencyTitle: 'জরুরি সহায়তা',
    emergencyBody: 'এটি তাৎক্ষণিক জরুরি অবস্থা হলে জাতীয় জরুরি নম্বরে যোগাযোগ করুন।',
    emergencyNumber: '112',
    close: 'বন্ধ করুন',
    ambulanceReady: 'জরুরি সহায়তার জন্য 112 উপলব্ধ।',
    services: 'পরিষেবা',
    findHospitals: 'হাসপাতাল খুঁজুন',
    findDoctors: 'ডাক্তার খুঁজুন',
    healthDocuments: 'স্বাস্থ্য নথি',
    healthDocumentsBody: 'গুরুত্বপূর্ণ স্বাস্থ্য তথ্য গুছিয়ে রাখুন।',
    healthTips: 'স্বাস্থ্য তথ্য',
    healthTipsBody: 'বিশ্বস্ত স্বাস্থ্য তথ্য ও সরকারি সংস্থান।',
    publicService: 'ভারত সরকারের জনসেবা',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    enabled: 'চালু',
    disabled: 'বন্ধ',
  },
  te: {
    brand: 'స్వాస్థ్య సేతు',
    government: 'ప్రజా ఆరోగ్య సేవ',
    home: 'హోమ్',
    search: 'వెతకండి',
    hospitals: 'ఆసుపత్రులు',
    doctors: 'వైద్యులు',
    profile: 'ప్రొఫైల్',
    emergency: 'అత్యవసర సహాయం',
    heroTitle: 'మీ ఆరోగ్యానికి సరైన సమాచారం, ఒకే చోట',
    heroBody: 'మీ దగ్గరలోని ఆసుపత్రులు, వైద్యులను కనుగొనండి. ప్రజా ఆరోగ్య సేవలకు సులభమైన, నమ్మదగిన ప్రవేశం.',
    findCare: 'చికిత్సను కనుగొనండి',
    emergencyHelp: 'అత్యవసర సహాయం',
    quickServices: 'త్వరిత సేవలు',
    nearby: 'మీ దగ్గరలోని సేవలు',
    nearbyBody: 'చుట్టుపక్కల ఆరోగ్య సేవలను చూడటానికి స్థాన అనుమతిని ఇవ్వండి.',
    verified: 'ధృవీకరించిన సమాచారం',
    verifiedBody: 'నమ్మదగిన వనరుల నుండి ఆసుపత్రి, వైద్యుల వివరాలు.',
    trusted: 'సురక్షితం మరియు సులభం',
    trustedBody: 'మీ సమాచారం మీ నియంత్రణలో ఉంటుంది.',
    searchTitle: 'ఆరోగ్య సేవలను వెతకండి',
    searchBody: 'ఆసుపత్రి, వైద్యుడు లేదా ఆరోగ్య సేవ పేరు వెతకండి.',
    askAnything: 'ఏదైనా ఆరోగ్య ప్రశ్న అడగండి',
    askAnythingBody: 'సులభమైన భాషలో ప్రశ్న రాయండి. ఆరోగ్య సహాయకుడు ఉపయోగకరమైన సమాచారాన్ని అందిస్తాడు.',
    askPlaceholder: 'ఉదాహరణ: జ్వరం ఉంటే వైద్యుడిని ఎప్పుడు కలవాలి?',
    ask: 'సహాయకుడిని అడగండి',
    aiAnswer: 'ఆరోగ్య సహాయకుడి సమాధానం',
    aiDisclaimer: 'ఇది సాధారణ సమాచారం మాత్రమే, వైద్య సలహాకు ప్రత్యామ్నాయం కాదు. అత్యవసర పరిస్థితిలో 112కు కాల్ చేయండి.',
    aiUnavailable: 'ఇప్పుడు సమాధానం అందుబాటులో లేదు. కొద్దిసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.',
    asking: 'సమాధానం సిద్ధమవుతోంది…',
    detectLocation: 'నా స్థానాన్ని గుర్తించండి',
    detectingLocation: 'మీ స్థానాన్ని కనుగొంటోంది…',
    locationDetected: 'మీ స్థానాన్ని చూపిస్తోంది',
    locationDenied: 'స్థాన అనుమతి అందుబాటులో లేదు. బ్రౌజర్ సెట్టింగ్‌లలో అనుమతించవచ్చు.',
    mapTitle: 'OpenStreetMapలో మీ దగ్గరలోని సేవలు',
    openMap: 'OpenStreetMapలో తెరవండి',
    searchPlaceholder: 'ఆసుపత్రి, వైద్యుడు లేదా సేవను వెతకండి',
    searchButton: 'వెతకండి',
    all: 'అన్నీ',
    hospitalsOnly: 'ఆసుపత్రులు',
    doctorsOnly: 'వైద్యులు',
    hospitalsTitle: 'ఆసుపత్రులను కనుగొనండి',
    hospitalsBody: 'ప్రభుత్వ మరియు గుర్తింపు పొందిన ఆసుపత్రుల సమాచారం.',
    doctorsTitle: 'వైద్యులను కనుగొనండి',
    doctorsBody: 'నైపుణ్యం మరియు ప్రాంతం ఆధారంగా వైద్యులను కనుగొనండి.',
    profileTitle: 'ప్రొఫైల్ మరియు ప్రాధాన్యతలు',
    profileBody: 'మీ భాష, సేవా ప్రాధాన్యతలను నియంత్రించండి.',
    guest: 'అతిథి వినియోగదారు',
    preferences: 'సేవా ప్రాధాన్యతలు',
    notifications: 'ఆరోగ్య సమాచారం',
    notificationsBody: 'ముఖ్యమైన ప్రజా ఆరోగ్య నవీకరణలు పొందండి.',
    location: 'స్థాన సేవలు',
    locationBody: 'మీ దగ్గరలోని సేవలను చూపించడంలో సహాయపడుతుంది.',
    language: 'భాష',
    languageBody: 'ఇంటర్‌ఫేస్ భాషను ఎంచుకోండి.',
    available: 'అందుబాటులో ఉంది',
    closed: 'మూసివేయబడింది',
    openNow: 'ఇప్పుడు తెరిచి ఉంది',
    viewDetails: 'వివరాలు చూడండి',
    directions: 'దిశలు',
    call: 'కాల్',
    results: 'ఫలితాలు',
    noResults: 'ఫలితాలు కనబడలేదు',
    noResultsBody: 'మరొక పేరు లేదా సేవతో ప్రయత్నించండి.',
    clearSearch: 'వెతుకులాటను తొలగించండి',
    emergencyTitle: 'అత్యవసర సహాయం',
    emergencyBody: 'ఇది తక్షణ అత్యవసర పరిస్థితి అయితే జాతీయ అత్యవసర నంబర్‌ను సంప్రదించండి.',
    emergencyNumber: '112',
    close: 'మూసివేయండి',
    ambulanceReady: 'అత్యవసర సహాయం కోసం 112 అందుబాటులో ఉంది.',
    services: 'సేవలు',
    findHospitals: 'ఆసుపత్రులను కనుగొనండి',
    findDoctors: 'వైద్యులను కనుగొనండి',
    healthDocuments: 'ఆరోగ్య పత్రాలు',
    healthDocumentsBody: 'మీ ముఖ్యమైన ఆరోగ్య సమాచారాన్ని క్రమబద్ధంగా ఉంచండి.',
    healthTips: 'ఆరోగ్య సమాచారం',
    healthTipsBody: 'నమ్మదగిన ఆరోగ్య సమాచారం మరియు ప్రజా వనరులు.',
    publicService: 'భారత ప్రభుత్వ ప్రజా సేవ',
    selectLanguage: 'భాషను ఎంచుకోండి',
    enabled: 'ఆన్',
    disabled: 'ఆఫ్',
  },
  ta: {
    brand: 'ஸ்வாஸ்த்ய சேது',
    government: 'பொது சுகாதார சேவை',
    home: 'முகப்பு',
    search: 'தேடல்',
    hospitals: 'மருத்துவமனைகள்',
    doctors: 'மருத்துவர்கள்',
    profile: 'சுயவிவரம்',
    emergency: 'அவசர உதவி',
    heroTitle: 'உங்கள் ஆரோக்கியத்திற்கான சரியான தகவல், ஒரே இடத்தில்',
    heroBody: 'உங்களுக்கு அருகிலுள்ள மருத்துவமனைகள் மற்றும் மருத்துவர்களைக் கண்டறியுங்கள். பொது சுகாதார சேவைகளுக்கான எளிய, நம்பகமான அணுகல்.',
    findCare: 'சிகிச்சையைக் கண்டறியுங்கள்',
    emergencyHelp: 'அவசர உதவி',
    quickServices: 'விரைவு சேவைகள்',
    nearby: 'உங்களுக்கு அருகிலுள்ள சேவைகள்',
    nearbyBody: 'சுற்றியுள்ள சுகாதார சேவைகளைப் பார்க்க இருப்பிட அனுமதியை வழங்குங்கள்.',
    verified: 'சரிபார்க்கப்பட்ட தகவல்',
    verifiedBody: 'நம்பகமான ஆதாரங்களில் இருந்து மருத்துவமனை மற்றும் மருத்துவர் விவரங்கள்.',
    trusted: 'பாதுகாப்பானதும் எளிமையானதும்',
    trustedBody: 'உங்கள் தகவல் உங்கள் கட்டுப்பாட்டில் இருக்கும்.',
    searchTitle: 'சுகாதார சேவைகளைத் தேடுங்கள்',
    searchBody: 'மருத்துவமனை, மருத்துவர் அல்லது சுகாதார சேவையின் பெயரைத் தேடுங்கள்.',
    askAnything: 'எந்த சுகாதாரக் கேள்வியையும் கேளுங்கள்',
    askAnythingBody: 'எளிய மொழியில் கேள்வியை எழுதுங்கள். சுகாதார உதவியாளர் பயனுள்ள தகவலை வழங்குவார்.',
    askPlaceholder: 'எடுத்துக்காட்டு: காய்ச்சலுக்கு எப்போது மருத்துவரை சந்திக்க வேண்டும்?',
    ask: 'உதவியாளரிடம் கேளுங்கள்',
    aiAnswer: 'சுகாதார உதவியாளரின் பதில்',
    aiDisclaimer: 'இது பொதுவான தகவல் மட்டுமே, மருத்துவ ஆலோசனைக்கு மாற்றல்ல. அவசரநிலையில் 112-க்கு அழைக்கவும்.',
    aiUnavailable: 'இப்போது பதிலைப் பெற முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.',
    asking: 'பதில் தயாராகிறது…',
    detectLocation: 'எனது இருப்பிடத்தை கண்டறியவும்',
    detectingLocation: 'உங்கள் இருப்பிடம் கண்டறியப்படுகிறது…',
    locationDetected: 'உங்கள் இருப்பிடம் காட்டப்படுகிறது',
    locationDenied: 'இருப்பிட அனுமதி கிடைக்கவில்லை. உலாவி அமைப்புகளில் அனுமதிக்கலாம்.',
    mapTitle: 'OpenStreetMap-ல் உங்களுக்கு அருகிலுள்ள சேவைகள்',
    openMap: 'OpenStreetMap-ல் திறக்கவும்',
    searchPlaceholder: 'மருத்துவமனை, மருத்துவர் அல்லது சேவையைத் தேடுங்கள்',
    searchButton: 'தேடுங்கள்',
    all: 'அனைத்தும்',
    hospitalsOnly: 'மருத்துவமனைகள்',
    doctorsOnly: 'மருத்துவர்கள்',
    hospitalsTitle: 'மருத்துவமனைகளைக் கண்டறியுங்கள்',
    hospitalsBody: 'அரசு மற்றும் அங்கீகரிக்கப்பட்ட மருத்துவமனைகளின் தகவல்.',
    doctorsTitle: 'மருத்துவர்களைக் கண்டறியுங்கள்',
    doctorsBody: 'சிறப்பு மற்றும் இருப்பிடத்தின் அடிப்படையில் மருத்துவர்களைக் கண்டறியுங்கள்.',
    profileTitle: 'சுயவிவரம் மற்றும் விருப்பங்கள்',
    profileBody: 'உங்கள் மொழி மற்றும் சேவை விருப்பங்களைக் கட்டுப்படுத்துங்கள்.',
    guest: 'விருந்தினர் பயனர்',
    preferences: 'சேவை விருப்பங்கள்',
    notifications: 'சுகாதார அறிவிப்புகள்',
    notificationsBody: 'முக்கியமான பொது சுகாதார புதுப்பிப்புகளைப் பெறுங்கள்.',
    location: 'இருப்பிட சேவைகள்',
    locationBody: 'உங்களுக்கு அருகிலுள்ள சேவைகளைக் காட்ட உதவும்.',
    language: 'மொழி',
    languageBody: 'இடைமுக மொழியைத் தேர்ந்தெடுக்கவும்.',
    available: 'கிடைக்கும்',
    closed: 'மூடப்பட்டது',
    openNow: 'இப்போது திறந்துள்ளது',
    viewDetails: 'விவரங்களைக் காண்க',
    directions: 'வழிகள்',
    call: 'அழைப்பு',
    results: 'முடிவுகள்',
    noResults: 'முடிவுகள் எதுவும் இல்லை',
    noResultsBody: 'வேறு பெயர் அல்லது சேவையைத் தேடிப் பாருங்கள்.',
    clearSearch: 'தேடலை அழிக்கவும்',
    emergencyTitle: 'அவசர உதவி',
    emergencyBody: 'இது உடனடி அவசரநிலை என்றால் தேசிய அவசர எண்ணைத் தொடர்புகொள்ளுங்கள்.',
    emergencyNumber: '112',
    close: 'மூடுக',
    ambulanceReady: 'அவசர உதவிக்கு 112 கிடைக்கிறது.',
    services: 'சேவைகள்',
    findHospitals: 'மருத்துவமனைகளைக் கண்டறியுங்கள்',
    findDoctors: 'மருத்துவர்களைக் கண்டறியுங்கள்',
    healthDocuments: 'சுகாதார ஆவணங்கள்',
    healthDocumentsBody: 'உங்கள் முக்கியமான சுகாதாரத் தகவல்களை ஒழுங்காக வைத்திருங்கள்.',
    healthTips: 'சுகாதாரத் தகவல்',
    healthTipsBody: 'நம்பகமான சுகாதாரத் தகவல் மற்றும் பொது வளங்கள்.',
    publicService: 'இந்திய அரசின் பொது சேவை',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    enabled: 'இயக்கத்தில்',
    disabled: 'முடக்கப்பட்டுள்ளது',
  },
};

const languages: Array<{ value: Language; label: string }> = [
  { value: 'hi', label: 'हिन्दी' },
  { value: 'en', label: 'English' },
  { value: 'mr', label: 'मराठी' },
  { value: 'bn', label: 'বাংলা' },
  { value: 'te', label: 'తెలుగు' },
  { value: 'ta', label: 'தமிழ்' },
];

const hospitals = [
  { id: 'h1', name: 'Shri Balaji Aarogyam Hospital', type: 'Multi-specialty hospital', city: 'Kurukshetra, Haryana', distance: '1.8 km', status: 'open' },
  { id: 'h2', name: 'Shri Krishna AYUSH University', type: 'University health facility', city: 'Kurukshetra, Haryana', distance: '2.6 km', status: 'open' },
  { id: 'h3', name: 'Kurushetra Nursing Home', type: 'Nursing home', city: 'Kurukshetra, Haryana', distance: '3.1 km', status: 'open' },
  { id: 'h4', name: 'BS Heart Care and Multi Specialist', type: 'Cardiac and multi-specialty clinic', city: 'Kurukshetra, Haryana', distance: '4.2 km', status: 'open' },
  { id: 'h5', name: 'District Civil Hospital', type: 'General hospital', city: 'Pune, Maharashtra', distance: '2.4 km', status: 'open' },
  { id: 'h6', name: 'Safdarjung Government Hospital', type: 'Multi-specialty hospital', city: 'New Delhi', distance: '4.8 km', status: 'open' },
  { id: 'h7', name: 'KEM Hospital', type: 'Teaching hospital', city: 'Mumbai, Maharashtra', distance: '8.1 km', status: 'open' },
  { id: 'h8', name: 'B. J. Government Medical College', type: 'Medical college hospital', city: 'Ahmedabad, Gujarat', distance: '10.6 km', status: 'closed' },
];

const doctors = [
  { id: 'd1', name: 'Dr. Isha Goel', specialty: 'CT Scan and Ultrasound Specialist', city: 'Kurukshetra, Haryana', distance: '2.0 km', status: 'open' },
  { id: 'd2', name: 'Dr. Rajul Goel', specialty: 'Orthopedic Surgeon', city: 'Kurukshetra, Haryana', distance: '2.5 km', status: 'open' },
  { id: 'd3', name: 'Dr. Meera Kulkarni', specialty: 'General physician', city: 'Pune, Maharashtra', distance: '1.8 km', status: 'open' },
  { id: 'd4', name: 'Dr. Arjun Menon', specialty: 'Paediatrician', city: 'Bengaluru, Karnataka', distance: '3.2 km', status: 'open' },
  { id: 'd5', name: 'Dr. Farah Khan', specialty: 'Gynaecologist', city: 'New Delhi', distance: '5.4 km', status: 'open' },
  { id: 'd6', name: 'Dr. Raghav Rao', specialty: 'Cardiologist', city: 'Hyderabad, Telangana', distance: '7.1 km', status: 'closed' },
];

const appointmentSchedules: Record<string, { days: string; slots: string[] }> = {
  d1: { days: 'Monday, Wednesday, Friday', slots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'] },
  d2: { days: 'Tuesday, Thursday, Saturday', slots: ['09:30 AM', '11:00 AM', '03:00 PM', '05:30 PM'] },
  d3: { days: 'Monday to Friday', slots: ['10:00 AM', '12:00 PM', '03:30 PM'] },
  d4: { days: 'Monday, Wednesday, Saturday', slots: ['09:00 AM', '11:30 AM', '04:00 PM'] },
  d5: { days: 'Tuesday, Thursday, Friday', slots: ['10:30 AM', '01:00 PM', '03:30 PM'] },
  d6: { days: 'Monday, Thursday', slots: ['09:00 AM', '01:30 PM', '05:00 PM'] },
};

const getLocalDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

function AppointmentBooking({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const [facilityId, setFacilityId] = useState(hospitals[0].id);
  const [doctorId, setDoctorId] = useState(doctors[0].id);
  const [appointmentDate, setAppointmentDate] = useState(getLocalDate);
  const [appointmentTime, setAppointmentTime] = useState(appointmentSchedules[doctors[0].id].slots[0]);
  const [patientName, setPatientName] = useState('');
  const [reason, setReason] = useState('');
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<AppointmentConfirmation | null>(null);

  const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId) ?? doctors[0];
  const selectedFacility = hospitals.find((facility) => facility.id === facilityId) ?? hospitals[0];
  const schedule = appointmentSchedules[selectedDoctor.id];

  const handleDoctorChange = (nextDoctorId: string) => {
    setDoctorId(nextDoctorId);
    setAppointmentTime(appointmentSchedules[nextDoctorId].slots[0]);
    const doctor = doctors.find((item) => item.id === nextDoctorId);
    const facility = hospitals.find((item) => item.city === doctor?.city);
    if (facility) setFacilityId(facility.id);
    setError('');
  };

  const handleBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setConfirmation(null);
    if (!patientName.trim()) {
      setError('Please enter the patient name.');
      return;
    }

    setBooking(true);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const patientId = localStorage.getItem('patient_id') || sessionStorage.getItem('patient_id');
    const canUseApi = Boolean(token && patientId && /^\d+$/.test(patientId));

    try {
      if (canUseApi) {
        const response = await fetch('http://localhost:5000/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            patient_id: Number(patientId),
            doctor_id: Number(doctorId.replace(/\D/g, '')),
            facility_id: Number(facilityId.replace(/\D/g, '')),
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            reason: reason.trim() || null,
          }),
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message || 'Unable to book this appointment.');
        setConfirmation({ id: String(payload.appointment.id), doctor: selectedDoctor.name, facility: selectedFacility.name, date: appointmentDate, time: appointmentTime, demo: false });
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 500));
        setConfirmation({ id: `DEMO-${Date.now().toString().slice(-6)}`, doctor: selectedDoctor.name, facility: selectedFacility.name, date: appointmentDate, time: appointmentTime, demo: true });
      }
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : 'Unable to book this appointment.');
    } finally {
      setBooking(false);
    }
  };

  return (
    <section className="ss-appointment-section" aria-labelledby="appointment-title">
      <div className="ss-section-header">
        <div>
          <p className="ss-page-kicker">Care when you need it</p>
          <h2 id="appointment-title" className="ss-section-title">Book an Appointment</h2>
        </div>
        <button type="button" className="ss-button ss-button-outline ss-button-small" onClick={() => onNavigate('profile')}>My Appointments</button>
      </div>
      <div className="ss-appointment-card">
        <form className="ss-appointment-form" onSubmit={handleBooking}>
          <div className="ss-appointment-profile">
            <span className="ss-appointment-avatar"><UserRound size={24} aria-hidden="true" /></span>
            <div>
              <span className="ss-appointment-label">Doctor</span>
              <strong>{selectedDoctor.name}</strong>
              <span>{selectedDoctor.specialty}</span>
              <small>Available: {schedule.days}</small>
            </div>
          </div>
          <label className="ss-appointment-field">Facility
            <select value={facilityId} onChange={(event) => setFacilityId(event.target.value)}>
              {hospitals.map((facility) => <option key={facility.id} value={facility.id}>{facility.name}</option>)}
            </select>
          </label>
          <label className="ss-appointment-field">Doctor
            <select value={doctorId} onChange={(event) => handleDoctorChange(event.target.value)}>
              {doctors.filter((doctor) => doctor.status === 'open').map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name} - {doctor.specialty}</option>)}
            </select>
          </label>
          <label className="ss-appointment-field">Patient name
            <input value={patientName} onChange={(event) => setPatientName(event.target.value)} placeholder="Enter patient name" required />
          </label>
          <label className="ss-appointment-field">Appointment date
            <span className="ss-date-input"><CalendarDays size={17} aria-hidden="true" /><input type="date" min={getLocalDate()} value={appointmentDate} onChange={(event) => setAppointmentDate(event.target.value)} required /></span>
          </label>
          <div className="ss-appointment-field ss-time-field"><span>Available time slots</span>
            <div className="ss-time-slots">{schedule.slots.map((slot) => <button key={slot} type="button" className="ss-time-slot" data-selected={appointmentTime === slot} onClick={() => setAppointmentTime(slot)}>{slot}</button>)}</div>
          </div>
          <label className="ss-appointment-field ss-reason-field">Reason (optional)
            <input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Add a short reason for the visit" />
          </label>
          {error && <p className="ss-appointment-error" role="alert">{error}</p>}
          <button type="submit" className="ss-button ss-button-primary ss-book-button" disabled={booking}>{booking ? <><LoaderCircle size={17} className="ss-spin" aria-hidden="true" /> Booking...</> : <><CalendarDays size={17} aria-hidden="true" /> Book Appointment</>}</button>
        </form>
        {confirmation && <div className="ss-appointment-success" role="status">
          <CheckCircle2 size={22} aria-hidden="true" />
          <div><strong>Appointment booked successfully</strong>{confirmation.demo && <span className="ss-demo-note">Demo appointment - connect your patient account to save it to the backend.</span>}
            <dl><div><dt>Appointment ID</dt><dd>{confirmation.id}</dd></div><div><dt>Doctor</dt><dd>{confirmation.doctor}</dd></div><div><dt>Facility</dt><dd>{confirmation.facility}</dd></div><div><dt>Date and time</dt><dd>{confirmation.date} at {confirmation.time}</dd></div></dl>
            <button type="button" className="ss-button ss-button-outline ss-button-small" onClick={() => onNavigate('profile')}>View Appointment</button>
          </div>
        </div>}
      </div>
    </section>
  );
}

const navItems: Array<{ id: Section; icon: typeof HeartPulse; copyKey: keyof Copy }> = [
  { id: 'home', icon: HeartPulse, copyKey: 'home' },
  { id: 'search', icon: Search, copyKey: 'search' },
  { id: 'hospitals', icon: Hospital, copyKey: 'hospitals' },
  { id: 'doctors', icon: Stethoscope, copyKey: 'doctors' },
  { id: 'profile', icon: UserRound, copyKey: 'profile' },
];

function sectionFromPath(path: string): Section {
  const value = path.replace('/', '') as Section;
  return ['home', 'search', 'hospitals', 'doctors', 'profile'].includes(value) ? value : 'home';
}

function Header({
  activeSection,
  content,
  language,
  onNavigate,
  onLanguageChange,
  onEmergency,
}: {
  activeSection: Section;
  content: Copy;
  language: Language;
  onNavigate: (section: Section) => void;
  onLanguageChange: (language: Language) => void;
  onEmergency: () => void;
}) {
  return (
    <header className="ss-topbar">
      <div className="ss-container ss-topbar-inner">
        <button className="ss-brand" type="button" onClick={() => onNavigate('home')} data-testid="button-brand-home" aria-label={content.home}>
          <span className="ss-brand-mark" aria-hidden="true"><Cross size={25} strokeWidth={2.5} /></span>
          <span>
            <span className="ss-brand-name">{content.brand}</span>
            <span className="ss-brand-subtitle">{content.government}</span>
          </span>
        </button>
        <nav className="ss-desktop-nav" aria-label="Primary navigation">
          {navItems.map(({ id, icon: Icon, copyKey }) => (
            <button key={id} type="button" className="ss-nav-button" data-active={activeSection === id} onClick={() => onNavigate(id)} data-testid={`nav-${id}`}>
              <Icon size={16} aria-hidden="true" />
              {content[copyKey] as string}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="ss-language-wrap">
            <label className="sr-only" htmlFor="header-language">{content.selectLanguage}</label>
            <select id="header-language" className="ss-language" value={language} onChange={(event) => onLanguageChange(event.target.value as Language)} data-testid="select-language-header">
              {languages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
          <button type="button" className="ss-emergency-button" onClick={onEmergency} data-testid="button-emergency-header">
            <Ambulance size={17} aria-hidden="true" />
            <span className="hidden sm:inline">{content.emergency}</span>
            <span className="sm:hidden">{content.emergencyNumber}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function MobileNav({ activeSection, content, onNavigate }: { activeSection: Section; content: Copy; onNavigate: (section: Section) => void }) {
  return (
    <nav className="ss-mobile-nav" aria-label="Mobile navigation">
      {navItems.map(({ id, icon: Icon, copyKey }) => (
        <button key={id} type="button" data-active={activeSection === id} onClick={() => onNavigate(id)} data-testid={`mobile-nav-${id}`}>
          <Icon size={19} aria-hidden="true" />
          <span>{content[copyKey] as string}</span>
        </button>
      ))}
    </nav>
  );
}

function HomePage({ content, onNavigate, onEmergency }: { content: Copy; onNavigate: (section: Section) => void; onEmergency: () => void }) {
  const quickItems: Array<{ icon: typeof Hospital; label: string; caption: string; action: Section }> = [
    { icon: Hospital, label: content.findHospitals, caption: content.hospitalsBody, action: 'hospitals' },
    { icon: Stethoscope, label: content.findDoctors, caption: content.doctorsBody, action: 'doctors' },
    { icon: Search, label: content.search, caption: content.searchBody, action: 'search' },
    { icon: FileText, label: content.healthDocuments, caption: content.healthDocumentsBody, action: 'profile' },
  ];
  return (
    <div className="ss-home-page">
      <section className="ss-hero">
        <div className="ss-hero-content">
          <div className="ss-hero-badge">
            <ShieldCheck size={16} aria-hidden="true" /> {content.publicService}
          </div>
          <h1>{content.heroTitle}</h1>
          <p>{content.heroBody}</p>
          <div className="ss-hero-actions">
            <button type="button" className="ss-button ss-button-light" onClick={() => onNavigate('search')} data-testid="button-find-care">
              <Search size={17} aria-hidden="true" /> {content.findCare}
            </button>
            <button type="button" className="ss-button ss-button-danger" onClick={onEmergency} data-testid="button-emergency-hero">
              <Ambulance size={17} aria-hidden="true" /> {content.emergencyHelp}
            </button>
          </div>
        </div>
      </section>
      <AppointmentBooking onNavigate={onNavigate} />
      <section className="ss-section" aria-labelledby="quick-services-title">
        <div className="ss-section-header">
          <h2 id="quick-services-title" className="ss-section-title">{content.quickServices}</h2>
          <span className="ss-section-note">{content.services}</span>
        </div>
        <div className="ss-quick-grid">
          {quickItems.map(({ icon: Icon, label, caption, action }) => (
            <button key={label} type="button" className="ss-quick-card ss-transition" onClick={() => onNavigate(action)} data-testid={`quick-service-${action}`}>
              <span className="ss-quick-icon"><Icon size={19} aria-hidden="true" /></span>
              <span className="ss-quick-label">{label}</span>
              <span className="ss-quick-caption">{caption}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="ss-section" aria-labelledby="nearby-title">
        <div className="ss-section-header">
          <h2 id="nearby-title" className="ss-section-title">{content.nearby}</h2>
        </div>
        <div className="ss-info-grid">
          <article className="ss-card ss-info-card">
            <LocateFixed size={19} className="mb-3 text-[#005A9C]" aria-hidden="true" />
            <h3>{content.nearby}</h3>
            <p>{content.nearbyBody}</p>
            <button type="button" className="ss-button ss-button-outline ss-button-small mt-4" onClick={() => onNavigate('search')} data-testid="button-nearby-services">
              {content.searchButton} <ArrowRight size={14} aria-hidden="true" />
            </button>
          </article>
          <article className="ss-card ss-info-card">
            <CheckCircle2 size={19} className="mb-3 text-[#138808]" aria-hidden="true" />
            <h3>{content.verified}</h3>
            <p>{content.verifiedBody}</p>
          </article>
          <article className="ss-card ss-info-card">
            <ShieldCheck size={19} className="mb-3 text-[#005A9C]" aria-hidden="true" />
            <h3>{content.trusted}</h3>
            <p>{content.trustedBody}</p>
          </article>
        </div>
      </section>
    </div>
  );
}

type Coordinates = { latitude: number; longitude: number };

const defaultCoordinates: Coordinates = { latitude: 18.5204, longitude: 73.8567 };

function OpenStreetMapTiles({ coordinates, title }: { coordinates: Coordinates; title: string }) {
  const zoom = 12;
  const tileCount = 2 ** zoom;
  const rawX = ((coordinates.longitude + 180) / 360) * tileCount;
  const latitudeRadians = (coordinates.latitude * Math.PI) / 180;
  const rawY = ((1 - Math.asinh(Math.tan(latitudeRadians)) / Math.PI) / 2) * tileCount;
  const baseX = Math.floor(rawX);
  const baseY = Math.floor(rawY);
  const fractionX = rawX - baseX;
  const fractionY = rawY - baseY;
  const tiles = [-1, 0, 1].flatMap((offsetY) => [-1, 0, 1].map((offsetX) => {
    const tileX = (baseX + offsetX + tileCount) % tileCount;
    const tileY = Math.min(tileCount - 1, Math.max(0, baseY + offsetY));
    return {
      key: `${tileX}-${tileY}`,
      src: `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`,
      left: `calc(50% + ${(offsetX - fractionX) * 256}px)`,
      top: `calc(50% + ${(offsetY - fractionY) * 256}px)`,
    };
  }));

  return (
    <div className="ss-osm-map" role="img" aria-label={title}>
      {tiles.map((tile) => (
        <img key={tile.key} className="ss-osm-tile" src={tile.src} alt="" aria-hidden="true" style={{ left: tile.left, top: tile.top }} />
      ))}
      <span className="ss-osm-marker" aria-hidden="true"><MapPin size={28} fill="#D32F2F" /></span>
      <span className="ss-osm-attribution">© OpenStreetMap contributors</span>
    </div>
  );
}

function SearchPage({ content, language, onNavigate }: { content: Copy; language: Language; onNavigate: (section: Section) => void }) {
  const [term, setTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'hospitals' | 'doctors'>('all');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [aiError, setAiError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  const [locationState, setLocationState] = useState<'idle' | 'detecting' | 'detected' | 'denied'>('idle');
  const results = useMemo(() => {
    const combined = [
      ...hospitals.map((item) => ({ ...item, resultType: 'hospitals' as const, subtitle: item.type })),
      ...doctors.map((item) => ({ ...item, resultType: 'doctors' as const, subtitle: item.specialty })),
    ];
    const normalized = term.trim().toLowerCase();
    return combined.filter((item) => {
      const matchesFilter = filter === 'all' || item.resultType === filter;
      const matchesTerm = !normalized || `${item.name} ${item.subtitle} ${item.city}`.toLowerCase().includes(normalized);
      return matchesFilter && matchesTerm;
    });
  }, [filter, term]);

  const askAssistant = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || aiLoading) return;

    setAiLoading(true);
    setAiError('');
    setAnswer('');

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmedQuestion, language }),
      });
      const data = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok || !data.answer) {
        setAiError(content.aiUnavailable);
        return;
      }
      setAnswer(data.answer);
    } catch {
      setAiError(content.aiUnavailable);
    } finally {
      setAiLoading(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationState('denied');
      return;
    }

    setLocationState('detecting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationState('detected');
      },
      () => setLocationState('denied'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  const openMapHref = `https://www.openstreetmap.org/?mlat=${coordinates.latitude}&mlon=${coordinates.longitude}#map=14/${coordinates.latitude}/${coordinates.longitude}`;

  return (
    <>
      <div className="ss-page-heading">
        <div className="ss-page-kicker">{content.services}</div>
        <h1 className="ss-page-title">{content.searchTitle}</h1>
        <p className="ss-page-description">{content.searchBody}</p>
      </div>
      <section className="ss-ai-panel" aria-labelledby="ai-question-title">
        <div className="ss-ai-heading">
          <span className="ss-ai-icon" aria-hidden="true"><Bot size={20} /></span>
          <div>
            <h2 id="ai-question-title">{content.askAnything}</h2>
            <p>{content.askAnythingBody}</p>
          </div>
        </div>
        <div className="ss-ai-form">
          <label className="sr-only" htmlFor="ai-question">{content.askAnything}</label>
          <textarea
            id="ai-question"
            className="ss-textarea"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={content.askPlaceholder}
            maxLength={1200}
            rows={3}
            data-testid="input-ai-question"
          />
          <button type="button" className="ss-button ss-button-primary ss-ai-submit" onClick={askAssistant} disabled={!question.trim() || aiLoading} data-testid="button-ask-ai">
            {aiLoading ? <LoaderCircle size={17} className="ss-spin" aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}
            {aiLoading ? content.asking : content.ask}
          </button>
        </div>
        {aiError && <div className="ss-alert ss-alert-danger ss-ai-feedback" role="alert"><Bot size={17} aria-hidden="true" /><span>{aiError}</span></div>}
        {answer && (
          <div className="ss-ai-answer" role="status" data-testid="ai-answer">
            <div className="ss-ai-answer-label"><Sparkles size={16} aria-hidden="true" /> {content.aiAnswer}</div>
            <p>{answer}</p>
            <div className="ss-ai-disclaimer"><ShieldCheck size={14} aria-hidden="true" /> {content.aiDisclaimer}</div>
          </div>
        )}
      </section>
      <section className="ss-map-section" aria-labelledby="map-title">
        <div className="ss-section-header">
          <div>
            <div className="ss-page-kicker">{content.nearby}</div>
            <h2 id="map-title" className="ss-section-title">{content.mapTitle}</h2>
          </div>
          <button type="button" className="ss-button ss-button-outline ss-button-small" onClick={detectLocation} disabled={locationState === 'detecting'} data-testid="button-detect-location">
            {locationState === 'detecting' ? <LoaderCircle size={15} className="ss-spin" aria-hidden="true" /> : <Locate size={15} aria-hidden="true" />}
            {locationState === 'detecting' ? content.detectingLocation : content.detectLocation}
          </button>
        </div>
        <div className="ss-map-card">
          <OpenStreetMapTiles coordinates={coordinates} title={content.mapTitle} />
          <div className="ss-map-footer">
            <div className="ss-map-status">
              <MapPinned size={16} aria-hidden="true" />
              <span>{locationState === 'detected' ? content.locationDetected : locationState === 'denied' ? content.locationDenied : content.nearbyBody}</span>
            </div>
            <a className="ss-map-link" href={openMapHref} target="_blank" rel="noreferrer">
              <Navigation size={14} aria-hidden="true" /> {content.openMap}
            </a>
          </div>
        </div>
      </section>
      <div className="ss-search-row">
        <div className="ss-search-field">
          <Search size={18} aria-hidden="true" />
          <label className="sr-only" htmlFor="service-search">{content.searchPlaceholder}</label>
          <input id="service-search" className="ss-input" value={term} onChange={(event) => setTerm(event.target.value)} placeholder={content.searchPlaceholder} type="search" data-testid="input-service-search" />
        </div>
        <button type="button" className="ss-button ss-button-primary" onClick={() => setTerm(term.trim())} data-testid="button-submit-search">
          <Search size={17} aria-hidden="true" /> {content.searchButton}
        </button>
      </div>
      <div className="ss-filter-row" role="group" aria-label={content.search}>
        {[
          { id: 'all' as const, label: content.all },
          { id: 'hospitals' as const, label: content.hospitalsOnly },
          { id: 'doctors' as const, label: content.doctorsOnly },
        ].map((item) => (
          <button key={item.id} type="button" className="ss-filter" data-active={filter === item.id} onClick={() => setFilter(item.id)} data-testid={`filter-${item.id}`}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-6 mb-3 flex items-center justify-between">
        <h2 className="ss-section-title text-[17px]">{results.length} {content.results}</h2>
        {term && <button type="button" className="text-[12px] font-bold text-[#005A9C] underline" onClick={() => setTerm('')} data-testid="button-clear-search">{content.clearSearch}</button>}
      </div>
      {results.length > 0 ? (
        <div className="ss-list">
          {results.map((item) => <ResultCard key={`${item.resultType}-${item.id}`} item={item} content={content} onNavigate={onNavigate} />)}
        </div>
      ) : (
        <div className="ss-empty" data-testid="empty-search-results">
          <span className="ss-empty-icon"><Search size={20} aria-hidden="true" /></span>
          <h3>{content.noResults}</h3>
          <p>{content.noResultsBody}</p>
        </div>
      )}
    </>
  );
}

type ResultItem = { id: string; name: string; subtitle: string; city: string; distance: string; status: string; resultType: 'hospitals' | 'doctors' };

function ResultCard({ item, content, onNavigate, onAction }: { item: ResultItem; content: Copy; onNavigate: (section: Section) => void; onAction?: (item: ResultItem, action: 'details' | 'directions' | 'call') => void }) {
  return (
    <article className="ss-card ss-result-card ss-transition" data-testid={`card-result-${item.id}`}>
      <div className="ss-result-top">
        <div>
          <h3 className="ss-result-title">{item.name}</h3>
          <p className="ss-result-subtitle">{item.subtitle}</p>
        </div>
        <span className={`ss-status ${item.status === 'closed' ? 'ss-status-neutral' : ''}`}>{item.status === 'open' ? content.available : content.closed}</span>
      </div>
      <div className="ss-result-meta">
        <span className="ss-meta-item"><MapPin size={15} aria-hidden="true" /> {item.city} · {item.distance}</span>
        <span className="ss-meta-item"><Clock3 size={15} aria-hidden="true" /> {item.status === 'open' ? content.openNow : content.closed}</span>
      </div>
      <div className="ss-result-actions">
        <button type="button" className="ss-button ss-button-outline ss-button-small" onClick={() => onAction ? onAction(item, 'details') : onNavigate(item.resultType)} data-testid={`button-details-${item.id}`}>{content.viewDetails}</button>
        <button type="button" className="ss-button ss-button-outline ss-button-small" onClick={() => onAction ? onAction(item, 'directions') : onNavigate(item.resultType)} data-testid={`button-directions-${item.id}`}><MapPin size={14} aria-hidden="true" /> {content.directions}</button>
        <button type="button" className="ss-button ss-button-outline ss-button-small" onClick={() => onAction ? onAction(item, 'call') : onNavigate(item.resultType)} data-testid={`button-call-${item.id}`}><Phone size={14} aria-hidden="true" /> {content.call}</button>
      </div>
    </article>
  );
}

function DirectoryPage({ kind, content }: { kind: 'hospitals' | 'doctors'; content: Copy }) {
  const [notice, setNotice] = useState('');
  const data = kind === 'hospitals' ? hospitals.map((item) => ({ ...item, subtitle: item.type, resultType: 'hospitals' as const })) : doctors.map((item) => ({ ...item, subtitle: item.specialty, resultType: 'doctors' as const }));
  const title = kind === 'hospitals' ? content.hospitalsTitle : content.doctorsTitle;
  const body = kind === 'hospitals' ? content.hospitalsBody : content.doctorsBody;
  return (
    <>
      <div className="ss-page-heading">
        <div className="ss-page-kicker">{content.services}</div>
        <h1 className="ss-page-title">{title}</h1>
        <p className="ss-page-description">{body}</p>
      </div>
      <div className="ss-alert" data-testid={`status-${kind}-directory`}>
        <ShieldCheck size={17} aria-hidden="true" />
        <span>{content.verified} · {content.nearbyBody}</span>
      </div>
      {notice && <div className="ss-alert" role="status" data-testid={`status-${kind}-action`}><CheckCircle2 size={17} aria-hidden="true" /><span>{notice}</span><button type="button" className="ml-auto text-[#003B5C]" onClick={() => setNotice('')} aria-label={content.close} data-testid={`button-dismiss-${kind}-action`}><X size={16} /></button></div>}
      <div className="ss-list">
        {data.map((item) => <ResultCard key={item.id} item={item} content={content} onNavigate={() => undefined} onAction={(selected, action) => setNotice(`${action === 'call' ? content.call : action === 'directions' ? content.directions : content.viewDetails}: ${selected.name}`)} />)}
      </div>
    </>
  );
}

function ProfilePage({ content, language, onLanguageChange }: { content: Copy; language: Language; onLanguageChange: (language: Language) => void }) {
  const [notifications, setNotifications] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  return (
    <>
      <div className="ss-page-heading">
        <div className="ss-page-kicker">{content.profile}</div>
        <h1 className="ss-page-title">{content.profileTitle}</h1>
        <p className="ss-page-description">{content.profileBody}</p>
      </div>
      <div className="ss-card ss-profile-card">
        <div className="ss-profile-heading">
          <div className="ss-avatar" aria-hidden="true">अ</div>
          <div>
            <div className="ss-profile-name">{content.guest}</div>
            <p className="ss-profile-copy">{content.publicService}</p>
          </div>
        </div>
        <div>
          <h2 className="mb-1 text-[16px] font-extrabold text-[#003B5C]">{content.preferences}</h2>
          <div className="ss-setting">
            <div><div className="ss-setting-title">{content.notifications}</div><div className="ss-setting-copy">{content.notificationsBody}</div></div>
            <button type="button" className="ss-toggle" data-on={notifications} aria-pressed={notifications} aria-label={content.notifications} onClick={() => setNotifications((value) => !value)} data-testid="toggle-notifications"><span className="sr-only">{notifications ? content.enabled : content.disabled}</span></button>
          </div>
          <div className="ss-setting">
            <div><div className="ss-setting-title">{content.location}</div><div className="ss-setting-copy">{content.locationBody}</div></div>
            <button type="button" className="ss-toggle" data-on={locationEnabled} aria-pressed={locationEnabled} aria-label={content.location} onClick={() => setLocationEnabled((value) => !value)} data-testid="toggle-location"><span className="sr-only">{locationEnabled ? content.enabled : content.disabled}</span></button>
          </div>
          <div className="ss-setting">
            <div><div className="ss-setting-title">{content.language}</div><div className="ss-setting-copy">{content.languageBody}</div></div>
            <div className="ss-language-wrap">
              <label className="sr-only" htmlFor="profile-language">{content.selectLanguage}</label>
              <select id="profile-language" className="ss-language" value={language} onChange={(event) => onLanguageChange(event.target.value as Language)} data-testid="select-language-profile">
                {languages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="ss-card ss-info-card mt-3">
        <Activity size={19} className="mb-3 text-[#138808]" aria-hidden="true" />
        <h3>{content.healthTips}</h3>
        <p>{content.healthTipsBody}</p>
      </div>
    </>
  );
}

function EmergencyModal({ content, onClose }: { content: Copy; onClose: () => void }) {
  return (
    <div className="ss-modal-backdrop" role="presentation" onClick={onClose}>
      <section className="ss-modal relative" role="dialog" aria-modal="true" aria-labelledby="emergency-title" onClick={(event) => event.stopPropagation()}>
        <div className="ss-modal-icon"><Ambulance size={25} aria-hidden="true" /></div>
        <h2 id="emergency-title">{content.emergencyTitle}</h2>
        <p>{content.emergencyBody} <strong className="text-[#003B5C]">{content.emergencyNumber}</strong>.</p>
        <div className="ss-alert ss-alert-danger mt-4 mb-0"><Phone size={17} aria-hidden="true" /><span>{content.ambulanceReady}</span></div>
        <div className="ss-modal-actions">
          <button type="button" className="ss-button ss-button-danger flex-1" onClick={onClose} data-testid="button-confirm-emergency">{content.emergencyNumber}</button>
          <button type="button" className="ss-button ss-button-outline flex-1" onClick={onClose} data-testid="button-close-emergency">{content.close}</button>
        </div>
        <button type="button" className="absolute right-4 top-4 text-[#222222]" onClick={onClose} aria-label={content.close} data-testid="button-dismiss-emergency"><X size={19} /></button>
      </section>
    </div>
  );
}

function AppContent() {
  const [location, setLocation] = useLocation();
  const [language, setLanguage] = useState<Language>('hi');
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const activeSection = sectionFromPath(location);
  const content = copy[language];
  const onNavigate = (section: Section) => setLocation(section === 'home' ? '/' : `/${section}`);
  let page: ReactNode;
  if (activeSection === 'home') page = <HomePage content={content} onNavigate={onNavigate} onEmergency={() => setEmergencyOpen(true)} />;
  if (activeSection === 'search') page = <SearchPage content={content} language={language} onNavigate={onNavigate} />;
  if (activeSection === 'hospitals') page = <DirectoryPage kind="hospitals" content={content} />;
  if (activeSection === 'doctors') page = <DirectoryPage kind="doctors" content={content} />;
  if (activeSection === 'profile') page = <ProfilePage content={content} language={language} onLanguageChange={setLanguage} />;
  return (
    <div className="ss-shell">
      <Header activeSection={activeSection} content={content} language={language} onNavigate={onNavigate} onLanguageChange={setLanguage} onEmergency={() => setEmergencyOpen(true)} />
      <main className="ss-container ss-main">{page}</main>
      <MobileNav activeSection={activeSection} content={content} onNavigate={onNavigate} />
      {emergencyOpen && <EmergencyModal content={content} onClose={() => setEmergencyOpen(false)} />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary resetKey="swasthya-setu">
          <AppContent />
        </ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;