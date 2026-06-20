'use client';

import React, { useState, useRef } from 'react';
import { Mic, Upload, Music, Settings2, Save, Printer, Plus } from 'lucide-react';

export default function ChordFinderStudio() {
  const [currentPage, setCurrentPage] = useState('home'); // home, recording, chart, library
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transpose, setTranspose] = useState(0);
  const [savedCharts, setSavedCharts] = useState([]);
  const [currentChart, setCurrentChart] = useState(null);
  const [error, setError] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  // Mock chord database (replace with real API)
  const MOCK_CHARTS = {
    'imagine-john-lennon': {
      title: 'Imagine',
      artist: 'John Lennon',
      originalKey: 'C',
      chords: [
        { section: 'Verse', content: 'C | Cmaj7 | C | Cmaj7' },
        { section: 'Chorus', content: 'F | Fmaj7 | F | Fmaj7' },
        { section: 'Verse', content: 'C | Cmaj7 | C | Cmaj7' }
      ]
    },
    'hello-adele': {
      title: 'Hello',
      artist: 'Adele',
      originalKey: 'A',
      chords: [
        { section: 'Verse', content: 'A | F#m | D | E' },
        { section: 'Chorus', content: 'A | F#m | D | E' }
      ]
    },
    'wonderwall-oasis': {
      title: 'Wonderwall',
      artist: 'Oasis',
      originalKey: 'Em7',
      chords: [
        { section: 'Verse', content: 'Em7 | Gsus2 | Dsus2 | A7sus4' },
        { section: 'Chorus', content: 'Em7 | Gsus2 | Dsus2 | A7sus4' }
      ]
    }
  };

  const NOTE_SEMITONES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const transposeChord = (chord, semitones) => {
    const baseNote = chord.match(/^[A-G]#?/)?.[0];
    if (!baseNote) return chord;
    const baseIndex = NOTE_SEMITONES.indexOf(baseNote);
    const newIndex = (baseIndex + semitones + 120) % 12;
    const suffix = chord.slice(baseNote.length);
    return NOTE_SEMITONES[newIndex] + suffix;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Microphone access denied. Try uploading a file instead.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(new Blob([file], { type: file.type }));
      setError(null);
    }
  };

  const recognizeSong = async () => {
    if (!audioBlob) {
      setError('No audio to recognize');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real app, send to AudD or ACRCloud
      // For demo, simulate recognition with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock recognition result
      const mockResults = [
        { title: 'Imagine', artist: 'John Lennon', confidence: 0.95, id: 'imagine-john-lennon' },
        { title: 'Hello', artist: 'Adele', confidence: 0.87, id: 'hello-adele' },
        { title: 'Wonderwall', artist: 'Oasis', confidence: 0.82, id: 'wonderwall-oasis' }
      ];

      const result = mockResults[Math.floor(Math.random() * mockResults.length)];
      setRecognitionResult(result);
      
      // Load the corresponding chart
      const chartData = MOCK_CHARTS[result.id];
      if (chartData) {
        setCurrentChart({ ...chartData, id: result.id });
        setTranspose(0);
        setCurrentPage('chart');
      }
    } catch (err) {
      setError('Recognition failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveChart = () => {
    if (!currentChart) return;
    const chartToSave = {
      ...currentChart,
      savedAt: new Date().toLocaleString(),
      transpose
    };
    setSavedCharts([...savedCharts, { ...chartToSave, savedId: Date.now() }]);
    setError(null);
  };

  const loadSavedChart = (chart) => {
    setCurrentChart(chart);
    setTranspose(chart.transpose || 0);
    setCurrentPage('chart');
  };

  const removeSavedChart = (savedId) => {
    setSavedCharts(savedCharts.filter(c => c.savedId !== savedId));
  };

  // Home Page
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto pt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Music className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ChordFinder Studio</h1>
            <p className="text-gray-600 mb-8">Hear a song. Get the chords. Fast.</p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => setCurrentPage('recording')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Mic className="w-5 h-5" />
                Record a Song
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Audio
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {savedCharts.length > 0 && (
                <button
                  onClick={() => setCurrentPage('library')}
                  className="w-full bg-green-100 hover:bg-green-200 text-green-900 py-3 rounded-lg font-semibold"
                >
                  Library ({savedCharts.length})
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-8">Free: 10 recognitions/month</p>
          </div>
        </div>
      </div>
    );
  }

  // Recording Page
  if (currentPage === 'recording') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto pt-10">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-indigo-600 font-semibold mb-6 flex items-center gap-2"
          >
            ← Back
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Record Audio</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-200'
            }`}>
              <Mic className={`w-12 h-12 ${isRecording ? 'text-white' : 'text-gray-600'}`} />
            </div>

            <p className="text-gray-600 mb-6">
              {isRecording ? 'Recording... (8-15 seconds)' : 'Click to record a song clip'}
            </p>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-full py-3 rounded-lg font-semibold mb-4 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>

            {audioBlob && (
              <button
                onClick={recognizeSong}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Recognizing...' : 'Recognize Song'}
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg text-sm"
            >
              Or upload a file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    );
  }

  // Chart Display Page
  if (currentPage === 'chart' && currentChart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto pt-4">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-indigo-600 font-semibold flex items-center gap-2"
            >
              ← Back
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{currentChart.title}</h1>
              <p className="text-gray-600">{currentChart.artist}</p>
            </div>

            {/* Transpose Control */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-gray-900 flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  Transpose
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTranspose(t => t - 1)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    ♭
                  </button>
                  <span className="w-12 text-center font-bold">
                    {transpose > 0 ? '+' : ''}{transpose}
                  </span>
                  <button
                    onClick={() => setTranspose(t => t + 1)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    ♯
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Original key: {currentChart.originalKey} → Now in: {transposeChord(currentChart.originalKey, transpose)}
              </p>
            </div>

            {/* Chord Chart */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 font-mono text-sm">
              {currentChart.chords.map((section, idx) => (
                <div key={idx} className="mb-4">
                  <h3 className="font-bold text-indigo-600 mb-2">{section.section}</h3>
                  <p className="text-gray-900 leading-relaxed">
                    {section.content.split('|').map((chord, i) => (
                      <span key={i}>
                        {transposeChord(chord.trim(), transpose)}
                        {i < section.content.split('|').length - 1 ? ' | ' : ''}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={saveChart}
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={() => setCurrentPage('home')}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Library Page
  if (currentPage === 'library') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto pt-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-indigo-600 font-semibold mb-6 flex items-center gap-2"
          >
            ← Back
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Charts ({savedCharts.length})</h2>

            {savedCharts.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No saved charts yet</p>
            ) : (
              <div className="space-y-3">
                {savedCharts.map((chart) => (
                  <div
                    key={chart.savedId}
                    className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{chart.title}</h3>
                      <p className="text-sm text-gray-600">{chart.artist}</p>
                      <p className="text-xs text-gray-500 mt-1">{chart.savedAt}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadSavedChart(chart)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-semibold"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => removeSavedChart(chart.savedId)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
