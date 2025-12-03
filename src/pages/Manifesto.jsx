import React, { useEffect } from 'react';
import Section from '../components/ui/Section';
import Container from '../components/ui/Container';
import BlurReveal from '../components/ui/BlurReveal';
import { getAssetPath } from '../utils/assets';

const Manifesto = () => {
  useEffect(() => {
    document.title = "The Next Hollywood is Unscripted: Our Manifesto • Awaiten";
    return () => {
      document.title = "Awaiten • Creative Production Studio";
    };
  }, []);

  return (
    <main className="min-h-screen bg-background text-primary overflow-x-hidden font-sans pt-32 pb-20">
      <Container className="max-w-3xl mx-auto px-6">
        <div className="space-y-12 text-lg md:text-xl leading-relaxed font-light text-gray-300">
          
          {/* Header */}
          <div className="space-y-6 mb-16">
            <BlurReveal 
              text="The next Hollywood is unscripted." 
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight"
              delay={0.2}
            />
            <p>
              In a world where every skill can be mastered by anyone, and the value of all skills goes to zero, those who stand out will be the best storytellers.
            </p>
            <p>
              Not stories that have been scripted, rather authentic stories—ones that are lived, captured, and shared with the world.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-6">
            <p>
              One could call these stories documentaries, video blogs (vlogs), or short films.
            </p>
            <p>
              But on their own, there’s nothing special about those.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-6">
            <p>
              Traditional documentaries are quite boring, to be honest.
            </p>
            <p>
              Accompanied by a robotic voiceover, you sit down to listen to hours of self-claimed experts lecturing about a certain topic, with miscellaneous b-roll overlaid throughout.
            </p>
            <p>
              They story-tell, and rarely story-show.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-6">
            <p>
              The word “vlog” also has its own negative connotation to it.
            </p>
            <p>
              You imagine someone holding a camera flipped around to show their face, yelling “what’s up” through muffled audio and 360p video quality.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-6">
            <p>
              And short films? They’re always created in a very specific style.
            </p>
            <p>
              There’s always that shot of an alarm clock, the ridiculously overdone two-tone lighting, and of course; the all mighty black bars.
            </p>
          </div>

          {/* Middle Reveal */}
          <div className="py-8">
            <BlurReveal 
              text="I believe the intersection of these three is where magic is born." 
              className="text-2xl md:text-3xl font-semibold text-white leading-snug"
              delay={2.5}
            />
          </div>

          {/* Historical Context */}
          <div className="space-y-8">
            <p>
              The French called it <span className="italic font-serif text-white">“cinéma vérité”</span>—a style of filmmaking that used simple equipment to capture real, unedited stories. This raw approach changed documentaries by pushing journalists to dig deeper, leading to real changes in society and documentary filmmaking <a href="https://www.britannica.com/art/cinema-verite" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-white transition-colors underline decoration-gray-700 underline-offset-2">(1)</a>.
            </p>
            
            <p>
              The Italians referred to it as <span className="italic font-serif text-white">“neorealism”</span>—a film movement about everyday people and their daily lives. By showing the tough realities of post-war life, neorealism got people talking about social issues and even influenced policy changes <a href="https://www.movementsinfilm.com/italian-neorealism" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-white transition-colors underline decoration-gray-700 underline-offset-2">(2)</a>.
            </p>

            <p>
              And the Americans even had their own term—<span className="italic font-serif text-white">“direct cinema”</span>. Starting in the late 1950s, it’s focus was “capturing reality without interference” <a href="https://www.moma.org/collection/terms/direct-cinema" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-white transition-colors underline decoration-gray-700 underline-offset-2">(3)</a>. This meant little editing, no scripts, and no forced interviews. Direct cinema’s honest look at events shaped modern reporting and sparked changes globally.
            </p>
          </div>

          <div className="h-px w-24 bg-gray-800 mx-auto my-12" />

          {/* Conclusion */}
          <div className="space-y-8 text-center md:text-left">
            <p className="font-medium text-white text-2xl md:text-3xl leading-snug">
              Unscripted storytelling has already impacted the world in countless ways, and it's not disappearing any time soon.
            </p>

            <div className="space-y-6">
              <p>
                Everyone has a story, but not everyone has the means to share their story with the world.
              </p>
              
              <p>
                Our goal with <span className="font-bold text-white">Awaiten</span> is to provide the resources needed, from beginning to end, for anyone - no matter their skill, age, or experience - to share their stories with the world.
              </p>
            </div>

            {/* Author Profile */}
            <div className="flex items-center justify-center gap-4 pt-12 pb-8">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800">
                <img 
                  src={getAssetPath("/images/mhadi.jpg")}
                  alt="M Hadi" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg">M Hadi</div>
                <div className="text-gray-500 text-xs tracking-widest uppercase font-medium">CEO & Co-Founder</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default Manifesto;
