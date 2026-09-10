import { useState, useMemo } from "react";
import { useToast } from "./Toast";
import {
  FiX,
  FiZap,
  FiTrendingUp,
  FiCopy,
  FiCheck,
  FiRefreshCw,
  FiSliders,
} from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";

const PRESET_TOPICS = [
  { id: "react", label: "⚡ React 19 & Server Components", prompt: "Write an exciting post on React 19 Compiler and Server Actions" },
  { id: "ai", label: "🤖 AI Pair Programming in 2026", prompt: "Explain how autonomous AI agents transformed frontend development workflows" },
  { id: "css", label: "🎨 Glassmorphism & Modern CSS", prompt: "Share tips for designing OLED dark mode with glass reflections and zero runtime CSS" },
  { id: "vite", label: "🚀 Fast Builds with Vite 7", prompt: "Break down why Vite 7 sub-100ms build times are unmatched for developer happiness" },
  { id: "career", label: "💡 Junior to Senior Dev Advice", prompt: "Share 3 high-impact habits that separate senior engineers from average coders" },
];

const TONES = [
  { id: "influencer", name: "Tech Influencer", emoji: "🚀", desc: "High energy, punchy hooks & viral formatting" },
  { id: "founder", name: "SaaS Founder", emoji: "💼", desc: "Metrics, building in public & honest lessons" },
  { id: "dev_humor", name: "Dev Humor", emoji: "🤓", desc: "Witty, relatable bugs & terminal jokes" },
  { id: "concise", name: "Concise & Punchy", emoji: "⚡", desc: "No fluff, high-signal actionable takeaways" },
  { id: "thought_leader", name: "Thought Leader", emoji: "💡", desc: "Macro trends, architectural depth & future outlook" },
];

const TEMPLATES = {
  influencer: (topic) => ({
    title: `Stop sleeping on ${topic} in 2026 🤯`,
    body: `If you haven't adopted this pattern yet, you are leaving massive developer productivity on the table.\n\nHere are 3 game-changing truths you need to understand right now:\n\n1️⃣ Instant iteration cycles reduce cognitive fatigue by 50%.\n2️⃣ Clean component abstractions make scaling effortless.\n3️⃣ The community standard has shifted — adapt or fall behind.\n\nWhat is your biggest blocker to adopting this today? Drop your thoughts below! 👇`,
    tags: ["tech", "frontend", "engineering", "productivity", "future"],
  }),
  founder: (topic) => ({
    title: `What building with ${topic} taught us after 100k users 📈`,
    body: `We spent the last 3 quarters rebuilding our architecture around this core philosophy.\n\nThe raw numbers:\n• Page load dropped from 1.8s down to 310ms\n• Engineering velocity doubled with unified design tokens\n• Zero production regression bugs caught by automated agent testing\n\nThe secret isn't more libraries — it's removing friction from your feedback loop.`,
    tags: ["startups", "buildinginpublic", "architecture", "saas"],
  }),
  dev_humor: (topic) => ({
    title: `Me: I will quickly configure ${topic} in 10 minutes 🤡`,
    body: `*4 hours later*\n\n• 47 open StackOverflow tabs\n• 3 node_modules deleted\n• Questioning my entire career choices\n• But hey, at least the hot reload works at 15ms speed! ✨\n\nWho else feels personally attacked by this? 😂☕`,
    tags: ["coding", "devhumor", "webdev", "javascript"],
  }),
  concise: (topic) => ({
    title: `Mastering ${topic}: The 30-Second Summary ⚡`,
    body: `Key highlights:\n- Direct browser primitives beat bloated abstraction layers.\n- Focus on bundle size, zero-runtime tokens, and semantic HTML.\n- Prioritize user responsiveness above all else.\n\nSave this for your next architecture review.`,
    tags: ["quicktips", "webdev", "performance", "bestpractices"],
  }),
  thought_leader: (topic) => ({
    title: `The architectural paradigm shift: Why ${topic} defines the next decade 🌐`,
    body: `We are witnessing a fundamental inflection point in user interface engineering.\n\nWhen we eliminate runtime compilation overhead and empower autonomous agent verification, our role as developers transforms from manual coders to strategic architects.\n\nThe future belongs to those who build for resilience, speed, and fluid human-computer interaction.`,
    tags: ["technology", "future", "innovation", "software"],
  }),
};

