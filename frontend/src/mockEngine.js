// SpecifyThat Mock Engine - Intelligent Spec Generation
// This engine analyzes project descriptions and generates contextual answers

const projectPatterns = {
  ecommerce: {
    keywords: ['shop', 'store', 'ecommerce', 'e-commerce', 'sell', 'product', 'cart', 'checkout', 'payment', 'inventory', 'marketplace', 'buy', 'purchase', 'order', 'shipping'],
    namePrefix: ['Shop', 'Store', 'Market', 'Buy', 'Cart'],
    nameSuffix: ['Hub', 'Pro', 'Plus', 'Direct', 'Express']
  },
  productivity: {
    keywords: ['task', 'todo', 'project', 'manage', 'organize', 'track', 'workflow', 'kanban', 'board', 'productivity', 'planning', 'schedule', 'calendar', 'reminder', 'notes'],
    namePrefix: ['Task', 'Flow', 'Plan', 'Work', 'Dash'],
    nameSuffix: ['Flow', 'Hub', 'Board', 'Track', 'Pro']
  },
  social: {
    keywords: ['social', 'community', 'connect', 'share', 'post', 'friend', 'follow', 'feed', 'network', 'chat', 'message', 'group', 'profile', 'comment', 'like'],
    namePrefix: ['Connect', 'Link', 'Social', 'Hive', 'Circle'],
    nameSuffix: ['Space', 'Hub', 'Net', 'Community', 'Zone']
  },
  saas: {
    keywords: ['saas', 'subscription', 'dashboard', 'analytics', 'metrics', 'reporting', 'enterprise', 'business', 'b2b', 'platform', 'service', 'tool', 'automation'],
    namePrefix: ['Cloud', 'Data', 'Metric', 'Insight', 'Auto'],
    nameSuffix: ['ly', 'ify', 'Hub', 'Platform', 'Suite']
  },
  education: {
    keywords: ['learn', 'course', 'education', 'student', 'teacher', 'quiz', 'lesson', 'training', 'tutorial', 'study', 'class', 'school', 'knowledge', 'skill'],
    namePrefix: ['Learn', 'Edu', 'Study', 'Skill', 'Course'],
    nameSuffix: ['Academy', 'Pro', 'Hub', 'Path', 'Master']
  },
  health: {
    keywords: ['health', 'fitness', 'workout', 'exercise', 'diet', 'nutrition', 'wellness', 'medical', 'patient', 'doctor', 'appointment', 'track', 'habit', 'meditation', 'sleep'],
    namePrefix: ['Health', 'Fit', 'Well', 'Vital', 'Life'],
    nameSuffix: ['Track', 'Pro', 'Plus', 'Coach', 'Care']
  },
  finance: {
    keywords: ['finance', 'money', 'budget', 'expense', 'income', 'investment', 'bank', 'wallet', 'payment', 'invoice', 'accounting', 'tax', 'savings', 'crypto', 'trading'],
    namePrefix: ['Money', 'Fin', 'Budget', 'Cash', 'Wealth'],
    nameSuffix: ['Track', 'Wise', 'Pro', 'Flow', 'Guard']
  },
  content: {
    keywords: ['blog', 'content', 'article', 'write', 'publish', 'cms', 'media', 'video', 'podcast', 'creator', 'newsletter', 'subscriber', 'audience'],
    namePrefix: ['Content', 'Create', 'Publish', 'Media', 'Story'],
    nameSuffix: ['Hub', 'Studio', 'Pro', 'Press', 'Lab']
  },
  ai: {
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'gpt', 'llm', 'chatbot', 'generate', 'automate', 'intelligent', 'smart', 'neural', 'predict'],
    namePrefix: ['AI', 'Smart', 'Neural', 'Auto', 'Genius'],
    nameSuffix: ['AI', 'Mind', 'Bot', 'Gen', 'IQ']
  },
  booking: {
    keywords: ['book', 'reserve', 'appointment', 'schedule', 'hotel', 'restaurant', 'service', 'availability', 'slot', 'calendar', 'venue', 'event'],
    namePrefix: ['Book', 'Reserve', 'Schedule', 'Slot', 'Cal'],
    nameSuffix: ['ly', 'Now', 'Pro', 'Easy', 'Quick']
  },
  realtime: {
    keywords: ['real-time', 'realtime', 'live', 'collaborative', 'sync', 'multiplayer', 'websocket', 'instant', 'streaming', 'broadcast'],
    namePrefix: ['Live', 'Sync', 'Real', 'Instant', 'Now'],
    nameSuffix: ['Sync', 'Live', 'Time', 'Flow', 'Hub']
  },
  mobile: {
    keywords: ['mobile', 'app', 'ios', 'android', 'phone', 'responsive', 'pwa', 'native', 'cross-platform'],
    namePrefix: ['Mobile', 'App', 'Pocket', 'Go', 'Swift'],
    nameSuffix: ['App', 'Go', 'Mobile', 'Pocket', 'Now']
  }
};

