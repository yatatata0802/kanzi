/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Clock, Star, Play, RotateCcw, Zap } from 'lucide-react';

/// 小学1・2年生の漢字データ
const KANJI_DATA = [
  // 1年生
  { kanji: '一', readings: ['いち', 'ひと'], distractors: ['に', 'し'], grade: 1 },
  { kanji: '二', readings: ['に', 'ふた'], distractors: ['いち', 'さん'], grade: 1 },
  { kanji: '三', readings: ['さん', 'み'], distractors: ['に', 'よん'], grade: 1 },
  { kanji: '四', readings: ['よん', 'し'], distractors: ['さん', 'ご'], grade: 1 },
  { kanji: '五', readings: ['ご', 'いつ'], distractors: ['よん', 'ろく'], grade: 1 },
  { kanji: '六', readings: ['ろく', 'む'], distractors: ['ご', 'なな'], grade: 1 },
  { kanji: '七', readings: ['なな', 'しち'], distractors: ['ろく', 'はち'], grade: 1 },
  { kanji: '八', readings: ['はち', 'や'], distractors: ['なな', 'きゅう'], grade: 1 },
  { kanji: '九', readings: ['きゅう', 'く', 'ここの'], distractors: ['はち', 'じゅう'], grade: 1 },
  { kanji: '十', readings: ['じゅう', 'とお'], distractors: ['きゅう', 'いち'], grade: 1 },
  { kanji: '日', readings: ['ひ', 'にち'], distractors: ['つき', 'ほし'], grade: 1 },
  { kanji: '月', readings: ['つき', 'げつ'], distractors: ['ひ', 'ほし'], grade: 1 },
  { kanji: '火', readings: ['ひ', 'か'], distractors: ['みず', 'き'], grade: 1 },
  { kanji: '水', readings: ['みず', 'すい'], distractors: ['ひ', 'つち'], grade: 1 },
  { kanji: '木', readings: ['き', 'もく'], distractors: ['ひ', 'かね'], grade: 1 },
  { kanji: '金', readings: ['かね', 'きん'], distractors: ['き', 'つち'], grade: 1 },
  { kanji: '土', readings: ['つち', 'ど'], distractors: ['き', 'みず'], grade: 1 },
  { kanji: '山', readings: ['やま', 'さん'], distractors: ['かわ', 'もり'], grade: 1 },
  { kanji: '川', readings: ['かわ', 'せん'], distractors: ['やま', 'うみ'], grade: 1 },
  { kanji: '田', readings: ['た', 'でん'], distractors: ['はた', 'やま'], grade: 1 },
  { kanji: '人', readings: ['ひと', 'じん', 'にん'], distractors: ['いぬ', 'ねこ'], grade: 1 },
  { kanji: '子', readings: ['こ', 'し'], distractors: ['おや', 'いぬ'], grade: 1 },
  { kanji: '女', readings: ['おんな', 'じょ'], distractors: ['おとこ', 'はは'], grade: 1 },
  { kanji: '男', readings: ['おとこ', 'だん'], distractors: ['おんな', 'ちち'], grade: 1 },
  { kanji: '目', readings: ['め', 'もく'], distractors: ['みみ', 'くち'], grade: 1 },
  { kanji: '口', readings: ['くち', 'こう'], distractors: ['め', 'みみ'], grade: 1 },
  { kanji: '耳', readings: ['みみ', 'じ'], distractors: ['め', 'くち'], grade: 1 },
  { kanji: '手', readings: ['て', 'しゅ'], distractors: ['あし', 'ゆび'], grade: 1 },
  { kanji: '足', readings: ['あし', 'そく'], distractors: ['て', 'ゆび'], grade: 1 },
  { kanji: '見', readings: ['みる', 'けん'], distractors: ['きく', 'かく'], grade: 1 },
  { kanji: '立', readings: ['たつ', 'りつ'], distractors: ['ねる', 'いく'], grade: 1 },
  { kanji: '休', readings: ['やすむ', 'きゅう'], distractors: ['あそぶ', 'ねる'], grade: 1 },
  { kanji: '学', readings: ['まなぶ', 'がく'], distractors: ['あそぶ', 'かく'], grade: 1 },
  { kanji: '校', readings: ['こう'], distractors: ['いえ', 'みせ', 'きょう'], grade: 1 },
  { kanji: '先', readings: ['さき', 'せん'], distractors: ['あと', 'いま'], grade: 1 },
  { kanji: '生', readings: ['なま', 'せい', 'うまれる'], distractors: ['しぬ', 'ねる'], grade: 1 },
  { kanji: '花', readings: ['はな', 'か'], distractors: ['くさ', 'き'], grade: 1 },
  { kanji: '草', readings: ['くさ', 'そう'], distractors: ['はな', 'き'], grade: 1 },
  { kanji: '虫', readings: ['むし', 'ちゅう'], distractors: ['とり', 'さかな'], grade: 1 },
  { kanji: '犬', readings: ['いぬ', 'けん'], distractors: ['ねこ', 'とり'], grade: 1 },
  { kanji: '貝', readings: ['かい', 'ばい'], distractors: ['さかな', 'うみ'], grade: 1 },
  { kanji: '赤', readings: ['あか', 'せき'], distractors: ['あお', 'しろ'], grade: 1 },
  { kanji: '青', readings: ['あお', 'せい'], distractors: ['あか', 'きいろ'], grade: 1 },
  { kanji: '白', readings: ['しろ', 'はく'], distractors: ['くろ', 'あか'], grade: 1 },
  // 2年生
  { kanji: '引', readings: ['ひく', 'いん'], distractors: ['おす', 'だす'], grade: 2 },
  { kanji: '羽', readings: ['はね', 'う'], distractors: ['とり', 'むし'], grade: 2 },
  { kanji: '雲', readings: ['くも', 'うん'], distractors: ['あめ', 'ゆき'], grade: 2 },
  { kanji: '園', readings: ['えん'], distractors: ['にわ', 'いえ'], grade: 2 },
  { kanji: '遠', readings: ['とおい', 'えん'], distractors: ['ちかい', 'はやい'], grade: 2 },
  { kanji: '何', readings: ['なに', 'か'], distractors: ['どこ', 'だれ'], grade: 2 },
  { kanji: '科', readings: ['か'], distractors: ['りか', 'さんすう'], grade: 2 },
  { kanji: '夏', readings: ['なつ', 'げ'], distractors: ['ふゆ', 'はる'], grade: 2 },
  { kanji: '家', readings: ['いえ', 'か', 'うち'], distractors: ['みせ', 'まち'], grade: 2 },
  { kanji: '歌', readings: ['うた', 'か'], distractors: ['おどる', 'きく'], grade: 2 },
  { kanji: '画', readings: ['が', 'かく'], distractors: ['え', 'よむ'], grade: 2 },
  { kanji: '回', readings: ['まわる', 'かい'], distractors: ['とまる', 'いく'], grade: 2 },
  { kanji: '会', readings: ['あう', 'かい'], distractors: ['いう', 'みる'], grade: 2 },
  { kanji: '海', readings: ['うみ', 'かい'], distractors: ['かわ', 'いけ'], grade: 2 },
  { kanji: '絵', readings: ['え', 'かい'], distractors: ['ず', 'が'], grade: 2 },
  { kanji: '外', readings: ['そと', 'がい'], distractors: ['なか', 'うち'], grade: 2 },
  { kanji: '角', readings: ['かど', 'かく'], distractors: ['まる', 'しかく'], grade: 2 },
  { kanji: '楽', readings: ['たのしい', 'らく', 'がく'], distractors: ['かなしい', 'おもい'], grade: 2 },
  { kanji: '活', readings: ['かつ'], distractors: ['しぬ', 'いきる'], grade: 2 },
  { kanji: '間', readings: ['あいだ', 'かん', 'ま'], distractors: ['なか', 'となり'], grade: 2 },
  { kanji: '丸', readings: ['まる', 'がん'], distractors: ['しかく', 'さんかく'], grade: 2 },
  { kanji: '岩', readings: ['いわ', 'がん'], distractors: ['いし', 'やま'], grade: 2 },
  { kanji: '顔', readings: ['かお', 'がん'], distractors: ['あたま', 'て'], grade: 2 },
  { kanji: '汽', readings: ['き'], distractors: ['みず', 'ゆげ'], grade: 2 },
  { kanji: '記', readings: ['しるす', 'き'], distractors: ['かく', 'よむ'], grade: 2 },
  { kanji: '帰', readings: ['かえる', 'き'], distractors: ['いく', 'くる'], grade: 2 },
  { kanji: '弓', readings: ['ゆみ', 'きゅう'], distractors: ['や', 'かたな'], grade: 2 },
  { kanji: '牛', readings: ['うし', 'ぎゅう'], distractors: ['うま', 'ぶた'], grade: 2 },
  { kanji: '魚', readings: ['さかな', 'ぎょ'], distractors: ['とり', 'むし'], grade: 2 },
  { kanji: '京', readings: ['きょう', 'けい'], distractors: ['みやコ', 'まち'], grade: 2 },
  { kanji: '強', readings: ['つよい', 'きょう'], distractors: ['よわい', 'はやい'], grade: 2 },
  { kanji: '教', readings: ['おしえる', 'きょう'], distractors: ['まなぶ', 'ならう'], grade: 2 },
  { kanji: '近', readings: ['ちかい', 'きん'], distractors: ['とおい', 'はやい'], grade: 2 },
  { kanji: '兄', readings: ['あに', 'けい'], distractors: ['おとうと', 'あね'], grade: 2 },
  { kanji: '形', readings: ['かたち', 'けい'], distractors: ['いろ', 'おと'], grade: 2 },
  { kanji: '計', readings: ['はかる', 'けい'], distractors: ['かく', 'よむ'], grade: 2 },
  { kanji: '元', readings: ['もと', 'げん'], distractors: ['さき', 'いま'], grade: 2 },
  { kanji: '言', readings: ['いう', 'げん'], distractors: ['きく', 'よむ'], grade: 2 },
  { kanji: '原', readings: ['はら', 'げん'], distractors: ['やま', 'うみ'], grade: 2 },
  { kanji: '戸', readings: ['と', 'こ'], distractors: ['まど', 'かべ'], grade: 2 },
  { kanji: '古', readings: ['ふるい', 'こ'], distractors: ['あたらしい', 'わかい'], grade: 2 },
  { kanji: '午', readings: ['ご'], distractors: ['ごぜん', 'ごご'], grade: 2 },
  { kanji: '後', readings: ['あと', 'ご', 'うしろ'], distractors: ['まえ', 'いま'], grade: 2 },
  { kanji: '語', readings: ['かたる', 'ご'], distractors: ['いう', 'きく'], grade: 2 },
  { kanji: '工', readings: ['こう', 'く'], distractors: ['だいく', 'つくる'], grade: 2 },
  { kanji: '公', readings: ['おおやけ', 'こう'], distractors: ['わたくし', 'みんな'], grade: 2 },
  { kanji: '広', readings: ['ひろい', 'こう'], distractors: ['せまい', 'ながい'], grade: 2 },
  { kanji: '交', readings: ['まじわる', 'こう'], distractors: ['あう', 'いく'], grade: 2 },
  { kanji: '光', readings: ['ひかり', 'こう'], distractors: ['かげ', 'おと'], grade: 2 },
  { kanji: '考', readings: ['かんがえる', 'こう'], distractors: ['おもう', 'いう'], grade: 2 },
  { kanji: '行', readings: ['いく', 'こう', 'おこなう'], distractors: ['くる', 'かえる'], grade: 2 },
  { kanji: '高', readings: ['たかい', 'こう'], distractors: ['ひくい', '安い'], grade: 2 },
  { kanji: '黄', readings: ['きいろ', 'こう'], distractors: ['あか', 'あお'], grade: 2 },
  { kanji: '合', readings: ['あう', 'ごう'], distractors: ['いう', 'みる'], grade: 2 },
  { kanji: '谷', readings: ['たに', 'こく'], distractors: ['やま', 'かわ'], grade: 2 },
  { kanji: '国', readings: ['くに', 'こく'], distractors: ['まち', 'むら'], grade: 2 },
  { kanji: '黒', readings: ['くろ', 'こく'], distractors: ['しろ', 'あか'], grade: 2 },
  { kanji: '今', readings: ['いま', 'こん'], distractors: ['まえ', 'あと'], grade: 2 },
  { kanji: '才', readings: ['さい'], distractors: ['とし', 'ねん'], grade: 2 },
  { kanji: '細', readings: ['ほそい', 'さい'], distractors: ['ふとい', 'ながい'], grade: 2 },
  { kanji: '作', readings: ['つくる', 'さく'], distractors: ['こわす', 'なおす'], grade: 2 },
  { kanji: '算', readings: ['さん'], distractors: ['かず', 'よむ'], grade: 2 },
  { kanji: '止', readings: ['とまる', 'し'], distractors: ['いく', 'くる'], grade: 2 },
  { kanji: '市', readings: ['いち', 'し'], distractors: ['まち', 'むら'], grade: 2 },
  { kanji: '矢', readings: ['や', 'し'], distractors: ['ゆみ', 'かたな'], grade: 2 },
  { kanji: '姉', readings: ['あね', 'し'], distractors: ['いもうと', 'はは'], grade: 2 },
  { kanji: '思', readings: ['おもう', 'し'], distractors: ['いう', 'きく'], grade: 2 },
  { kanji: '紙', readings: ['かみ', 'し'], distractors: ['ぬの', 'いと'], grade: 2 },
  { kanji: '寺', readings: ['てら', 'じ'], distractors: ['じんじゃ', 'いえ'], grade: 2 },
  { kanji: '自', readings: ['みずから', 'じ'], distractors: ['ひと', 'そら'], grade: 2 },
  { kanji: '時', readings: ['とき', 'じ'], distractors: ['いま', 'ねん'], grade: 2 },
  { kanji: '室', readings: ['しつ'], distractors: ['へや', 'いえ'], grade: 2 },
  { kanji: '社', readings: ['やしろ', 'しゃ'], distractors: ['まち', 'いえ'], grade: 2 },
  { kanji: '弱', readings: ['よわい', 'じゃく'], distractors: ['つよい', 'はやい'], grade: 2 },
  { kanji: '首', readings: ['くび', 'しゅ'], distractors: ['あたま', 'て'], grade: 2 },
  { kanji: '秋', readings: ['あき', 'しゅう'], distractors: ['はる', 'なつ'], grade: 2 },
  { kanji: '週', readings: ['しゅう'], distractors: ['ひ', 'つき'], grade: 2 },
  { kanji: '春', readings: ['はる', 'しゅん'], distractors: ['なつ', 'あき'], grade: 2 },
  { kanji: '書', readings: ['かく', 'しょ'], distractors: ['よむ', 'きく'], grade: 2 },
  { kanji: '少', readings: ['すくない', 'しょう'], distractors: ['おおい', 'ちいさい'], grade: 2 },
  { kanji: '場', readings: ['ば', 'じょう'], distractors: ['ところ', 'みせ'], grade: 2 },
  { kanji: '色', readings: ['いろ', 'しき'], distractors: ['かたち', 'おと'], grade: 2 },
  { kanji: '食', readings: ['たべる', 'しょく'], distractors: ['のむ', 'ねる'], grade: 2 },
  { kanji: '心', readings: ['こころ', 'しん'], distractors: ['あたま', 'からだ'], grade: 2 },
  { kanji: '新', readings: ['あたらしい', 'しん'], distractors: ['ふるい', 'わかい'], grade: 2 },
  { kanji: '親', readings: ['おや', 'しん'], distractors: ['こ', 'ともだち'], grade: 2 },
  { kanji: '図', readings: ['ず', 'と'], distractors: ['え', 'が'], grade: 2 },
  { kanji: '数', readings: ['かず', 'すう'], distractors: ['おおい', 'すくない'], grade: 2 },
  { kanji: '西', readings: ['にし', 'せい'], distractors: ['ひがし', 'みなみ'], grade: 2 },
  { kanji: '声', readings: ['こえ', 'せい'], distractors: ['おと', 'うた'], grade: 2 },
  { kanji: '星', readings: ['ほし', 'せい'], distractors: ['つき', 'ひ'], grade: 2 },
  { kanji: '晴', readings: ['はれ', 'せい'], distractors: ['あめ', 'くもり'], grade: 2 },
  { kanji: '切', readings: ['きる', 'せつ'], distractors: ['はる', 'ぬう'], grade: 2 },
  { kanji: '雪', readings: ['ゆき', 'せつ'], distractors: ['あめ', 'くも'], grade: 2 },
  { kanji: '船', readings: ['ふね', 'せん'], distractors: ['くるま', 'ひこうき'], grade: 2 },
  { kanji: '線', readings: ['せん'], distractors: ['まる', 'てん'], grade: 2 },
  { kanji: '前', readings: ['まえ', 'ぜん'], distractors: ['あと', 'いま'], grade: 2 },
  { kanji: '組', readings: ['くみ', 'そ'], distractors: ['なかま', 'いえ'], grade: 2 },
  { kanji: '走', readings: ['はしる', 'そう'], distractors: ['あるく', 'とまる'], grade: 2 },
  { kanji: '多', readings: ['おおい', 'た'], distractors: ['すくない', 'ちいさい'], grade: 2 },
  { kanji: '太', readings: ['ふとい', 'たい'], distractors: ['ほそい', 'ながい'], grade: 2 },
  { kanji: '体', readings: ['からだ', 'たい'], distractors: ['あたま', 'こころ'], grade: 2 },
  { kanji: '台', readings: ['だい', 'たい'], distractors: ['つくえ', 'いす'], grade: 2 },
  { kanji: '地', readings: ['ち'], distractors: ['そら', 'うみ'], grade: 2 },
  { kanji: '池', readings: ['いけ', 'ち'], distractors: ['うみ', 'かわ'], grade: 2 },
  { kanji: '知', readings: ['しる', 'ち'], distractors: ['いう', 'きく'], grade: 2 },
  { kanji: '茶', readings: ['ちゃ', 'さ'], distractors: ['みず', 'おゆ'], grade: 2 },
  { kanji: '昼', readings: ['ひる', 'ちゅう'], distractors: ['よる', 'あさ'], grade: 2 },
  { kanji: '長', readings: ['ながい', 'ちょう'], distractors: ['みじかい', 'ひろい'], grade: 2 },
  { kanji: '鳥', readings: ['とり', 'ちょう'], distractors: ['いぬ', 'さかな'], grade: 2 },
  { kanji: '朝', readings: ['あさ', 'ちょう'], distractors: ['ひる', 'よる'], grade: 2 },
  { kanji: '直', readings: ['なおす', 'ちょく'], distractors: ['こわす', 'つくる'], grade: 2 },
  { kanji: '通', readings: ['とおる', 'つう'], distractors: ['いく', 'くる'], grade: 2 },
  { kanji: '弟', readings: ['おとうと', 'だい'], distractors: ['あに', 'あね'], grade: 2 },
  { kanji: '店', readings: ['みせ', 'てん'], distractors: ['いえ', 'まち'], grade: 2 },
  { kanji: '点', readings: ['てん'], distractors: ['まる', 'せん'], grade: 2 },
  { kanji: '電', readings: ['でん'], distractors: ['ひかり', 'おと'], grade: 2 },
  { kanji: '刀', readings: ['かたな', 'とう'], distractors: ['ゆみ', 'や'], grade: 2 },
  { kanji: '冬', readings: ['ふゆ', 'とう'], distractors: ['はる', 'なつ'], grade: 2 },
  { kanji: '当', readings: ['あたる', 'とう'], distractors: ['はずれる', 'いう'], grade: 2 },
  { kanji: '東', readings: ['ひがし', 'とう'], distractors: ['にし', 'みなみ'], grade: 2 },
  { kanji: '答', readings: ['こたえる', 'とう'], distractors: ['きく', 'いう'], grade: 2 },
  { kanji: '頭', readings: ['あたま', 'とう'], distractors: ['かお', 'て'], grade: 2 },
  { kanji: '同', readings: ['おなじ', 'どう'], distractors: ['ちがう', 'にている'], grade: 2 },
  { kanji: '道', readings: ['みち', 'どう'], distractors: ['まち', 'やま'], grade: 2 },
  { kanji: '読', readings: ['よむ', 'どく'], distractors: ['かく', 'きく'], grade: 2 },
  { kanji: '内', readings: ['うち', 'ない'], distractors: ['そと', 'なか'], grade: 2 },
  { kanji: '南', readings: ['みなみ', 'なん'], distractors: ['きた', 'ひがし'], grade: 2 },
  { kanji: '肉', readings: ['にく'], distractors: ['さかな', 'やさい'], grade: 2 },
  { kanji: '馬', readings: ['うま', 'ば'], distractors: ['うし', 'いぬ'], grade: 2 },
  { kanji: '売', readings: ['うる', 'ばい'], distractors: ['かう', 'だす'], grade: 2 },
  { kanji: '買', readings: ['かう', 'ばい'], distractors: ['うる', 'もらう'], grade: 2 },
  { kanji: '麦', readings: ['むぎ', 'ばく'], distractors: ['こめ', 'いね'], grade: 2 },
  { kanji: '半', readings: ['はん'], distractors: ['ぜんぶ', 'すこし'], grade: 2 },
  { kanji: '番', readings: ['ばん'], distractors: ['かず', 'じゅんばん'], grade: 2 },
  { kanji: '父', readings: ['ちち', 'ふ'], distractors: ['はは', 'おじ'], grade: 2 },
  { kanji: '風', readings: ['かぜ', 'ふう'], distractors: ['あめ', 'くも'], grade: 2 },
  { kanji: '分', readings: ['わける', 'ぶん'], distractors: ['あわせる', 'きる'], grade: 2 },
  { kanji: '聞', readings: ['きく', 'ぶん'], distractors: ['いう', 'よむ'], grade: 2 },
  { kanji: '米', readings: ['こめ', 'まい'], distractors: ['むぎ', 'パン'], grade: 2 },
  { kanji: '歩', readings: ['あるく', 'ほ'], distractors: ['はしる', 'とまる'], grade: 2 },
  { kanji: '母', readings: ['はは', 'ぼ'], distractors: ['ちち', 'おば'], grade: 2 },
  { kanji: '方', readings: ['かた', 'ほう'], distractors: ['ひと', 'もの'], grade: 2 },
  { kanji: '北', readings: ['きた', 'ほく'], distractors: ['みなみ', 'にし'], grade: 2 },
  { kanji: '毎', readings: ['まい'], distractors: ['いつも', 'ときどき'], grade: 2 },
  { kanji: '妹', readings: ['いもうと', 'まい'], distractors: ['あね', 'はは'], grade: 2 },
  { kanji: '万', readings: ['まん'], distractors: ['せん', 'ひゃく'], grade: 2 },
  { kanji: '明', readings: ['あかるい', 'めい'], distractors: ['くらい', 'はやい'], grade: 2 },
  { kanji: '鳴', readings: ['なく', 'めい'], distractors: ['いう', 'きく'], grade: 2 },
  { kanji: '毛', readings: ['け', 'もう'], distractors: ['はだ', 'つめ'], grade: 2 },
  { kanji: '門', readings: ['もん'], distractors: ['と', 'まど'], grade: 2 },
  { kanji: '夜', readings: ['よる', 'や'], distractors: ['ひる', 'あさ'], grade: 2 },
  { kanji: '野', readings: ['の', 'や'], distractors: ['やま', 'まち'], grade: 2 },
  { kanji: '友', readings: ['とも', 'ゆう'], distractors: ['なかま', 'ひと'], grade: 2 },
  { kanji: '用', readings: ['よう'], distractors: ['こと', 'もの'], grade: 2 },
  { kanji: '曜', readings: ['よう'], distractors: ['ひ', 'つき'], grade: 2 },
  { kanji: '来', readings: ['くる', 'らい'], distractors: ['いく', 'かえる'], grade: 2 },
  { kanji: '里', readings: ['さと', 'り'], distractors: ['むら', 'まち'], grade: 2 },
  { kanji: '理', readings: ['り'], distractors: ['わけ', 'こと'], grade: 2 },
  { kanji: '話', readings: ['はなす', 'わ'], distractors: ['きく', 'よむ'], grade: 2 },
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
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState(KANJI_DATA[0]);
  const [masteredKanji, setMasteredKanji] = useState<Set<string>>(new Set());
  const [moles, setMoles] = useState<Mole[]>(
    Array.from({ length: 4 }, (_, i) => ({ id: i, text: '', isCorrect: false, isVisible: false }))
  );

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

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setGameState('PLAYING');
    pickNewQuestion();
  };

  const pickNewQuestion = useCallback(() => {
    const randomQuestion = KANJI_DATA[Math.floor(Math.random() * KANJI_DATA.length)];
    setCurrentQuestion(randomQuestion);

    // 選択肢の準備（正解1つ + 誤答3つ）
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

    setMoles(prev => prev.map((m, i) => ({
      ...m,
      text: shuffledOptions[i].text,
      isCorrect: shuffledOptions[i].isCorrect,
      isVisible: false
    })));
  }, []);

  const spawnMole = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    setMoles((prevMoles) => {
      const invisibleMoles = prevMoles.filter((m) => !m.isVisible);
      if (invisibleMoles.length === 0) return prevMoles;

      // ユーザーの要望「答えがですぎ」に応え、出現率を調整
      // 画面に正解がない場合でも、30%の確率でしか正解を優先しない（あとは完全ランダム）
      const correctMole = prevMoles.find(m => m.isCorrect);
      let targetMole;
      if (correctMole && !correctMole.isVisible && Math.random() < 0.3) {
        targetMole = correctMole;
      } else {
        targetMole = invisibleMoles[Math.floor(Math.random() * invisibleMoles.length)];
      }

      const newMoles = prevMoles.map((m) =>
        m.id === targetMole.id ? { ...m, isVisible: true } : m
      );

      // 難易度調整: スコアが上がるほど消えるのが早くなる
      const baseDuration = Math.max(800, 2000 - (score * 20));
      const duration = baseDuration + Math.random() * 500;

      setTimeout(() => {
        setMoles((current) =>
          current.map((m) => (m.id === targetMole.id ? { ...m, isVisible: false } : m))
        );
      }, duration);

      return newMoles;
    });

    // 難易度調整: スコアが上がるほど次が出るのが早くなる
    const baseSpawnTime = Math.max(400, 1000 - (score * 15));
    const nextSpawnTime = baseSpawnTime + Math.random() * 800;
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
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearTimeout(spawnRef.current);
    };
  }, [gameState, spawnMole]);

  const handleMoleClick = (mole: Mole, e: React.MouseEvent) => {
    if (!mole.isVisible) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    if (mole.isCorrect) {
      const bonus = streak >= 5 ? 2 : 1;
      setScore((prev) => prev + bonus);
      setStreak((prev) => prev + 1);
      setFeedback({ x, y, text: bonus > 1 ? `+${bonus} ボーナス!` : '+1', color: 'text-yellow-500' });
      
      // 正解した漢字を記録
      setMasteredKanji(prev => {
        const next = new Set(prev);
        next.add(currentQuestion.kanji);
        return next;
      });

      pickNewQuestion(); // 正解したらお題を変える
    } else {
      setScore((prev) => Math.max(0, prev - 1));
      setStreak(0);
      setFeedback({ x, y, text: '-1', color: 'text-red-500' });
    }

    // 叩いたもぐらを消す
    setMoles((prev) => prev.map((m) => (m.id === mole.id ? { ...m, isVisible: false } : m)));

    setTimeout(() => setFeedback(null), 800);
  };

  return (
    <div className="h-screen bg-sky-100 font-sans text-slate-800 flex flex-col items-center justify-center p-2 md:p-4 select-none overflow-hidden">
      {/* Header Stats */}
      {gameState === 'PLAYING' && (
        <div className="absolute top-2 left-0 right-0 flex justify-around items-center z-10 px-2">
          <div className="bg-white/90 backdrop-blur rounded-full px-4 py-1 shadow-md flex items-center gap-2 border-2 border-sky-400">
            <Clock className="text-sky-500 w-5 h-5" />
            <span className="text-xl font-bold tabular-nums">{timeLeft}s</span>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-full px-4 py-1 shadow-md flex items-center gap-2 border-2 border-yellow-400">
            <Star className="text-yellow-500 w-5 h-5" />
            <span className="text-xl font-bold tabular-nums">{score}</span>
          </div>
          {streak >= 3 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-orange-500 text-white rounded-full px-3 py-1 shadow-md flex items-center gap-1 border border-white"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span className="text-sm font-bold">{streak} れんぞく！</span>
            </motion.div>
          )}
        </div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {gameState === 'START' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center bg-white p-6 rounded-3xl shadow-2xl border-8 border-sky-400 max-w-sm w-full"
          >
            <h1 className="text-3xl font-black text-sky-600 mb-4 leading-tight">
              漢字<br />もぐらたたき
            </h1>
            <div className="bg-sky-50 p-4 rounded-2xl mb-6 text-base font-medium text-sky-800">
              <p className="mb-1">漢字を見て、正しい</p>
              <p className="text-xl font-bold text-orange-500">読み方を叩こう！</p>
            </div>
            <button
              onClick={startGame}
              className="group relative bg-orange-500 hover:bg-orange-600 text-white text-2xl font-black py-4 px-10 rounded-full shadow-[0_6px_0_rgb(194,65,12)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-3 mx-auto mb-4"
            >
              <Play className="w-6 h-6 fill-current" />
              スタート！
            </button>
            <button
              onClick={() => setGameState('COLLECTION')}
              className="text-sky-600 font-bold flex items-center gap-2 mx-auto hover:underline"
            >
              <Star className="w-5 h-5 fill-current" />
              かんじコレクション
            </button>
          </motion.div>
        )}

        {gameState === 'COLLECTION' && (
          <motion.div
            key="collection"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-6 rounded-3xl shadow-2xl border-8 border-sky-400 w-full max-w-2xl max-h-[85vh] flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black text-sky-600 flex items-center gap-2">
                <Star className="w-6 h-6 fill-sky-500" />
                かんじコレクション
              </h2>
              <button
                onClick={() => setGameState('START')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-full transition-colors flex items-center gap-2 font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                もどる
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-4 text-sm font-bold items-center">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-400 rounded-sm" />
                <span>おぼえた！</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-slate-100 border border-slate-300 rounded-sm" />
                <span>まだだよ</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setShowReadings(!showReadings)}
                  className={`px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1 ${
                    showReadings ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {showReadings ? '読みをかくす' : '読みをだす'}
                </button>
                <div className="text-sky-600">
                  {masteredKanji.size} / {KANJI_DATA.length}
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm('これまでのおぼえたデータを ぜんぶけしますか？')) {
                    setMasteredKanji(new Set());
                  }
                }}
                className="text-slate-300 hover:text-red-400 transition-colors ml-2"
                title="データをリセット"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
              <div className="space-y-6">
                {[1, 2].map(grade => (
                  <div key={grade}>
                    <h3 className="text-lg font-black text-slate-500 mb-3 border-b-2 border-slate-100 pb-1">
                      {grade}年生の かんじ
                    </h3>
                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                      {KANJI_DATA.filter(k => k.grade === grade).map(item => {
                        const isMastered = masteredKanji.has(item.kanji);
                        return (
                          <div
                            key={item.kanji}
                            className={`flex flex-col items-center justify-center py-2 rounded-xl border-2 transition-all ${
                              isMastered 
                                ? 'bg-orange-50 border-orange-400 text-orange-600 shadow-sm' 
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <span className="text-2xl font-black leading-none mb-1">{item.kanji}</span>
                            {showReadings && (
                              <span className={`text-[10px] font-bold px-1 rounded ${
                                isMastered ? 'bg-orange-200/50' : 'bg-slate-200/50 text-slate-500'
                              }`}>
                                {item.readings.join('・')}
                              </span>
                            )}
                          </div>
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
            className="w-full max-w-2xl flex flex-col items-center gap-4 md:gap-6"
          >
            {/* Question Display */}
            <div className="bg-white px-8 pt-10 pb-6 rounded-3xl shadow-lg border-4 border-sky-400 text-center relative mt-4">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-sky-400 text-white px-5 py-1.5 rounded-full text-base font-bold whitespace-nowrap shadow-sm">
                この漢字の読み方は？
              </div>
              <motion.h2 
                key={currentQuestion.kanji}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-7xl md:text-8xl font-black text-slate-700 leading-none"
              >
                {currentQuestion.kanji}
              </motion.h2>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-md px-4">
              {moles.map((mole) => (
                <div key={mole.id} className="relative aspect-square">
                  {/* Hole */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-slate-800/20 rounded-[100%] shadow-inner" />
                  
                  {/* Mole/Kanji */}
                  <AnimatePresence>
                    {mole.isVisible && (
                      <motion.button
                        initial={{ y: 80, scale: 0.5 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 80, scale: 0.5 }}
                        onClick={(e) => handleMoleClick(mole, e)}
                        className="absolute inset-0 flex items-center justify-center rounded-full text-2xl md:text-3xl font-black shadow-lg border-4 transition-transform active:scale-90 bg-amber-500 border-amber-300 text-white px-1 text-center break-all"
                        style={{ zIndex: 5 }}
                      >
                        {mole.text}
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Hole Rim */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-amber-800 rounded-b-3xl border-t-4 border-amber-900/20" style={{ zIndex: 10 }} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {gameState === 'RESULT' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white p-10 rounded-3xl shadow-2xl border-8 border-yellow-400 max-w-md w-full"
          >
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-slate-700 mb-2">タイムアップ！</h2>
            <p className="text-slate-500 mb-6">きみのスコアは...</p>
            
            <div className="text-7xl font-black text-orange-500 mb-8 drop-shadow-sm">
              {score}
              <span className="text-2xl ml-2">てん</span>
            </div>

            <div className="space-y-4">
              <button
                onClick={startGame}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow-[0_6px_0_rgb(3,105,161)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-6 h-6" />
                もういっかい！
              </button>
              <button
                onClick={() => setGameState('COLLECTION')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xl font-bold py-4 px-8 rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <Star className="w-6 h-6 fill-current" />
                コレクションをみる
              </button>
              <button
                onClick={() => setGameState('START')}
                className="w-full text-slate-400 text-base font-bold py-2 hover:underline"
              >
                タイトルにもどる
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: feedback.y, x: feedback.x - 50 }}
            animate={{ opacity: 1, y: feedback.y - 100 }}
            exit={{ opacity: 0 }}
            className={`fixed z-50 text-3xl font-black pointer-events-none ${feedback.color}`}
            style={{ left: feedback.x, top: feedback.y }}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-sky-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-300 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
