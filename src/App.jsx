import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight, Video, Mic, Globe2, Loader2, Wand2, Send, RotateCcw, History } from 'lucide-react';
import { generateRandomIdea, generateScenario, getOpeningLine, sendChatMessage, generateSpeech } from './services/gemini';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="container flex-col items-center justify-center" style={{ minHeight: '100vh', textAlign: 'center' }}>
      <div className="bg-glow-blob" style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }}></div>

      <div className="animate-fade-in flex-col items-center gap-8">
        <div className="glass-panel" style={{ display: 'inline-flex', padding: '0.5rem 1rem', borderRadius: '999px', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={16} className="text-secondary" />
          <span className="text-subtle" style={{ fontSize: '0.875rem', fontWeight: 500 }}>The Ultimate Founder Sandbox</span>
        </div>

        <h1 style={{ fontSize: '4rem', maxWidth: '800px', margin: '0 auto' }}>
          Perfect Your Pitch. <br />
          <span className="text-gradient">Secure the Bag.</span>
        </h1>

        <p className="text-subtle" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '1rem auto 2rem' }}>
          HyperFounder immerses you in hyper-realistic, AI-driven scenarios. From skeptical VCs to confused relatives.
        </p>

        <div className="flex justify-center gap-4">
          <button className="btn-primary" onClick={() => navigate('/setup')} style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
            Start Simulation <ArrowRight size={20} />
          </button>
          <button className="btn-secondary" onClick={() => navigate('/history')} style={{ fontSize: '1.125rem', padding: '1rem 2rem', background: 'var(--bg-tertiary)' }}>
            <History size={20} /> Mission History
          </button>
        </div>

        <div className="flex items-center gap-8 text-subtle" style={{ marginTop: '4rem', opacity: 0.7 }}>
          <div className="flex items-center gap-2"><Globe2 size={16} /> Dynamic AI Environments</div>
          <div className="flex items-center gap-2"><Mic size={16} /> Real-time AI Interaction</div>
        </div>
      </div>
    </div>
  );
}

