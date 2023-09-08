import React from "react"
import he from "he"
 
 
 export default function Quiz({option, startAgain}) { 
    const [questions, setQuestions] = React.useState([])
    const[selectedAnswers, setSelectedAnswers] = React.useState({})
    const[correctAnswers, setCorrectAnswers] = React.useState([])
    const[showResults, setShowResults] = React.useState(false)
    const[reset, setReset] = React.useState(false)
    const[isLoading, setIsLoading] = React.useState(false)
    const difficulty=option.difficulty
    const type=option.type
    React.useEffect(() => {
        setIsLoading(true)
         fetch(`https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=${type}`)
         .then(res => res.json())
          .then((data) => {
          setQuestions(
            data.results.map((question) => {
              return {
                question: question.question,
                answers: question.incorrect_answers
                  .concat([question.correct_answer])
                  .sort(() => Math.random() - 0.5)
                  .map((value) => value),
                correct_answer: question.correct_answer,
              }
            })
          )
          setIsLoading(false)
        })
        .catch((err) => {
          throw new Error(`There was an error when fetching questions: ${err}`)
          setIsLoading(false)
        })
     }, [reset])
    function handleAnswers(index, answer) {
        setSelectedAnswers((prevSelectedAnswer) =>
        (   
            
            {
            ...prevSelectedAnswer,
            [index]: answer,
        })
            
        )
        
   if(answer === questions[index].correct_answer){
        setCorrectAnswers(prevCorrectAnswer => [...prevCorrectAnswer, index])
    } 
    }
     
    function handleShowResults(){
        setShowResults(true)
        
    }
       
     function handleReset(){
         setReset(true)
         setShowResults(false)
         setSelectedAnswers({})
         setCorrectAnswers([])
     }

    return (
       <div className="quiz-div">
       {isLoading ? 
      ( <div className="loader"></div> ) :
       (
           <div>
       {questions.map((question, index) =>
        (
            <div key={index}>
            <p>{he.decode(question.question)}</p>
            {question.answers.map((answer) => {
                const isSelected = selectedAnswers[index] === answer
                const isCorrect = question.correct_answer === answer
                let className = ''
                if(showResults) {
                    if(isSelected){
                    className = isSelected ? (isCorrect ? 'correct' : 'incorrect') : ''
                }
                else if(isCorrect){
                    className = 'correct'    
                    }
                    else{
                        className="others"
                }}
                else {
                    className = isSelected ? 'selected' : ''
                }
                return (
                <button 
                key={answer}
                className={className}
                onClick = {() => handleAnswers(index, answer)} >
                  {he.decode(answer)}
                </button>
             ) })}
             <hr/>
            </div>
               
        )
            
        )}
        <div className="answer-div">
       {showResults && <p className="marks-paragraph">Marks: {correctAnswers.length}/5</p>}
       {!showResults && <button className="checkanswers-button" onClick={handleShowResults}>Check Answers</button> }
        {showResults && <button className="checkanswers-button" onClick={startAgain}>Start Again</button>}
        </div>
       </div>
        ) }
       
        </div>
    )
 }