function detectProjectType(description) {
  const lowerDesc = description.toLowerCase();
  const scores = {};
  
  for (const [type, data] of Object.entries(projectPatterns)) {
    scores[type] = 0;
    for (const keyword of data.keywords) {
      if (lowerDesc.includes(keyword)) {
        scores[type] += keyword.length > 5 ? 2 : 1; // Longer keywords score higher
      }
    }
  }
  
  const sortedTypes = Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);
  
  return sortedTypes.length > 0 
    ? { primary: sortedTypes[0][0], secondary: sortedTypes[1]?.[0] || null, all: sortedTypes }
    : { primary: 'saas', secondary: null, all: [] };
}

function generateProjectName(description, projectType) {
  const pattern = projectPatterns[projectType] || projectPatterns.saas;
  const words = description.split(/\s+/).filter(w => w.length > 3);
  
  // Try to find a meaningful word from description
  const meaningfulWords = words.filter(w => 
    !['that', 'this', 'with', 'from', 'they', 'want', 'need', 'like', 'would', 'could', 'should'].includes(w.toLowerCase())
  );
  
  const prefix = pattern.namePrefix[Math.floor(Math.random() * pattern.namePrefix.length)];
  const suffix = pattern.nameSuffix[Math.floor(Math.random() * pattern.nameSuffix.length)];
  
  // Sometimes use a word from description
  if (meaningfulWords.length > 0 && Math.random() > 0.5) {
    const word = meaningfulWords[Math.floor(Math.random() * Math.min(3, meaningfulWords.length))];
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return capitalized + suffix;
  }
  
  return prefix + suffix;
}

function extractTargetAudience(description) {
  const lowerDesc = description.toLowerCase();
  const audiences = [
    { keywords: ['team', 'teams', 'employees', 'staff', 'coworkers'], audience: 'teams and organizations' },
    { keywords: ['developer', 'developers', 'programmer', 'engineer'], audience: 'developers and technical teams' },
    { keywords: ['designer', 'designers', 'creative'], audience: 'designers and creative professionals' },
    { keywords: ['student', 'students', 'learner'], audience: 'students and learners' },
    { keywords: ['business', 'entrepreneur', 'startup', 'founder'], audience: 'entrepreneurs and business owners' },
    { keywords: ['freelancer', 'freelancers', 'contractor'], audience: 'freelancers and independent contractors' },
    { keywords: ['customer', 'consumer', 'user', 'people'], audience: 'general consumers' },
    { keywords: ['small business', 'smb', 'local'], audience: 'small and medium businesses' },
    { keywords: ['enterprise', 'corporate', 'large'], audience: 'enterprise organizations' },
    { keywords: ['creator', 'creators', 'influencer'], audience: 'content creators and influencers' },
    { keywords: ['patient', 'health', 'medical'], audience: 'healthcare providers and patients' },
  ];
  
  for (const { keywords, audience } of audiences) {
    for (const kw of keywords) {
      if (lowerDesc.includes(kw)) return audience;
    }
  }
  
  return 'users who need efficient digital solutions';
}