const calculateViralScore = (title, body, tags) => {
  let score = 50;
  if (!title && !body) return { score: 0, grade: "Empty", tips: ["Start writing or pick a prompt to evaluate viral potential."] };

  // Length check
  const charLen = (body || "").length;
  if (charLen > 80 && charLen < 450) score += 15;
  else if (charLen >= 450) score += 8;

  // Question or hook check
  if (/[?!]/.test(title || "")) score += 12;
  if (/[?!]/.test(body || "")) score += 8;

  // Emojis
  if (/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu.test(body || "")) score += 8;

  // Bullet points
  if (/[-•]|\d+\)/.test(body || "") || (body || "").includes("1️⃣")) score += 10;

  // Tags
  if (tags && tags.length >= 2) score += 10;

  score = Math.min(score, 99);

  let grade = "Moderate";
  let tips = [];
  if (score >= 85) {
    grade = "Viral Ready 🔥";
    tips = ["Strong hook detected!", "Scannable formatting & optimal length", "High engagement probability."];
  } else if (score >= 70) {
    grade = "High Potential ✨";
    tips = ["Good structure.", "Add a question at the end to boost comment replies!"];
  } else {
    grade = "Needs Polish ✏️";
    tips = ["Add bullet points or numbered lists.", "Include 2-3 trending hashtags for discoverability."];
  }

  return { score, grade, tips };
};

