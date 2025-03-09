import React, { useEffect, useRef, useState } from 'react';
import { Timeline, DataSet } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.css';
import Button from '../common/Button';

const TIMELINE_TYPES = {
  PHILOSOPHY: 'philosophy',
  HISTORY: 'history',
  MYTHOLOGY: 'mythology',
};

// Sample timeline data - using numbers for dates
const timelineData = {
  [TIMELINE_TYPES.PHILOSOPHY]: [
    { id: 1, content: 'Pre-Socratic Era Begins', start: -600, className: 'philosophy-item' },
    { id: 2, content: 'Birth of Socrates', start: -470, className: 'philosophy-item' },
    { id: 3, content: 'Birth of Plato', start: -428, className: 'philosophy-item' },
    { id: 4, content: 'Birth of Aristotle', start: -384, className: 'philosophy-item' },
    { id: 5, content: 'Rise of Hellenistic Schools', start: -300, className: 'philosophy-item' }
  ],
  [TIMELINE_TYPES.HISTORY]: [
    { id: 1, content: 'Mycenaean Civilization', start: -1600, className: 'history-item' },
    { id: 2, content: 'First Olympic Games', start: -776, className: 'history-item' },
    { id: 3, content: 'Athenian Democracy', start: -508, className: 'history-item' },
    { id: 4, content: 'Persian Wars', start: -490, end: -479, className: 'history-item' },
    { id: 5, content: 'Alexander the Great', start: -336, end: -323, className: 'history-item' }
  ],
  [TIMELINE_TYPES.MYTHOLOGY]: [
    { id: 1, content: 'Creation Myths', start: -1300, className: 'mythology-item' },
    { id: 2, content: 'Titanomachy', start: -1200, className: 'mythology-item' },
    { id: 3, content: 'Golden Age of Man', start: -1100, className: 'mythology-item' },
    { id: 4, content: 'Trojan War', start: -1250, end: -1240, className: 'mythology-item' },
    { id: 5, content: 'Odyssey', start: -1230, end: -1220, className: 'mythology-item' }
  ]
};

// Details for each timeline item
const timelineDetails = {
  [TIMELINE_TYPES.PHILOSOPHY]: {
    1: {
      title: "Pre-Socratic Era Begins",
      subtitle: "Early Greek philosophers focus on natural world",
      description: "Thinkers like Thales, Anaximander, and Heraclitus attempt to explain the world through natural principles rather than mythological explanations."
    },
    2: {
      title: "Birth of Socrates",
      subtitle: "The father of Western philosophy is born in Athens",
      description: "Socrates developed the Socratic method of questioning, focusing on ethics and how one should live. He left no writings; we know him through his students."
    },
    3: {
      title: "Birth of Plato",
      subtitle: "Founder of the Academy in Athens",
      description: "Plato, a student of Socrates, wrote dialogues featuring his teacher. He developed the Theory of Forms and founded the first Western university."
    },
    4: {
      title: "Birth of Aristotle",
      subtitle: "Plato's student who tutored Alexander the Great",
      description: "Aristotle established the Lyceum and wrote on numerous subjects including ethics, metaphysics, physics, and poetics. He pioneered the scientific method."
    },
    5: {
      title: "Rise of Hellenistic Schools",
      subtitle: "Epicureanism and Stoicism emerge",
      description: "After Alexander's conquests, philosophy diversified with schools focused on achieving happiness. Epicurus advocated moderate pleasure, while Zeno's Stoicism emphasized virtue and rationality."
    }
  },
  [TIMELINE_TYPES.HISTORY]: {
    1: {
      title: "Mycenaean Civilization",
      subtitle: "Early Greek civilization emerges",
      description: "The Mycenaeans established powerful city-states, built impressive palaces, and developed a writing system called Linear B."
    },
    2: {
      title: "First Olympic Games",
      subtitle: "Pan-Hellenic games begin",
      description: "The first recorded Olympic Games are held at Olympia, featuring only a single race. The games would eventually expand to multiple events and continue every four years."
    },
    3: {
      title: "Athenian Democracy",
      subtitle: "Cleisthenes reforms establish democracy",
      description: "After years of tyranny and instability, Cleisthenes institutes democratic reforms in Athens, creating the world's first democratic system."
    },
    4: {
      title: "Persian Wars",
      subtitle: "Greece defends against Persian invasion",
      description: "The Greeks, led by Athens and Sparta, successfully defend against two Persian invasions, including famous battles at Marathon, Thermopylae, and Salamis."
    },
    5: {
      title: "Alexander the Great",
      subtitle: "Macedonian king conquers Persian Empire",
      description: "Alexander creates one of history's largest empires, spreading Greek culture throughout the Near East and as far as India, beginning the Hellenistic Age."
    }
  },
  [TIMELINE_TYPES.MYTHOLOGY]: {
    1: {
      title: "Creation Myths",
      subtitle: "The birth of the universe",
      description: "From Chaos emerged Gaia (Earth), Tartarus (Underworld), Eros (Love), Erebus (Darkness), and Nyx (Night). Gaia gave birth to Uranus (Sky), and together they produced the Titans."
    },
    2: {
      title: "Titanomachy",
      subtitle: "War of the Titans",
      description: "Cronus, who had overthrown his father Uranus, is in turn overthrown by his son Zeus. After a ten-year war, the Olympians defeat the Titans and imprison them in Tartarus."
    },
    3: {
      title: "Golden Age of Man",
      subtitle: "Hesiod's ages of human civilization",
      description: "The Golden Age under Cronus was a time of peace and prosperity. Humans lived like gods without sorrow, followed by progressively worse ages: Silver, Bronze, Heroic, and Iron (current)."
    },
    4: {
      title: "Trojan War",
      subtitle: "Greeks vs. Trojans",
      description: "Paris of Troy abducts Helen from Sparta, leading to a massive Greek expedition. After ten years, the Greeks use the Trojan Horse to infiltrate the city and win the war."
    },
    5: {
      title: "Odyssey",
      subtitle: "Odysseus's Journey Home",
      description: "After offending Poseidon, Odysseus wanders the Mediterranean for ten years, facing monsters, witches, and divine challenges before finally returning to his faithful wife Penelope in Ithaca."
    }
  }
};