function generateConstraints(projectType, description) {
  const baseConstraints = [
    'Must be completable in one focused build session',
    'Browser-based (no native app requirements)',
    'Single developer can build and maintain'
  ];
  
  const typeConstraints = {
    ecommerce: ['No real payment processing in MVP (mock checkout)', 'Focus on core shopping flow over advanced features'],
    productivity: ['Local storage for MVP (no complex backend sync)', 'Core workflow over integrations'],
    social: ['Basic interactions only (no real-time in MVP)', 'Privacy-first approach'],
    saas: ['Free tier focus for MVP', 'Core value proposition over enterprise features'],
    education: ['Content structure over gamification', 'Simple progress tracking'],
    health: ['Informational only (no medical advice)', 'Privacy-compliant data handling'],
    finance: ['Display only (no real transactions)', 'Security-first architecture'],
    content: ['Text-first (rich media later)', 'Simple publishing workflow'],
    ai: ['Rate limiting on AI calls', 'Graceful fallbacks for AI failures'],
    booking: ['Simple availability logic', 'Email confirmation only (no SMS)'],
    realtime: ['Polling fallback for real-time', 'Graceful offline handling'],
    mobile: ['Mobile-first responsive (not native)', 'Progressive enhancement']
  };
  
  return [...baseConstraints, ...(typeConstraints[projectType] || [])];
}

function generateFeatures(projectType, description) {
  const coreFeatures = {
    ecommerce: [
      'Product catalog with search and filters',
      'Shopping cart with quantity management',
      'Mock checkout flow with order confirmation',
      'Product detail pages with images',
      'Category navigation',
      'Order history view'
    ],
    productivity: [
      'Create, edit, and delete items',
      'Status/progress tracking',
      'Drag-and-drop organization',
      'Search and filter functionality',
      'Due dates and reminders',
      'Dashboard overview'
    ],
    social: [
      'User profiles with customization',
      'Content posting and editing',
      'Feed with chronological/algorithmic sort',
      'Like/react interactions',
      'Basic commenting system',
      'Follow/connection system'
    ],
    saas: [
      'User authentication and accounts',
      'Main dashboard with key metrics',
      'Core feature workflow',
      'Settings and preferences',
      'Data visualization/charts',
      'Export functionality'
    ],
    education: [
      'Course/content structure',
      'Lesson progression tracking',
      'Quiz/assessment functionality',
      'Progress dashboard',
      'Bookmarking/favorites',
      'Search across content'
    ],
    health: [
      'Activity/data logging',
      'Progress tracking over time',
      'Goal setting and monitoring',
      'Visual progress charts',
      'Daily/weekly summaries',
      'Reminder notifications'
    ],
    finance: [
      'Transaction entry and categorization',
      'Budget creation and tracking',
      'Visual spending breakdowns',
      'Monthly/yearly summaries',
      'Goal tracking',
      'Export reports'
    ],
    content: [
      'Rich text editor',
      'Content organization (categories/tags)',
      'Preview before publish',
      'Draft management',
      'Basic SEO fields',
      'Content scheduling'
    ],
    ai: [
      'Input interface for AI interaction',
      'AI response display',
      'History of interactions',
      'Response regeneration',
      'Copy/export results',
      'Settings for AI behavior'
    ],
    booking: [
      'Calendar view of availability',
      'Booking form with validation',
      'Confirmation display',
      'Booking management',
      'Email notifications',
      'Cancellation handling'
    ],
    realtime: [
      'Live data updates',
      'Presence indicators',
      'Sync status display',
      'Conflict resolution UI',
      'Offline mode handling',
      'Connection status'
    ],
    mobile: [
      'Touch-optimized interface',
      'Swipe gestures',
      'Responsive layouts',
      'Fast loading times',
      'Offline capability',
      'Native-like transitions'
    ]
  };
  
  return coreFeatures[projectType] || coreFeatures.saas;
}

