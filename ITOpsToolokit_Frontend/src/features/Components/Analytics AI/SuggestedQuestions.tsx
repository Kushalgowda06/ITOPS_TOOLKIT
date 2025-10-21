// SuggestedQuestions.tsx
interface SuggestedQuestionsProps {
    onSelect: (question: string) => void;
  }
  
  const SuggestedQuestions = ({ onSelect }: SuggestedQuestionsProps) => {
    const suggestions = [
      "How can I reduce cloud costs?",
      "Show me underutilized resources?",
    ];
  
    return (
      <div className="px-4  bg_color ">
        <p className="text-white fw-semibold f-size mb-2">Suggested questions:</p>
        <div className="d-flex flex-wrap gap-2"> 

        {suggestions.map((question, idx) => (
          <p
            key={idx}
            className="text-white f-size text-decoration-underline mb-1"
            role="button"
            onClick={() => onSelect(question)}
          >
            {question}
          </p>
        ))}
      </div>
      </div>
    );
  };
  
  export default SuggestedQuestions;
  