var submitQuestionNode = document.getElementById("submitBtn");
var questionTitleNode = document.getElementById("subject");
var questionDescriptionNode = document.getElementById("question");
var allQuestionsListNode = document.getElementById("dataList");
var createQuestionFormNode = document.getElementById("toggleDisplay");
var questionDetailContainerNode = document.getElementById("respondQue");
var resolveQuestionContainerNode = document.getElementById("resolveHolder");
var resolveQuestionNode = document.getElementById("resolveQuestion");
var responseContainerNode = document.getElementById("respondAns");
var commentContainerNode = document.getElementById("commentHolder");
var commentatorNameNode = document.getElementById("pickName");
var commentNode = document.getElementById("pickComment");
var submitCommentNode = document.getElementById("commentBtn");


// display all existing questions

function onLoad()
{
  // get all questions from storage
  var allQuestions = getAllQuestions();

  allQuestions.forEach(function(question) 
  {
    addQuestionToPanel(question)
  });
}

onLoad();

// submit button

submitQuestionNode.addEventListener("click", onQuestionSubmit);

function onQuestionSubmit()
{
  var question = {
    title: questionTitleNode.value,
    description: questionDescriptionNode.value,
    responses: []
  }
  saveQuestion(question);
  addQuestionToPanel(question);
}

// save to storage

function saveQuestion(question)
{
  // get all questions
  var allQuestions = getAllQuestions();

  allQuestions.push(question);

  localStorage.setItem("questions", JSON.stringify(allQuestions));
}

// get all questions from storage
function getAllQuestions()
{
  var allQuestions = localStorage.getItem("questions");

  if(allQuestions)
  {
    allQuestions = JSON.parse(allQuestions)
  }
  else
  {
    allQuestions = []
  }

  return allQuestions;

}

// append question to left pane

function addQuestionToPanel(question)
{
  var questionContainer = document.createElement("div");
  questionContainer.style.background = "grey";

  var newQuestionTitleNode = document.createElement("h4");
  newQuestionTitleNode.innerHTML = question.title;
  questionContainer.appendChild(newQuestionTitleNode);

  var newQuestionDescriptionNode = document.createElement("p");
  newQuestionDescriptionNode.innerHTML = question.description;
  questionContainer.appendChild(newQuestionDescriptionNode);

  allQuestionsListNode.appendChild(questionContainer);

  questionContainer.addEventListener("click", onQuestionClick(question) );

}

// clear question

function clearQuestionForm(){
  allQuestionsListNode.innerHTML = ""
}

// click on question and display question on right pane

function onQuestionClick(question)
{
  return function()
  {
    // clouser access question variable
    // hide question panel
    hideQuestionPanel();

    // show clicked question
    showDetails();

    // create question details
    addQuestionToRight(question);

    // listen for response submit

    submitCommentNode.addEventListener("click", onResponseSubmit(question))
  }
}

// submit response button

function onResponseSubmit(question)
{
  return function()
  {
    saveResponse(question);
  }
}

// display response

function addResponseInPanel()
{

}

// hide question panel

function hideQuestionPanel()
{
  createQuestionFormNode.style.display = "none";
}

// display question details
function showDetails()
{
  questionDetailContainerNode.style.display = "block";
  resolveQuestionContainerNode.style.display = "block";
  responseContainerNode.style.display = "block";
  commentContainerNode.style.display = "block";

}

// show question
function addQuestionToRight(question)
{
  var titleNode = document.createElement("h3");
  titleNode.innerHTML = question.title;

  var descriptionNode = document.createElement("p");
  descriptionNode.innerHTML = question.description;

  questionDetailContainerNode.appendChild(titleNode);
  questionDetailContainerNode.appendChild(descriptionNode);
}

//

function saveResponse(updatedQuestion)
{
  var allQuestions = getAllQuestions();
  var revisedQuestions = allQuestions.map(function(question)
  {
    if( updatedQuestion.title === question.title)
    {
      question.responses.push({
        name:  commentatorNameNode.value,
        description: commentNode.value
      })
    }
    return question;
  })
  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}