function generateNonGoals(projectType, description) {
  const nonGoals = {
    ecommerce: [
      'Real payment processing',
      'Inventory management system',
      'Shipping carrier integration',
      'Multi-vendor marketplace',
      'Advanced analytics dashboard',
      'Mobile native apps'
    ],
    productivity: [
      'Real-time collaboration (v2)',
      'Third-party integrations (Slack, etc)',
      'Advanced reporting',
      'Team management features',
      'Native mobile apps',
      'Offline-first architecture'
    ],
    social: [
      'Real-time messaging/chat',
      'Video/audio calls',
      'Advanced content moderation',
      'Advertising system',
      'Analytics for creators',
      'Native mobile apps'
    ],
    saas: [
      'Multi-tenant architecture',
      'Advanced billing/subscriptions',
      'White-labeling',
      'API for third parties',
      'Enterprise SSO',
      'Advanced admin panel'
    ],
    education: [
      'Live video classes',
      'Certification system',
      'Payment/enrollment',
      'Discussion forums',
      'Instructor tools',
      'Mobile apps'
    ],
    health: [
      'Medical diagnosis features',
      'Wearable device sync',
      'Telemedicine',
      'Insurance integration',
      'HIPAA compliance (MVP)',
      'Social features'
    ],
    finance: [
      'Bank account linking',
      'Real transactions',
      'Investment advice',
      'Tax filing',
      'Multi-currency',
      'Crypto trading'
    ],
    content: [
      'Monetization features',
      'Advanced analytics',
      'Email marketing',
      'Comment moderation AI',
      'Multi-author workflows',
      'Custom domains'
    ],
    ai: [
      'Custom model training',
      'Multi-modal inputs',
      'API access for users',
      'Team collaboration',
      'Advanced prompt management',
      'Usage-based billing'
    ],
    booking: [
      'Payment processing',
      'Calendar sync (Google, etc)',
      'SMS notifications',
      'Multi-location support',
      'Staff management',
      'Advanced reporting'
    ],
    realtime: [
      'Video/audio streaming',
      'End-to-end encryption',
      'Message history search',
      'File sharing',
      'Advanced presence features',
      'Cross-platform native apps'
    ],
    mobile: [
      'Native iOS/Android apps',
      'Push notifications (MVP)',
      'Background sync',
      'Device-specific features',
      'App store deployment',
      'In-app purchases'
    ]
  };
  
  return nonGoals[projectType] || nonGoals.saas;
}

function generateDataEntities(projectType, description) {
  const entities = {
    ecommerce: ['User', 'Product', 'Category', 'Cart', 'CartItem', 'Order', 'OrderItem', 'Review'],
    productivity: ['User', 'Workspace', 'Project', 'Task', 'Tag', 'Comment', 'Activity'],
    social: ['User', 'Profile', 'Post', 'Comment', 'Like', 'Follow', 'Notification'],
    saas: ['User', 'Organization', 'Subscription', 'Feature', 'Usage', 'Setting', 'AuditLog'],
    education: ['User', 'Course', 'Lesson', 'Progress', 'Quiz', 'Question', 'Answer', 'Certificate'],
    health: ['User', 'Activity', 'Goal', 'Measurement', 'Habit', 'Reminder', 'Achievement'],
    finance: ['User', 'Account', 'Transaction', 'Category', 'Budget', 'Goal', 'Report'],
    content: ['User', 'Post', 'Category', 'Tag', 'Comment', 'Media', 'Draft'],
    ai: ['User', 'Conversation', 'Message', 'Prompt', 'Template', 'Setting', 'Usage'],
    booking: ['User', 'Service', 'Provider', 'TimeSlot', 'Booking', 'Notification'],
    realtime: ['User', 'Room', 'Message', 'Presence', 'Event', 'Sync'],
    mobile: ['User', 'Session', 'Preference', 'Cache', 'SyncQueue', 'Notification']
  };
  
  return entities[projectType] || entities.saas;
}