// Color mapping for each timeline type
const timelineColors = {
  [TIMELINE_TYPES.PHILOSOPHY]: '#1E4B8C', // aegeanBlue
  [TIMELINE_TYPES.HISTORY]: '#39725E',     // oracleGreen
  [TIMELINE_TYPES.MYTHOLOGY]: '#C5A572'    // oliveGold
};

const TimelineViewer = () => {
  const [timelineType, setTimelineType] = useState(TIMELINE_TYPES.PHILOSOPHY);
  const [selectedItem, setSelectedItem] = useState(null);
  const timelineRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Inject custom CSS for timeline items
  useEffect(() => {
    // Create a style element if it doesn't exist yet
    let styleEl = document.getElementById('timeline-custom-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'timeline-custom-styles';
      document.head.appendChild(styleEl);
    }
    
    // Apply custom styles
    styleEl.innerHTML = `
      .vis-time-axis .vis-text {
        color: #614B79;
      }
      
      .vis-time-axis .vis-text.vis-minor {
        font-size: 0; /* Hide the timestamp completely */
      }
      
      .vis-time-axis .vis-text.vis-major {
        font-weight: bold;
      }
      
      .vis-item.vis-selected {
        background-color: ${timelineColors[timelineType]} !important;
        border-color: ${timelineColors[timelineType]} !important;
      }
      
      .vis-item.vis-box.philosophy-item {
        background-color: rgba(30, 75, 140, 0.7);
        border-color: #1E4B8C;
      }
      
      .vis-item.vis-box.history-item {
        background-color: rgba(57, 114, 94, 0.7);
        border-color: #39725E;
      }
      
      .vis-item.vis-box.mythology-item {
        background-color: rgba(197, 165, 114, 0.7);
        border-color: #C5A572;
      }
      
      .vis-item.vis-box {
        border-radius: 4px;
        color: white;
        font-weight: 500;
      }
      
      .vis-item .vis-item-content {
        padding: 8px;
      }
      
      .vis-panel.vis-center,
      .vis-panel.vis-left,
      .vis-panel.vis-right {
        border-color: rgba(30, 75, 140, 0.1);
      }
      
      .vis-timeline {
        border: none !important;
      }
    `;
    
    return () => {
      // Clean up when component unmounts
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, [timelineType]);
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    setSelectedItem(null);
    
    // Short delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      initializeTimeline();
    }, 200);
    
    return () => {
      clearTimeout(initTimer);
      if (timelineRef.current) {
        try {
          timelineRef.current.destroy();
          timelineRef.current = null;
        } catch (e) {
          console.warn("Error cleaning up timeline:", e);
        }
      }
    };
  }, [timelineType]);
  
  const initializeTimeline = () => {
    if (!containerRef.current) {
      setError("Timeline container not found");
      setLoading(false);
      return;
    }
    
    // Clean up any existing timeline
    if (timelineRef.current) {
      try {
        timelineRef.current.destroy();
        timelineRef.current = null;
      } catch (e) {
        console.warn("Error destroying previous timeline:", e);
      }
    }
    
    try {
      // Create the dataset with the numeric years
      const items = new DataSet(timelineData[timelineType]);
      
      // Set up options
      const options = {
        height: '400px',
        showCurrentTime: false,
        minHeight: '250px',
        maxHeight: '600px',
        stack: true,
        type: 'box',
        align: 'center',
        orientation: {
          axis: 'top',
          item: 'top'
        },
        format: {
          minorLabels: {
            millisecond:'',
            second: '',
            minute: '',
            hour: '',
            weekday: '',
            day: '',
            week: '',
            month: '',
            year: function(date) {
              if (date.getFullYear() === 0) return '0';
              // For BCE years (negative years)
              if (date.getFullYear() < 0) {
                return Math.abs(date.getFullYear()) + ' BCE';
              }
              return date.getFullYear();
            }
          },
          majorLabels: {
            millisecond:'',
            second: '',
            minute: '',
            hour: '',
            weekday: '',
            day: '',
            week: '',
            month: '',
            year: ''
          }
        },
        max: 0, // 0 CE/AD
        zoomable: true,
        tooltip: {
          followMouse: true
        },
        template: function(item) {
          // Show the year in the item
          const yearText = item.end ? 
            `${Math.abs(item.start)} - ${Math.abs(item.end)} BCE` : 
            `${Math.abs(item.start)} BCE`;
          
          return `<div class="vis-item-content">
                    <div style="font-weight: bold;">${item.content}</div>
                    <div style="font-size: 0.8em; opacity: 0.9;">${yearText}</div>
                  </div>`;
        }
      };
      
      // Create timeline
      const timeline = new Timeline(containerRef.current, items, options);
      timelineRef.current = timeline;
      
      // Add click event
      timeline.on('select', function(properties) {
        if (properties.items && properties.items.length) {
          const itemId = parseInt(properties.items[0], 10);
          setSelectedItem(timelineDetails[timelineType][itemId]);
        } else {
          setSelectedItem(null);
        }
      });
      
      // Set initial view window based on timeline type
      setTimeout(() => {
        try {
          if (timelineType === TIMELINE_TYPES.HISTORY) {
            timeline.setWindow(-1700, -300);
          } else if (timelineType === TIMELINE_TYPES.MYTHOLOGY) {
            timeline.setWindow(-1300, -1100);
          } else { // PHILOSOPHY
            timeline.setWindow(-650, -250);
          }
        } catch (e) {
          console.warn("Could not set timeline window:", e);
        }
        setLoading(false);
      }, 200);
      
    } catch (e) {
      console.error("Error initializing timeline:", e);
      setError(`Error initializing timeline: ${e.message}`);
      setLoading(false);
    }
  };
  
  const handleTypeChange = (type) => {
    setTimelineType(type);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-marbleWhite">
        <h3 className="font-serif text-xl text-aegeanBlue mb-3">Interactive Timeline</h3>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Button 
            variant={timelineType === TIMELINE_TYPES.PHILOSOPHY ? 'primary' : 'outline'}
            onClick={() => handleTypeChange(TIMELINE_TYPES.PHILOSOPHY)}
            size="sm"
          >
            Philosophy
          </Button>
          <Button 
            variant={timelineType === TIMELINE_TYPES.HISTORY ? 'primary' : 'outline'}
            onClick={() => handleTypeChange(TIMELINE_TYPES.HISTORY)}
            size="sm"
          >
            History
          </Button>
          <Button 
            variant={timelineType === TIMELINE_TYPES.MYTHOLOGY ? 'primary' : 'outline'}
            onClick={() => handleTypeChange(TIMELINE_TYPES.MYTHOLOGY)}
            size="sm"
          >
            Mythology
          </Button>
        </div>
      </div>
      
      <div className="flex-grow relative flex flex-col">
        <div className="timeline-container relative" ref={containerRef} style={{ flexGrow: 1, minHeight: '300px' }}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-aegeanBlue/20 border-t-aegeanBlue rounded-full animate-spin"></div>
                <p className="mt-3 text-aegeanBlue">Loading timeline...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center text-terracotta p-4">
                <p>{error}</p>
                <button 
                  className="mt-4 px-4 py-2 bg-aegeanBlue text-white rounded-md hover:bg-aegeanBlue/90"
                  onClick={initializeTimeline}
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
        
        {selectedItem && (
          <div className="p-4 bg-marbleWhite border-t border-aegeanBlue/20">
            <h3 className="text-xl font-serif font-bold text-aegeanBlue">{selectedItem.title}</h3>
            <h4 className="text-md text-philosophicalPurple mb-2">{selectedItem.subtitle}</h4>
            <p className="text-sm">{selectedItem.description}</p>
          </div>
        )}
        
        {!selectedItem && !loading && !error && (
          <div className="p-4 bg-marbleWhite border-t border-aegeanBlue/20 text-center text-sm text-aegeanBlue/70">
            <p>Click on a timeline event to see details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineViewer;