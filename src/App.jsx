import { languages } from "./languages"
import { useState } from "react"
import clsx from "clsx";
import { getFarewellText, getRandomWord } from "./utils";
import ReactConfetti from "react-confetti";

export default function App(){

  //State values
  const [ currentWord , setCurrentWord ] = useState(() => getRandomWord());

  const [ guessLetters , setGuessLetters ] = useState([]); 

  //Derived values
  const wrongGuessCount = 
              guessLetters.filter(letter => 
                !currentWord.includes(letter)).length

  const isGameWon = currentWord.split("")
                      .every(letter => guessLetters.includes(letter))

  const isGameLost = wrongGuessCount >= languages.length -1

  const isGameOver = isGameLost || isGameWon

    const lastGuessedLetter = guessLetters[guessLetters.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)



  function addGuessedLetter(letter){
       setGuessLetters(prevLetters =>
           prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
       )
  }

  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  function startNewGame(){
    setCurrentWord(getRandomWord())
    setGuessLetters([])
  }

  const languageElement = languages.map((lang,index) => {
    const isLanguageLost = index < wrongGuessCount
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    return (
      <span 
             key={lang.name}
            className={`chip ${isLanguageLost ? "lost" : ""}`}
            style={styles}
            >
              {lang.name}
      </span>
    )
  })

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessLetters.includes(letter)
    const letterClassName = clsx(isGameLost && !guessLetters.includes(letter) && "missed-letters")
    return (
    <span key={index} className={letterClassName}>
         {shouldRevealLetter ?  letter.toUpperCase() : ""}
    </span>
  )})

  //button

   const keyboardElements = alphabet.split("").map(letter => {
       
        const isGuessed = guessLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })
    
    return (
          <button
                   className={className}
                   key={letter}
                   disabled={isGameOver}
                   onClick={() => addGuessedLetter(letter)}
              >
                {letter.toUpperCase()}
          </button>
        )       
})

    const gameStatusClass = clsx("game-status",{
      won: isGameWon,
      lost: isGameLost,
      farewell: !isGameOver && isLastGuessIncorrect
    })

  function renderGameStatus() {
               if (!isGameOver && isLastGuessIncorrect) {
            return (
                <p className="farewell-message">
                    {getFarewellText(languages[wrongGuessCount - 1].name)}
                </p>
            )
        }

        if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            )
        } 
        if (isGameLost) {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }
        
        return null

    }
  
  return(
    <main>
      <div>{isGameWon && <ReactConfetti 
                                   recycle={false}
                                   numberOfPieces={2000}
                                   />}</div>
      <div className="upperPart">
         <header>
      <h1>Assembly: Endgame</h1>
      <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
    </header>

    <section className={gameStatusClass}>
       {renderGameStatus()}
    </section>

    <section className="language-chips">
      {languageElement}
    </section>

    <section className="word">
      {letterElements}
    </section>
      </div>
     
    <section className="alphabet-btn">
      {keyboardElements}
    </section>
     {isGameOver &&  <button 
                          className="new-game"
                          onClick={startNewGame} 
                         >New Game
                     </button> }
    </main>
    
  )
}