function generateRelationships(projectType, entities) {
  const relationships = {
    ecommerce: [
      'User has many Orders',
      'User has one Cart',
      'Cart has many CartItems',
      'Product belongs to Category',
      'Order has many OrderItems',
      'Product has many Reviews'
    ],
    productivity: [
      'User has many Workspaces',
      'Workspace has many Projects',
      'Project has many Tasks',
      'Task has many Tags (many-to-many)',
      'Task has many Comments',
      'User has many Activities'
    ],
    social: [
      'User has one Profile',
      'User has many Posts',
      'Post has many Comments',
      'Post has many Likes',
      'User follows many Users',
      'User has many Notifications'
    ],
    saas: [
      'User belongs to Organization',
      'Organization has one Subscription',
      'Subscription has many Features',
      'User has many UsageRecords',
      'Organization has many Settings'
    ],
    education: [
      'Course has many Lessons',
      'User has many Progress records',
      'Lesson has many Quizzes',
      'Quiz has many Questions',
      'User has many Certificates'
    ],
    health: [
      'User has many Activities',
      'User has many Goals',
      'User has many Measurements',
      'Habit has many Reminders',
      'User has many Achievements'
    ],
    finance: [
      'User has many Accounts',
      'Account has many Transactions',
      'Transaction belongs to Category',
      'User has many Budgets',
      'Budget has many Categories'
    ],
    content: [
      'User has many Posts',
      'Post belongs to Category',
      'Post has many Tags',
      'Post has many Comments',
      'Post has many Media'
    ],
    ai: [
      'User has many Conversations',
      'Conversation has many Messages',
      'User has many Prompts',
      'User has many Templates'
    ],
    booking: [
      'Provider has many Services',
      'Service has many TimeSlots',
      'User has many Bookings',
      'Booking belongs to TimeSlot'
    ],
    realtime: [
      'User has many Rooms',
      'Room has many Messages',
      'Room has many Presences',
      'User has many Events'
    ],
    mobile: [
      'User has many Sessions',
      'User has many Preferences',
      'User has many CachedItems',
      'User has many SyncQueues'
    ]
  };
  
  return relationships[projectType] || relationships.saas;
}

