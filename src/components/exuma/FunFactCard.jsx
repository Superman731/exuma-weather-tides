import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const exumaFacts = [
  "The Exumas consist of over 365 cays and islands, often said to be 'one for every day of the year.'",
  "The famous swimming pigs of Big Major Cay have become one of the Bahamas' most popular tourist attractions.",
  "Thunderball Grotto, a stunning underwater cave, was featured in two James Bond films.",
  "The Exuma Cays Land and Sea Park was the first of its kind in the world, established in 1958.",
  "Exuma's waters are known for their extraordinary clarity, with visibility often exceeding 200 feet.",
  "Nurse sharks can be hand-fed at Compass Cay, a unique wildlife experience in the Exumas.",
  "Staniel Cay hosted scenes from the James Bond film 'Thunderball' and 'Never Say Never Again.'",
  "The limestone formations in Exuma are over 150 million years old.",
  "Exuma is home to the endangered Bahamian rock iguana, found nowhere else on Earth.",
  "The Tropic of Cancer runs through Little Exuma, marked by a monument on the beach.",
  "Pirates once used the hidden coves of the Exumas as hideouts, including the notorious Blackbeard.",
  "The water in Exuma appears in 50+ shades of blue due to varying depths and sandy bottoms.",
  "Leaf Cay is home to a colony of friendly iguanas that greet visitors on the beach.",
  "The Exumas were largely uninhabited until Loyalists arrived after the American Revolution.",
  "Stocking Island's Chat 'N' Chill is famous for its Sunday pig roasts and conch salad.",
  "The sandbars of Exuma shift and change with the tides, creating new landscapes daily.",
  "Exuma's coral reefs are part of the third-largest barrier reef system in the world.",
  "David Copperfield owns several islands in the Exumas, including Musha Cay.",
  "The annual National Family Island Regatta in George Town is the Bahamas' biggest sailing event.",
  "Exuma salt was once a major export, with salt raking ponds still visible on Little Exuma."
];

export default function FunFactCard() {
  const [factIndex, setFactIndex] = useState(() => {
    // Calculate initial index based on 4-hour blocks
    const hours = new Date().getHours();
    const block = Math.floor(hours / 4);
    const day = new Date().getDate();
    return (day + block) % exumaFacts.length;
  });

  useEffect(() => {
    // Check every minute if we need to change the fact
    const checkFactChange = () => {
      const hours = new Date().getHours();
      const block = Math.floor(hours / 4);
      const day = new Date().getDate();
      const newIndex = (day + block) % exumaFacts.length;
      setFactIndex(newIndex);
    };

    const interval = setInterval(checkFactChange, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-white/10 to-cyan-500/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 hover:border-amber-300/30 transition-all duration-500">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-300" />
        <h3 className="text-sky-200/80 uppercase tracking-widest text-xs font-medium">
          Island Discovery
        </h3>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={factIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-white/90 text-lg md:text-xl font-light leading-relaxed"
        >
          "{exumaFacts[factIndex]}"
        </motion.p>
      </AnimatePresence>

      <p className="text-sky-200/40 text-xs mt-4 text-right">
        Updates every 4 hours
      </p>
    </div>
  );
}