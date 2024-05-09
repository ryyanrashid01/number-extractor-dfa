class DFA {
  constructor() {
    this.transitions = {
      q0: { " ": "q0", dollar: "q33", zero: "q3", digit: "q4" },
      q33: { digit: "q1" },
      q1: { digit: "q1", decimal: "q2" },
      q2: { digit: "q2" },
      q3: { digit: "q5", decimal: "q27", f_slash: "q28", percent: "31" },
      q4: {
        digit: "q5",
        f_slash: "q6",
        hyphen: "q15",
        colon: "q20",
        decimal: "q27",
        percent: "q31",
      },
      q5: {
        digit: "q26",
        f_slash: "q6",
        hyphen: "q15",
        colon: "q20",
        decimal: "q27",
        percent: "q31",
      },
      q6: { zero: "q7", digit: "q8" },
      q7: { digit: "q8" },
      q8: { digit: "q9", f_slash: "q10" },
      q9: { f_slash: "q10" },
      q10: { digit: "q11" },
      q11: { digit: "q12" },
      q12: { digit: "q13" },
      q13: { digit: "q14" },
      q15: { zero: "q16", digit: "q17" },
      q16: { digit: "q17" },
      q17: { digit: "q18", hyphen: "q19" },
      q18: { hyphen: "q19" },
      q19: { digit: "q11" },
      q20: { digit: "q21" },
      q21: { digit: "q22" },
      q22: { colon: "q23" },
      q23: { digit: "q24" },
      q24: { digit: "q25" },
      q26: { digit: "q26", decimal: "q27", f_slash: "q28", percent: "q31" },
      q27: { digit: "q30" },
      q28: { digit: "q29" },
      q29: { digit: "q29" },
      q30: { digit: "q30", percent: "q31" },
      q32: {},
    };
    this.acceptingStates = [
      "q1",
      "q2",
      "q3",
      "q4",
      "q5",
      "q8",
      "q9",
      "q12",
      "q14",
      "q17",
      "q18",
      "q22",
      "q25",
      "q26",
      "q29",
      "q30",
      "q31",
    ];
  }

  transition(state, char) {
    if (/^[0-9]$/.test(char)) {
      if (this.transitions[state]?.zero) {
        if (char == "0") {
          return this.transitions[state]?.zero ?? "q32";
        }
      }
      return this.transitions[state]?.digit ?? "q32";
    } else if (char == "-") {
      return this.transitions[state]?.hyphen ?? "q32";
    } else if (char == "/") {
      return this.transitions[state]?.f_slash ?? "q32";
    } else if (char == "$") {
      return this.transitions[state]?.dollar ?? "q32";
    } else if (char == "%") {
      return this.transitions[state]?.percent ?? "q32";
    } else if (char == ":") {
      return this.transitions[state]?.colon ?? "q32";
    } else if (char == ".") {
      return this.transitions[state]?.decimal ?? "q32";
    } else {
      return this.transitions[state]?.[char] ?? "q32";
    }
  }
}

var outputTextContainer = document.getElementById("outputText");
var numberListContainer = document.getElementById("numberList");
var inputContainer = document.getElementById("inputContainer");
var outputContainer = document.getElementById("outputContainer");
var flowchartContainer = document.getElementById("flowchart");