function generateUserFlow(projectType, description) {
  const flows = {
    ecommerce: [
      'Land on homepage → Browse products by category',
      'Search/filter products → View product details',
      'Add to cart → Continue shopping or go to cart',
      'Review cart → Proceed to checkout',
      'Enter shipping info → Confirm order',
      'View order confirmation → Check order history'
    ],
    productivity: [
      'Sign in → Land on dashboard',
      'View existing projects → Select or create new',
      'Add tasks with details → Organize by drag-drop',
      'Update task status → Track progress',
      'Filter/search tasks → Review completed work',
      'Check daily/weekly overview → Plan next steps'
    ],
    social: [
      'Sign up/Sign in → Complete profile',
      'Browse feed → Interact with posts',
      'Create new post → Add content/media',
      'Discover users → Follow interesting profiles',
      'Check notifications → Respond to interactions',
      'Edit profile → Manage settings'
    ],
    saas: [
      'Sign up → Complete onboarding',
      'Land on dashboard → View key metrics',
      'Navigate to main feature → Perform core action',
      'Configure settings → Customize experience',
      'Check reports/analytics → Export data',
      'Manage account → Update preferences'
    ],
    education: [
      'Browse courses → Select course',
      'Start lesson → Consume content',
      'Complete quiz → Review answers',
      'Track progress → Continue next lesson',
      'Review completed courses → Get certificate',
      'Search content → Bookmark favorites'
    ],
    health: [
      'Open app → View daily summary',
      'Log activity/data → Confirm entry',
      'Check progress charts → Review trends',
      'Set/update goals → Track against targets',
      'View achievements → Stay motivated',
      'Set reminders → Build habits'
    ],
    finance: [
      'Sign in → View dashboard',
      'Add transaction → Categorize',
      'Review spending → Analyze by category',
      'Set budget → Monitor against limits',
      'Check goals → Track savings',
      'Generate report → Export data'
    ],
    content: [
      'Sign in → View content dashboard',
      'Create new post → Write in editor',
      'Add categories/tags → Preview',
      'Publish or save draft → Share',
      'View published content → Check engagement',
      'Manage posts → Edit or archive'
    ],
    ai: [
      'Open app → Start new conversation',
      'Enter prompt → Submit to AI',
      'View response → Refine if needed',
      'Save useful responses → Build history',
      'Use templates → Speed up common tasks',
      'Adjust settings → Customize behavior'
    ],
    booking: [
      'Browse services → Select service',
      'View calendar → Pick available slot',
      'Fill booking form → Confirm details',
      'Submit booking → Receive confirmation',
      'View bookings → Manage if needed',
      'Receive reminder → Attend appointment'
    ],
    realtime: [
      'Sign in → View active rooms',
      'Join or create room → Connect',
      'Send messages → See live updates',
      'View presence → Know who\'s active',
      'Handle disconnection → Auto-reconnect',
      'Leave room → Data persists'
    ],
    mobile: [
      'Open app → Fast load',
      'Navigate with gestures → Smooth transitions',
      'Perform action → Optimistic updates',
      'Go offline → Continue working',
      'Come online → Sync changes',
      'Receive notification → Quick action'
    ]
  };
  
  return flows[projectType] || flows.saas;
}

function generateAPIs(projectType, description) {
  const apis = {
    ecommerce: ['Product Search API', 'Cart Management API', 'Order Processing API', 'User Authentication', 'Mock Payment Gateway'],
    productivity: ['Task CRUD API', 'Project Management API', 'User Auth API', 'Search/Filter API', 'Activity Log API'],
    social: ['User Auth API', 'Post CRUD API', 'Feed Algorithm API', 'Follow System API', 'Notification API'],
    saas: ['User Auth API', 'Core Feature API', 'Analytics API', 'Settings API', 'Billing API (mock)'],
    education: ['Course Content API', 'Progress Tracking API', 'Quiz API', 'User Auth API', 'Certificate API'],
    health: ['Activity Logging API', 'Goals API', 'Progress API', 'Reminder API', 'Achievement API'],
    finance: ['Transaction API', 'Budget API', 'Category API', 'Report Generation API', 'User Auth API'],
    content: ['Content CRUD API', 'Media Upload API', 'Category/Tag API', 'User Auth API', 'Comment API'],
    ai: ['Chat Completion API', 'Conversation History API', 'Template API', 'Usage Tracking API', 'User Settings API'],
    booking: ['Availability API', 'Booking CRUD API', 'Notification API', 'User Auth API', 'Calendar API'],
    realtime: ['WebSocket Connection', 'Message API', 'Presence API', 'Room Management API', 'Sync API'],
    mobile: ['REST API with caching headers', 'Auth Token API', 'Sync Queue API', 'Push Registration API', 'Offline Data API']
  };
  
  // Check if AI is mentioned specifically
  const lowerDesc = description.toLowerCase();
  const baseApis = apis[projectType] || apis.saas;
  
  if (lowerDesc.includes('ai') || lowerDesc.includes('gpt') || lowerDesc.includes('llm')) {
    if (!baseApis.includes('AI/LLM Integration API')) {
      baseApis.push('AI/LLM Integration API');
    }
  }
  
  return baseApis;
}

