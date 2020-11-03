function rand(x){
  //random integer from 0 to x-1
  return Math.floor(Math.random() * x);
}
function randChar(){
  // 2/3 chance letter, 1/6 chance number, 1/6 chance common symbol
  var x = rand(6);
  var i;
  if(x <= 3){
     i = 97 + rand(122-97+1);
     return String.fromCharCode(i);
  }
  if(x == 4){
    i = rand(10);
    return i.toString();
  }
  var commonSymbols = ['@', '!', '$', '+'];
  if(x == 5){
    i = rand(4);
    return commonSymbols[i];
  }
}
var n;
var x;
var y;
var a;
var b;
var charWidth = 29;

var inputAreas = [document.getElementById("area1"), document.getElementById("area2"), document.getElementById("area3")];
var char1 = document.getElementById("firstGiven");
var char2 = document.getElementById("secondGiven");
var space1 = document.getElementById("startInput");
var space2 = document.getElementById("middleInput");
var space3 = document.getElementById("endInput");
var response = document.getElementById("response");
var list = document.getElementById("list");
var listTitle = document.getElementById("listTitle");

space1.onkeyup = (e)=>{
  if (space1.maxLength == space1.value.length) {
    space2.focus();
  }
  if(e.keyCode === 13){
    run();
  }
}
space2.onkeyup = (e)=>{
  if (space2.maxLength == space2.value.length) {
    space3.focus();
  }
  if(e.keyCode === 13){
    run();
  }
}
for (let s of [space3]) {
  s.onkeyup = (e) => {
    if(e.keyCode === 13){
      run();
    }
  };
}


reset();
var ran;
function reset(){
  ran = false;
  showed = false;
  n = rand(4) + 5;
  x = rand(n);
  y = rand(n);
  while(y == x){
    y = rand(n);
  }
  if(x > y){
    var temp = x;
    x = y;
    y = temp;
  }
  a = randChar();
  b = randChar();

  var spaceArray = [space1, space2, space3];
  var spaceLengths = [x, y - x - 1, n - 1 - y];

  char1.innerHTML = a;
  char2.innerHTML = b;

  var currLength;
  var currSpace;
  for(var i = 0; i < 3; i = i + 1){
    currSpace = spaceArray[i];
    currSpace.value = "";
    currLength = spaceLengths[i];
    if(currLength == 0){
      currSpace.remove();
    }
    else{
      inputAreas[i].append(currSpace);
    }
    currSpace.style.width = (currLength * charWidth).toString() + "px";
    let pl = ""
    for (let x = 0; x<currLength; x++) { pl+="*" }
    currSpace.placeholder = pl;
    currSpace.maxLength = currLength;
  }
  response.innerHTML = "";
  listTitle.innerHTML = "";
  list.innerHTML = "";
  resetValues();
}
function resetValues(){
  samples = [];
  reversions = [];
  wordReversions = [];
  revertedTemplate = [];
  reversionTemplates = [];
  wordReversionTemplates = [];
  tempArray = [];
  specialData = "jello";
  done = 0;
  found = 0;
  did = false;
}
var enteredWord;
function run(){
  if(ran) return;
  enteredWord = space1.value + a + space2.value + b + space3.value;
  if(enteredWord.length < n){
    response.innerHTML = "Please enter all characters";
    return;
  }
  ran = true;
  resetValues();
  var w = findWeakness(enteredWord);
  var weaknessMessage = "Weakness " + (8 - w).toString() + ": " + weaknessDescriptions[w];
  if(w == 2 || w == 4 || w == 5 || w == 6 || w == 7){
    weaknessMessage += specialData;
  }
  response.innerHTML = weaknessMessage;
  show();
}
var showed;
function show(){
  if(showed) return;
  showed = true;
  var template = [n, x, a, y, b];
  generatePasswords(template);
  var sample;
  listTitle.innerHTML = "Some possible bad passwords: <br>"
  if(samples.length == 0){
    list.innerHTML = "No bad passwords found";
  }
  var tempSamples = samples.slice();
  var weaknessMessage;
  for(var i = 0; i < 10; i++){
    if(i == tempSamples.length) break;
    resetValues();
    sample = tempSamples[i];
    w = findWeakness(sample)
    weaknessMessage = "<b>" + sample + "</b>" + " (" + (8-w).toString() + ") <br>" + weaknessDescriptions[w];
    if(w == 2 || w == 4 || w == 5 || w == 6 || w == 7){
      weaknessMessage += specialData;
    }
    weaknessMessage += "<br>";
    list.innerHTML += weaknessMessage;
  }
}


