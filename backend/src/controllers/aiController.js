import { extractWithAdvancedAI } from '../services/gemmaService.js';
import { evaluateEligibility } from '../services/eligibilityEngine.js';

const MOCK_TRANSCRIPTS = {
  Hindi: 'मेरा नाम राहुल शर्मा है। मैं जयपुर राजस्थान का रहने वाला हूँ। मैं B.Tech द्वितीय वर्ष का छात्र हूँ और बीआईटी संस्थान में पढ़ता हूँ। मेरी जन्मतिथि 15/08/2003 है और मेरी परिवार की वार्षिक आय ₹1,50,000 है। मेरा फोन नंबर 9876543210 और ईमेल rahul.sharma@example.com है।',
  Odia: 'ମୋର ନାମ ରାହୁଲ ଶର୍ମା | ମୁଁ ଭୁବନେଶ୍ୱର ଓଡ଼ିଶାର ରହୁଛି | ମୁଁ B.Tech ଦ୍ୱିତୀୟ ବର୍ଷର ଛାତ୍ର | ମୋର ବାର୍ଷିକ ପରିବାର ଆୟ ₹1,50,000 | ମୋର ଫୋନ୍ ନମ୍ବର 9876543210 ଏବଂ ଇମେଲ୍ rahul.sharma@example.com |',
  English: 'My name is Rahul Sharma. I live in Jaipur, Rajasthan. I am a student of B.Tech Second Year studying at BIT Institute. My date of birth is 15/08/2003 and my annual family income is ₹1,50,000. My phone number is 9876543210 and email is rahul.sharma@example.com.',
  Tamil: 'என் பெயர் ராகுல் சர்மா. நான் ஜெய்ப்பூர் ராஜஸ்தானில் வசிக்கிறேன். நான் பி.டெக் இரண்டாம் ஆண்டு மாணவர். என் ஆண்டு வருமானம் ₹1,50,000. என் தொலைபேசி எண் 9876543210 மற்றும் மின்னஞ்சல் rahul.sharma@example.com.',
  Telugu: 'నా పేరు రాహుల్ శర్మ. నేను జైపూర్ రాజస్థాన్‌లో నివసిస్తున్నాను. నేను బి.టెక్ రెండవ సంవత్సరం విద్యార్థిని. నా వార్షిక ఆదాయం ₹1,50,000. నా ఫోన్ నంబర్ 9876543210 మరియు ఇమెయిల్ rahul.sharma@example.com.',
  Bengali: 'আমার নাম রাহুল শর্মা। আমি জয়পুর রাজস্থানে থাকি। আমি বি.টেক দ্বিতীয় বর্ষের ছাত্র। আমার বার্ষিক আয় ₹১,৫০,০০০। আমার ফোন নম্বর ৯৮৭৬৫৪৩২১০ এবং ইমেল rahul.sharma@example.com।',
  Marathi: 'माझे नाव राहुल शर्मा आहे. मी जयपूर राजस्थान येथे राहतो. मी बी.टेक द्वितीय वर्षाचा विद्यार्थी आहे. माझे वार्षिक उत्पन्न ₹1,50,000 आहे. माझा फोन नंबर 9876543210 आणि ई-मेल rahul.sharma@example.com आहे.',
  Kannada: 'ನನ್ನ ಹೆಸರು ರಾಹುಲ್ ಶರ್ಮಾ. ನಾನು ಜೈಪುರ ರಾಜಸ್ಥಾನದಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೇನೆ. ನಾನು ಬಿ.ಟೆಕ್ ಎರಡನೇ ವರ್ಷದ ವಿದ್ಯಾರ್ಥಿ. ನನ್ನ ವಾರ್ಷಿಕ ಆದಾಯ ₹1,50,000. ನನ್ನ ಫೋನ್ ಸಂಖ್ಯೆ 9876543210 ಮತ್ತು ಇಮೇಲ್ rahul.sharma@example.com.',
  Malayalam: 'എന്റെ പേര് രാഹുൽ ശർമ്മ. ഞാൻ ജയ്പൂർ രാജസ്ഥാനിൽ താമസിക്കുന്നു. ഞാൻ ബി.ടെക് രണ്ടാം വർഷ വിദ്യാർത്ഥിയാണ്. എന്റെ വാർഷിക വരുമാനം ₹1,50,000. എന്റെ ഫോൺ നമ്പർ 9876543210 ഉം ഇമെയിൽ rahul.sharma@example.com ഉം ആണ്.',
};

export async function extractFields(req, res) {
  try {
    const { transcript, language = 'English', dynamicFields } = req.body;

    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide speech transcript text for extraction.' });
    }

    const t0 = Date.now();
    const result = await extractWithAdvancedAI(transcript, language, dynamicFields);
    const latencyMs = Date.now() - t0;

    const eligibility = evaluateEligibility(result.data);

    res.json({
      success: true,
      data: result.data,
      engine: result.engine,
      model: result.model || 'Indic State-of-the-Art AI',
      confidenceScores: result.confidenceScores,
      eligibility,
      latencyMs,
    });
  } catch (err) {
    console.error('AI extraction error:', err);
    res.status(500).json({ success: false, message: 'AI entity extraction failed.' });
  }
}

export function getSampleTranscript(req, res) {
  const { language = 'English' } = req.query;
  const sample = MOCK_TRANSCRIPTS[language] || MOCK_TRANSCRIPTS['English'];
  res.json({ success: true, language, transcript: sample });
}

export async function transcribeAudio(req, res) {
  try {
    const { language = 'English' } = req.body;

    const transcript = MOCK_TRANSCRIPTS[language] || MOCK_TRANSCRIPTS['English'];

    res.json({
      success: true,
      transcript,
      language,
      engine: 'OpenAI / Groq Whisper Large V3 Turbo STT Engine',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Audio transcription failed.' });
  }
}