function generateBuildSequence(projectType, features) {
  return [
    `1. **Foundation** (30 min): Project setup, routing, base layout components`,
    `2. **Data Layer** (45 min): Define data models, set up state management, mock data`,
    `3. **Core UI** (60 min): Build main views and navigation, implement responsive design`,
    `4. **Primary Feature** (90 min): ${features[0] || 'Main functionality'} - the core value proposition`,
    `5. **Secondary Features** (60 min): ${features.slice(1, 3).join(', ') || 'Supporting features'}`,
    `6. **Polish** (45 min): Loading states, error handling, animations, edge cases`,
    `7. **Testing & Fix** (30 min): Manual testing, bug fixes, final adjustments`
  ];
}

function generateSuccessCriteria(projectType, description) {
  const criteria = {
    ecommerce: [
      'User can browse and search products',
      'Products can be added to cart',
      'Cart persists across sessions',
      'Checkout flow completes with confirmation',
      'Order appears in history',
      'Mobile experience is smooth'
    ],
    productivity: [
      'User can create and manage items',
      'Status changes save correctly',
      'Drag-and-drop works reliably',
      'Search returns accurate results',
      'Data persists across sessions',
      'Performance stays fast with 50+ items'
    ],
    social: [
      'User can create profile and posts',
      'Feed displays content correctly',
      'Interactions (like/comment) work',
      'Follow system functions properly',
      'Notifications appear correctly',
      'Profile edits save and display'
    ],
    saas: [
      'User can complete core workflow',
      'Dashboard displays accurate data',
      'Settings changes persist',
      'Data exports correctly',
      'Error states handled gracefully',
      'Performance acceptable under load'
    ],
    education: [
      'Lessons display and navigate properly',
      'Progress saves correctly',
      'Quizzes grade accurately',
      'Progress dashboard reflects reality',
      'Search finds relevant content',
      'Mobile learning works well'
    ],
    health: [
      'Data logs save accurately',
      'Charts display correct trends',
      'Goals track properly',
      'Reminders trigger correctly',
      'Historical data accessible',
      'Privacy controls work'
    ],
    finance: [
      'Transactions categorize correctly',
      'Budgets calculate accurately',
      'Charts reflect real data',
      'Reports generate correctly',
      'Data exports properly',
      'Multi-month views work'
    ],
    content: [
      'Editor saves content correctly',
      'Posts publish and display properly',
      'Categories/tags work correctly',
      'Search returns relevant results',
      'Drafts persist reliably',
      'Media uploads display correctly'
    ],
    ai: [
      'AI responses generate and display',
      'Conversation history saves',
      'Regeneration works correctly',
      'Templates apply properly',
      'Error handling graceful',
      'Response times acceptable'
    ],
    booking: [
      'Calendar shows correct availability',
      'Bookings save correctly',
      'Confirmations deliver',
      'Cancellations process properly',
      'Double-booking prevented',
      'Mobile booking works smoothly'
    ],
    realtime: [
      'Messages deliver instantly',
      'Presence updates in real-time',
      'Reconnection works automatically',
      'Data syncs across clients',
      'Offline mode functions',
      'No message loss on disconnect'
    ],
    mobile: [
      'Loads under 2 seconds',
      'Gestures work intuitively',
      'Offline mode functional',
      'Sync works reliably',
      'Battery usage reasonable',
      'Works on various screen sizes'
    ]
  };
  
  return criteria[projectType] || criteria.saas;
}

