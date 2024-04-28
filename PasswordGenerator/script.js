const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
setIndicator("#ccc"); //grey

// function setCookie(id, status){
//     if(document.cookie.includes(id)){
//         document.cookie.
//     }
//     document.cookie += id + '=' + status + ';'
// }
function getCookie(name) {
  let newName = name + "=";
  let cookies = document.cookie.split(";");
  for (let k = 0; k < cookies.length; k++) {
    let c = cookies[k];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(newName) == 0) {
      return c.substring(newName.length, c.length);
    }
  }
  return "";
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + ";";
}

document.addEventListener("DOMContentLoaded", () => {
  allCheckBox.forEach((checkBox) => {
    checkBox.checked = getCookie(checkBox.id) == "true";
    console.log("checkBox id ", checkBox.id, " ", checkBox.checked);
    if (checkBox.checked) checkCount++;
    checkBox.addEventListener("change", (e) => {
      if (e.target.checked) checkCount++;
      else checkCount--;
      setCookie(e.target.id, e.target.checked, 90);
      calcStrength();
    });
  });
});

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function getRandomIdx(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomNumber() {
  return getRandomIdx(0, 9);
}

function generateUpperCase() {
  return String.fromCharCode(getRandomIdx(65, 91));
}

function generateLowerCase() {
  return String.fromCharCode(getRandomIdx(97, 123));
}

function generateSymbol() {
  return symbols[getRandomIdx(0, symbols.length)];
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

inputSlider.addEventListener("mouseup", (e) => {
  console.log("input slider changing");
  passwordLength = e.target.value;
  handleSlider();
  calcStrength();
});

// allCheckBox.forEach((checkBox) => {
//   checkBox.addEventListener("change", (e) => {
//     if (e.target.checked) checkCount++;
//     else checkCount--;
//     setCookie(e.target.id, e.target.checked, 90);
//     calcStrength();
//   });
// });

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    // console.log("#0f0");
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    // console.log("#ff0");
    setIndicator("#ff0");
  } else {
    // console.log("#f00");
    setIndicator("#f00");
  }
}

copyBtn.addEventListener("click", () => {
  // Select the text field
  passwordDisplay.select();
  passwordDisplay.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(passwordDisplay.value);
  copyMsg.innerText = "Copied to clipboard";
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
  console.log("Copied the text: " + passwordDisplay.value);
});

function shufflePassword(thisPassword) {
  for (let i = thisPassword.length - 1; i > 0; i--) {
    let j = undefined;
    let temp = thisPassword[i];
    if (i > 1) j = getRandomIdx(0, i - 2);
    else j = 0;
    thisPassword[i] = thisPassword[j];
    thisPassword[j] = temp;
  }
  // console.log(thisPassword);
  let shuffled = "";
  thisPassword.forEach((element) => {
    shuffled += element;
  });
  return shuffled;
}

function getCheckedCharacterSet() {
  const randomCharacter = {};
  let count = 0;
  if (lowercaseCheck.checked) {
    count += 1;
    randomCharacter[count] = generateLowerCase;
  }
  if (uppercaseCheck.checked) {
    count += 1;
    randomCharacter[count] = generateUpperCase;
  }
  if (numbersCheck.checked) {
    count += 1;
    randomCharacter[count] = generateRandomNumber;
  }
  if (symbolsCheck.checked) {
    count += 1;
    randomCharacter[count] = generateSymbol;
  }
  return randomCharacter;
}

generateBtn.addEventListener("click", () => {
  const randomCharacter = getCheckedCharacterSet();
  console.log("chechCount ", checkCount);
  if (checkCount == 0) {
    alert("Please check atleast 1 checkbox.");
    return password;
  }

  password = "";
  for (let i = 0; i < passwordLength; i++) {
    password += randomCharacter[getRandomIdx(1, checkCount + 1)]();
  }
  console.log("Unshuffled: ",password);
  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;
});