//Finding weakness and sample passwords:
var weaknessDescriptions = [
  "Very common password",
  "Common password",
  "Variation of a very common password: ",
  "An English word",
  "Variation of a common password: ",
  "Variation of an English word: ",
  "Contains an English word: ",
  "Alteration of a string containing an English word: ",
  "Not very weak password"
];



function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}
function rand(n){
  return Math.floor(Math.random() * n);
}


var storingDone = false;
var tempArray = []; //used for storing arrays
var topPasswords; //very popular passwords
var passwords; //popular passwords
var words; //english words (excluding passwords)
var allWords; //english words (including passwords)
var reversions = []; //possible original passwords before substitution
var wordReversions = []; //reversions consisting of only letters
var subs = {}; //substitution dictionary
var specialData; //depends on password weakness

var lowerCaseLetters = [];
var upperCaseLetters = [];
var numbers = [];
var commonSymbols = [];
var allSymbols = [];

var originalTemplate = [];
// Original template (password length and given characters)
// Format: [length of password, index of first char, first char, index of second char, second char]
var revertedTemplate = []; // Template when symbols are substituted for letters
var reversionTemplates = []; // Templates allowing for letters and/or symbols to be appended
var wordReversionTemplates = []; // Templates where both characters given are letters
var samples = []; // Sample passwords, format: [template, password]

makeCharLists();

function makeCharLists(){
  var c;
  for(var i = 0; i < 26; i++){
    lowerCaseLetters.push(String.fromCharCode(i + 97));
    upperCaseLetters.push(String.fromCharCode(i + 65));
  }
  for(var i = 0; i < 10; i++){
    numbers.push(i.toString());
  }
  for(var i = 33; i < 127; i++){
    c = String.fromCharCode(i);
    if(!(lowerCaseLetters.includes(c) || upperCaseLetters.includes(c) || numbers.includes(c))){
      allSymbols.push(c);
    }
  }
  commonSymbols = ['@', '!', '$', '+'];
} //creates character lists

makeSubs();
function makeSubs(){
  let requestURL = "https://raw.githubusercontent.com/dlee1828/badPasswords/master/data/substitutions.txt";
  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'text';
  request.send();
  request.onload = function() {
    var text = request.responseText;
    tempArray = text.toString().split("\n");
    var curr;
    var arr;
    for(var i = 0; i < tempArray.length; i++){
      curr = tempArray[i].trim();
      arr = curr.split(" ");
      arr[0] = arr[0].slice(0, 1);
      if(curr == "") continue;
      for(var j = 0; j < arr.length; j++){
        if(j == 0){
          subs[arr[j]] = [];
          continue;
        }
        subs[arr[0]].push(arr[j]);
      }
    }
    storeAll();
  }
}
var done = 0;
function store(url, callback){
  let requestURL = url;
  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'text';
  request.send();
  request.onload = function() {
    var text = request.responseText;
    tempArray = text.split("\n");
    tempArray.map(s => s.trim());
    done++;
    callback();
    if(done == 4) doneStoring();
  }
}
function storeAll(){
  store("https://raw.githubusercontent.com/dlee1828/badPasswords/master/data/allWords.txt", ()=>{
    allWords = tempArray;
  });
  store("https://raw.githubusercontent.com/dlee1828/badPasswords/master/data/passwords.txt", ()=>{
    passwords = tempArray;
  });
  store("https://raw.githubusercontent.com/dlee1828/badPasswords/master/data/topPasswords.txt", ()=>{
    topPasswords = tempArray;
  });
  store("https://raw.githubusercontent.com/dlee1828/badPasswords/master/data/words.txt", ()=>{
    words = tempArray;
  });
}

function isLetter(c){
  return (lowerCaseLetters.includes(c) || upperCaseLetters.includes(c));
}
function isNumber(c){
  return numbers.includes(c);
}
function isSymbol(c){
  return allSymbols.includes(c);
}
function isCommonSymbol(c){
  return commonSymbols.includes(c);
}
function canRevert(c){
  return c in subs;
}

