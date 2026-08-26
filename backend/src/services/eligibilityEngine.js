export function evaluateEligibility(data = {}) {
  const category = (data.Category || '').toUpperCase();
  const rawIncome = parseInt(data.Income || '0', 10) || 0;
  const course = (data.Course || '').toUpperCase();
  const state = data.State || '';
  const gender = (data.Gender || '').toUpperCase();

  const isTechnical = ['B.TECH', 'M.TECH', 'POLYTECHNIC', 'DIPLOMA', 'BCA', 'MCA', 'B.PHARM'].some((c) => course.includes(c));
  const isSchoolMatric = ['CLASS 10', 'CLASS 11', 'CLASS 12', '10TH', '12TH'].some((c) => course.includes(c));
  const isFemale = gender === 'FEMALE';

  return [
    {
      id: 'post_matric',
      title: 'Post-Matric Scholarship Scheme',
      badge: 'National Portal',
      badgeColor: '#FF7A00',
      eligible: ['SC', 'ST', 'OBC', 'EWS'].includes(category) && rawIncome <= 250000,
      reason:
        ['SC', 'ST', 'OBC', 'EWS'].includes(category) && rawIncome <= 250000
          ? 'Qualifies: Category & Family income under ₹2.5 Lakh limit.'
          : 'Income exceeds ₹2.5 Lakh limit or non-reserved category.',
      desc: 'Financial support for SC/ST/OBC students in Class 11, 12, ITI, Degree & Higher Education.',
    },
    {
      id: 'central_sector',
      title: 'Central Sector Scheme of Scholarships',
      badge: 'Ministry of Education',
      badgeColor: '#0284C7',
      eligible: rawIncome <= 450000,
      reason:
        rawIncome <= 450000
          ? 'Qualifies: Meritorious higher education scholarship with income under ₹4.5 Lakh.'
          : 'Annual family income exceeds ₹4.5 Lakh threshold.',
      desc: 'Merit-cum-means scholarship for undergraduate and postgraduate university students.',
    },
    {
      id: 'pragati_scheme',
      title: 'AICTE Pragati Scholarship for Girl Students',
      badge: 'AICTE Govt of India',
      badgeColor: '#EC4899',
      eligible: isFemale && isTechnical && rawIncome <= 800000,
      reason:
        isFemale && isTechnical && rawIncome <= 800000
          ? 'Qualifies: Girl student enrolled in Technical Degree/Diploma with income under ₹8.0 Lakh.'
          : !isFemale
          ? 'Reserved exclusively for female students.'
          : !isTechnical
          ? 'Requires enrollment in recognized AICTE Technical/Engineering degree.'
          : 'Family annual income exceeds ₹8.0 Lakh limit.',
      desc: '₹50,000 per annum financial grant for meritorious girl students pursuing technical degree or diploma.',
    },
    {
      id: 'pm_yasasvi',
      title: 'PM-YASASVI Top Class Education Scheme',
      badge: 'Ministry of Social Justice',
      badgeColor: '#F59E0B',
      eligible: ['OBC', 'EWS'].includes(category) && rawIncome <= 250000,
      reason:
        ['OBC', 'EWS'].includes(category) && rawIncome <= 250000
          ? 'Qualifies: OBC/EWS student with family income under ₹2.5 Lakh.'
          : 'Requires OBC/EWS category with income below ₹2.5 Lakh.',
      desc: 'Full fee coverage and living stipend for OBC, EWS and DNT students in premier institutes.',
    },
    {
      id: 'pre_matric',
      title: 'Pre-Matric Scholarship for Minorities',
      badge: 'Minority Affairs',
      badgeColor: '#10B981',
      eligible: (category === 'MINORITY' || isSchoolMatric) && rawIncome <= 100000,
      reason:
        rawIncome <= 100000
          ? 'Qualifies: Family income under ₹1.0 Lakh ceiling.'
          : 'Applicable only for students with income under ₹1.0 Lakh.',
      desc: 'Empowering minority community school students across India.',
    },
    {
      id: 'state_merit',
      title: `State Higher Education Merit Scheme (${state || 'State Level'})`,
      badge: 'State Govt Scheme',
      badgeColor: '#8B5CF6',
      eligible: isTechnical && rawIncome <= 300000,
      reason:
        isTechnical && rawIncome <= 300000
          ? `Qualifies: Technical/Degree course (${data.Course || 'Technical'}) in ${state || 'State'}.`
          : 'Requires enrollment in recognized Degree/Technical courses with income under ₹3.0 Lakh.',
      desc: 'State-sponsored merit fee waiver and stipend for technical degree courses.',
    },
  ];
}