// Main export function
export function generateAllAnswers(projectDescription) {
  const description = projectDescription.trim();
  const { primary: projectType, secondary } = detectProjectType(description);
  const audience = extractTargetAudience(description);
  const projectName = generateProjectName(description, projectType);
  const features = generateFeatures(projectType, description);
  const entities = generateDataEntities(projectType, description);
  
  // Generate deployment based on detected type
  let deployment = 'Static hosting (Vercel, Netlify, or GitHub Pages)';
  if (description.toLowerCase().includes('database') || description.toLowerCase().includes('backend')) {
    deployment = 'Full-stack deployment (Vercel/Railway with database)';
  }
  
  return {
    1: projectName,
    2: `${projectName} is a ${projectType === 'ai' ? 'AI-powered ' : ''}${projectType} application designed for ${audience}. ${description.charAt(0).toUpperCase() + description.slice(1)}${description.endsWith('.') ? '' : '.'} The platform focuses on delivering core functionality with a clean, intuitive interface that users can master immediately.`,
    3: `Enable ${audience} to ${description.toLowerCase().includes('help') ? description.split('help')[1]?.split('.')[0]?.trim() || 'accomplish their goals efficiently' : 'accomplish their goals efficiently'} through a streamlined, focused experience that prioritizes simplicity and immediate value delivery.`,
    4: generateConstraints(projectType, description).map(c => `- ${c}`).join('\n'),
    5: deployment,
    6: features.map(f => `- ${f}`).join('\n'),
    7: generateNonGoals(projectType, description).map(n => `- ${n}`).join('\n'),
    8: entities.map(e => `- **${e}**: Core entity for ${e.toLowerCase()} data`).join('\n'),
    9: generateRelationships(projectType, entities).map(r => `- ${r}`).join('\n'),
    10: generateUserFlow(projectType, description).map((step, i) => `${i + 1}. ${step}`).join('\n'),
    11: generateAPIs(projectType, description).map(a => `- ${a}`).join('\n'),
    12: generateBuildSequence(projectType, features).join('\n'),
    13: generateSuccessCriteria(projectType, description).map(c => `- [ ] ${c}`).join('\n')
  };
}

// Question metadata
export const questions = [
  { id: 1, section: 'Project Name', icon: 'Sparkles' },
  { id: 2, section: 'One-Paragraph Summary', icon: 'FileText' },
  { id: 3, section: 'Primary Goal', icon: 'Target' },
  { id: 4, section: 'Hard Constraints', icon: 'Lock' },
  { id: 5, section: 'Deployment Requirements', icon: 'Cloud' },
  { id: 6, section: 'Core Features (Must-Haves)', icon: 'CheckSquare' },
  { id: 7, section: 'Non-Goals (What NOT to Build)', icon: 'XSquare' },
  { id: 8, section: 'Data Entities', icon: 'Database' },
  { id: 9, section: 'Entity Relationships', icon: 'GitBranch' },
  { id: 10, section: 'Main User Flow', icon: 'Route' },
  { id: 11, section: 'APIs/Services Needed', icon: 'Server' },
  { id: 12, section: 'Build Sequence', icon: 'ListOrdered' },
  { id: 13, section: 'Success Criteria', icon: 'Award' }
];

// Generate final spec markdown
export function generateSpecMarkdown(projectName, answers) {
  return `# ${answers[1]} - Project Specification

---

## 1. Project Overview

**Name:** ${answers[1]}

### Summary
${answers[2]}

### Primary Goal
${answers[3]}

---

## 2. Constraints & Requirements

### Hard Constraints
${answers[4]}

### Deployment
${answers[5]}

---

## 3. Features

### Must-Have Features
${answers[6]}

### Non-Goals (Out of Scope)
${answers[7]}

---

## 4. Data Model

### Entities
${answers[8]}

### Relationships
${answers[9]}

---

## 5. User Experience

### Main User Flow
${answers[10]}

---

## 6. Technical Architecture

### APIs & Services
${answers[11]}

### Build Sequence
${answers[12]}

---

## 7. Success Criteria

${answers[13]}

---

*Generated by SpecifyThat - Planning & Prompt Engine*
*Ready to paste into Cursor, Claude, ChatGPT, Bolt, v0, or Emergent*
`;
}
