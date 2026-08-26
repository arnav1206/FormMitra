export const SCHOLARSHIP_FORMS = [
  {
    id: 'post_matric',
    title: 'Post-Matric Scholarship Scheme',
    description: 'For SC/ST/OBC/EBC students in Class 11, 12, ITI, Degree, Diploma & Higher Education.',
    icon: '🎓',
    tag: 'Government of India',
    tagColor: '#FF7A00',
    available: true,
    sections: [
      {
        title: 'Personal Information',
        icon: '👤',
        fields: [
          { id: 'Full Name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. Rahul Sharma' },
          { id: 'Date of Birth', label: 'Date of Birth', type: 'date', required: true, placeholder: 'DD/MM/YYYY' },
          { id: 'Gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Transgender'] },
          { id: 'Category', label: 'Category', type: 'select', required: true, options: ['General', 'OBC', 'SC', 'ST', 'EWS'] },
        ],
      },
      {
        title: 'Address & Domicile Details',
        icon: '📍',
        fields: [
          { id: 'Address', label: 'Street Address', type: 'text', required: true, placeholder: 'House/Street/Locality' },
          { id: 'City', label: 'City / District', type: 'text', required: true, placeholder: 'e.g. Jaipur' },
          { id: 'State', label: 'State', type: 'select', required: true, placeholder: 'Select State' },
          { id: 'PIN Code', label: 'PIN Code', type: 'text', required: true, placeholder: '6-digit PIN' },
        ],
      },
      {
        title: 'Academic Information',
        icon: '🎓',
        fields: [
          { id: 'College', label: 'College / Institute', type: 'text', required: true, placeholder: 'College name' },
          { id: 'Course', label: 'Course', type: 'text', required: true, placeholder: 'e.g. B.Tech' },
          { id: 'Year', label: 'Current Year', type: 'select', required: true, options: ['First Year', 'Second Year', 'Third Year', 'Fourth Year'] },
          { id: 'Percentage / CGPA', label: 'Percentage / CGPA', type: 'text', required: true, placeholder: 'e.g. 8.5 CGPA or 82%' },
        ],
      },
      {
        title: 'Financial & Contact Details',
        icon: '💼',
        fields: [
          { id: 'Annual Family Income', label: 'Annual Family Income (₹)', type: 'number', required: true, placeholder: 'e.g. 150000' },
          { id: 'Phone Number', label: 'Mobile Number', type: 'tel', required: true, placeholder: '10-digit mobile' },
          { id: 'Email', label: 'Email Address', type: 'email', required: true, placeholder: 'name@example.com' },
        ],
      },
    ],
  },
  {
    id: 'central_sector',
    title: 'Central Sector Scheme of Scholarships',
    description: 'For meritorious College and University students with family income under ₹4.5 Lakh.',
    icon: '🏛️',
    tag: 'Ministry of Education',
    tagColor: '#0284C7',
    available: true,
  },
  {
    id: 'pre_matric',
    title: 'Pre-Matric Scholarship for Minorities',
    description: 'For Minority community students studying in Class 1 to 10 with family income under ₹1.0 Lakh.',
    icon: '📚',
    tag: 'Ministry of Minority Affairs',
    tagColor: '#10B981',
    available: true,
  },
  {
    id: 'state_merit',
    title: 'State Higher Education Merit Scholarship',
    description: 'State-level merit scheme for undergraduate and postgraduate students in technical courses.',
    icon: '🌟',
    tag: 'State Govt Scheme',
    tagColor: '#8B5CF6',
    available: true,
  },
  {
    id: 'certificate_portal',
    title: 'Income & Caste Certificate Portal',
    description: 'Government portal for issuing verified EWS and Caste certificates.',
    icon: '📜',
    tag: 'Revenue Dept',
    tagColor: '#64748B',
    available: false,
  },
  {
    id: 'pm_kisan',
    title: 'PM-Kisan Farmer Welfare Scheme',
    description: 'Direct benefit transfer for agricultural landholding farmer families.',
    icon: '🌾',
    tag: 'Ministry of Agriculture',
    tagColor: '#EAB308',
    available: false,
  },
];

export function getForms(req, res) {
  res.json({
    success: true,
    forms: SCHOLARSHIP_FORMS,
  });
}

export function getFormById(req, res) {
  const { id } = req.params;
  const form = SCHOLARSHIP_FORMS.find((f) => f.id === id) || SCHOLARSHIP_FORMS[0];
  res.json({ success: true, form });
}

export async function parseExternalForm(req, res) {
  try {
    const { url } = req.body;
    if (!url || !url.includes('google.com/forms')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid Google Forms public link.' });
    }

    // Mock parsed dynamic Google form representation
    const dynamicForm = {
      id: `dyn_${Date.now()}`,
      title: 'Scraped Google Form',
      description: `Imported from: ${url}`,
      questions: [
        { id: 'q1', title: 'Full Name', type: 'text', required: true },
        { id: 'q2', title: 'Email Address', type: 'email', required: true },
        { id: 'q3', title: 'Phone Number', type: 'tel', required: true },
        { id: 'q4', title: 'City / District', type: 'text', required: true },
        { id: 'q5', title: 'Annual Family Income', type: 'number', required: true },
      ],
    };

    res.json({ success: true, form: dynamicForm });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to import form.' });
  }
}
