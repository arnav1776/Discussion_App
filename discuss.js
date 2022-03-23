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
var questionSearchNode = document.getElementById("questionSearch");
var upvote = document.getElementById("upvote");
var downvote = document.getElementById("downvote");

// listen to value change

questionSearchNode.addEventListener("change", function(event)
{
  // show filtered result
  filterResult(event.target.value);
})

// filter result
function filterResult(query)
{

  var allQuestions = getAllQuestions();
  if(query)
  {
    clearQuestionPanel();

    var filteredQuestions = allQuestions.filter(function(question)
    {
      if(question.title.includes(query))
      {
        return true;
      }
    });
    if(filteredQuestions.length)
    {
      filteredQuestions.forEach(function(question)
      {
        addQuestionToPanel(question);
      })
    }
    else{
      printNoMatchFound();
    }
  }
else
{
  clearQuestionPanel();
  allQuestions.forEach(function(question)
  {
    addQuestionToPanel(question);
  });
}

}

function clearQuestionPanel(){
  allQuestionsListNode.innerHTML = ""
}


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
    responses: [],
    upvotes: 0,
    downvotes: 0

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
  questionContainer.setAttribute("id", question.title);  
  questionContainer.style.background = "grey";

  var newQuestionTitleNode = document.createElement("h4");
  newQuestionTitleNode.innerHTML = question.title;
  questionContainer.appendChild(newQuestionTitleNode);

  var newQuestionDescriptionNode = document.createElement("p");
  newQuestionDescriptionNode.innerHTML = question.description;
  questionContainer.appendChild(newQuestionDescriptionNode);

  allQuestionsListNode.appendChild(questionContainer);


  var upvoteTextNode = document.createElement("h4");
  upvoteTextNode.innerHTML = "upvote ="+ question.upvotes;
  questionContainer.appendChild(upvoteTextNode);

  var downvoteTextNode = document.createElement("h4");
  downvoteTextNode.innerHTML = "downvote ="+ question.downvotes;
  questionContainer.appendChild(downvoteTextNode);

  questionContainer.addEventListener("click", onQuestionClick(question) );
  
  questionDescriptionNode.value="";
  questionTitleNode.value="";
}

// // clear question

// function clearQuestionForm(){
//   allQuestionsListNode.innerHTML = ""
// }

// click on question and display question on right pane

function onQuestionClick(question)
{
  return function()
  {
    // clouser access question variable
    // hide question panel
    hideQuestionPanel();
    // clear last details
    clearQuestionDetails();
    clearResponsePanel();

    // show clicked question
    showDetails();

    // create question details
    addQuestionToRight(question);

    // show all previous responses
    question.responses.forEach(function(response){
      addResponseInPanel(response)
    })

    // listen for response submit

    submitCommentNode.addEventListener("click", onResponseSubmit(question), { once: true});

    upvote.onclick = upvoteQuestion(question);
    downvote.onclick = downvoteQuestion(question);

  }
}

// upvotes
function upvoteQuestion(question)
{
  return function()
  {
    question.upvotes++;
    updateQuestion(question);
    updateQuestionUI(question);
  }
}

// downvotes
function downvoteQuestion(question)
{
  return function()
  {
  question.downvotes++;
  updateQuestion(question);
  updateQuestionUI(question);

  }
}

// update question UI

function updateQuestionUI(question)
{
  var questionContainerNode = document.getElementById(question.title);

  questionContainerNode.childNodes[2].innerHTML = "upvote = "+question.upvotes;
  questionContainerNode.childNodes[3].innerHTML = "downvote = "+question.downvotes;

}

// submit response button

function onResponseSubmit(question)
{
  return function()
  {
    var response = {
      name:  commentatorNameNode.value,
      description: commentNode.value
    }
    saveResponse(question, response);
    addResponseInPanel(response);
  }
}

// display response

function addResponseInPanel(response)
{
  var userNameNode = document.createElement("h4");
  userNameNode.innerHTML = response.name;

  var userCommentNode = document.createElement("p");
  userCommentNode.innerHTML = response.description;

  var container = document.createElement("div");
  container.appendChild(userNameNode);
  container.appendChild(userCommentNode);

  responseContainerNode.appendChild(container);

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

// update question
function updateQuestion(updatedQuestion)
{
  var allQuestions = getAllQuestions();
  var revisedQuestions = allQuestions.map(function(question)
  {
    if( updatedQuestion.title === question.title)
    {
      return updatedQuestion;
    }
    return question;
  })
  localStorage.setItem("questions", JSON.stringify(revisedQuestions));

}

//

function saveResponse(updatedQuestion, response)
{
  var allQuestions = getAllQuestions();
  var revisedQuestions = allQuestions.map(function(question)
  {
    if( updatedQuestion.title === question.title)
    {
      question.responses.push(response)
    }
    return question;
  })
  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}

function clearQuestionDetails()
{
  questionDetailContainerNode.innerHTML = "";
}

function clearResponsePanel()
{
  responseContainerNode.innerHTML = "";
}

function printNoMatchFound()
{
  var title = document.createElement("h1");
  title.innerHTML = "No match found";

  allQuestionsListNode.appendChild(title)
}