function findNumbers() {
  var text = document.getElementById("textInput").value;
  var numbers = [];
  var number_indices = [];
  var outputText = "";

  outputContainer.classList.remove("disappear");
  inputContainer.classList.add("disappear");

  const dfa = new DFA();

  let state = "q0";
  let lastState = "q0";
  let tokenStart = 0;

  for (var i = 0; i < text.length; i++) {
    let char = text.charAt(i);

    // If the character is a space character then check if the last state was an accepted state. If yes, add it to the list
    if (char == " ") {
      if (dfa.acceptingStates.includes(lastState)) {
        numbers.push(text.substring(tokenStart, i));
        number_indices.push([tokenStart, i]);
      }
      tokenStart = i + 1;
      state = "q0";
      console.log(1, lastState, char, state);
      appendGraph(dfa, char, state);
      lastState = "q0";
    }
    // If the character is a period and it is not followed by a number then check if the last state was an accepted state. If yes, add it to the list
    // OR if the character is a-z, A-Z or comma and the last state is accepted then add it to the list
    else if (
      (char == "." && (text.charAt(i + 1) == " " || i == text.length - 1)) ||
      (dfa.acceptingStates.includes(lastState) && /^[a-zA-Z,]$/.test(char))
    ) {
      // If the character is a comma and the last state is accepted and comma is followed by digits then go to q0
      if (
        char == "," &&
        dfa.acceptingStates.includes(lastState) &&
        /^[0-9]$/.test(text.charAt(i + 1))
      ) {
        state = "q0";
        console.log(2, lastState, char, state);
        appendGraph(dfa, char, state);
        lastState = "q0";
      }
      // If the last state is accepted, then add it to the list
      if (dfa.acceptingStates.includes(lastState)) {
        numbers.push(text.substring(tokenStart, i));
        number_indices.push([tokenStart, i]);
        state = "q0";
        console.log(3, lastState, char, state);
        appendGraph(dfa, char, state);
        lastState = "q0";
      }
    }
    // Check for the end of the text
    else if (i == text.length - 1) {
      state = dfa.transition(state, char);
      console.log(4, lastState, char, state);
      appendGraph(dfa, char, state);
      if (dfa.acceptingStates.includes(state)) {
        numbers.push(text.substring(tokenStart, i + 1));
        number_indices.push([tokenStart, i + 1]);
      }
      continue;
    } else {
      state = dfa.transition(state, char);
      console.log(5, lastState, char, state);
      appendGraph(dfa, char, state);
      lastState = state;
    }
  }

  console.log(numbers);

  if (numbers.length == 0) {
    numberListContainer.classList.add("disappear");
  }

  let partition_start = 0;

  for (let i = 0; i < number_indices.length; i++) {
    let numberStart = number_indices[i][0];
    let numberEnd = number_indices[i][1];

    outputText += text.substring(partition_start, numberStart);
    outputText +=
      "<span class='accepted list-item-" +
      i +
      "'>&nbsp;" +
      text.substring(numberStart, numberEnd) +
      "&nbsp;</span>";
    partition_start = numberEnd;
  }
  outputText += text.substring(partition_start, text.lenght);

  outputTextContainer.innerHTML = outputText;

  for (var i = 0; i < numbers.length; i++) {
    numberListContainer.innerHTML +=
      "<span class='extracted list-item-" + i + "'>" + numbers[i] + "</span>";
    if (i != numbers.length - 1) {
      numberListContainer.innerHTML += ", ";
    }
  }

  const extractedElements = document.querySelectorAll(".extracted");

  // console.log(extractedElements);

  // Add event listeners to each extracted element
  extractedElements.forEach((element) => {
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
  });

  // console.log(numbers);
  // console.log(number_indices);
}

function handleMouseEnter() {
  const number = this.classList[1].split("-")[2];
  const listItems = document.querySelectorAll(`.list-item-${number}`);
  listItems.forEach((item) => {
    item.classList.add("highlight");
  });
}

function handleMouseLeave() {
  const number = this.classList[1].split("-")[2]; // Extract the number from the class name
  const listItems = document.querySelectorAll(`.list-item-${number}`); // Select all elements with class name 'list-item-[number]'
  listItems.forEach((item) => {
    item.classList.remove("highlight"); // Reset the color of each selected element
  });
}

function appendGraph(dfa, char, state) {
  let node = "";
  if (char == " ") {
    char = "ws";
  }
  let arrow = "<span class='arrow'>&rarr;" + char + "&rarr;</span>";
  if (dfa.acceptingStates.includes(state)) {
    node = "<span class='state green'>" + state + "</span>";
  } else if (state == "q32") {
    node = "<span class='state red'>" + state + "</span>";
  } else {
    node = "<span class='state'>" + state + "</span>";
  }
  flowchartContainer.innerHTML += arrow + node;
}
