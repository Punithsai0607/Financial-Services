import { useState } from 'react';
import {
  Search, BookOpen, MessageCircle, Mail, ChevronDown, ChevronRight,
  ExternalLink, Zap, Shield, CreditCard, BarChart3, Users, Settings,
  HelpCircle, ArrowRight, Sparkles,
} from 'lucide-react';

const faqCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Zap,
    color: '#10b981',
    faqs: [
      { q: 'How do I create my first transaction?', a: 'Navigate to the Dashboard or Transactions page and click the "Add Transaction" button. Fill in the description, amount, category, type, and date, then click submit.' },
      { q: 'What are the Admin and Viewer roles?', a: 'Admin users can add, edit, and delete transactions, while Viewer users have read-only access. You can switch roles using the toggle in the header.' },
      { q: 'How do I navigate the dashboard?', a: 'Use the sidebar on the left to navigate between Dashboard, Transactions, Analytics, Settings, and Help Center. On mobile, tap the hamburger menu to open it.' },
    ],
  },
  {
    id: 'transactions',
    title: 'Transactions',
    icon: CreditCard,
    color: '#3b82f6',
    faqs: [
      { q: 'Can I export my transactions?', a: 'Yes! Go to the Transactions page and click the "Export CSV" button. This will download all your filtered transactions as a CSV file.' },
      { q: 'How do I search and filter transactions?', a: 'Use the search bar to find transactions by description or category. You can also filter by type (Income/Expense) and category using the dropdown filters.' },
      { q: 'Can I delete a transaction?', a: 'Yes, but only Admin users can delete transactions. Click the trash icon next to any transaction to remove it.' },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: BarChart3,
    color: '#8b5cf6',
    faqs: [
      { q: 'What charts are available?', a: 'The Analytics page includes area charts for income/expense trends, bar charts for monthly savings, pie charts for category breakdown, and income vs expenses comparison.' },
      { q: 'How is the savings rate calculated?', a: 'Savings Rate = (Net Savings / Total Income) × 100. Net Savings is calculated as Total Income minus Total Expenses.' },
    ],
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: Shield,
    color: '#f59e0b',
    faqs: [
      { q: 'Is my data secure?', a: 'Your session data is stored locally in your browser. We use modern security practices including encrypted connections and session management.' },
      { q: 'How do I change my password?', a: 'Go to Settings > Security and click "Change Password". You\'ll need to enter your current password and choose a new one.' },
    ],
  },
  {
    id: 'account',
    title: 'Account & Billing',
    icon: Users,
    color: '#06b6d4',
    faqs: [
      { q: 'How do I upgrade my plan?', a: 'Visit Settings > Billing to view available plans and upgrade your subscription. Pro plans include unlimited transactions and advanced analytics.' },
      { q: 'How do I update my profile?', a: 'Go to Settings > Profile to update your name, email, phone number, timezone, and default currency.' },
    ],
  },
];

export default function HelpCenterPage() {
  const [search, setSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleFaq = (id) => {
    setExpandedFaq((prev) => (prev === id ? null : id));
  };

  // Filter FAQs based on search
  const filteredCategories = faqCategories.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter(
      (faq) =>
        faq.q.toLowerCase().includes(search.toLowerCase()) ||
        faq.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.faqs.length > 0);

  const displayCategories = activeCategory
    ? filteredCategories.filter((c) => c.id === activeCategory)
    : filteredCategories;

  return (
    <div className="page-content animate-fade-in-up" style={{ opacity: 0 }}>
      {/* Hero Section */}
      <div className="help-hero glass-card">
        <div className="help-hero-content">
          <div className="help-hero-icon">
            <Sparkles size={28} />
          </div>
          <h1 className="help-hero-title">How can we help you?</h1>
          <p className="help-hero-subtitle">
            Search our knowledge base or browse categories below
          </p>
          <div className="help-search-wrapper">
            <Search size={18} className="help-search-icon" />
            <input
              className="help-search-input"
              id="help-search"
              type="text"
              placeholder="Search for answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="help-quick-links">
        <a href="#" className="help-quick-link glass-card" id="help-link-docs">
          <BookOpen size={20} />
          <div>
            <h4>Documentation</h4>
            <p>Detailed guides and tutorials</p>
          </div>
          <ExternalLink size={14} className="help-link-arrow" />
        </a>
        <a href="#" className="help-quick-link glass-card" id="help-link-chat">
          <MessageCircle size={20} />
          <div>
            <h4>Live Chat</h4>
            <p>Chat with our support team</p>
          </div>
          <ExternalLink size={14} className="help-link-arrow" />
        </a>
        <a href="#" className="help-quick-link glass-card" id="help-link-email">
          <Mail size={20} />
          <div>
            <h4>Email Support</h4>
            <p>support@zorvyn.com</p>
          </div>
          <ExternalLink size={14} className="help-link-arrow" />
        </a>
      </div>

      {/* Category Filter */}
      <div className="help-category-filter">
        <button
          className={`help-category-btn ${!activeCategory ? 'active' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          <HelpCircle size={14} /> All Topics
        </button>
        {faqCategories.map((cat) => (
          <button
            key={cat.id}
            className={`help-category-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
          >
            <cat.icon size={14} /> {cat.title}
          </button>
        ))}
      </div>

      {/* FAQ Sections */}
      <div className="help-faq-sections">
        {displayCategories.length === 0 ? (
          <div className="help-empty glass-card">
            <Search size={40} strokeWidth={1.2} style={{ color: 'var(--slate-500)' }} />
            <p>No results found for "{search}"</p>
            <button className="btn-outline" onClick={() => { setSearch(''); setActiveCategory(null); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          displayCategories.map((cat) => (
            <div key={cat.id} className="help-faq-category">
              <div className="help-faq-category-header">
                <div className="help-faq-category-icon" style={{ background: `${cat.color}15`, color: cat.color }}>
                  <cat.icon size={18} />
                </div>
                <h3>{cat.title}</h3>
                <span className="help-faq-count">{cat.faqs.length} article{cat.faqs.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="help-faq-list">
                {cat.faqs.map((faq, i) => {
                  const faqId = `${cat.id}-${i}`;
                  const isOpen = expandedFaq === faqId;
                  return (
                    <div key={faqId} className={`help-faq-item glass-card ${isOpen ? 'open' : ''}`}>
                      <button
                        className="help-faq-question"
                        onClick={() => toggleFaq(faqId)}
                        id={`faq-${faqId}`}
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      {isOpen && (
                        <div className="help-faq-answer animate-fade-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contact CTA */}
      <div className="help-cta glass-card">
        <div>
          <h3>Still need help?</h3>
          <p>Our support team is available 24/7 to assist you</p>
        </div>
        <button className="add-btn" id="help-contact-btn">
          <MessageCircle size={16} />
          Contact Support
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
