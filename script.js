// script.js - All your JavaScript in one organized file

// ========== DATA ==========
const responseTemplates = {
  analytical: {
    default: `Looking at this systematically, we can break down the question into several key components:

1. Core Definition: The fundamental concept involves understanding the relationship between inputs and outputs
2. Key Mechanisms: The process operates through pattern recognition and statistical analysis
3. Practical Applications: This translates to real-world uses in automation, prediction, and decision support
4. Important Considerations: Scale, accuracy, and context all play crucial roles

The evidence suggests that approaching this methodically helps clarify common misconceptions.`,
    
    healthcare: `From an analytical standpoint, AI in healthcare presents quantifiable impacts:

1. Diagnostic Accuracy: Studies show 85-95% accuracy in specific imaging tasks
2. Efficiency Gains: Reduces analysis time by 40-60% in certain procedures
3. Data Processing: Can analyze millions of patient records to identify patterns
4. Risk Assessment: Predictive models achieve 70-80% accuracy in early disease detection

However, these metrics must be contextualized within clinical workflows and validated through rigorous testing.`,
    
    worry: `Analyzing this concern objectively:

Risk Factors to Consider:
- Job displacement in specific sectors (estimated 15-30% of current tasks)
- Privacy implications with data collection
- Bias in algorithmic decision-making
- Dependency on technology systems

Mitigating Factors:
- New job categories being created
- Regulatory frameworks developing
- Increased awareness of ethical AI
- Human oversight requirements

The data suggests measured concern with active engagement is more productive than either panic or dismissal.`
  },
  
  simplified: {
    default: `Think of it this way: 

Imagine teaching a child to recognize cats. You show them hundreds of cat pictures, and eventually they learn what makes something a "cat." AI works similarly - it learns from lots of examples.

The key difference? AI can process way more examples way faster than humans, but it doesn't truly "understand" like we do. It's finding patterns, not thinking.

In everyday terms: AI is like a really fast pattern-matching assistant. It's incredibly helpful for specific tasks, but it's not magic and it's definitely not replacing human judgment anytime soon.`,
    
    healthcare: `Here's the simple version:

Imagine a doctor who's seen 10,000 X-rays versus one who's seen 100. The experienced doctor spots problems faster, right?

AI in healthcare is like giving every doctor access to insights from millions of cases instantly. It helps them say, "Hey, this pattern looks similar to cases where patients had X condition - maybe we should check that."

Important: The AI doesn't replace the doctor. It's more like a really knowledgeable assistant saying "you might want to look at this." The doctor still makes the final call.

Think of it as a safety net that catches things humans might miss when we're tired or rushed.`,
    
    worry: `Let's make this relatable:

Remember when ATMs came out? People worried bank tellers would all lose jobs. What happened? Some roles changed, but banks needed people for different things - solving problems, building relationships, handling complex situations.

AI is similar. Yes, some tasks will change. But:
- New jobs are being created (someone has to teach, maintain, and oversee these systems)
- AI handles boring repetitive stuff, freeing humans for creative work
- It's a tool, like a calculator - makes us more capable, not obsolete

Should you learn about it? Yes. Should you panic? No. The people who adapt and learn to work WITH AI will be fine.`
  },
  
  critical: {
    default: `Let's question the common narrative:

What's often missing from mainstream discussions:
- Who benefits from current AI development? (Hint: mostly large tech companies)
- What biases are baked into training data? (Reflects existing societal biases)
- What are we NOT talking about? (Environmental cost, labor exploitation in data labeling)

Alternative perspectives to consider:
- AI is marketed as "inevitable progress" but it's shaped by human choices
- "Efficiency" often means "profitable" not "better for humans"
- The framing of "AI vs humans" obscures that AI is built BY humans FOR specific purposes

Critical question: Who decides what problems AI should solve, and whose problems are being ignored?`,
    
    healthcare: `Let's examine what's not being said:

The Optimistic Narrative: AI will democratize healthcare, catch diseases early, save lives.

What's conveniently omitted:
- Healthcare AI is trained primarily on data from wealthy countries/demographics
- Who owns the AI and therefore controls access? (Private companies)
- False positives can lead to unnecessary procedures and anxiety
- The "human touch" in medicine isn't just efficiency - it's empathy, context, holistic care

Uncomfortable questions:
- If AI makes diagnosis easier, will insurance companies use it to deny coverage? 
- Will hospitals cut staff and claim "AI can handle it"?
- Who's liable when AI makes a mistake?

This isn't anti-technology - it's asking "technology for whom and for what?"`,
    
    worry: `Let's flip the question:

Instead of "should you be worried?" ask:
- Worried compared to what? (Climate change? Economic inequality?)
- Who benefits when you're worried vs. when you're informed?
- What's the real concern - AI itself or how capitalism deploys it?

Nuanced take:
- Yes, job displacement is real BUT it's a policy choice, not a technology inevitability
- Privacy concerns matter BUT surveillance existed before AI
- Bias in AI is real BUT it reflects human bias, making it visible might help address it

The trap: "AI anxiety" can be used to sell you AI solutions, courses, and products.

Better approach: Focus on collective action, regulation, and ensuring AI serves public good not just profit.`
  }
};