var currReversion;
var currCount;
var totalRevertibleChars;
var revertibleCharsIndices;
function initialReversionsRecursion(){
  var tempReversion = currReversion;
  if(currCount == totalRevertibleChars){
    reversions.push(currReversion);
    return;
  }
  var index = revertibleCharsIndices[currCount];
  var charSubList = subs[currReversion[index]];
  for(var i = 0; i < charSubList.length; i++){
    currReversion = setCharAt(currReversion, index, charSubList[i]);
    currCount++;
    initialReversionsRecursion();
    currReversion = tempReversion;
    currCount--;
  }
  currCount++;
  initialReversionsRecursion();
  currCount--;
} // backtracking to fill reversions
function makeInitialReversions(word){
  totalRevertibleChars = 0;
  revertibleCharsIndices = [];
  for(var i = 0; i < word.length; i++){
    if(canRevert(word[i])){
      totalRevertibleChars++;
      revertibleCharsIndices.push(i);
    }
  }
  currCount = 0;
  currReversion = word;
  initialReversionsRecursion();
}
function pruneReversions(){
  var word; // current reversion to be analyzed
  var char;
  var firstLetterDone; // whether the first letter has been encountered
  var letterCount; // number of letters in the word
  var startCount; // number of consecutive non-letters at the start of the word
  var endCount; //number of consecutive non-letters at the end of the word
  var works;
  var symbolCount; // number of symbols at the end of the word
  var tempWord;
  tempArray = reversions.slice();
  reversions = [];
  for(var i = 0; i < tempArray.length; i++){
    firstLetterDone = false;
    letterCount = startCount = endCount = symbolCount = 0;
    works = true;
    word = tempArray[i];
    for(var j = 0; j < word.length; j++){
      char = word[j];
      if(isLetter(char)){
        if(!firstLetterDone) firstLetterDone = true;
        else if(!isLetter(word[j-1])){
          works = false;
          break;
        }
        letterCount++;
      }
      else{
        if(!firstLetterDone) startCount++;
        else endCount++;
      }
    } // ensures that letters are consecutive, finds letterCount, startCount, and endCount
    if(!works) continue;
    if(letterCount >= 4){
      tempWord = word.substring(startCount, word.length - endCount) // removes non-letters
      wordReversions.push(tempWord);
      for(j = word.length - 1; j >= word.length - endCount; j--){
        if(isSymbol(word[j])) symbolCount++;
      } // finds symbolCount
      if(startCount > 1 || (symbolCount > 0 && endCount > 1)){
        reversions.push(word);
        continue;
      } // no further adjustments appropriate
      reversions.push(tempWord); // removes non-letters
      continue;
    }
    reversions.push(word);
  }
}
function binSearch(list, item){
  var bottom = 0;
  var top = list.length - 1;
  var mid;
  var attempt;
  while(top - bottom > 1){
    mid = Math.floor((top + bottom)/2);
    attempt = list[mid];
    if(attempt == item) return mid;
    if(attempt < item) bottom = mid;
    else top = mid;
  }
  if(list[bottom] == item) return bottom;
  if(list[top] == item) return top;
  return -1;
}
function subWord(word){
  var n = word.length;
  var substr;
  for(var i = 0; i <= n - 4; i++){
    for(var j = 4; j <= n-i; j++){
      substr = word.substring(i, i+j);
      if(binSearch(allWords, substr) >= 0){
        specialData = allWords[binSearch(allWords, substr)];
        return true;
      }
    }
  }
  return false;
}
function findWeakness(word){
  if(binSearch(topPasswords, word) >= 0) return 0;
  if(binSearch(passwords, word) >= 0) return 1;
  word = word.toLowerCase();
  makeInitialReversions(word);
  pruneReversions();
  for (var i = 0; i < reversions.length; i++) {
    if(binSearch(topPasswords, reversions[i]) >= 0){
      specialData = topPasswords[binSearch(topPasswords, reversions[i])];
      return 2;
    }
    if(binSearch(passwords, reversions[i]) >= 0){
      specialData = passwords[binSearch(passwords, reversions[i])];
      return 4;
    }
  }
  if(binSearch(words, word) >= 0) return 3;
  for (var i = 0; i < wordReversions.length; i++) {
    if(binSearch(words, wordReversions[i]) >= 0){
      specialData = words[binSearch(words, wordReversions[i])];
      return 5;
    }
    if(subWord(wordReversions[i])) return 7;
  }
  if(subWord(word)) return 6;
  return 8;
}

