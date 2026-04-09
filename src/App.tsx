/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { Trophy, Clock, Star, Play, RotateCcw, Zap, Target, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Visual Constants ---
const COLORS = {
  primary: '#00D1FF', // Electric Blue
  secondary: '#FF007A', // Neon Pink
  accent: '#FFD600', // Cyber Yellow
  bg: '#0F172A', // Deep Space
  surface: '#1E293B',
  text: '#F8FAFC',
};

/// 小学1・2年生の漢字データ
const KANJI_DATA = [
  // 1年生
  { kanji: '日', readings: ['ひ'], distractors: ['つき', 'ほし'], grade: 1 },
  { kanji: '月', readings: ['つき'], distractors: ['ひ', 'ほし'], grade: 1 },
  { kanji: '火', readings: ['ひ'], distractors: ['みず', 'き'], grade: 1 },
  { kanji: '水', readings: ['みず'], distractors: ['ひ', 'つち'], grade: 1 },
  { kanji: '木', readings: ['き'], distractors: ['ひ', 'かね'], grade: 1 },
  { kanji: '金', readings: ['かね'], distractors: ['き', 'つち'], grade: 1 },
  { kanji: '土', readings: ['つち'], distractors: ['き', 'みず'], grade: 1 },
  { kanji: '山', readings: ['やま'], distractors: ['かわ', 'もり'], grade: 1 },
  { kanji: '川', readings: ['かわ'], distractors: ['やま', 'うみ'], grade: 1 },
  { kanji: '田', readings: ['た'], distractors: ['はた', 'やま'], grade: 1 },
  { kanji: '人', readings: ['ひと'], distractors: ['いぬ', 'ねこ'], grade: 1 },
  { kanji: '子', readings: ['こ'], distractors: ['おや', 'いぬ'], grade: 1 },
  { kanji: '女', readings: ['おんな'], distractors: ['おとこ', 'はは'], grade: 1 },
  { kanji: '男', readings: ['おとこ'], distractors: ['おんな', 'ちち'], grade: 1 },
  { kanji: '目', readings: ['め'], distractors: ['みみ', 'くち'], grade: 1 },
  { kanji: '口', readings: ['くち'], distractors: ['め', 'みみ'], grade: 1 },
  { kanji: '耳', readings: ['みみ'], distractors: ['め', 'くち'], grade: 1 },
  { kanji: '手', readings: ['て'], distractors: ['あし', 'ゆび'], grade: 1 },
  { kanji: '足', readings: ['あし'], distractors: ['て', 'ゆび'], grade: 1 },
  { kanji: '見', readings: ['みる'], distractors: ['きく', 'かく'], grade: 1 },
  { kanji: '立', readings: ['たつ'], distractors: ['ねる', 'いく'], grade: 1 },
  { kanji: '休', readings: ['やすむ'], distractors: ['あそぶ', 'ねる'], grade: 1 },
  { kanji: '学', readings: ['まなぶ'], distractors: ['あそぶ', 'かく'], grade: 1 },
  { kanji: '先', readings: ['さき'], distractors: ['あと', 'いま'], grade: 1 },
  { kanji: '生', readings: ['いきる'], distractors: ['しぬ', 'ねる'], grade: 1 },
  { kanji: '花', readings: ['はな'], distractors: ['くさ', 'き'], grade: 1 },
  { kanji: '草', readings: ['くさ'], distractors: ['はな', 'き'], grade: 1 },
  { kanji: '虫', readings: ['むし'], distractors: ['とり', 'さかな'], grade: 1 },
  { kanji: '犬', readings: ['いぬ'], distractors: ['ねこ', 'とり'], grade: 1 },
  { kanji: '貝', readings: ['かい'], distractors: ['さかな', 'うみ'], grade: 1 },
  { kanji: '赤', readings: ['あか'], distractors: ['あお', 'しろ'], grade: 1 },
  { kanji: '青', readings: ['あお'], distractors: ['あか', 'きいろ'], grade: 1 },
  { kanji: '白', readings: ['しろ'], distractors: ['くろ', 'あか'], grade: 1 },
  // 2年生
  { kanji: '引', readings: ['ひく'], distractors: ['おす', 'だす'], grade: 2 },
  { kanji: '羽', readings: ['はね'], distractors: ['とり', 'むし'], grade: 2 },
  { kanji: '雲', readings: ['くも'], distractors: ['あめ', 'ゆき'], grade: 2 },
  { kanji: '遠', readings: ['とおい'], distractors: ['ちかい', 'はやい'], grade: 2 },
  { kanji: '何', readings: ['なに'], distractors: ['どこ', 'だれ'], grade: 2 },
  { kanji: '夏', readings: ['なつ'], distractors: ['ふゆ', 'はる'], grade: 2 },
  { kanji: '家', readings: ['いえ'], distractors: ['みせ', 'まち'], grade: 2 },
  { kanji: '歌', readings: ['うた'], distractors: ['おどる', 'きく'], grade: 2 },
  { kanji: '回', readings: ['まわる'], distractors: ['とまる', 'いく'], grade: 2 },
  { kanji: '会', readings: ['あう'], distractors: ['いう', 'みる'], grade: 2 },
  { kanji: '海', readings: ['うみ'], distractors: ['かわ', 'いけ'], grade: 2 },
  { kanji: '外', readings: ['そと'], distractors: ['なか', 'うち'], grade: 2 },
  { kanji: '角', readings: ['かど'], distractors: ['まる', 'しかく'], grade: 2 },
  { kanji: '楽', readings: ['たのしい'], distractors: ['かなしい', 'おもい'], grade: 2 },
  { kanji: '間', readings: ['あいだ'], distractors: ['なか', 'となり'], grade: 2 },
  { kanji: '丸', readings: ['まる'], distractors: ['しかく', 'さんかく'], grade: 2 },
  { kanji: '岩', readings: ['いわ'], distractors: ['いし', 'やま'], grade: 2 },
  { kanji: '顔', readings: ['かお'], distractors: ['あたま', 'て'], grade: 2 },
  { kanji: '記', readings: ['しるす'], distractors: ['かく', 'よむ'], grade: 2 },
  { kanji: '帰', readings: ['かえる'], distractors: ['いく', 'くる'], grade: 2 },
  { kanji: '弓', readings: ['ゆみ'], distractors: ['や', 'かたな'], grade: 2 },
  { kanji: '牛', readings: ['うし'], distractors: ['うま', 'ぶた'], grade: 2 },
  { kanji: '魚', readings: ['さかな'], distractors: ['とり', 'むし'], grade: 2 },
  { kanji: '強', readings: ['つよい'], distractors: ['よわい', 'はやい'], grade: 2 },
  { kanji: '教', readings: ['おしえる'], distractors: ['まなぶ', 'ならう'], grade: 2 },
  { kanji: '近', readings: ['ちかい'], distractors: ['とおい', 'はやい'], grade: 2 },
  { kanji: '兄', readings: ['あに'], distractors: ['おとうと', 'あね'], grade: 2 },
  { kanji: '形', readings: ['かたち'], distractors: ['いろ', 'おと'], grade: 2 },
  { kanji: '計', readings: ['はかる'], distractors: ['かく', 'よむ'], grade: 2 },
  { kanji: '元', readings: ['もと'], distractors: ['さき', 'いま'], grade: 2 },
  { kanji: '言', readings: ['いう'], distractors: ['きく', 'よむ'], grade: 2 },
  { kanji: '原', readings: ['はら'], distractors: ['やま', 'うみ'], grade: 2 },
  { kanji: '戸', readings: ['と'], distractors: ['まど', 'かべ'], grade: 2 },
  { kanji: '古', readings: ['ふるい'], distractors: ['あたらしい', 'わかい'], grade: 2 },
  { kanji: '後', readings: ['あと'], distractors: ['まえ', 'いま'], grade: 2 },
  { kanji: '語', readings: ['かたる'], distractors: ['いう', 'きく'], grade: 2 },
  { kanji: '公', readings: ['おおやけ'], distractors: ['わたくし', 'みんな'], grade: 2 },
  { kanji: '広', readings: ['ひろい'], distractors: ['せまい', 'ながい'], grade: 2 },
  { kanji: '交', readings: ['まじわる'], distractors: ['あう', 'いく'], grade: 2 },
  { kanji: '光', readings: ['ひかり'], distractors: ['かげ', 'おと'], grade: 2 },
  { kanji: '考', readings: ['かんがえる'], distractors: ['おもう', 'いう'], grade: 2 },
  { kanji: '行', readings: ['いく'], distractors: ['くる', 'かえる'], grade: 2 },
  { kanji: '高', readings: ['たかい'], distractors: ['ひくい', 'やすい'], grade: 2 },
  { kanji: '黄', readings: ['き'], distractors: ['あか', 'あお'], grade: 2 },
  { kanji: '合', readings: ['あう'], distractors: ['いう', 'みる'], grade: 2 },
  { kanji: '谷', readings: ['たに'], distractors: ['やま', 'かわ'], grade: 2 },
  { kanji: '国', readings: ['くに'], distractors: ['まち', 'むら'], grade: 2 },
  { kanji: '黒', readings: ['くろ'], distractors: ['しろ', 'あか'], grade: 2 },
  { kanji: '今', readings: ['いま'], distractors: ['まえ', 'あと'], grade: 2 },
  { kanji: '細', readings: ['ほそい'], distractors: ['ふとい', 'ながい'], grade: 2 },
  { kanji: '作', readings: ['つくる'], distractors: ['こわす', 'なおす'], grade: 2 },
  { kanji: '止', readings: ['とまる'], distractors: ['いく', 'くる'], grade: 2 },
  { kanji: '市', readings: ['いち'], distractors: ['まち', 'むら'], grade: 2 },
  { kanji: '矢', readings: ['や'], distractors: ['ゆみ', 'かたな'], grade: 2 },
  { kanji: '姉', readings: ['あね'], distractors: ['いもうと', 'はは'], grade: 2 },
  { kanji: '思', readings: ['お思う'], distractors: ['いう', 'きく'], grade: 2 },
  { kanji: '紙', readings: ['かみ'], distractors: ['ぬの', 'いと'], grade: 2 },
  { kanji: '寺', readings: ['てら'], distractors: ['じんじゃ', 'いえ'], grade: 2 },
  { kanji: '自', readings: ['みずから'], distractors: ['ひと', 'そら'], grade: 2 },
  { kanji: '時', readings: ['とき'], distractors: ['いま', 'ねん'], grade: 2 },
  { kanji: '社', readings: ['やしろ'], distractors: ['まち', 'いえ'], grade: 2 },
  { kanji: '弱', readings: ['よわい'], distractors: ['つよい', 'はやい'], grade: 2 },
  { kanji: '首', readings: ['くび'], distractors: ['あたま', 'て'], grade: 2 },
  { kanji: '秋', readings: ['あき'], distractors: ['はる', 'なつ'], grade: 2 },
  { kanji: '春', readings: ['はる'], distractors: ['なつ', 'あき'], grade: 2 },
  { kanji: '書', readings: ['かく'], distractors: ['よむ', 'きく'], grade: 2 },
  { kanji: '少', readings: ['すくない'], distractors: ['おおい', 'ちいさい'], grade: 2 },
  { kanji: '場', readings: ['ば'], distractors: ['ところ', 'みせ'], grade: 2 },
  { kanji: '色', readings: ['いろ'], distractors: ['かたち', 'おと'], grade: 2 },
  { kanji: '食', readings: ['たべる'], distractors: ['のむ', 'ねる'], grade: 2 },
  { kanji: '心', readings: ['こころ'], distractors: ['あたま', 'からだ'], grade: 2 },
  { kanji: '新', readings: ['あたらしい'], distractors: ['ふるい', 'わかい'], grade: 2 },
  { kanji: '親', readings: ['おや'], distractors: ['こ', 'ともだち'], grade: 2 },
  { kanji: '数', readings: ['かず'], distractors: ['おおい', 'すくない'], grade: 2 },
  { kanji: '西', readings: ['にし'], distractors: ['ひがし', 'みなみ'], grade: 2 },
  { kanji: '声', readings: ['こえ'], distractors: ['おト', 'うた'], grade: 2 },
  { kanji: '星', readings: ['ほし'], distractors: ['つき', 'ひ'], grade: 2 },
  { kanji: '晴', readings: ['はれ'], distractors: ['あめ', 'くもり'], grade: 2 },
  { kanji: '切', readings: ['きる'], distractors: ['はる', 'ぬう'], grade: 2 },
  { kanji: '雪', readings: ['ゆき'], distractors: ['あめ', 'くも'], grade: 2 },
  { kanji: '船', readings: ['ふね'], distractors: ['くるま', 'ひこうき'], grade: 2 },
  { kanji: '前', readings: ['まえ'], distractors: ['あと', 'いま'], grade: 2 },
  { kanji: '組', readings: ['くみ'], distractors: ['なかま', 'いえ'], grade: 2 },
  { kanji: '走', readings: ['はしる'], distractors: ['あるく', 'とまる'], grade: 2 },
  { kanji: '多', readings: ['おおい'], distractors: ['すくない', 'ちいさい'], grade: 2 },
  { kanji: '太', readings: ['ふとい'], distractors: ['ほそい', 'ながい'], grade: 2 },
  { kanji: '体', readings: ['からだ'], distractors: ['あたま', 'こころ'], grade: 2 },
  { kanji: '池', readings: ['いけ'], distractors: ['うみ', 'かわ'], grade: 2 },
  { kanji: '知', readings: ['しる'], distractors: ['いう', 'きく'], grade: 2 },
  { kanji: '昼', readings: ['ひる'], distractors: ['よる', 'あさ'], grade: 2 },
  { kanji: '長', readings: ['ながい'], distractors: ['みじかい', 'ひろい'], grade: 2 },
  { kanji: '鳥', readings: ['とり'], distractors: ['いぬ', 'さかな'], grade: 2 },
  { kanji: '朝', readings: ['あさ'], distractors: ['ひる', 'よる'], grade: 2 },
  { kanji: '直', readings: ['なおす'], distractors: ['こわす', 'つくる'], grade: 2 },
  { kanji: '通', readings: ['とおる'], distractors: ['いく', 'くる'], grade: 2 },
  { kanji: '弟', readings: ['おとうと'], distractors: ['あに', 'あね'], grade: 2 },
  { kanji: '店', readings: ['みせ'], distractors: ['いえ', 'まち'], grade: 2 },
  { kanji: '刀', readings: ['かたな'], distractors: ['ゆみ', 'や'], grade: 2 },
  { kanji: '冬', readings: ['ふゆ'], distractors: ['はる', 'なつ'], grade: 2 },
  { kanji: '当', readings: ['あたる'], distractors: ['はずれる', 'いう'], grade: 2 },
  { kanji: '東', readings: ['ひがし'], distractors: ['にし', 'みなみ'], grade: 2 },
  { kanji: '答', readings: ['こたえる'], distractors: ['きく', 'いう'], grade: 2 },
  { kanji: '頭', readings: ['あたま'], distractors: ['かお', 'て'], grade: 2 },
  { kanji: '同', readings: ['おなじ'], distractors: ['ちがう', 'にている'], grade: 2 },
  { kanji: '道', readings: ['みち'], distractors: ['まち', 'やま'], grade: 2 },
  { kanji: '読', readings: ['よむ'], distractors: ['かく', 'きく'], grade: 2 },
  { kanji: '内', readings: ['うち'], distractors: ['そと', 'なか'], grade: 2 },
  { kanji: '南', readings: ['みなみ'], distractors: ['きた', 'ひがし'], grade: 2 },
  { kanji: '馬', readings: ['うま'], distractors: ['うし', 'いぬ'], grade: 2 },
  { kanji: '売', readings: ['うる'], distractors: ['かう', 'だす'], grade: 2 },
  { kanji: '買', readings: ['かう'], distractors: ['うる', 'もらう'], grade: 2 },
  { kanji: '麦', readings: ['むぎ'], distractors: ['こめ', 'いね'], grade: 2 },
  { kanji: '父', readings: ['ちち'], distractors: ['はは', 'おじ'], grade: 2 },
  { kanji: '風', readings: ['かぜ'], distractors: ['あめ', 'くも'], grade: 2 },
  { kanji: '分', readings: ['わける'], distractors: ['あわせる', 'きる'], grade: 2 },
  { kanji: '聞', readings: ['きく'], distractors: ['いう', 'よむ'], grade: 2 },
  { kanji: '米', readings: ['こめ'], distractors: ['むぎ', 'パン'], grade: 2 },
  { kanji: '歩', readings: ['あるく'], distractors: ['はしる', 'とまる'], grade: 2 },
  { kanji: '母', readings: ['はは'], distractors: ['ちち', 'おば'], grade: 2 },
  { kanji: '方', readings: ['かた'], distractors: ['ひと', 'もの'], grade: 2 },
  { kanji: '北', readings: ['きた'], distractors: ['みなみ', 'にし'], grade: 2 },
  { kanji: '妹', readings: ['いもうと'], distractors: ['あね', 'はは'], grade: 2 },
  { kanji: '明', readings: ['あかるい'], distractors: ['くらい', 'はやい'], grade: 2 },
  { kanji: '鳴', readings: ['なく'], distractors: ['いう', 'きく'], grade: 2 },
  { kanji: '毛', readings: ['け'], distractors: ['はだ', 'つめ'], grade: 2 },
  { kanji: '夜', readings: ['よる'], distractors: ['ひる', 'あさ'], grade: 2 },
  { kanji: '野', readings: ['の'], distractors: ['やま', 'まち'], grade: 2 },
  { kanji: '友', readings: ['とも'], distractors: ['なかま', 'ひと'], grade: 2 },
  { kanji: '来', readings: ['くる'], distractors: ['いく', 'かえる'], grade: 2 },
  { kanji: '里', readings: ['さと'], distractors: ['むら', 'まち'], grade: 2 },
  { kanji: '話', readings: ['はなす'], distractors: ['きく', 'よむ'], grade: 2 },
];

type GameState = 'START' | 'PLAYING' | 'RESULT' | 'COLLECTION';

interface Mole {
  id: number;
  text: string;
  isCorrect: boolean;
  isVisible: boolean;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState(KANJI_DATA[0]);
  const [masteredKanji, setMasteredKanji] = useState<Set<string>>(new Set());
  const [moles, setMoles] = useState<Mole[]>(
    Array.from({ length: 4 }, (_, i) => ({ id: i, text: '', isCorrect: false, isVisible: false }))
  );
  const controls = useAnimation();

  const [showReadings, setShowReadings] = useState(true);

  // ローカルストレージからデータを読み込む
  useEffect(() => {
    const saved = localStorage.getItem('masteredKanji');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMasteredKanji(new Set(parsed));
        }
      } catch (e) {
        console.error('Failed to load masteredKanji', e);
      }
    }
  }, []);

  // データを保存する
  useEffect(() => {
    localStorage.setItem('masteredKanji', JSON.stringify(Array.from(masteredKanji)));
  }, [masteredKanji]);
  const [feedback, setFeedback] = useState<{ x: number; y: number; text: string; color: string } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimeouts = useRef<Record<number, NodeJS.Timeout>>({});

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(60);
    setGameState('PLAYING');
    pickNewQuestion();
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [COLORS.primary, COLORS.secondary, COLORS.accent]
    });
  };

  const shakeScreen = async () => {
    await controls.start({
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.2 }
    });
  };

  const pickNewQuestion = useCallback(() => {
    const randomQuestion = KANJI_DATA[Math.floor(Math.random() * KANJI_DATA.length)];
    setCurrentQuestion(randomQuestion);

    const correctReading = randomQuestion.readings[Math.floor(Math.random() * randomQuestion.readings.length)];
    const distractorPool = [...randomQuestion.distractors];
    while (distractorPool.length < 3) {
      const other = KANJI_DATA[Math.floor(Math.random() * KANJI_DATA.length)].readings[0];
      if (!randomQuestion.readings.includes(other) && !distractorPool.includes(other)) {
        distractorPool.push(other);
      }
    }
    
    const shuffledOptions = [
      { text: correctReading, isCorrect: true },
      ...distractorPool.slice(0, 3).map(d => ({ text: d, isCorrect: false }))
    ].sort(() => Math.random() - 0.5);

    setMoles(prev => {
      // 全てのタイムアウトをクリア
      Object.values(moleTimeouts.current).forEach(clearTimeout);
      moleTimeouts.current = {};
      
      return prev.map((m, i) => ({
        ...m,
        text: shuffledOptions[i].text,
        isCorrect: shuffledOptions[i].isCorrect,
        isVisible: false
      }));
    });
  }, []);

  const spawnMole = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    setMoles((prevMoles) => {
      const invisibleMoles = prevMoles.filter((m) => !m.isVisible);
      if (invisibleMoles.length === 0) return prevMoles;

      // 同時に出現する数はランダム（40%の確率で2つ、それ以外は1つ）
      const numToSpawn = Math.random() < 0.4 && invisibleMoles.length >= 2 ? 2 : 1;
      const targets: Mole[] = [];
      
      let currentInvisible = [...invisibleMoles];
      for (let i = 0; i < numToSpawn; i++) {
        if (currentInvisible.length === 0) break;
        
        // 完全にランダムに出現させる（正解の優先度を廃止）
        const idx = Math.floor(Math.random() * currentInvisible.length);
        const target = currentInvisible[idx];
        
        targets.push(target);
        currentInvisible = currentInvisible.filter(m => m.id !== target.id);
      }

      const newMoles = prevMoles.map((m) =>
        targets.some(t => t.id === m.id) ? { ...m, isVisible: true } : m
      );

      // 表示時間をさらに延長（3秒〜5秒程度）し、タイムアウトの衝突を防ぐ
      targets.forEach(target => {
        if (moleTimeouts.current[target.id]) {
          clearTimeout(moleTimeouts.current[target.id]);
        }

        const baseDuration = Math.max(3000, 5000 - (score * 5));
        const duration = baseDuration + Math.random() * 1000;

        moleTimeouts.current[target.id] = setTimeout(() => {
          setMoles((current) =>
            current.map((m) => (m.id === target.id ? { ...m, isVisible: false } : m))
          );
          delete moleTimeouts.current[target.id];
        }, duration);
      });

      return newMoles;
    });

    // 次の出現までの間隔を少し広げる（ゆったりさせる）
    const baseSpawnTime = Math.max(800, 1500 - (score * 10));
    const nextSpawnTime = baseSpawnTime + Math.random() * 1000;
    spawnRef.current = setTimeout(spawnMole, nextSpawnTime);
  }, [gameState, score]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('RESULT');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      spawnMole();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearTimeout(spawnRef.current);
      Object.values(moleTimeouts.current).forEach(clearTimeout);
      moleTimeouts.current = {};
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearTimeout(spawnRef.current);
      Object.values(moleTimeouts.current).forEach(clearTimeout);
      moleTimeouts.current = {};
    };
  }, [gameState, spawnMole]);

  const handleMoleClick = (mole: Mole, e: React.MouseEvent) => {
    if (!mole.isVisible) return;

    // クリックされたモグラのタイムアウトをクリア
    if (moleTimeouts.current[mole.id]) {
      clearTimeout(moleTimeouts.current[mole.id]);
      delete moleTimeouts.current[mole.id];
    }

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    if (mole.isCorrect) {
      setScore((prev) => {
        const next = prev + 1;
        // 10問ごとにコンフェッティでお祝い
        if (next % 10 === 0) {
          confetti({ particleCount: 100, spread: 160 });
        }
        return next;
      });

      setStreak((prev) => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });

      const feedbackText = 'せいかい！';
      const feedbackColor = 'text-cyan-400';
      
      setMasteredKanji(prev => {
        const next = new Set(prev);
        next.add(currentQuestion.kanji);
        return next;
      });

      pickNewQuestion();
      setFeedback({ x, y, text: feedbackText, color: feedbackColor });
    } else {
      shakeScreen();
      setFeedback({ x, y, text: 'ざんねん！', color: 'text-rose-500' });
      setStreak(0);
    }

    setMoles((prev) => prev.map((m) => (m.id === mole.id ? { ...m, isVisible: false } : m)));
    setTimeout(() => setFeedback(null), 800);
  };

  return (
    <motion.div 
      animate={controls}
      className={`h-screen font-sans text-slate-100 flex flex-col items-center justify-center p-2 md:p-4 select-none overflow-hidden transition-all duration-1000 bg-slate-950`}
    >
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${COLORS.primary}22 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10" />
      </div>

      {/* Header Stats */}
      {gameState === 'PLAYING' && (
        <div className="absolute top-4 left-0 right-0 flex flex-col items-center z-10 px-6 max-w-4xl mx-auto w-full gap-4">
          <div className="flex justify-between w-full items-center">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 shadow-xl">
                <Clock className={`w-5 h-5 ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-cyan-400'}`} />
                <span className={`text-2xl font-black tabular-nums ${timeLeft < 10 ? 'text-rose-500' : 'text-white'}`}>{timeLeft}s</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className={`px-8 py-2 rounded-2xl border-2 shadow-2xl flex flex-col items-center min-w-[140px] bg-slate-800/80 border-slate-700 text-white`}>
                <span className="text-xs font-bold uppercase tracking-widest opacity-70">せいかい数</span>
                <span className="text-4xl font-black tabular-nums">{score}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 shadow-xl">
                <Zap className={`w-5 h-5 ${streak > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'}`} />
                <span className="text-2xl font-black tabular-nums">{streak}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {gameState === 'START' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="text-center z-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <h1 className="text-7xl md:text-9xl font-black mb-2 tracking-tighter italic">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600">かんじ</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-fuchsia-400 to-rose-600">たたき！</span>
              </h1>
            </motion.div>
            
            <p className="text-slate-400 font-bold tracking-[0.3em] uppercase mb-4 text-sm">くんよみを おぼえよう</p>

            {/* Mastery Bar */}
            <div className="max-w-xs mx-auto mb-12">
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                <span>どれくらい おぼえたかな</span>
                <span>{Math.round((masteredKanji.size / KANJI_DATA.length) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(masteredKanji.size / KANJI_DATA.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 max-w-xs mx-auto">
              <button
                onClick={startGame}
                className="group relative bg-white text-slate-950 text-2xl font-black py-6 px-12 rounded-2xl shadow-[0_8px_0_#cbd5e1] hover:shadow-[0_4px_0_#cbd5e1] hover:translate-y-[4px] active:shadow-none active:translate-y-[8px] transition-all flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-fuchsia-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Play className="w-6 h-6 fill-current" />
                あそぶ
              </button>
              
              <button
                onClick={() => setGameState('COLLECTION')}
                className="bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-bold py-4 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-5 h-5" />
                あつめた かんじ
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'COLLECTION' && (
          <motion.div
            key="collection"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-700 w-full max-w-4xl max-h-[85vh] flex flex-col z-20 relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            
            <div className="flex justify-between items-center mb-8 relative">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                  <Award className="w-10 h-10 text-cyan-400" />
                  かんじ ずかん
                </h2>
                <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">どれくらい おぼえたかな</p>
              </div>
              <button
                onClick={() => setGameState('START')}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl transition-all flex items-center gap-2 font-black border border-slate-600"
              >
                <RotateCcw className="w-5 h-5" />
                もどる
              </button>
            </div>

            <div className="flex flex-wrap gap-6 mb-8 text-xs font-black items-center relative">
              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                <span className="text-slate-300">おぼえた</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                <div className="w-3 h-3 bg-slate-700 rounded-full" />
                <span className="text-slate-500">まだだよ</span>
              </div>
              
              <div className="ml-auto flex items-center gap-4">
                <button
                  onClick={() => setShowReadings(!showReadings)}
                  className={`px-4 py-2 rounded-xl transition-all font-black border ${
                    showReadings ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {showReadings ? 'よみを かくす' : 'よみを だす'}
                </button>
                <div className="text-2xl font-black text-white bg-slate-800 px-4 py-1 rounded-xl border border-slate-700">
                  <span className="text-cyan-400">{masteredKanji.size}</span>
                  <span className="text-slate-600 mx-1">/</span>
                  <span className="text-slate-400">{KANJI_DATA.length}</span>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 pr-4 custom-scrollbar relative">
              <div className="space-y-12">
                {[1, 2].map(grade => (
                  <div key={grade}>
                    <h3 className="text-xl font-black text-slate-400 mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-sm border border-slate-700">{grade}</span>
                      {grade}ねんせいの かんじ
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                      {KANJI_DATA.filter(k => k.grade === grade).map(item => {
                        const isMastered = masteredKanji.has(item.kanji);
                        return (
                          <motion.div
                            key={item.kanji}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all relative group ${
                              isMastered 
                                ? 'bg-slate-800 border-cyan-500/50 text-white shadow-lg' 
                                : 'bg-slate-900/50 border-slate-800 text-slate-700'
                            }`}
                          >
                            {isMastered && <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            <span className={`text-3xl font-black leading-none mb-2 ${isMastered ? 'text-white' : 'text-slate-800'}`}>{item.kanji}</span>
                            {showReadings && (
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md tracking-tighter ${
                                isMastered ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-700'
                              }`}>
                                {item.readings[0]}
                              </span>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'PLAYING' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl flex flex-col items-center gap-12 relative"
          >
            {/* Question Display */}
            <div className="relative">
              <div className={`bg-slate-900/80 backdrop-blur-xl px-16 py-12 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border-2 border-slate-700 text-center relative`}>
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap shadow-lg bg-cyan-500 text-slate-950`}>
                  この かんじを よもう
                </div>
                <motion.h2 
                  key={currentQuestion.kanji}
                  initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  className={`text-9xl md:text-[12rem] font-black leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] text-white`}
                >
                  {currentQuestion.kanji}
                </motion.h2>
              </div>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-2 gap-6 md:gap-12 w-full max-w-lg px-4">
              {moles.map((mole) => (
                <div key={mole.id} className="relative aspect-square group">
                  {/* Cyber Hole */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-slate-950 rounded-[100%] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border-b-4 border-slate-800" />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1/4 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-colors" />
                  
                  {/* Mole/Kanji */}
                  <AnimatePresence>
                    {mole.isVisible && (
                      <motion.button
                        initial={{ y: 120, scale: 0.8, rotate: -5 }}
                        animate={{ y: 0, scale: 1, rotate: 0 }}
                        exit={{ y: 120, scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9, y: 10 }}
                        onClick={(e) => handleMoleClick(mole, e)}
                        className={`absolute inset-0 flex items-center justify-center rounded-3xl text-3xl md:text-5xl font-black shadow-2xl border-4 transition-all z-20 overflow-hidden bg-slate-100 border-white text-slate-900`}
                      >
                        <span className="relative z-10 drop-shadow-md">{mole.text}</span>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Hole Rim Decoration */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-slate-800 rounded-b-3xl border-t-2 border-slate-700 z-10" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {gameState === 'RESULT' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-slate-900 p-12 rounded-[3rem] shadow-2xl border-2 border-slate-700 max-w-xl w-full z-20 relative overflow-hidden"
          >
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl" />
            
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
            >
              <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]" />
            </motion.div>
            
            <h2 className="text-5xl font-black text-white mb-2 italic tracking-tighter">おつかれさま！</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest mb-12">がんばったね！</p>
            
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <span className="block text-slate-500 text-xs font-black uppercase mb-1">せいかい数</span>
                <span className="text-5xl font-black text-cyan-400">{score}</span>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <span className="block text-slate-500 text-xs font-black uppercase mb-1">れんぞくせいかい</span>
                <span className="text-5xl font-black text-rose-400">{maxStreak}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={startGame}
                className="w-full bg-white text-slate-950 text-2xl font-black py-6 rounded-2xl shadow-[0_8px_0_#cbd5e1] hover:shadow-[0_4px_0_#cbd5e1] hover:translate-y-[4px] active:shadow-none active:translate-y-[8px] transition-all flex items-center justify-center gap-3"
              >
                <RotateCcw className="w-6 h-6" />
                もういちど あそぶ
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setGameState('COLLECTION')}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  あつめた かんじ
                </button>
                <button
                  onClick={() => setGameState('START')}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <Target className="w-5 h-5" />
                  さいしょに もどる
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: feedback.y, scale: 0.5 }}
            animate={{ opacity: 1, y: feedback.y - 150, scale: 1.5 }}
            exit={{ opacity: 0, scale: 2 }}
            className={`fixed z-50 text-4xl font-black pointer-events-none italic tracking-tighter drop-shadow-lg ${feedback.color}`}
            style={{ left: feedback.x - 50, top: feedback.y }}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