function LevelSetup() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState('social network to connect dog-lovers on play dates');
  const [founderName, setFounderName] = useState('Alex');
  const [founderGender, setFounderGender] = useState('Male');
  const [customCharacter, setCustomCharacter] = useState('Female mid 20s woman named Jen, who loves her Shih Tzu Muffin');
  const [customEnvironment, setCustomEnvironment] = useState('NY subway');
  const [customGoal, setCustomGoal] = useState('Sign them up for the app waitlist');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateIdea = async () => {
    setIsLoading(true);
    const result = await generateRandomIdea();
    if (result) {
      setIdea(`${result.name}: ${result.tagline}\n\nProblem: ${result.problem}`);
    } else {
      setIdea("Bloop: A social network for dogs to rate fire hydrants.");
    }
    setIsLoading(false);
  };

  const loadPreset = (presetName) => {
    if (presetName === "dog_app") {
      setFounderName('Alex');
      setFounderGender('Male');
      setCustomCharacter('Female mid 20s woman named Jen, who loves her Shih Tzu Muffin');
      setCustomEnvironment('NY subway');
      setCustomGoal('Sign them up for the app waitlist');
      setIdea('social network to connect dog-lovers on play dates');
    } else if (presetName === 'umass') {
      setFounderName('Varshini');
      setFounderGender('Female');
      setCustomCharacter(`Shanyu, early stage startup founder and UMass Alumni. BEHAVIOR: You MUST start the conversation with friendly small talk about UMass (e.g. "How is your course work?", "How is the weather on campus?"). Then, after they pitch, you must aggressively challenge the idea. Argue that online assessments and take-home projects are better, and point out that GitHub/LinkedIn profiles can easily be faked or exaggerated. Say: "Why should I use your platform for this?" and "I don't really think you are clear on why you are building this."`);
      setCustomEnvironment('University cafe (Roots Cafe or similar)');
      setCustomGoal('Get feedback on the product and see if they would use it for screening candidates');
      setIdea('A credibility-first opportunity matchmaker platform that builds a robust knowledge graph of candidates based on GitHub repos, LinkedIn, online portfolios to screen candidates better than online assessments.');
    } else if (presetName === 'linkedin') {
      setFounderName('Varshini');
      setFounderGender('Female');
      setCustomCharacter('A tech recruiter looking for top talent on LinkedIn or a virtual networking event.');
      setCustomEnvironment('A virtual networking event or LinkedIn message thread.');
      setCustomGoal('Get them to agree that a unified credibility graph is better than standard resumes, and agree to beta test it.');
      setIdea('A credibility-first opportunity matchmaker platform that builds a robust knowledge graph of candidates based on GitHub repos, LinkedIn, online portfolios to screen candidates better than online assessments.');
    }
  };

  const launchMission = async (difficulty) => {
    setIsLoading(true);
    const finalIdea = idea.trim() || "A generic B2B SaaS platform for productivity.";
    const finalName = founderName.trim() || "The Founder";
    const finalCharacter = customCharacter.trim();
    const finalEnvironment = customEnvironment.trim();

    const scenario = await generateScenario(difficulty, finalIdea, finalName, finalCharacter, finalEnvironment);
    setIsLoading(false);

    if (scenario) {
      navigate('/simulation', { state: { scenario, idea: finalIdea, founderName: finalName, founderGender, customGoal: customGoal.trim() } });
    } else {
      alert("Failed to generate scenario. Please check your API key.");
    }
  };

  return (
    <div className="container flex-col items-center justify-center animate-fade-in" style={{ minHeight: '100vh' }}>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', marginTop: '2rem', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Select Your Mission</h2>

        {/* Presets */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="text-subtle" style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem', fontSize: '0.875rem' }}>Demo Presets:</span>
          <button className="btn-secondary" onClick={() => loadPreset('dog_app')} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>🐶 Dog Social App</button>
          <button className="btn-secondary" onClick={() => loadPreset('umass')} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>🎓 UMass Startup Pitch</button>
          <button className="btn-secondary" onClick={() => loadPreset('linkedin')} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>💼 HR/Recruiter Pitch</button>
        </div>

        {/* Founder Name Input */}
        <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>What is your name?</h3>
              <input
                type="text"
                className="input-glass"
                style={{ marginBottom: '0.5rem' }}
                placeholder="e.g. Alex"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
              />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Your Voice (Gender)</h3>
              <select
                className="input-glass"
                style={{ marginBottom: '0.5rem', background: 'var(--bg-secondary)', color: 'white' }}
                value={founderGender}
                onChange={(e) => setFounderGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Custom Context Input */}
        <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Who are you meeting? <span className="text-subtle" style={{ fontSize: '0.8rem' }}>(Optional)</span></h3>
          <input
            type="text"
            className="input-glass"
            style={{ marginBottom: '1rem' }}
            placeholder="e.g. A dog lover on the subway in NYC"
            value={customCharacter}
            onChange={(e) => setCustomCharacter(e.target.value)}
          />

          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Where are you meeting? <span className="text-subtle" style={{ fontSize: '0.8rem' }}>(Optional)</span></h3>
          <input
            type="text"
            className="input-glass"
            style={{ marginBottom: '1rem' }}
            placeholder="e.g. A loud Starbucks, or a quiet park bench"
            value={customEnvironment}
            onChange={(e) => setCustomEnvironment(e.target.value)}
          />

          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>What is your goal for this pitch? <span className="text-subtle" style={{ fontSize: '0.8rem' }}>(For Scoring)</span></h3>
          <input
            type="text"
            className="input-glass"
            placeholder="e.g. Get them to sign up, validate my problem, get a second meeting..."
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
          />
        </div>

        {/* Idea Input */}
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>What are you pitching today?</h3>
          <textarea
            className="input-glass"
            style={{ minHeight: '80px', marginBottom: '1rem' }}
            placeholder="Describe your startup idea here..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <div className="flex justify-end">
            <button className="btn-secondary" onClick={handleGenerateIdea} disabled={isLoading} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              <Wand2 size={16} /> Random Idea
            </button>
          </div>
        </div>

        <p className="text-subtle" style={{ marginBottom: '1.5rem' }}>Select difficulty to generate a dynamic environment:</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Level Cards */}
          <div className="glass-panel" style={{ cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1, padding: '1.5rem', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }} onClick={() => !isLoading && launchMission('easy')}>
            <h3 style={{ fontSize: '1.25rem' }}>Level 1: Friendly Face</h3>
            <p className="text-subtle" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Pitch to someone supportive who wants you to succeed.</p>
            <div style={{ marginTop: '1rem', color: 'var(--accent-tertiary)', fontSize: '0.875rem' }}>Difficulty: Easy</div>
          </div>

          <div className="glass-panel" style={{ cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1, padding: '1.5rem', transition: 'all 0.3s' }} onClick={() => !isLoading && launchMission('medium')}>
            <h3 style={{ fontSize: '1.25rem' }}>Level 2: Business Casual</h3>
            <p className="text-subtle" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Standard Q&A with someone looking for real value.</p>
            <div style={{ marginTop: '1rem', color: 'var(--accent-secondary)', fontSize: '0.875rem' }}>Difficulty: Medium</div>
          </div>

          <div className="glass-panel" style={{ cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1, padding: '1.5rem', transition: 'all 0.3s' }} onClick={() => !isLoading && launchMission('hard')}>
            <h3 style={{ fontSize: '1.25rem' }}>Level 3: The Shark</h3>
            <p className="text-subtle" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Aggressive, skeptical, looking for reasons to reject.</p>
            <div style={{ marginTop: '1rem', color: '#ef4444', fontSize: '0.875rem' }}>Difficulty: Hard</div>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center gap-2 text-accent-primary" style={{ padding: '1rem' }}>
            <Loader2 size={24} className="animate-spin" /> Generating AI Scenario...
          </div>
        )}

        <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    </div>
  );
}

function SimulationRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const scenario = location.state?.scenario;
  const userIdea = location.state?.idea;
  const founderName = location.state?.founderName;
  const founderGender = location.state?.founderGender || 'Male';
  const customGoal = location.state?.customGoal;

  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [povImageBase64, setPovImageBase64] = useState(null);
  const chatEndRef = useRef(null);
  const hasInitialized = useRef(false);
  const activeAudioRef = useRef(null);
  const isInterruptedRef = useRef(false);
  const isAiSpeakingRef = useRef(false);
  const isAiLoadingRef = useRef(true);

  // Speech Recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = useRef(SpeechRecognition ? new SpeechRecognition() : null);

  useEffect(() => {
    if (recognition.current) {
      recognition.current.continuous = false;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Listen for text input when SpeechRecognition ends
  useEffect(() => {
    if (!isListening && inputText.trim() && !isAiLoading && !isAiSpeaking) {
      // Auto-submit if the mic turned off and we have text
      handleSendMessage();
    }
  }, [isListening]);

  // Initialize the conversation
  useEffect(() => {
    if (!scenario) {
      navigate('/setup');
      return;
    }

    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initCall = async () => {
      setIsAiLoading(true);

      // Fetch the image and the opening line concurrently for speed
      const [firstLine, povImage] = await Promise.all([
        getOpeningLine(scenario, founderName),
        generatePOVImage(scenario)
      ]);

      if (povImage) {
        setPovImageBase64(povImage);
      }

      if (firstLine) {
        setChatHistory([{ role: 'model', content: firstLine }]);
        simulateAudioPlayback(firstLine);
      }
      setIsAiLoading(false);
    };

    initCall();
  }, [scenario, navigate]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const simulateAudioPlayback = async (text) => {
    setIsAiSpeaking(true);
    isInterruptedRef.current = false;

    const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);

    for (const part of parts) {
      if (isInterruptedRef.current) break;

      const isNarration = part.startsWith('*') && part.endsWith('*');
      const cleanPart = isNarration ? part.replace(/\*/g, '').trim() : part.trim();
      if (!cleanPart) continue;

      // Attempt ElevenLabs realistic generation first
      const audioUrl = await generateSpeech(cleanPart, scenario.persona, isNarration);

      if (isInterruptedRef.current) break;

      if (audioUrl) {
        await new Promise((resolve) => {
          if (isInterruptedRef.current) return resolve();

          const audio = new Audio(audioUrl);
          activeAudioRef.current = audio;

          audio.onended = () => {
            activeAudioRef.current = null;
            resolve();
          };
          audio.onerror = async () => {
            console.error("ElevenLabs audio playback failed, falling back");
            activeAudioRef.current = null;
            if (!isInterruptedRef.current) await fallbackAudioPlayback(cleanPart, isNarration);
            resolve();
          };
          audio.play().catch(async e => {
            console.error("Audio block:", e);
            activeAudioRef.current = null;
            if (!isInterruptedRef.current) await fallbackAudioPlayback(cleanPart, isNarration);
            resolve();
          });
        });
      } else {
        if (!isInterruptedRef.current) await fallbackAudioPlayback(cleanPart, isNarration);
      }
    }

    if (!isInterruptedRef.current) {
      setIsAiSpeaking(false);
    }
  };

  const handleInterrupt = () => {
    isInterruptedRef.current = true;
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsAiSpeaking(false);
  };

  const fallbackAudioPlayback = (text, isNarration) => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onend = resolve;
        utterance.onerror = resolve;

        const handleFallbackPlay = () => {
          if (isInterruptedRef.current) {
            window.speechSynthesis.cancel();
            resolve();
            return;
          }
          window.speechSynthesis.speak(utterance);
        };

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          if (isNarration) {
            const narrator = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Alex'));
            if (narrator) utterance.voice = narrator;
          } else {
            const demoString = scenario.persona.demographic?.toLowerCase() || '';
            const nameString = scenario.persona.name?.toLowerCase() || '';
            const isFemale = /\b(female|woman|lady|girl|aunt|jen|mom|sister)\b/.test(demoString) || /\b(jen|sarah|linda|misa|samantha|ginger)\b/.test(nameString);

            const preferredVoice = voices.find(v => isFemale ? (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female')) : (v.name.includes('Male') || v.name.includes('Alex') || v.name.includes('Google UK English Male')));
            if (preferredVoice) utterance.voice = preferredVoice;
          }
        }

        utterance.rate = 1.05;
        utterance.pitch = isNarration ? 0.8 : 1;

        handleFallbackPlay();
      } else {
        const words = text.split(' ').length;
        setTimeout(resolve, words * 300);
      }
    });
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.current?.stop();
    } else {
      if (window.speechSynthesis.speaking) window.speechSynthesis.cancel(); // Stop AI if we interrupt
      setInputText('');
      recognition.current?.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isAiLoading) return;

    const userMsg = { role: 'user', content: inputText.trim() };
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setInputText('');
    setIsAiLoading(true);

    const aiResponse = await sendChatMessage(scenario, newHistory, userMsg.content, founderName);
    if (aiResponse) {
      setChatHistory([...newHistory, { role: 'model', content: aiResponse }]);
      simulateAudioPlayback(aiResponse);
    } else {
      setChatHistory([...newHistory, { role: 'model', content: "..." }]);
    }

    setIsAiLoading(false);
  };

  if (!scenario) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <header className="glass-panel" style={{ borderRadius: '0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div className="flex items-center gap-4">
          <div style={{ background: 'var(--accent-primary)', width: '12px', height: '12px', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-glow)' }}></div>
          <span style={{ fontWeight: 600, letterSpacing: '1px' }}>LIVE SESSION</span>
        </div>
        <div className="text-subtle">Target: {scenario.persona.role} | Location: {scenario.context.location}</div>
      </header>

      {/* Main Sandbox Area */}
      <main style={{ flex: 1, display: 'flex', position: 'relative', padding: '2rem', gap: '2rem' }}>
        <div className="bg-glow-blob" style={{ bottom: '-10%', right: '10%' }}></div>

        {/* Visual/Audio Focus Area */}
        <div className="glass-panel flex-col items-center justify-center animate-fade-in" style={{
          flex: 2,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: povImageBase64 ? `url(${povImageBase64})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: povImageBase64 ? '1px solid rgba(255,255,255,0.1)' : undefined
        }}>
          {povImageBase64 && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0.2) 100%)', zIndex: 0 }}></div>}

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>

            <div className="text-subtle" style={{ position: 'absolute', top: '-1rem', right: '-1rem', background: 'rgba(0,0,0,0.6)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', textAlign: 'right', backdropFilter: 'blur(10px)' }}>
              <div><strong style={{ color: 'var(--accent-primary)' }}>Scene:</strong> {scenario.context.setup}</div>
              {scenario.persona.demographic && <div style={{ marginTop: '0.25rem', color: 'var(--accent-secondary)' }}><strong>Look:</strong> {scenario.persona.demographic}</div>}
            </div>

            <div style={{
              width: '120px', height: '120px', borderRadius: '50%', background: povImageBase64 ? 'rgba(0,0,0,0.4)' : 'var(--bg-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
              border: povImageBase64 ? '1px solid rgba(255,255,255,0.2)' : '2px solid var(--border-strong)', position: 'relative',
              boxShadow: isAiSpeaking ? '0 0 40px var(--accent-tertiary)' : povImageBase64 ? '0 4px 20px rgba(0,0,0,0.5)' : 'none',
              transition: 'box-shadow 0.3s ease',
              backdropFilter: povImageBase64 ? 'blur(8px)' : 'none'
            }}>
              {/* Outer pulsing ring for AI speaking */}
              {isAiSpeaking && <div style={{ position: 'absolute', inset: '-15px', borderRadius: '50%', border: '3px dashed var(--accent-tertiary)', animation: 'spin 4s linear infinite', opacity: 0.8 }}></div>}

              {isAiLoading ? <Loader2 size={36} className="animate-spin text-accent-secondary" /> : <Mic size={36} className={isAiSpeaking ? 'text-primary' : 'text-subtle'} />}
            </div>

            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.25rem', textShadow: povImageBase64 ? '0 2px 10px rgba(0,0,0,0.9)' : 'none' }}>"{scenario.persona.name}"</h2>
            {scenario.persona.mood && <div className="text-gradient" style={{ fontWeight: 600, marginBottom: '0.5rem', textShadow: povImageBase64 ? '0 2px 10px rgba(0,0,0,0.9)' : 'none' }}>{scenario.persona.mood} | {scenario.persona.knowledgeLevel}</div>}

            <p className="text-subtle" style={{ maxWidth: '400px', textAlign: 'center', minHeight: '3rem', textShadow: povImageBase64 ? '0 2px 10px rgba(0,0,0,0.9)' : 'none' }}>
              {isAiSpeaking ? "AI is speaking..." : isAiLoading ? "Thinking..." : "Listening..."}
            </p>
          </div>
        </div>

        {/* Chat & Controls */}
        <div className="flex-col gap-4 animate-fade-in" style={{ flex: 1, display: 'flex' }}>

          {/* Context/Prompt Log */}
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Simulation Log</h3>
            <div className="flex-col gap-4" style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
              {/* Message bubbles */}
              {chatHistory.map((msg, i) => (
                <div key={i} style={{
                  background: msg.role === 'model' ? 'var(--bg-tertiary)' : 'var(--accent-glow)',
                  padding: '1rem', borderRadius: '12px',
                  alignSelf: msg.role === 'model' ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  borderBottomLeftRadius: msg.role === 'model' ? '2px' : '12px',
                  borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                }}>
                  <span style={{ fontSize: '0.75rem', color: msg.role === 'model' ? 'var(--accent-tertiary)' : 'var(--text-primary)', opacity: msg.role === 'user' ? 0.7 : 1, display: 'block', marginBottom: '0.25rem' }}>
                    {msg.role === 'model' ? `AI (${scenario.persona.name})` : 'You'}
                  </span>
                  {msg.content}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <input
              type="text"
              className="input-glass"
              placeholder="Type your response..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isAiLoading || isAiSpeaking}
            />
            <div className="flex justify-between items-center" style={{ marginTop: '1rem' }}>
              <button
                className={`btn-secondary ${isListening ? 'listening-active' : ''}`}
                onClick={toggleListening}
                style={{
                  padding: '0.5rem',
                  borderRadius: '50%',
                  background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                  color: isListening ? '#ef4444' : 'inherit',
                  borderColor: isListening ? '#ef4444' : 'var(--border-subtle)',
                  animation: isListening ? 'pulse 2s infinite' : 'none'
                }}
                title={recognition.current ? "Tap to speak" : "Voice input not supported in this browser"}
                disabled={!recognition.current || isAiLoading}
              >
                <Mic size={20} />
              </button>

              <div className="flex gap-2">
                {isAiSpeaking && (
                  <button className="btn-secondary" onClick={handleInterrupt} style={{ padding: '0.5rem 1.5rem', color: '#ef4444', borderColor: '#ef4444' }}>
                    Interrupt
                  </button>
                )}
                <button
                  className="btn-secondary"
                  onClick={() => navigate('/feedback', { state: { scenario, chatHistory, customGoal, founderName, founderGender } })}
                  style={{ padding: '0.5rem 1.5rem', background: 'var(--accent-tertiary)', color: '#000', border: 'none', fontWeight: 600 }}
                  disabled={isAiSpeaking}
                >
                  End Session & Generate Video
                </button>
                <button className="btn-primary" onClick={handleSendMessage} disabled={isAiLoading || isAiSpeaking || !inputText.trim()} style={{ padding: '0.5rem 1.5rem', opacity: (isAiLoading || isAiSpeaking || !inputText.trim()) ? 0.5 : 1 }}>
                  <Send size={16} /> Send
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}} />
    </div>
  );
}

import { evaluatePitch, generatePOVImage, generateVeoPrompt } from './services/gemini';

function FeedbackRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const scenario = location.state?.scenario;
  const chatHistory = location.state?.chatHistory;
  const founderName = location.state?.founderName;
  const founderGender = location.state?.founderGender;
  const customGoal = location.state?.customGoal;

  const [veoVideoUrl, setVeoVideoUrl] = useState(null);
  const [veoStatus, setVeoStatus] = useState('');
  const [veoError, setVeoError] = useState(null);

  useEffect(() => {
    if (!scenario || !chatHistory) {
      navigate('/');
      return;
    }

    const fetchFeedback = async () => {
      setIsLoading(true);
      try {
        const result = await evaluatePitch(scenario, chatHistory, customGoal);
        setFeedback(result);

        // Save the run to localStorage
        saveMissionToStorage({
          founderName,
          scenario,
          customGoal,
          score: result.score,
          date: new Date().toISOString(),
          chatHistory
        });
      } catch (e) {
        console.error("Evaluation error:", e);
        setFeedback(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [scenario, chatHistory, navigate, founderName, founderGender]);

  const runVeo = async () => {
    try {
      setVeoError(null);
      setVeoStatus('Analyzing conversation to write cinematic prompt...');
      const prompt = await generateVeoPrompt(scenario, chatHistory, founderName, founderGender);

      setVeoStatus('Starting Veo 3 generation...');
      const res = await fetch('/api/veo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      if (data.cached) {
        setVeoVideoUrl(`data:video/mp4;base64,${data.videoBytes}`);
        setVeoStatus('');
        return;
      }

      const operationName = data.name;
      if (!operationName) throw new Error("No operation returned.");

      setVeoStatus('Generating video... (this takes 1-2 minutes)');

      while (true) {
        await new Promise(r => setTimeout(r, 10000));
        const statRes = await fetch('/api/veo/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName })
        });
        const statData = await statRes.json();

        if (statData.done) {
          if (statData.error) throw new Error(statData.error.message || "Generation failed");
          const videoBytes = statData.response?.videos?.[0]?.bytesBase64Encoded;
          if (videoBytes) {
            setVeoVideoUrl(`data:video/mp4;base64,${videoBytes}`);
            setVeoStatus('');
            fetch('/api/veo/cache', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt, videoBytes })
            });
            break;
          } else {
            throw new Error("Video format unknown in response.");
          }
        } else {
          setVeoStatus('Generating video... (still processing...)');
        }
      }
    } catch (e) {
      console.error("Veo Error:", e);
      setVeoError(e.message);
      setVeoStatus('');
    }
  };

  if (isLoading) {
    return (
      <div className="container flex-col items-center justify-center animate-fade-in" style={{ minHeight: '100vh' }}>
        <Loader2 size={48} className="animate-spin text-accent-primary" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem' }}>Analyzing Pitch Performance...</h2>
        <p className="text-subtle">Evaluating against the Mom Test framework.</p>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="container flex-col items-center justify-center animate-fade-in" style={{ minHeight: '100vh' }}>
        <h2>Feedback generation failed.</h2>
        <button className="btn-secondary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>Return Home</button>
      </div>
    )
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem' }}>
      <div className="flex justify-between items-end" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Mission Report</h1>
          <p className="text-subtle">Target: {scenario.persona.name} | Scenario: {scenario.context.location}</p>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: feedback.score > 70 ? 'var(--accent-tertiary)' : feedback.score > 40 ? 'var(--accent-secondary)' : '#ef4444', lineHeight: 1 }}>
              {feedback.score}<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>/100</span>
            </div>
            <div className="text-subtle">Overall Score</div>
          </div>

          {feedback.dynamicMetrics && feedback.dynamicMetrics.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              {feedback.dynamicMetrics.map((metric, i) => (
                <div key={i} style={{ background: 'var(--bg-tertiary)', padding: '0.5rem 0.75rem', borderRadius: '6px', textAlign: 'center', minWidth: '100px', borderTop: `2px solid ${metric.score > 70 ? 'var(--accent-tertiary)' : metric.score > 40 ? 'var(--accent-secondary)' : '#ef4444'}` }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{metric.score}</div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>{metric.metricName}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {customGoal && (
        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', borderLeft: '4px solid var(--accent-tertiary)' }}>
          <strong style={{ color: 'var(--accent-tertiary)' }}>Your Goal:</strong> {customGoal}
        </div>
      )}

      {/* Veo Output Section */}
      <div className="glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Simulation Recording (Google Veo 3)</h3>
        {!veoVideoUrl && !veoStatus && (
          <div style={{ margin: '1.5rem 0' }}>
            <p className="text-subtle" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>Generate a cinematic AI replay of your pitch session.</p>
            <button className="btn-secondary" onClick={runVeo}>
              <Video size={16} /> Generate Scene Video
            </button>
          </div>
        )}
        {veoStatus && <div className="text-subtle" style={{ margin: '2rem 0' }}><Loader2 className="animate-spin inline mr-2" /> {veoStatus}</div>}
        {veoError && (
          <div style={{ color: '#ef4444', margin: '1rem 0' }}>
            {veoError}
            <button className="btn-secondary" onClick={runVeo} style={{ marginLeft: '1rem', fontSize: '0.8rem' }}>Retry</button>
          </div>
        )}
        {veoVideoUrl && (
          <video
            src={veoVideoUrl}
            controls
            autoPlay
            loop
            style={{ width: '100%', maxWidth: '600px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', margin: '0 auto' }}
          />
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>

        {/* The Mom Test Evaluation */}
        <div className="glass-panel" style={{ border: feedback.momTestAnalysis.passed ? '1px solid var(--accent-tertiary)' : '1px solid #ef4444' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} className={feedback.momTestAnalysis.passed ? 'text-tertiary' : 'text-danger'} />
            The Mom Test
          </h3>
          <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', marginBottom: '1rem' }}>
            <strong>Status:</strong> {feedback.momTestAnalysis.passed ? '✅ Passed – Focused on their problem.' : '❌ Failed – Pitched too hard or asked for compliments.'}
          </div>
          <p className="text-subtle" style={{ minHeight: '80px' }}>{feedback.momTestAnalysis.feedback}</p>
        </div>

        {/* General Overview */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Executive Summary</h3>
          <p className="text-subtle" style={{ marginBottom: '1.5rem', minHeight: '80px' }}>{feedback.summary}</p>

          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>Key Takeaway:</div>
            {feedback.keyTakeaway}
          </div>
        </div>

      </div>

      {/* Goal Analysis row (if any) */}
      {feedback.goalAnalysis && feedback.goalAnalysis !== "No specific goal provided" && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--accent-secondary)' }}>
          <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🎯 Goal Tracking Analysis
          </h4>
          <p className="text-subtle">{feedback.goalAnalysis}</p>
        </div>
      )}

      {/* Details Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ color: 'var(--accent-tertiary)', marginBottom: '1rem' }}>Strengths</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {feedback.strengths.map((str, i) => <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span style={{ color: 'var(--accent-tertiary)' }}>+</span> <span className="text-subtle">{str}</span></li>)}
          </ul>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ color: '#ef4444', marginBottom: '1rem' }}>Critical Issues</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {feedback.areasForImprovement.map((imp, i) => <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span style={{ color: '#ef4444' }}>-</span> <span className="text-subtle">{imp}</span></li>)}
          </ul>
        </div>
      </div>

      <div className="flex justify-center">
        <button className="btn-primary" onClick={() => navigate('/setup')} style={{ padding: '1rem 3rem', fontSize: '1.25rem' }}>
          <RotateCcw size={20} /> Next Mission
        </button>
      </div>

    </div>
  )
}

function MissionHistory() {
  const navigate = useNavigate();
  const [missions, setMissions] = useState([]);
  const [generatingIndex, setGeneratingIndex] = useState(null);
  const [pollingStatus, setPollingStatus] = useState('');

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('hyperfounder_missions') || '[]');
      setMissions(stored);
    } catch (e) {
      console.error("Failed to parse history", e);
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to permanently delete all your mission logs?")) {
      localStorage.removeItem('hyperfounder_missions');
      setMissions([]);
    }
  };

  const handleGenerateVideo = async (index, m) => {
    try {
      setGeneratingIndex(index);
      setPollingStatus('Writing camera directions for Google Veo...');

      const prompt = await generateVeoPrompt(m.scenario, m.chatHistory, m.founderName, m.founderGender || 'founder');

      setPollingStatus('Initializing video generation engine...');
      const startRes = await fetch('/api/veo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const startData = await startRes.json();

      if (startData.error) throw new Error(startData.error?.message || "Failed to start Veo");

      if (startData.cached) {
        const updated = [...missions];
        updated[index].videoUrl = `data:video/mp4;base64,${startData.videoBytes}`;
        setMissions(updated);
        setGeneratingIndex(null);
        setPollingStatus('');
        return;
      }

      const operationName = startData.name;
      if (!operationName) throw new Error("No operation returned.");

      setPollingStatus('Generating video... (this takes 1-2 minutes)');

      while (true) {
        await new Promise(r => setTimeout(r, 10000));
        const statRes = await fetch('/api/veo/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName })
        });
        const statData = await statRes.json();

        if (statData.done) {
          if (statData.error) throw new Error(statData.error.message || "Generation failed");

          const videoBytes = statData.response?.videos?.[0]?.bytesBase64Encoded;
          if (videoBytes) {
            const updated = [...missions];
            updated[index].videoUrl = `data:video/mp4;base64,${videoBytes}`;
            setMissions(updated);
            fetch('/api/veo/cache', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt, videoBytes })
            });
            setGeneratingIndex(null);
            setPollingStatus('');
            break;
          } else {
            throw new Error("Video format unknown in response.");
          }
        } else {
          setPollingStatus('Generating video... (still processing...)');
        }
      }
    } catch (e) {
      console.error("Veo Error:", e);
      alert("Video generation failed: " + e.message);
      setGeneratingIndex(null);
      setPollingStatus('');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Mission History</h1>
          <p className="text-subtle">Review your past pitches and track your progress.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={clearHistory} style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }} disabled={missions.length === 0}>
            Clear History
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '1rem' }}>
        {missions.length === 0 ? (
          <div className="glass-panel text-center" style={{ padding: '4rem 2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No missions recorded yet.</h3>
            <p className="text-subtle mb-4">Complete your first simulation to start building your track record!</p>
            <button className="btn-primary" onClick={() => navigate('/setup')}>Start Simulator</button>
          </div>
        ) : (
          missions.map((m, i) => (
            <div key={i} className="glass-panel animate-fade-in" style={{ display: 'flex', gap: '2rem', padding: '1.5rem', animationDelay: `${i * 0.1}s` }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.5rem' }}>{m.founderName}'s Pitch</h3>
                  <div className="text-subtle">{new Date(m.date).toLocaleString()}</div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <strong className="text-primary" style={{ display: 'block', marginBottom: '0.25rem' }}>Target Persona</strong>
                    <div className="text-subtle">{m.scenario?.persona?.name} ({m.scenario?.persona?.role})</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong className="text-primary" style={{ display: 'block', marginBottom: '0.25rem' }}>Environment</strong>
                    <div className="text-subtle">{m.scenario?.context?.location}</div>
                  </div>
                  {m.customGoal && (
                    <div style={{ flex: 1.5 }}>
                      <strong className="text-accent-secondary" style={{ display: 'block', marginBottom: '0.25rem' }}>Mission Goal</strong>
                      <div className="text-subtle">{m.customGoal}</div>
                    </div>
                  )}
                </div>

                {/* Score */}
                <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: '8px', gap: '1rem' }}>
                  <span style={{ fontWeight: 600 }}>Final Score:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: m.score > 70 ? 'var(--accent-tertiary)' : m.score > 40 ? 'var(--accent-secondary)' : '#ef4444' }}>
                    {m.score}/100
                  </span>
                </div>
              </div>

              {/* Media & Transcript row */}
              <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                {/* Media panel */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {m.videoUrl ? (
                    <video src={m.videoUrl} autoPlay loop playsInline controls style={{ width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                  ) : generatingIndex === i ? (
                    <div style={{ flex: 1, minHeight: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', border: '1px dashed var(--accent-tertiary)' }}>
                      <Loader2 className="animate-spin text-accent-tertiary mb-2" size={24} />
                      <div className="text-subtle text-center text-sm px-4">{pollingStatus}</div>
                    </div>
                  ) : (
                    <div style={{ flex: 1, minHeight: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                      <Video size={32} className="text-subtle mb-2 opacity-50" />
                      <button className="btn-secondary" onClick={() => handleGenerateVideo(i, m)}>
                        <Wand2 size={16} /> Generate Scene Video
                      </button>
                    </div>
                  )}
                </div>

                {/* Mini Transcript Viewer */}
                <div style={{ flex: 1, background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', maxHeight: '250px' }}>
                  <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-subtle)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Transcript Preview</h4>
                  <div style={{ overflowY: 'auto', flex: 1, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {m.chatHistory.map((msg, idx) => (
                      <div key={idx} style={{ color: msg.role === 'model' ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                        <strong>{msg.role === 'model' ? m.scenario?.persona?.name : 'You'}:</strong> {msg.content}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div >
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/setup" element={<LevelSetup />} />
      <Route path="/simulation" element={<SimulationRoom />} />
      <Route path="/feedback" element={<FeedbackRoom />} />
      <Route path="/history" element={<MissionHistory />} />
    </Routes>
  );
}

// Helper to save missions
function saveMissionToStorage(missionData) {
  try {
    const existingMissions = JSON.parse(localStorage.getItem('hyperfounder_missions') || '[]');
    existingMissions.unshift(missionData); // Add to beginning (newest first)
    localStorage.setItem('hyperfounder_missions', JSON.stringify(existingMissions));
  } catch (e) {
    console.error("Failed to save mission to localStorage", e);
  }
}

export default App;
