var submitQuestionNode = document.getElementById("submitBtn");
var questionTitleNode = document.getElementById("subject");
var questionDescriptionNode = document.getElementById("question");
var allQuestionsListNode = document.getElementById("dataList");


// submit button

submitQuestionNode.addEventListener("click", onQuestionSubmit);

function onQuestionSubmit()
{
  var question = {
    title: questionTitleNode.value,
    description: questionDescriptionNode.value,
  }
  saveQuestion(question);
  addQuestinToPanel(question);
}

// save to storage

function saveQuestion(question)
{
  // get all questions
  let allQuestions = localStorage.getItem("questions");

  if(allQuestions)
  {
    allQuestions = JSON.parse(allQuestions);
  }
  else
  {
    allQuestions = [];
  }

  allQuestions.push(question)

  localStorage.setItem("questions", JSON.stringify(allQuestions));
}

// append question to left pane

function addQuestinToPanel(question)
{
  var questionContainer = document.createElement("div");

  var newQuestionTitleNode = document.createElement("h4");
  newQuestionTitleNode.innerHTML = question.title;
  questionContainer.appendChild(newQuestionTitleNode);

  var newQuestionDescriptionNode = document.createElement("p");
  newQuestionDescriptionNode.innerHTML - question.description;
  questionContainer.appendChild(newQuestionDescriptionNode);

  allQuestionsListNode.appendChild(questionContainer);

  
}

// display question on right pane

function onQuestionClick()
{

}

// submit response button

function onResponseSubmit()
{

}

// display response

function addResponseInPanel()
{

}