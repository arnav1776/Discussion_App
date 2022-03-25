var submitQuestionNode = document.getElementById("submitBtn");
var questionTitleNode = document.getElementById("subject");
var questionDescriptionNode = document.getElementById("question");
var allQuestionsListNode = document.getElementById("dataList");
var createQuestionFormNode = document.getElementById("toggleDisplay");
var questionDetailContainerNode = document.getElementById("respondQue");
var resolveQuestionCOntainerNode = document.getElementById("resolveHolder");
var resolveQuestionNode = document.getElementById("resolveQuestion");
var responseContainerNode = document.getElementById("respondAns");
var commentContainerNode = document.getElementById("commentHolder");
var commentatorNameNode = document.getElementById("pickName");
var commentNode = document.getElementById("pickComment");
var submitCommentNode = document.getElementById("commentBtn");
var questionSearchNode = document.getElementById("questionSearch");
var upvote = document.getElementById("upvote");
var downvote = document.getElementById("downvote");
var newQuestionFormNode = document.getElementById("newQuestionForm");

// listen to value change

questionSearchNode.addEventListener("keyup", function(event)
{
  // show filtered result
  filterResult(event.target.value);
})

// filter result

function filterResult(query)
{
  
  getAllQuestions(function(allQuestions){  
    if(query)
    {
      clearQuestionPanel();    

      var filteredQuestions = allQuestions.filter(function(question)
      {
          var str1 = question.title;
          var str2 = query;

        if(str1.includes(str2)){
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
      else
      {
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

  });
}

// clear all questions

function clearQuestionPanel()
{
  allQuestionsListNode.innerHTML = "";
}


// Display all exixting questions

function onLoad()
{
  getAllQuestions(function(allQuestions){
    allQuestions = allQuestions.sort(function(currentQuestion){
      if(currentQuestion.isFav){
        return -1;
      }
      return 1;
    });

    allQuestions.forEach(function(question)
    {
      addQuestionToPanel(question)
    });
  })

}

onLoad();


// listen for the submit button to create question

submitQuestionNode.addEventListener("click", onQuestionSubmit);


function onQuestionSubmit(){
  if(questionTitleNode.value!=="" &&questionDescriptionNode.value !== ""){
    var question = {    
      title: questionTitleNode.value,
      description: questionDescriptionNode.value,
      responses: [],
      upvotes:0,
      downvotes:0,
      isFav:false,
      createdAt: Date.now(),
    }
    saveQuestion(question);
    addQuestionToPanel(question);
    questionTitleNode.value = "";
    questionDescriptionNode.value = "";
  }
}

// save question 

function saveQuestion(question){
  getAllQuestions(function(allQuestions){
    allQuestions.push(question);

    saveQuestionOnServer(allQuestions);
  })  
}

// save questions on server;

function saveQuestionOnServer(allQuestions){
  var body = {
      data : JSON.stringify(allQuestions),
    };
    var request = new XMLHttpRequest();

    request.open("POST", "https://storage.codequotient.com/data/save");
    request.setRequestHeader("Content-type","application/json");  

    request.send(JSON.stringify(body));

    request.addEventListener("load",function(){
    })
}

// Get all questions from storage

function getAllQuestions(onResponse){

  var request = new XMLHttpRequest();
  request.addEventListener("load", function()
  {
    var data = JSON.parse(request.responseText);

    allQuestions = JSON.parse(data.data);
    if(allQuestions){
       onResponse(allQuestions);
    }
    else
    {
      allQuestions = []
      onResponse(allQuestions);
    }
 })

  request.open("get","https://storage.codequotient.com/data/get");
  request.send();

}

// Append question to the left panel

function addQuestionToPanel(question)
{
  var questionContainer = document.createElement("div");
  questionContainer.setAttribute("id", question.title);
  questionContainer.setAttribute("class","questionContainer")
  questionContainer.style.background = "grey";


  var newQuestionTitleNode = document.createElement("h4");
  var btnFav = document.createElement("button");

  var str = document.createElement("span");
  str.innerHTML = "&starf;"
  str.style.fontSize = "200%"
  btnFav.setAttribute("class","btnFav")
  btnFav.appendChild(str);
  if(question.isFav){
    str.style.color = "yellow"
  }else{
    str.style.color = "grey"
  } 

  newQuestionTitleNode.innerHTML = question.title;
  questionContainer.appendChild(newQuestionTitleNode );


  var newQuestionDescriptionNode = document.createElement("p");
  newQuestionDescriptionNode.innerHTML = question.description;
  questionContainer.appendChild(newQuestionDescriptionNode);


  var upvoteTextNode = document.createElement("h4");
  upvoteTextNode.innerHTML = "upvote = "+ question.upvotes
  questionContainer.appendChild(upvoteTextNode);

  var downvoteTextNode = document.createElement("h4");
  var downvoteTextNodeContainingText = document.createElement("h4");
  downvoteTextNodeContainingText.innerHTML = "downvote = "+question.downvotes;
  downvoteTextNodeContainingText.setAttribute("class","dwnvotetxt")
  downvoteTextNode.appendChild(downvoteTextNodeContainingText);
  downvoteTextNode.appendChild(btnFav)
  questionContainer.appendChild(downvoteTextNode);
  btnFav.addEventListener("click",clickOnFavBtn(question));
  var createAtNode = document.createElement("p");
  createAtNode.innerHTML = "created: "+updateAndConvertTime(createAtNode)(question.createdAt)+" ago";
  questionContainer.appendChild(createAtNode);

  allQuestionsListNode.appendChild(questionContainer);


  questionContainer.addEventListener("click", onQuestionClick(question) );

}


// Listen to click on question and display on right pane

function onQuestionClick(question)
{
  return function()
  {
    // clouser access question variable
    // hide question panle
    hideQuestionPanel();

    // clear details
    clearQuestionDetails();
    clearResponsePanel();

    // show clicked Question
    showDetails();

    // create question details
    addQuestionToRight(question);

    //show previous responses

    question.responses = question.responses.sort(function(currentRes, nextRes){
    if(currentRes.isFav){
      return -1;
    }
    return 1;
   })


    question.responses.forEach(function(response)
    {
      addResponseInPanel(response,question)
    })

    // Response submit

    submitCommentNode.onclick =  onResponeSubmit(question);

    upvote.onclick = upvoteQuestion(question);
    downvote.onclick = downvoteQuestion(question);

  }
}

// Upvotes

function upvoteQuestion(question)
{
  return function()
  {
    question.upvotes++;
    updateQuestion(question);
    updateQuestionUI(question);
  }
  
}

// DownVotes

function downvoteQuestion(question)
{
  return function()
  {
    question.downvotes++;
    updateQuestion(question);
    updateQuestionUI(question);    
  }

}

// upvote and downvote question UI
function updateQuestionUI(question)
{
  var questionContainerNode = document.getElementById(question.title);

  console.log(questionContainerNode.childNodes[3])

  questionContainerNode.childNodes[2].innerHTML = "upvote = "+question.upvotes;
  questionContainerNode.childNodes[3].childNodes[0].innerHTML = "downvote = "+question.downvotes;

}


// Listen for click on submit response button
function onResponeSubmit(question)
{
  return function()
  {
    if(commentatorNameNode.value!=="" && commentNode.value!==""){
      var response = {
          name: commentatorNameNode.value,
          description: commentNode.value,
          isFav :false,
      }
      question.responses.push(response)

      saveResponse(question, response);
      addResponseInPanel(response,question)
      commentatorNameNode.value="";
      commentNode.value="";
    }
  }
}

// Display response in response section

function addResponseInPanel(response,question)
{
  var userNameNode = document.createElement("h4");
  userNameNode.innerHTML = response.name;

  var userCommentNode = document.createElement("p");
  userCommentNode.innerHTML = response.description;

  var btnFavOnRes = document.createElement("button");

  var str = document.createElement("span");
  str.innerHTML = "&starf;"
  str.style.fontSize = "200%"
  btnFavOnRes.setAttribute("class","btnFav")
  btnFavOnRes.appendChild(str);
  if(response.isFav){
    str.style.color = "yellow"
  }else{
    str.style.color = "white"
  }

  var container = document.createElement("div");
  container.setAttribute("class","resOfQues")
  container.appendChild(userNameNode);
  container.appendChild(userCommentNode);

  btnFavOnRes.onclick = clickOnResopnseFavBtn(response,question);

  responseContainerNode.appendChild(container);
}

// Hide question panel

function hideQuestionPanel()
{
  createQuestionFormNode.style.display = "none";
}


// Display question details

function showDetails()
{
  questionDetailContainerNode.style.display = "block";
  resolveQuestionCOntainerNode.style.display = "block";
  responseContainerNode.style.display = "block";
  commentContainerNode.style.display = "block";

}

// show question on right when question on left is clicked

function addQuestionToRight(question)
{
  var titleNode = document.createElement("h3");
  titleNode.innerHTML = question.title;

  var descriptionNode = document.createElement("p")
  descriptionNode.innerHTML = question.description;

  questionDetailContainerNode.appendChild(titleNode);
  questionDetailContainerNode.appendChild(descriptionNode);

}

// update question

function updateQuestion(updatedQuestion)
{
  getAllQuestions(function(allQuestions){
    var revisedQuestions = allQuestions.map(function(question){
      if( updatedQuestion.title  === question.title)
      {
        return updatedQuestion
      }

      return question;
    })
    saveQuestionOnServer(revisedQuestions);

  })

}


// save responces of particular question

function saveResponse(updatedQuestion, response)
{
  getAllQuestions(function(allQuestions){
    var revisedQuestions = allQuestions.map(function(question)
    {
      if( updatedQuestion.title  === question.title)
      {
        question.responses.push(response)
        console.log(response);
      }

      return question;
    })
    saveQuestionOnServer(revisedQuestions);
  });

}

// clear the question details

function clearQuestionDetails()
{
  questionDetailContainerNode.innerHTML = "";
}
function clearResponsePanel()
{
 responseContainerNode.innerHTML = "";
}

// No match found

function printNoMatchFound()
{
  var title = document.createElement("h1");
  title.innerHTML = "No match found";

  allQuestionsListNode.appendChild(title) 
}

newQuestionFormNode.addEventListener("click",displayQuestionForm);

// display newform 

function displayQuestionForm(){
  createQuestionFormNode.style.display = "block";
  hideDetailsOfResponce();
}

function hideDetailsOfResponce()
{
  questionDetailContainerNode.style.display = "none";
  resolveQuestionCOntainerNode.style.display = "none";
  responseContainerNode.style.display = "none";
  commentContainerNode.style.display = "none";
}

// event listner on resolve button is clicked

resolveQuestionNode.addEventListener("click",function(){
  updateUiAfterResolve();
  
})

function updateUiAfterResolve(){
  getAllQuestions(function(allQuestions){
    var el = document.getElementById("respondQue")
    console.log(el);
    allQuestions.forEach(function(val,ind){
      if(questionDetailContainerNode.childNodes[0].innerHTML===val.title){
        allQuestions.splice(ind,1);
        clearQuestionFromSetion(val);
      }
     })
    clearQuestionDetails();
    clearResponsePanel();
    displayQuestionForm();
    saveQuestionOnServer(allQuestions);    
  });
}

// Update UI when reolve button is clicked

function clearQuestionFromSetion(question){
  var len = allQuestionsListNode.children.length;
  for(var i = 0;i<len;i++){
    if(allQuestionsListNode.children[i].childNodes[0].innerHTML==question.title){
      allQuestionsListNode.children[i].remove();
      break;
    }
  }
}

function clickOnFavBtn(question){
  return function(event){
    event.stopPropagation();
    question.isFav = !question.isFav;
    updateQuestion(question);
    if(question.isFav){
      event.target.style.color = "yellow"
    }else{
      event.target.style.color = "grey"
    }
  }
}

// setInterval and update time

function updateAndConvertTime(element)
{
  return function(time)
  {
    setInterval(function()
    {
      element.innerHTML = "created: "+convertDateToCreatedAtTime(time)+" ago";
    })

    return convertDateToCreatedAtTime(time);
  }
}

// Date and Time

function convertDateToCreatedAtTime(date)
{
    var currentTime = Date.now();
    var timeLapsed = currentTime - new Date(date).getTime();

    var secondsDiff = parseInt(timeLapsed / 1000 );
    var minutesDiff = parseInt(secondsDiff / 60 );
    var hourDiff = parseInt(minutesDiff / 60 );

    if(hourDiff){
      return hourDiff +" hours";
    }else if(minutesDiff){
      return minutesDiff +" minutes"
    }else{
      return secondsDiff +" Seconds";
    } 
}

function clickOnResopnseFavBtn(response,question){  
  return function(event){
    console.log(question);
    response.isFav = !response.isFav;
    updateResponse(response,question);
    if(response.isFav){
      event.target.style.color = "yellow"
    }else{
      event.target.style.color = "white"
    }
  }
}

// update response to a particular question

function updateResponse(response,question){
  console.log(response)
  console.log(question)
  question.responses.forEach(function(res,inx){
    if(res.name === response.name){
      question.responses[inx]= response
    }
  })
  updateQuestion(question);
}
