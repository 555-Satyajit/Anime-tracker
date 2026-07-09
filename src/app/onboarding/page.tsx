"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "./actions";
import { Sword, Wand2, Compass, RefreshCw, ArrowRight, Loader2 } from "lucide-react";

type Vibe = "Fighter" | "Mystic" | "Wanderer" | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedVibe, setSelectedVibe] = useState<Vibe>(null);
  
  const [generatedName, setGeneratedName] = useState("");
  const [generatedAvatar, setGeneratedAvatar] = useState("");
  const [rerolls, setRerolls] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const adjectives = {
    Fighter: ["Crimson", "Iron", "Fallen", "Savage", "Blazing", "Storm", "Blood", "Steel", "Thunder", "Dark"],
    Mystic: ["Lunar", "Divine", "Mystic", "Astral", "Crystal", "Star", "Silent", "Celestial", "Aura", "Dream"],
    Wanderer: ["Wandering", "Lost", "Phantom", "Shadow", "Rogue", "Hidden", "Echo", "Dusk", "Void", "Ashen"]
  };

  const nouns = {
    Fighter: ["Ronin", "Samurai", "Titan", "Slayer", "Monarch", "Brawler", "Knight", "Warrior", "Berserker", "Dragon"],
    Mystic: ["Valkyrie", "Miko", "Esper", "Alchemist", "Mage", "Witch", "Goddess", "Oracle", "Fairy", "Spirit"],
    Wanderer: ["Shinobi", "Ghoul", "Hollow", "Pirate", "Hunter", "Reaper", "Otaku", "Nomad", "Phantom", "Drifter"]
  };

  const avatarStyles = {
    Fighter: "pixel-art", // Retro JRPG vibes
    Mystic: "lorelei", // Cute chibi anime style
    Wanderer: "micah" // Very clean, premium stylized characters
  };

  const generateIdentity = (vibe: Vibe) => {
    if (!vibe) return;
    
    const adjList = adjectives[vibe];
    const nounList = nouns[vibe];
    
    const getSecureRandomInt = (max: number) => {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    };
    
    const adj = adjList[getSecureRandomInt(adjList.length)];
    const noun = nounList[getSecureRandomInt(nounList.length)];
    const suffix = getSecureRandomInt(99) + 1;
    
    const newName = `${adj}${noun}${suffix}`;
    
    // Pick a random avatar from the 380 local SVGs
    const randomAvatarNum = getSecureRandomInt(380) + 1;
    const newAvatar = `/Avatars/${randomAvatarNum}.svg`;
    
    setGeneratedName(newName);
    setGeneratedAvatar(newAvatar);
  };

  const handleSelectVibe = (vibe: Vibe) => {
    setSelectedVibe(vibe);
    setRerolls(5);
    generateIdentity(vibe);
  };

  const handleReroll = () => {
    if (rerolls > 0) {
      setRerolls(prev => prev - 1);
      generateIdentity(selectedVibe);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const result = await completeOnboarding(generatedName, generatedAvatar);
    if (result.success) {
      router.push("/Tracker");
    } else {
      console.error(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-white relative overflow-hidden">
      
      {/* Cool background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e71014]/10 via-background to-purple-900/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#e71014]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Who are you?</h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Before you enter Senkai, choose your Anime Archetype to generate your unique identity.
          </p>
        </div>

        {!selectedVibe ? (
          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-4xl mx-auto">
            {/* Fighter */}
            <button 
              onClick={() => handleSelectVibe("Fighter")}
              className="group flex flex-col items-center p-3 md:p-8 bg-black/40 border border-white/10 rounded-xl md:rounded-2xl hover:bg-white/5 hover:border-[#e71014]/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#e71014]/0 to-[#e71014]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 md:w-20 md:h-20 bg-[#e71014]/20 rounded-full flex items-center justify-center mb-3 md:mb-6 text-[#e71014] group-hover:scale-110 transition-transform shrink-0">
                <Sword className="w-6 h-6 md:w-10 md:h-10" />
              </div>
              <h2 className="text-sm md:text-2xl font-bold mb-1 md:mb-2 text-center leading-tight">Fighter</h2>
              <p className="text-xs text-muted-foreground text-center hidden md:block">Intense, Shonen vibes. Think Saiyans, Ronins, and Slayers.</p>
            </button>

            {/* Mystic */}
            <button 
              onClick={() => handleSelectVibe("Mystic")}
              className="group flex flex-col items-center p-3 md:p-8 bg-black/40 border border-white/10 rounded-xl md:rounded-2xl hover:bg-white/5 hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/0 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 md:w-20 md:h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-3 md:mb-6 text-purple-400 group-hover:scale-110 transition-transform shrink-0">
                <Wand2 className="w-6 h-6 md:w-10 md:h-10" />
              </div>
              <h2 className="text-sm md:text-2xl font-bold mb-1 md:mb-2 text-center leading-tight">Mystic</h2>
              <p className="text-xs text-muted-foreground text-center hidden md:block">Elegant, Magical vibes. Think Valkyries, Mages, and Espers.</p>
            </button>

            {/* Wanderer */}
            <button 
              onClick={() => handleSelectVibe("Wanderer")}
              className="group flex flex-col items-center p-3 md:p-8 bg-black/40 border border-white/10 rounded-xl md:rounded-2xl hover:bg-white/5 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 md:w-20 md:h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-3 md:mb-6 text-blue-400 group-hover:scale-110 transition-transform shrink-0">
                <Compass className="w-6 h-6 md:w-10 md:h-10" />
              </div>
              <h2 className="text-sm md:text-2xl font-bold mb-1 md:mb-2 text-center leading-tight">Wanderer</h2>
              <p className="text-xs text-muted-foreground text-center hidden md:block">Mysterious, Rogue vibes. Think Shinobi, Ghouls, and Phantoms.</p>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center bg-black/40 border border-white/10 rounded-3xl p-8 md:p-12 max-w-2xl mx-auto backdrop-blur-xl">
            <h2 className="text-xl text-muted-foreground font-medium mb-8">Your new identity is...</h2>
            
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-background overflow-hidden bg-muted shadow-2xl mb-6 relative group">
              <img src={generatedAvatar} alt={`${generatedName}'s Avatar Preview`} className="w-full h-full object-cover" />
            </div>
            
            <div className="text-3xl md:text-5xl font-black mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              {generatedName}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleReroll}
                disabled={rerolls === 0 || isSubmitting}
                className="w-full sm:w-auto bg-transparent border-white/20 hover:bg-white/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${rerolls > 0 ? "" : "opacity-50"}`} />
                Re-roll ({rerolls} left)
              </Button>
              
              <Button 
                size="lg" 
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#e71014] text-white hover:bg-[#e71014]/90 min-w-[200px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Entering Senkai...
                  </>
                ) : (
                  <>
                    Enter Senkai <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
            
            <button 
              onClick={() => setSelectedVibe(null)} 
              className="mt-8 text-sm text-muted-foreground hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              Choose a different Vibe
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
