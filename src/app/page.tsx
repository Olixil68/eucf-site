import Image from "next/image";
import { Button } from "@/components/ui/button"
import Chatbot from "./chatbot"

export default function Home() {
  return (
    
    <div className="bg-[#000000] font-[family-name:var(--font-jetbrains-mono)]">
      <div className="flex w-full h-[160px] items-center justify-between bg-gradient-to-r from-[#ffffff] to-[#B49758] px-5 py-1">
        <Image
          src = "/1._Primary_Shield.png"
          alt = "EUCF Logo Top Bar"
          width={110}
          height={120}
        />
        <div className="w-[500px] h-full px-5 py-7 text-center font-bold text-[#ffffff] text-[50px]">
          Esports at UCF
        </div>
        <Image
          src = "/1._Primary_Shield.png"
          alt = "EUCF Logo Top Bar"
          width={110}
          height={120}
        />
      </div>
      <div className="flex w-full h-[50px] bg-[#B49758] items-center justify-center sticky top-0 z-10 px-1 py-1 gap-x-3">
          <Button variant="link" asChild>
            <a href="#about-us">About Us</a>
          </Button>
          <Button variant="link" asChild>
            <a href="#teams">Teams</a>
          </Button>
          <Button variant="link" asChild>
            <a href="#staff">Staff/Officers</a>
          </Button>
          <Button variant="link" asChild>
            <a href="#dungeon">The Dungeon</a>
          </Button>
          <Button variant="link" asChild>
            <a href="#contact">Contact Info</a>
          </Button>
      </div>
        <main className="space-y-32 p-8 pl-20 pr-20">
        <section id="about-us" className="h-screen scroll-mt-[50px] pt-4">
          <h2 className="text-6xl font-bold text-[#ffffff]">About Us</h2>
          <br></br>
          <h3 className="text-3xl font-bold text-[#ffffff]">Esports at UCF (EUCF) is a club at the University of Central Florida that is dedicated to UCF students that are interested in casual and competitive gaming. Founded in May 2020, EUCF has competitive teams that play in tournaments versus different schools and also we have events on campus for anyone to enjoy!
            <Image
              src="/eucf-about-us.png"
              alt="EUCF About Us"
              width={1105}
              height={369}
            />
          </h3>
        </section>

        <section id="teams" className="h-screen scroll-mt-[50px] pt-4">
          <h2 className="text-6xl font-bold text-[#ffffff]">Teams</h2>
          <br></br>
          <h3 className="text-3xl font-bold text-[#ffffff]">Esports at UCF has teams for Valorant, League of Legends, Rocket League, Call of Duty Apex Legends, Overwatch, Splatoon, Rainbow 6, Counter Strike, Super Smash Smash Bros Ultimate, Marvel Rivals with tryouts happening every semester!
          <Image
            src="/eucf-teams.png"
            alt="EUCF Teams"
            width={490}
            height={622}
          />

          </h3>
        </section>

        <section id="staff" className="h-screen scroll-mt-[50px] pt-4">
          <h2 className="text-6xl font-bold text-[#ffffff]">Staff/Officers</h2>
          <br></br>
          <h3 className="text-3xl font-bold text-[#ffffff]">Not only do we have Officers and Junior officers we also have many other teams that make EUCF possible!</h3> 
          <ul className="text-3xl font-bold text-[#ffffff]">
            <li>
              <h3>&#8226; Managerial Staff: Every team has a manager that makes sure the team is registered and ready to play the matches they have.</h3>
            </li>
            <li>
              <h3>&#8226; Marketing staff: The marketing team helps promote the club as much as they can, they help design the jerseys, shirts, and just any other form of merchandise.</h3>
            </li>
            <li>
              <h3>&#8226; Event staff: The event staff helps run the many event that EUCF has like watch parties, general body meetings, and many more.</h3>
            </li>
            <li>
              <h3>&#8226; Content staff: The content staff helps run the streams for our game days and also help make videos and content for the EUCF social media accounts.</h3>
            </li>
            <Image
              src="/eucf-staff.jpeg"
              alt="EUCF Staff"
              width={600}
              height={400}
            />
          </ul>

        </section>
        <section id="dungeon" className="h-screen scroll-mt-[50px] pt-4">
          <h2 className="text-6xl font-bold text-[#ffffff]">The Dungeon
          </h2>
          <br></br>
          <h3 className="flext text-3xl items-center justify-right font-bold text-[#ffffff] pt-2">The dungeon is located on the third floor of the student union and is open to all members of EUCF anytime and it is where most EUCF events are held. It has high quality gaming PCs, headphones, and other equipment for the players to use for practice or on game days.
          <Image
              src = "/the-dungeon.jpg"
              alt = "The Dungeon"
              width={1000}
              height={462}
            />
          </h3>
          
        </section>

        <section id="contact" className="h-screen scroll-mt-[50px] pt-4">
          <h2 className="text-6xl font-bold text-[#ffffff]">Contact Info</h2>
          <a 
            className="font-bold text-3xl text-[#ffffff]"
            href="https://x.com/EsportsatUCF"
            target="_blank"
            rel="noopenner noreferrer"
          >
            <h3>EUCF X</h3>
          </a>
          <a 
            className="font-bold text-3xl text-[#ffffff]"
            href="https://www.instagram.com/esportsatucf/"
            target="_blank"
            rel="noopenner noreferrer"
          >
            <h3>EUCF Instagram</h3>
          </a>
          <a 
            className="font-bold text-3xl text-[#ffffff]"
            href="https://www.linkedin.com/company/esportsatucf/"
            target="_blank"
            rel="noopenner noreferrer"
          >
            <h3>EUCF LinkedIn</h3>
          </a>

          <Image
            src="/logocombo.png"
            alt="EUCF Socials Logos"
            width={528}
            height={615}
          />

        </section>
      </main>
      <Chatbot />
    </div>

  );
};