const AiMagicModal = ({ isOpen, onClose, onApply, initialDraft = { title: "", body: "", tags: [] } }) => {
  const { showToast } = useToast();
  const [activeTone, setActiveTone] = useState("influencer");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState(initialDraft.title || "");
  const [generatedBody, setGeneratedBody] = useState(initialDraft.body || "");
  const [generatedTags, setGeneratedTags] = useState(
    initialDraft.tags?.length ? initialDraft.tags : ["ai", "tech", "webdev"]
  );

  const viralAnalysis = useMemo(
    () => calculateViralScore(generatedTitle, generatedBody, generatedTags),
    [generatedTitle, generatedBody, generatedTags]
  );

  if (!isOpen) return null;

  const handleGenerateFromTopic = (topicItem) => {
    setIsGenerating(true);
    setCustomPrompt(topicItem.prompt);

    setTimeout(() => {
      const templateFn = TEMPLATES[activeTone] || TEMPLATES.influencer;
      const cleanTopic = topicItem.label.replace(/^[^\w\s]+/, "").trim();
      const res = templateFn(cleanTopic);

      setGeneratedTitle(res.title);
      setGeneratedBody(res.body);
      setGeneratedTags(res.tags);
      setIsGenerating(false);

      showToast({
        type: "success",
        title: "AI Post Draft Ready! ✨",
        message: `Generated in "${TONES.find((t) => t.id === activeTone)?.name}" tone.`,
      });
    }, 450);
  };

  const handleToneChange = (newToneId) => {
    setActiveTone(newToneId);
    if (generatedBody || customPrompt) {
      setIsGenerating(true);
      setTimeout(() => {
        const topic = customPrompt || generatedTitle || "Modern Software Engineering";
        const templateFn = TEMPLATES[newToneId] || TEMPLATES.influencer;
        const res = templateFn(topic.slice(0, 35));

        setGeneratedTitle(res.title);
        setGeneratedBody(res.body);
        setGeneratedTags(res.tags);
        setIsGenerating(false);
      }, 350);
    }
  };

  const handleApply = () => {
    onApply({
      title: generatedTitle,
      body: generatedBody,
      tags: generatedTags,
    });
    showToast({
      type: "success",
      title: "Draft Applied 🚀",
      message: "AI generated content populated into your composer.",
    });
    onClose();
  };

  return (
    <div className="ai-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ai-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="ai-modal-header">
          <div className="ai-modal-title-group">
            <div className="ai-magic-badge">
              <RiSparklingFill /> AI Studio Copilot
            </div>
            <h2 className="ai-modal-heading">Magic Post Assistant & Viral Polish</h2>
          </div>
          <button
            type="button"
            className="ai-modal-close-btn"
            onClick={onClose}
            aria-label="Close AI Studio"
          >
            <FiX />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="ai-modal-body-grid">
          {/* Left Controls */}
          <div className="ai-modal-controls-col">
            {/* Tone Selector */}
            <div className="ai-control-group">
              <label className="ai-control-label">
                <FiSliders /> Select Tone of Voice
              </label>
              <div className="ai-tone-chips-grid">
                {TONES.map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    className={`ai-tone-chip ${activeTone === tone.id ? "active" : ""}`}
                    onClick={() => handleToneChange(tone.id)}
                  >
                    <span className="ai-tone-emoji">{tone.emoji}</span>
                    <div className="ai-tone-meta">
                      <span className="ai-tone-name">{tone.name}</span>
                      <span className="ai-tone-desc">{tone.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Inspiration Topics */}
            <div className="ai-control-group">
              <label className="ai-control-label">
                <FiZap /> Quick Topic Prompts
              </label>
              <div className="ai-presets-list">
                {PRESET_TOPICS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className="ai-preset-item-btn"
                    onClick={() => handleGenerateFromTopic(preset)}
                    disabled={isGenerating}
                  >
                    <span>{preset.label}</span>
                    <RiSparklingFill className="ai-btn-sparkle" />
                  </button>
                ))}
              </div>
            </div>

            {/* Viral Predictor Score Meter */}
            <div className="ai-viral-meter-card">
              <div className="ai-meter-top">
                <div className="ai-meter-title-wrap">
                  <FiTrendingUp className="ai-meter-icon" />
                  <span className="ai-meter-title">Predicted Viral Impact</span>
                </div>
                <span className="ai-meter-score-badge">{viralAnalysis.score}/100</span>
              </div>

              <div className="ai-score-progress-track">
                <div
                  className="ai-score-progress-fill"
                  style={{ width: `${viralAnalysis.score}%` }}
                />
              </div>

              <div className="ai-meter-grade-text">{viralAnalysis.grade}</div>

              <ul className="ai-meter-tips-list">
                {viralAnalysis.tips.map((tip, idx) => (
                  <li key={idx} className="ai-tip-item">
                    <FiCheck className="ai-tip-check" /> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Preview & Editor */}
          <div className="ai-modal-preview-col">
            <div className="ai-preview-header">
              <span className="ai-preview-label">Live Generated Draft</span>
              {isGenerating && (
                <span className="ai-generating-tag">
                  <FiRefreshCw className="spinning" /> Synthesizing creative draft...
                </span>
              )}
            </div>

            <div className="ai-draft-container">
              <div className="ai-draft-field">
                <label className="ai-field-label">Post Title</label>
                <input
                  type="text"
                  className="ai-input-title"
                  placeholder="Draft post title..."
                  value={generatedTitle}
                  onChange={(e) => setGeneratedTitle(e.target.value)}
                />
              </div>

              <div className="ai-draft-field">
                <label className="ai-field-label">Post Content</label>
                <textarea
                  className="ai-textarea-body"
                  rows={9}
                  placeholder="Generated body text will appear here..."
                  value={generatedBody}
                  onChange={(e) => setGeneratedBody(e.target.value)}
                />
              </div>

              {/* Tags */}
              <div className="ai-draft-tags-row">
                <span className="ai-tags-label">Tags:</span>
                <div className="ai-tags-wrap">
                  {generatedTags.map((t) => (
                    <span key={t} className="ai-tag-pill">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="ai-modal-actions-bar">
              <button
                type="button"
                className="ai-btn-secondary"
                onClick={() => {
                  navigator.clipboard?.writeText(`${generatedTitle}\n\n${generatedBody}`);
                  showToast({
                    type: "success",
                    title: "Copied! 📋",
                    message: "Draft copied to your clipboard.",
                  });
                }}
                disabled={!generatedBody}
              >
                <FiCopy /> Copy Text
              </button>

              <button
                type="button"
                className="ai-btn-primary"
                onClick={handleApply}
                disabled={!generatedBody.trim()}
              >
                <RiSparklingFill /> Apply to Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiMagicModal;
