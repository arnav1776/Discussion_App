var submitQuestion = document.getElementById("submitBtm")

// submit button

submitQuestion.addEventListener("click", onQuestionSubmit)

function onQuestionSubmit()
{
  addQuestinToPanel();
}

// save to storage

questions = [ { title: "", description: ""}]

function saveQuestion()
{
    localStorage.setItem("todos", JSON.stringify());
}

// append question to left pane

function addQuestinToPanel()
{

}
// display question on right pane
// submit response button
// display response