import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight, Video, Mic, Globe2, Loader2, Wand2, Send, RotateCcw } from 'lucide-react';
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
      setCustomCharacter('Female mid 20s woman named Jen, who loves her Shih Tzu Muffin');
      setCustomEnvironment('NY subway');
      setCustomGoal('Sign them up for the app waitlist');
      setIdea('social network to connect dog-lovers on play dates');
    } else if (presetName === 'umass') {
      setFounderName('Varshini');
      setCustomCharacter(`Shanyu, early stage startup founder and UMass Alumni. BEHAVIOR: You MUST start the conversation with friendly small talk about UMass (e.g. "How is your course work?", "How is the weather on campus?"). Then, after they pitch, you must aggressively challenge the idea. Argue that online assessments and take-home projects are better, and point out that GitHub/LinkedIn profiles can easily be faked or exaggerated. Say: "Why should I use your platform for this?" and "I don't really think you are clear on why you are building this."`);
      setCustomEnvironment('University cafe (Roots Cafe or similar)');
      setCustomGoal('Get feedback on the product and see if they would use it for screening candidates');
      setIdea('A credibility-first opportunity matchmaker platform that builds a robust knowledge graph of candidates based on GitHub repos, LinkedIn, online portfolios to screen candidates better than online assessments.');
    } else if (presetName === 'linkedin') {
      setFounderName('Varshini');
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
      navigate('/simulation', { state: { scenario, idea: finalIdea, founderName: finalName, customGoal: customGoal.trim() } });
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
  const customGoal = location.state?.customGoal;

  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [povImageBase64, setPovImageBase64] = useState(null);
  const chatEndRef = useRef(null);
  const hasInitialized = useRef(false);

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

    const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);

    for (const part of parts) {
      const isNarration = part.startsWith('*') && part.endsWith('*');
      const cleanPart = isNarration ? part.replace(/\*/g, '').trim() : part.trim();
      if (!cleanPart) continue;

      // Attempt ElevenLabs realistic generation first
      const audioUrl = await generateSpeech(cleanPart, scenario.persona, isNarration);

      if (audioUrl) {
        await new Promise((resolve) => {
          const audio = new Audio(audioUrl);
          audio.onended = resolve;
          audio.onerror = async () => {
            console.error("ElevenLabs audio playback failed, falling back");
            await fallbackAudioPlayback(cleanPart, isNarration);
            resolve();
          };
          audio.play().catch(async e => {
            console.error("Audio block:", e);
            await fallbackAudioPlayback(cleanPart, isNarration);
            resolve();
          });
        });
      } else {
        await fallbackAudioPlayback(cleanPart, isNarration);
      }
    }

    setIsAiSpeaking(false);
  };

  const fallbackAudioPlayback = (text, isNarration) => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          if (isNarration) {
            const narrator = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Alex'));
            if (narrator) utterance.voice = narrator;
          } else {
            const isFemale = scenario.persona.demographic?.toLowerCase().includes('woman') || scenario.persona.demographic?.toLowerCase().includes('lady') || scenario.persona.name.includes('Aunt');
            const preferredVoice = voices.find(v => isFemale ? (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female')) : (v.name.includes('Male') || v.name.includes('Alex') || v.name.includes('Google UK English Male')));
            if (preferredVoice) utterance.voice = preferredVoice;
          }
        }

        utterance.rate = 1.05;
        utterance.pitch = isNarration ? 0.8 : 1;

        utterance.onend = resolve;
        utterance.onerror = resolve;

        window.speechSynthesis.speak(utterance);
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
        <button className="btn-secondary" onClick={() => navigate('/feedback', { state: { scenario, chatHistory, customGoal } })} style={{ padding: '0.5rem 1rem', background: 'var(--accent-tertiary)', color: '#000', border: 'none' }}>End Mission</button>
      </header>

      {/* Main Sandbox Area */}
      <main style={{ flex: 1, display: 'flex', position: 'relative', padding: '2rem', gap: '2rem' }}>
        <div className="bg-glow-blob" style={{ bottom: '-10%', right: '10%' }}></div>

        {/* Visual/Audio Focus Area */}
        <div className="glass-panel flex-col items-center justify-center animate-fade-in" style={{ flex: 2, position: 'relative', overflow: 'hidden' }}>
          {/* Dynamic visual flair based on context could go here */}
          <div className="text-subtle" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.875rem', textAlign: 'right' }}>
            <div><strong>Scene:</strong> {scenario.context.setup}</div>
            {scenario.persona.demographic && <div style={{ marginTop: '0.25rem', color: 'var(--accent-secondary)' }}><strong>Look:</strong> {scenario.persona.demographic}</div>}
          </div>

          <div style={{
            width: '180px', height: '180px', borderRadius: '50%', background: 'var(--bg-tertiary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
            border: '2px solid var(--border-strong)', position: 'relative',
            boxShadow: isAiSpeaking ? '0 0 40px var(--accent-tertiary)' : 'none',
            transition: 'box-shadow 0.3s ease',
            backgroundImage: povImageBase64 ? `url(${povImageBase64})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            {/* Outer pulsing ring for AI speaking */}
            {isAiSpeaking && <div style={{ position: 'absolute', inset: '-15px', borderRadius: '50%', border: '3px dashed var(--accent-tertiary)', animation: 'spin 4s linear infinite', opacity: 0.8 }}></div>}

            {!povImageBase64 && (
              isAiLoading ? <Loader2 size={48} className="animate-spin text-accent-secondary" /> : <Mic size={48} className={isAiSpeaking ? 'text-primary' : 'text-subtle'} />
            )}

            {/* Small loading indicator overlaid on image if spinning */}
            {povImageBase64 && isAiLoading && (
              <div style={{ position: 'absolute', background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '50%' }}>
                <Loader2 size={24} className="animate-spin text-white" />
              </div>
            )}
          </div>

          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>"{scenario.persona.name}"</h2>
          {scenario.persona.mood && <div className="text-gradient" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{scenario.persona.mood} | {scenario.persona.knowledgeLevel}</div>}

          <p className="text-subtle" style={{ maxWidth: '400px', textAlign: 'center', minHeight: '3rem' }}>
            {isAiSpeaking ? "AI is speaking..." : isAiLoading ? "Thinking..." : "Listening..."}
          </p>
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
              <button className="btn-primary" onClick={handleSendMessage} disabled={isAiLoading || isAiSpeaking || !inputText.trim()} style={{ padding: '0.5rem 1.5rem', opacity: (isAiLoading || isAiSpeaking || !inputText.trim()) ? 0.5 : 1 }}>
                <Send size={16} /> Send
              </button>
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

import { evaluatePitch, generatePOVImage } from './services/gemini';

function FeedbackRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const scenario = location.state?.scenario;
  const chatHistory = location.state?.chatHistory;
  const customGoal = location.state?.customGoal;

  useEffect(() => {
    if (!scenario || !chatHistory) {
      navigate('/');
      return;
    }

    const fetchFeedback = async () => {
      setIsLoading(true);
      const result = await evaluatePitch(scenario, chatHistory, customGoal);
      setFeedback(result);
      setIsLoading(false);
    };

    fetchFeedback();
  }, [scenario, chatHistory, navigate]);

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
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: 800, color: feedback.score > 70 ? 'var(--accent-tertiary)' : feedback.score > 40 ? 'var(--accent-secondary)' : '#ef4444' }}>
            {feedback.score}<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>/100</span>
          </div>
          <div className="text-subtle">Overall Score</div>
        </div>
      </div>

      {customGoal && (
        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', borderLeft: '4px solid var(--accent-tertiary)' }}>
          <strong style={{ color: 'var(--accent-tertiary)' }}>Your Goal:</strong> {customGoal}
        </div>
      )}

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

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/setup" element={<LevelSetup />} />
      <Route path="/simulation" element={<SimulationRoom />} />
      <Route path="/feedback" element={<FeedbackRoom />} />
    </Routes>
  );
}

export default App;
