import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
const src = "https://www.youtube.com/embed/dQw4w9WgXcQ";

const VideoPlayer = () => {
  return (
    <div>
      <ReactPlayer controls={true} playing={false} width={"100%"} height={"500px"} url={src} />
        <Accordion disableGutters={true} sx={{marginTop:"20px"}}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Transcript
          </AccordionSummary>
          <AccordionDetails>
            [Intro] <br />
            Desert you <br />
            Ooh-ooh-ooh-ooh <br />
            Hurt you
            <br />
            <br />
            [Verse 1] <br />
            We're no strangers to love <br />
            You know the rules and so do I (Do I) <br />
            A full commitment's what I'm thinking of <br />
            You wouldn't get this from any other guy
            <br />
            <br />
            [Pre-Chorus] <br />
            I just wanna tell you how I'm feeling <br />
            Gotta make you understand
            <br />
            <br />
            [Chorus] <br />
            Never gonna give you up <br />
            Never gonna let you down <br />
            Never gonna run around and desert you <br />
            Never gonna make you cry <br />
            Never gonna say goodbye <br />
            Never gonna tell a lie and hurt you
            <br />
            <br />
            [Verse 2] <br />
            We've known each other for so long <br />
            Your heart's been aching, but you're too shy to say it (To say it){" "}
            <br />
            Inside, we both know what's been going on (Going on) <br />
            We know the game, and we're gonna play it
            <br />
            <br />
            [Pre-Chorus] <br />
            And if you ask me how I'm feeling <br />
            Don't tell me you're too blind to see
            <br />
            <br />
            [Chorus] <br />
            Never gonna give you up <br />
            Never gonna let you down <br />
            Never gonna run around and desert you <br />
            Never gonna make you cry <br />
            Never gonna say goodbye <br />
            Never gonna tell a lie and hurt you <br />
            Never gonna give you up <br />
            Never gonna let you down <br />
            Never gonna run around and desert you <br />
            Never gonna make you cry <br />
            Never gonna say goodbye <br />
            Never gonna tell a lie and hurt you
            <br />
            <br />
            [Post-Chorus] <br />
            Ooh (Give you up) <br />
            Ooh-ooh (Give you up) <br />
            Ooh-ooh <br />
            Never gonna give, never gonna give (Give you up) <br />
            Ooh-ooh <br />
            Never gonna give, never gonna give (Give you up) <br />
            [Bridge]
            <br />
            We've known each other for so long
            <br />
            Your heart's been aching, but you're too shy to say it (To say it)
            <br />
            Inside, we both know what's been going on (Going on)
            <br />
            We know the game, and we're gonna play it
            <br />
            <br />
            [Pre-Chorus]
            <br />
            I just wanna tell you how I'm feeling
            <br />
            Gotta make you understand
            <br />
            <br />
            [Chorus]
            <br />
            Never gonna give you up
            <br />
            Never gonna let you down
            <br />
            Never gonna run around and desert you
            <br />
            Never gonna make you cry
            <br />
            Never gonna say goodbye
            <br />
            Never gonna tell a lie and hurt you
            <br />
            Never gonna give you up
            <br />
            Never gonna let you down
            <br />
            Never gonna run around and desert you
            <br />
            Never gonna make you cry
            <br />
            Never gonna say goodbye
            <br />
            Never gonna tell a lie and hurt you
            <br />
            Never gonna give you up
            <br />
            Never gonna let you down
            <br />
            Never gonna run around and desert you
            <br />
            Never gonna make you cry
            <br />
            Never gonna say goodbye
            <br />
            Never gonna tell a lie and hurt you
            <br />
          </AccordionDetails>
        </Accordion>
    </div>
  );
};

export default VideoPlayer;