var found = 0;
function createReversionTemplates(template){
  var options = [[], []];
  var chars = [template[2], template[4]];
  var newTemplate = template.slice();
  for(var i = 0; i < 2; i++){
    options[i].push(chars[i]);
    if(subs.hasOwnProperty(chars[i])){
      for(var j = 0; j < subs[chars[i]].length; j++){
        options[i].push(subs[chars[i]][j]);
      }
    }
  }
  for(var i = 0; i < options[0].length; i++){
    for(var j = 0; j < options[1].length; j++){
      newTemplate[2] = options[0][i];
      newTemplate[4] = options[1][j];
      reversionTemplates.push(newTemplate.slice());
    }
  }
  var tempReversionTemplates = reversionTemplates.slice();
  for (var i = 0; i < tempReversionTemplates.length; i++) {
    newTemplate = tempReversionTemplates[i].slice();
    if(newTemplate[0] <= 4) break;
    if(!(newTemplate[1] == 0 && isLetter(newTemplate[2]))){
      newTemplate[0]--;
      newTemplate[1]--;
      newTemplate[3]--;
      reversionTemplates.push(newTemplate);
    }
    newTemplate = tempReversionTemplates[i].slice();
    while(newTemplate[0] >= 4){
      if(newTemplate[3] == newTemplate[0] - 1) break;
      newTemplate[0]--;
      reversionTemplates.push(newTemplate);
    }
  }
  for (var i = 0; i < reversionTemplates.length; i++) {
    newTemplate = reversionTemplates[i].slice();
    if(isLetter(newTemplate[2]) && isLetter(newTemplate[4])) wordReversionTemplates.push(newTemplate);
  }
} // Creates all possible variations of original template
var did = false;
function check(template, word){
  if(word.length != template[0]) return false;
  var ind;
  for(var i = 0; i < 2; i++){
    ind = template[2*i+1];
    if(ind == -1) continue;
    if(word[ind] != template[2*i+2]) return false;
  }
  did = true;
  return true;
} // Checks if a password satisfies a template
function checkReversionTemplates(list){
  for (var i = 0; i < reversionTemplates.length; i++) {
    for (var j = 0; j < list.length; j++){
      if(check(reversionTemplates[i], list[j])){
        samples.push([reversionTemplates[i], list[j]]);
        found++;
      }
    }
  }
} // Performs check() for all reversion templates for all words in list
function generatePasswords(template){
  originalTemplate = template;
  found = 0;
  for (var i = 0; i < topPasswords.length; i++) {
    if(check(template, topPasswords[i])){
      samples.push([template, topPasswords[i]]);
      found++;
    }
  }
  for (var i = 0; i < passwords.length; i++) {
    if(check(template, passwords[i])){
      samples.push([template, passwords[i]]);
      found++;
    }
  }
  createReversionTemplates(template);
  checkReversionTemplates(topPasswords);
  checkReversionTemplates(passwords);
  for (var i = 0; i < words.length; i++) {
    if(check(originalTemplate, words[i])){
      samples.push([template, passwords[i]]);
      found++;
    }
  }
  checkReversionTemplates(words);
  fixPasswords();
} // Generates samples
function fixPasswords(){
  var password;
  var template;
  var temp = samples.slice();
  var newPassword;
  samples = [];
  for (var i = 0; i < temp.length; i++) {
    template = temp[i][0];
    password = temp[i][1];
    newPassword = password;
    if(template[0] != originalTemplate[0]){
      if(template[1] != originalTemplate[1]){
        if(template[1] == -1) newPassword = originalTemplate[2] + newPassword;
        else{
          newPassword = rand(9).toString() + newPassword;
        }
      } // means a character was removed from the beginning
      else{
        for(var j = 0; j < originalTemplate[0] - template[0]; j++){
          newPassword += rand(9).toString();
        }
      } // means characters were removed from the end
    } // restoring the password's length;
    newPassword = setCharAt(newPassword, originalTemplate[1], originalTemplate[2]);
    newPassword = setCharAt(newPassword, originalTemplate[3], originalTemplate[4]);
    samples.push(newPassword);
  }
}
function doneStoring(){
  storingDone = true;
  //console.log("Weakness " + (8 - w).toString() + ": " + weaknessDescriptions[w]);
}



//Comment
