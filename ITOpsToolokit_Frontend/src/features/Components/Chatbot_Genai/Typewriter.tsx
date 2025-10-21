import useTypewriter from "../../../customhooks/useTypewriter";

const Typewriter = ({ text, speed }) => {
    const displayText = useTypewriter(text, speed);
  
    return <p>{displayText}</p>;
  };
  
  export default Typewriter;