const perspectives = [
  {
    name: 'Analytical Perspective',
    description: 'Data-driven, logical reasoning',
    color: '#6a5cff',
    icon: '📊'
  },
  {
    name: 'Simplified Perspective',
    description: 'Plain language, beginner-friendly',
    color: '#00e5ff',
    icon: '💡'
  },
  {
    name: 'Critical Perspective',
    description: 'Question assumptions, explore nuances',
    color: '#ff4fd8',
    icon: '🔍'
  }
];

// ========== DOM ELEMENTS ==========
const questionInput = document.getElementById('question-input');
const submitBtn = document.getElementById('submit-btn');
const responsesGrid = document.getElementById('responses-grid');
const errorBox = document.getElementById('error-box');
const emailCapture = document.getElementById('email-capture');
const ctaFooter = document.getElementById('cta-footer');
const askAnother = document.getElementById('ask-another');
const loading = document.getElementById('loading');

// ========== HELPER FUNCTIONS ==========
function getResponseType(question) {
  const lowerQ = question.toLowerCase();
  if (lowerQ.includes('healthcare') || lowerQ.includes('health') || lowerQ.includes('medical')) {
    return 'healthcare';
  }
  if (lowerQ.includes('worried') || lowerQ.includes('worry') || lowerQ.includes('afraid') || lowerQ.includes('fear')) {
    return 'worry';
  }
  return 'default';
}

function displayResponses(responses) {
  responsesGrid.innerHTML = '';
  
  responses.forEach(response => {
    const card = document.createElement('div');
    card.className = 'ai-response-card';
    card.style.borderLeft = `4px solid ${response.color}`;
    
    card.innerHTML = `
      <div class="ai-response-header">
        <span class="ai-response-icon">${response.icon}</span>
        <div>
          <div class="ai-response-title" style="color: ${response.color}">${response.name}</div>
          <div class="ai-response-desc">${response.description}</div>
        </div>
      </div>
      <div class="ai-response-text">${response.text}</div>
    `;
    
    responsesGrid.appendChild(card);
  });
}

// ========== MAIN FUNCTION ==========
async function handleSubmit() {
  const question = questionInput.value.trim();
  if (!question) return;

  // UI State: Loading
  submitBtn.disabled = true;
  submitBtn.textContent = 'Analyzing...';
  errorBox.style.display = 'none';
  emailCapture.style.display = 'none';
  responsesGrid.innerHTML = '';
  ctaFooter.style.display = 'none';
  loading.style.display = 'block';

  // Simulate API delay for realism
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const responseType = getResponseType(question);
    const responses = [
      {
        ...perspectives[0],
        text: responseTemplates.analytical[responseType]
      },
      {
        ...perspectives[1],
        text: responseTemplates.simplified[responseType]
      },
      {
        ...perspectives[2],
        text: responseTemplates.critical[responseType]
      }
    ];

    displayResponses(responses);
    emailCapture.style.display = 'block';
    ctaFooter.style.display = 'block';
    
  } catch (error) {
    errorBox.textContent = '⚠️ Something went wrong. Please try again.';
    errorBox.style.display = 'block';
    console.error('Error:', error);
  } finally {
    // UI State: Finished
    loading.style.display = 'none';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Compare';
  }
}

// ========== EVENT LISTENERS ==========
submitBtn.addEventListener('click', handleSubmit);

questionInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
});

askAnother.addEventListener('click', () => {
  window.scrollTo({ top: questionInput.offsetTop - 100, behavior: 'smooth' });
  questionInput.focus();
  responsesGrid.innerHTML = '';
  ctaFooter.style.display = 'none';
  emailCapture.style.display = 'none';
});

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Tally embed script
  const d = document;
  const w = "https://tally.so/widgets/embed.js";
  const v = function() {
    if (typeof Tally !== 'undefined') {
      Tally.loadEmbeds();
    } else {
      d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((e) => {
        e.src = e.dataset.tallySrc;
      });
    }
  };
  
  if (typeof Tally !== 'undefined') {
    v();
  } else if (d.querySelector('script[src="' + w + '"]') == null) {
    const s = d.createElement("script");
    s.src = w;
    s.onload = v;
    s.onerror = v;
    d.body.appendChild(s);
  }

  // Auto-focus question input if hash present
  if (window.location.hash === '#ai-comparison') {
    questionInput.focus();
  }
});